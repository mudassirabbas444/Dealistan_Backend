import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function getServiceAccountFromEnv() {
  const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (svcPath) {
    try {
      const resolved = path.isAbsolute(svcPath) ? svcPath : path.resolve(process.cwd(), svcPath);
      console.log(resolved);
      const raw = fs.readFileSync(resolved, 'utf8');
      const svc = JSON.parse(raw);
      return {
        projectId: svc.project_id,
        clientEmail: svc.client_email,
        privateKey: (svc.private_key || '').replace(/\\n/g, '\n')
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
        privateKey: parsed.private_key?.replace(/\\n/g, '\n')
      };
    } catch (_) {
      // fall through
    }
  }
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  }
  return null;
}

if (admin.apps.length === 0) {
  const serviceAccount = getServiceAccountFromEnv();
  console.log(serviceAccount);
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
    // Fallback to ADC if available (e.g., GOOGLE_APPLICATION_CREDENTIALS)
    options.credential = admin.credential.applicationDefault();
  }
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

