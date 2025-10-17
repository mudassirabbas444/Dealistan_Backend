import admin from 'firebase-admin';

if (!admin.apps.length) {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!json) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable.');
  }

  const parsed = JSON.parse(json);

  const privateKey = parsed.private_key?.includes('\\n')
    ? parsed.private_key.replace(/\\n/g, '\n')
    : parsed.private_key;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey,
    }),
    storageBucket: `${parsed.project_id}.appspot.com`,
  });
}

export default admin;
export const db = admin.firestore();
export const bucket = admin.storage().bucket();
