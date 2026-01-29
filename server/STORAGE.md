# S3-compatible storage for uploads (optional)

When configured, uploaded images (form file fields and VDI Start photos) are stored in **S3 or Cloudflare R2** instead of only on the server disk. That way:

- Images **persist across redeploys** (Render’s disk is ephemeral).
- **Download PDF** from Completed Forms can always embed those images (the server fetches them from the stored URL).

If you **don’t** set these env vars, uploads still work: they go to the server’s `uploads` folder and PDFs embed them only while that disk still has the files.

---

## Env vars (Web Service on Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `S3_BUCKET` | Yes | Bucket name |
| `AWS_ACCESS_KEY_ID` | Yes | Access key for S3/R2 |
| `AWS_SECRET_ACCESS_KEY` | Yes | Secret key |
| `S3_REGION` | No | Region (default `us-east-1`). For R2 use e.g. `auto`. |
| `S3_ENDPOINT` | For R2 | R2 S3 API endpoint (e.g. `https://<account-id>.r2.cloudflarestorage.com`) |
| `S3_PUBLIC_URL` | For R2 | Public URL base for the bucket (e.g. `https://pub-xxx.r2.dev`) so the app and PDFs can load images |

---

## AWS S3

1. Create a bucket and set its **Block Public Access** so objects can be public (or use a bucket policy).
2. Create an IAM user with `s3:PutObject` and `s3:PutObjectAcl` (for `public-read`), attach to the bucket.
3. In the Web Service → **Environment**, add:
   - `S3_BUCKET` = your bucket name  
   - `AWS_ACCESS_KEY_ID` = IAM access key  
   - `AWS_SECRET_ACCESS_KEY` = IAM secret key  
   - `S3_REGION` = e.g. `eu-west-1`
4. Redeploy. Uploads will get a URL like `https://<bucket>.s3.<region>.amazonaws.com/uploads/...`.

---

## Cloudflare R2

1. In Cloudflare Dashboard → **R2** → create a bucket.
2. **R2 → Manage R2 API Tokens** → Create API token (Object Read & Write). Note **Access Key ID** and **Secret Access Key**.
3. **R2 → your bucket → Settings** → enable **Public access** (or custom domain) and note the public URL (e.g. `https://pub-xxx.r2.dev`).
4. **S3 API** tab: note the **Endpoint** (e.g. `https://<account-id>.r2.cloudflarestorage.com`).
5. In the Web Service → **Environment**, add:
   - `S3_BUCKET` = bucket name  
   - `AWS_ACCESS_KEY_ID` = R2 Access Key ID  
   - `AWS_SECRET_ACCESS_KEY` = R2 Secret Access Key  
   - `S3_REGION` = `auto`  
   - `S3_ENDPOINT` = R2 S3 endpoint URL  
   - `S3_PUBLIC_URL` = public bucket URL (e.g. `https://pub-xxx.r2.dev`)
6. Redeploy. New uploads will be stored in R2 and the app/PDF will use `S3_PUBLIC_URL` to load images.
