# Easiest way: Cloudflare R2 in 10 steps

R2 is free for typical use (10 GB storage, no egress fees). You only need a Cloudflare account (free).

---

## Part A: Create the bucket and get keys (Cloudflare)

**1.** Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in (or sign up free).

**2.** In the left sidebar, click **R2 Object Storage**.

**3.** Click **Create bucket**.  
   - Name: `ambucheck-uploads` (or any name).  
   - Click **Create bucket**.

**4.** Open your new bucket. Click **Settings**.  
   - Under **Public access**, click **Allow Access** (or **Edit** and turn on public access).  
   - If you see **R2.dev subdomain**, note the URL they give you (e.g. `https://pub-xxxxx.r2.dev`).  
   - Copy that **full URL** (you’ll use it as `S3_PUBLIC_URL`). If there’s no subdomain yet, you may need to enable “Public bucket” or “R2.dev” – use the URL they show.

**5.** In the left sidebar, click **R2 Object Storage** again, then **Manage R2 API Tokens**.

**6.** Click **Create API token**.  
   - Name: `AmbuCheck`.  
   - Permissions: **Object Read & Write**.  
   - Specify bucket: **Apply to specific bucket only** → choose `ambucheck-uploads`.  
   - Click **Create API Token**.

**7.** On the result screen you’ll see:
   - **Access Key ID** (long string)  
   - **Secret Access Key** (click “Reveal” and copy)  
   Copy both somewhere safe; you can’t see the secret again later.

**8.** Get the S3 endpoint:
   - Go back to **R2 Object Storage** → your bucket **ambucheck-uploads**.
   - Open the **S3 API** tab (or **Settings** → S3 API).
   - You’ll see **Endpoint** or **S3 API URL**, e.g.  
     `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`  
   Copy that full URL (replace nothing).

**9.** Note your **Account ID** (in the R2 or S3 API section, or in the Cloudflare URL when you’re in the dashboard).  
   The endpoint is usually: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

You should now have:
- **Bucket name:** `ambucheck-uploads`
- **Public URL:** e.g. `https://pub-xxxxx.r2.dev` (from step 4)
- **Access Key ID** (from step 7)
- **Secret Access Key** (from step 7)
- **S3 Endpoint:** e.g. `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (from step 8)

---

## Part B: Add env vars on Render

**10.** Open [dashboard.render.com](https://dashboard.render.com) → your **Web Service** (the Node/backend for AmbuCheck).

- Go to **Environment** (left sidebar).
- Click **Add Environment Variable** and add these **one by one**:

| Key | Value (paste yours) |
|-----|----------------------|
| `S3_BUCKET` | `ambucheck-uploads` |
| `AWS_ACCESS_KEY_ID` | (paste Access Key ID from step 7) |
| `AWS_SECRET_ACCESS_KEY` | (paste Secret Access Key from step 7) |
| `S3_REGION` | `auto` |
| `S3_ENDPOINT` | (paste S3 endpoint from step 8, e.g. `https://1234567890abcdef.r2.cloudflarestorage.com`) |
| `S3_PUBLIC_URL` | (paste public URL from step 4, e.g. `https://pub-xxxxx.r2.dev`) |

- Click **Save Changes**. Render will redeploy your service.

---

## Done

After the redeploy, new uploads (form images and VDI Start photos) go to R2. Download PDF from Completed Forms will always show those images, even after redeploys.

**Troubleshooting:** If PDFs still don’t show images, check the Web Service **Logs** on Render. If you see `[Storage] S3 upload failed`, double-check the six env vars (no extra spaces, correct bucket name and endpoint).
