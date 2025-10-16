import admin from 'firebase-admin';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function getServiceAccountFromEnv() {
  const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (svcPath) {
    try {
      const resolved = path.isAbsolute(svcPath) ? svcPath : path.resolve(process.cwd(), svcPath);
      const raw = fs.readFileSync(resolved, 'utf8');
      const svc = JSON.parse(raw);
      return {
        projectId: svc.project_id,
        clientEmail: svc.client_email,
        privateKey: (svc.private_key || '').replace(/\\n/g, '\n'),
        keyId: svc.private_key_id,
        source: 'path'
      };
    } catch (_) {
      // fall through
    }
  }
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      return {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key?.replace(/\\n/g, '\n'),
        keyId: parsed.private_key_id,
        source: 'json-env'
      };
    } catch (_) {
      // fall through
    }
  }
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      keyId: undefined,
      source: 'vars'
    };
  }
  return null;
}

if (admin.apps.length === 0) {
  const serviceAccount = getServiceAccountFromEnv();
  const options = {};
  if (serviceAccount) {
    options.credential = admin.credential.cert({
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      privateKey: serviceAccount.privateKey
    });
    if (serviceAccount.projectId) {
      options.projectId = serviceAccount.projectId;
    }
  } else {
    throw new Error(
      'Firebase Admin credentials not found. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
    );
  }
  // Log which credential source is used (without sensitive data)
  try {
    const source = serviceAccount.source || (process.env.FIREBASE_SERVICE_ACCOUNT_PATH ? 'path' : (process.env.FIREBASE_SERVICE_ACCOUNT ? 'json-env' : 'vars'));
    const keyFingerprint = serviceAccount.privateKey
      ? crypto.createHash('sha256').update(serviceAccount.privateKey).digest('hex').slice(0, 12)
      : 'none';
    const maskedEmail = typeof serviceAccount.clientEmail === 'string'
      ? serviceAccount.clientEmail.replace(/(^.{3}).*(@.*$)/, '$1***$2')
      : 'unknown';
    console.log(`[firebaseAdmin] Using credential source: ${source} for project ${options.projectId || 'unknown'}`);
    console.log(
      `[firebaseAdmin] Cred details -> clientEmail=${maskedEmail}, private_key_id=${serviceAccount.keyId || 'n/a'}, key_fingerprint=${keyFingerprint}`
    );
  } catch (_) {}
  // Ensure projectId is set even if using ADC
  if (!options.projectId) {
    const envProjectId = process.env.FIREBASE_PROJECT_ID
      || process.env.PROJECTID
      || process.env.REACT_APP_FIREBASE_PROJECT_ID;
    if (envProjectId) options.projectId = envProjectId;
  }
  // Resolve storage bucket; fallback to default appspot.com if missing
  let bucketName = process.env.FIREBASE_STORAGE_BUCKET
    || process.env.STORAGEBUCKET
    || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
  if (!bucketName && options.projectId) {
    bucketName = `${options.projectId}.appspot.com`;
  }
  if (bucketName) {
    options.storageBucket = bucketName;
  }
  admin.initializeApp(options);
  // Auth preflight: try to obtain an access token and ping Firestore for clearer diagnostics
  try {
    const cred = admin.app().options?.credential;
    if (cred && typeof cred.getAccessToken === 'function') {
      cred.getAccessToken()
        .then(() => {
          // no-op on success
        })
        .catch((e) => {
          console.error('[firebaseAdmin] Failed to obtain access token:', e?.message || e);
        });
    }
    // Firestore lightweight ping
    try {
      const pingRef = admin.firestore?.().collection('_health').doc('init');
      if (pingRef) {
        pingRef.set({ ts: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch((e) => {
          console.error('[firebaseAdmin] Firestore write preflight failed:', e?.message || e);
        });
      }
    } catch (_) {}
  } catch (_) {}
}

export default admin;
export const db = admin.firestore?.() || null;
// Avoid throwing at module load if bucket is misconfigured
let storageBucket = null;
try {
  const configuredBucket = (admin.app().options && admin.app().options.storageBucket) ? String(admin.app().options.storageBucket) : undefined;
  storageBucket = configuredBucket ? admin.storage?.().bucket?.(configuredBucket) : admin.storage?.().bucket?.();
} catch (_) {
  storageBucket = null;
}
export const bucket = storageBucket;

