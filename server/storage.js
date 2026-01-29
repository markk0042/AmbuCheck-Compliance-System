/**
 * Optional S3-compatible storage for uploads (AWS S3 or Cloudflare R2).
 * When configured, uploaded files are stored in S3 and a public URL is returned
 * so PDFs and the app can always load images (persists across deploys).
 *
 * Env vars:
 *   S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 *   S3_REGION (optional, default us-east-1)
 *   S3_ENDPOINT (optional, for R2)
 *   S3_PUBLIC_URL (optional, e.g. https://pub-xxx.r2.dev for R2 public bucket)
 */

const fs = require('fs');
const path = require('path');

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.S3_REGION || 'us-east-1';
const PUBLIC_URL_BASE = process.env.S3_PUBLIC_URL;
const USE_S3 = Boolean(
  BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
);

let s3Client = null;

function getClient() {
  if (!USE_S3 || s3Client) return s3Client;
  const { S3Client } = require('@aws-sdk/client-s3');
  const config = {
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };
  if (process.env.S3_ENDPOINT) {
    config.endpoint = process.env.S3_ENDPOINT;
    config.forcePathStyle = true;
  }
  s3Client = new S3Client(config);
  return s3Client;
}

function getPublicUrl(key) {
  if (PUBLIC_URL_BASE) {
    const base = PUBLIC_URL_BASE.replace(/\/$/, '');
    return `${base}/${key}`;
  }
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Upload a file to S3. Returns public URL or null if not configured or on error.
 * @param {Buffer} buffer - File contents
 * @param {string} filename - Original filename (used for key and Content-Type)
 * @returns {Promise<string|null>} Public URL or null
 */
async function uploadToS3(buffer, filename) {
  if (!USE_S3) return null;
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const key = `uploads/${Date.now()}-${path.basename(filename)}`;
  try {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const client = getClient();
    const params = {
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mime,
    };
    if (!process.env.S3_ENDPOINT) {
      params.ACL = 'public-read';
    }
    await client.send(new PutObjectCommand(params));
    return getPublicUrl(key);
  } catch (err) {
    console.error('[Storage] S3 upload failed:', err.message);
    return null;
  }
}

function isS3Configured() {
  return USE_S3;
}

/**
 * Upload a file to Supabase Storage. Returns public URL or null.
 * Preferred when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set (only 3 env vars).
 */
async function uploadToSupabase(buffer, filename) {
  if (!USE_SUPABASE) return null;
  const objectPath = `uploads/${Date.now()}-${path.basename(filename)}`;
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': mime,
      },
      body: buffer,
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[Storage] Supabase upload failed:', res.status, err);
      return null;
    }
    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${objectPath}`;
  } catch (err) {
    console.error('[Storage] Supabase upload failed:', err.message);
    return null;
  }
}

function isSupabaseConfigured() {
  return USE_SUPABASE;
}

/**
 * Upload to persistent storage when configured. Tries Supabase first, then S3.
 * Returns public URL or null (caller falls back to local /uploads/ path).
 */
async function uploadPersistent(buffer, filename) {
  if (USE_SUPABASE) {
    const url = await uploadToSupabase(buffer, filename);
    if (url) return url;
  }
  if (USE_S3) {
    const url = await uploadToS3(buffer, filename);
    if (url) return url;
  }
  return null;
}

function isPersistentStorageConfigured() {
  return USE_SUPABASE || USE_S3;
}

module.exports = {
  uploadToS3,
  uploadToSupabase,
  uploadPersistent,
  isS3Configured,
  isSupabaseConfigured,
  isPersistentStorageConfigured,
};
