# AmbuCheck – Ambulance Compliance & Frontline Run Sheets

AmbuCheck is a full‑stack web app for **ambulance fleet compliance**, combining:

- Frontline **Start/End of Shift run sheets**
- Comprehensive vehicle & equipment **VDI checklists**
- Medication bag and equipment **check forms** (BLS, EMT, ALS, AP)
- Admin tools for **completed forms, PDFs, and configuration**

It is designed to feel natural to frontline crews on both **desktop** and **mobile/tablet** devices.

**Live demo:** [`https://ambu-check-compliance-system.vercel.app/`](https://ambu-check-compliance-system.vercel.app/)

---

## ✨ Highlights

- **Frontline Run Sheets**
  - “Frontline Run Sheets” side heading with a **Start Shift** workflow.
  - Captures shift date, book on/off times, trust station/contract, callsign, drug bag numbers & seals, vehicle details, start mileage/fuel, crew details, EOS data, and comments.
  - Runsheets are stored centrally and can be viewed later.
  - Visibility is scoped so crews only see runsheets they are attached to (by **creator**, **name**, or **PIN**).

- **VDI – Start & End of Shift**
  - Dedicated VDI Start of Shift equipment checklist with rich status dropdowns (green/red icons, tagged/present statuses).
  - VDI End of Shift dynamic form, including **Patient Area** section with “Response Bag Sealed”.
  - Image uploads (vehicle sides) persist via cloud storage so images survive redeploys.

- **Equipment & Bag Checklists**
  - BLS Bag, EMT Meds, Paramedic Meds, ALS Bag, AP Meds.
  - Smart “tamper seal” logic: when main tamper is intact, content fields can be auto‑filled and/or relaxed.
  - Required fields clearly marked with a red asterisk and validated before submit.

- **Completed Forms & PDFs**
  - Admin‑only **Completed Forms** page with search and category filters.
  - View submissions in a modal, or download **styled PDFs** with:
    - Centered report and section headings.
    - Form‑like layout (labels + value boxes).
    - Embedded photos with proper headings above each image.
  - Completed forms can be **deleted** by admins if needed.

- **Admin Settings**
  - Manage **practitioners** (including PINs and roles).
  - Manage **vehicles** (registration, callsign, description).
  - Edit form configurations via JSON overrides (e.g. tweak labels, required flags) without redeploying the client.

---

## 📸 Screenshots

> Replace the image paths below with your actual screenshots (e.g. place PNG files in `docs/screenshots/`).

### Desktop

- **Frontline Run Sheets – List & Start Shift**

```markdown
![Frontline Run Sheets – Desktop](docs/screenshots/frontline-runsheets-desktop.png)
```

- **VDI – Start of Shift Checklist**

```markdown
![VDI Start of Shift – Desktop](docs/screenshots/vdi-start-desktop.png)
```

- **Completed Forms – Admin PDF Downloads**

```markdown
![Completed Forms – Desktop](docs/screenshots/completed-forms-desktop.png)
```

### Mobile / Tablet

- **Frontline Run Sheets – Mobile**

```markdown
![Frontline Run Sheets – Mobile](docs/screenshots/frontline-runsheets-mobile.png)
```

- **Checklist Form – Mobile**

```markdown
![Checklist Form – Mobile](docs/screenshots/checklist-form-mobile.png)
```

---

## 🧩 Architecture Overview

### Frontend (`client/`)

- **React** SPA with React Router.
- Central layout shell (`Layout.js`) with sidebar navigation:
  - Frontline Run Sheets
  - VDI – Start/End of Shift
  - Vehicle IR1 Incident Reports
  - Monitor/AED, BLS Bag, EMT Meds, Paramedic/ALS/AP Meds
  - Admin: Completed Forms & Settings (admin‑only).
- **Auth context** (`AuthContext.js`):
  - JWT‑based auth.
  - Tokens stored in **`sessionStorage`** (not localStorage) so sessions end when the browser/app is closed.
- **Key components**
  - `RunsheetList` – Frontline run sheets list + Start Shift form + detailed view modal.
  - `EquipmentCheck` – VDI Start of Shift vehicle equipment check.
  - `DynamicForm` – Generic renderer for all JSON‑configured forms (VDI End, BLS, meds, etc.).
  - `CompletedForms` – Admin dashboard for viewing, filtering, downloading PDFs, and deleting submissions.
  - `AdminSettings` – Practitioners, vehicles, and form config overrides.

### Backend (`server/`)

- **Node.js + Express** API.
- **PostgreSQL** via `pg` when `DATABASE_URL` is set; otherwise JSON files in `server/data/` (for local dev).
  - `form_submissions`, `equipment_checks`, `runsheets`, `practitioners`, `vehicles`, `form_config_overrides`, `users`.
- **Auth**
  - `/api/login` issues JWT with `{ id, username, role, name }`.
  - `/api/me` returns current user for the token.
- **Storage**
  - Upload endpoints use `multer` + a `storage` abstraction.
  - Can use **Supabase Storage** or S3/R2 for persistent image URLs; falls back to local `/uploads` in dev.
- **PDF generation**
  - `pdfkit` used to build PDFs for VDI Start and all admin form submissions.
  - Images embedded from their public URLs with headings centered and labels above each photo.

---

## 🔐 Authentication & Roles

- **Admin**
  - Username: `admin`
  - Password: `admin1994` (or `ADMIN_DEFAULT_PASSWORD` env var on Render)
  - Role: `admin`
  - Access: All checklists + Completed Forms + Admin Settings + delete forms.

- **Standard user (test)**
  - Username: `user1`
  - Password: `1user`
  - Role: `user`
  - Access: Frontline Run Sheets, all checklists; **no** admin pages.

Tokens are stored in `sessionStorage` so users are logged out when the browser/tab or WebView is closed.

---

## 👥 Frontline Run Sheets – Visibility Logic

Runsheets are stored with:

- `createdBy` – user ID of the creator.
- `crew1Name`, `crew1Pin`, `crew1Grade`
- `crew2Name`, `crew2Pin`, `crew2Grade`

When a non‑admin calls `GET /api/runsheets`, the backend:

1. Looks up the user’s **name** (from the JWT / `/api/me`).
2. Looks up their **PIN** from the `practitioners` table (matching active practitioner by name).
3. Filters runsheets so the user only sees rows where:
   - `createdBy === user.id`, or
   - `crew1Name` or `crew2Name` equals their name, or
   - `crew1Pin` or `crew2Pin` equals their practitioner PIN.

This means:

- If you start a shift with your crew mate’s PIN, **they will see that runsheet** under Frontline Run Sheets.
- Admins always see the full dataset.

---

## 🛠 Project Structure

```text
Checklist App/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Pages, layout, forms, modals
│   │   ├── config/         # Form JSON configs (formsConfig.js)
│   │   ├── context/        # Auth context
│   │   └── utils/          # Axios instance, helpers
│   └── package.json
├── server/                 # Node/Express backend
│   ├── data/               # JSON storage (local dev fallback)
│   ├── uploads/            # Uploaded files (dev fallback)
│   ├── index.js            # Express app & routes
│   ├── db.js               # DB abstraction (Postgres + JSON)
│   ├── storage.js          # Supabase / S3 / local upload abstraction
│   ├── DATABASE.md         # DB setup notes
│   └── package.json
└── package.json            # Root scripts (dev, install-all)
```

---

## 🚀 Getting Started (Local Dev)

### 1. Install dependencies

From the **repo root**:

```bash
npm install           # root dev tools (concurrently, nodemon)
cd server && npm install
cd ../client && npm install
```

Or use the helper script:

```bash
npm run install-all
```

### 2. Environment variables (optional but recommended)

In `server/.env` (or Render dashboard):

- `DATABASE_URL` – Postgres connection string (Render PostgreSQL or local).
- `JWT_SECRET` – JWT signing secret.
- `ADMIN_DEFAULT_PASSWORD` – override default `admin1994`.
- **Optional storage:**
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_STORAGE_BUCKET`

Without `DATABASE_URL`, the app uses JSON files in `server/data/` for local testing.

### 3. Run both server & client

From the repo root:

```bash
npm run dev
```

This starts:

- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

### 4. Run individually

**Backend only**

```bash
cd server
npm start
```

**Frontend only**

```bash
cd client
npm start
```

---

## 🌐 Deployment

The project is designed to be deployed as:

- **Frontend** – Vercel (React app from `client/`, using `REACT_APP_` env vars for API base URL).
- **Backend** – Render Web Service (Node/Express in `server/`), using:
  - `DATABASE_URL` for PostgreSQL
  - Optional Supabase / S3 storage env vars
  - CORS configured to allow both `*.vercel.app` and `.onrender.com` origins.

PDF generation, persistent image URLs, and DB usage are all fully supported on Render.

---

## 🧪 Key API Endpoints (high‑level)

- `POST /api/login` – user login, returns JWT + user payload.
- `GET /api/me` – current user profile.
- `GET /api/runsheets` – paginated, filtered runsheets (scoped by user/role).
- `POST /api/runsheets` – create a new frontline runsheet (Start Shift).
- `POST /api/equipment-checks` – VDI Start of Shift equipment check (with photos).
- `POST /api/upload/:fieldName` – single file upload for form fields.
- `GET /api/admin/forms/:formId/submissions` – list form submissions (admin).
- `GET /api/admin/forms/:formId/submissions/:id/pdf` – download styled PDF.
- `DELETE /api/admin/forms/:formId/submissions/:id` – delete a submission.
- `GET /api/practitioners`, `POST/PUT/DELETE /api/practitioners/:id` – manage crew records.
- `GET /api/vehicles`, `POST/PUT/DELETE /api/vehicles/:id` – manage vehicle records.

---

## 🧱 Tech Stack

- **Frontend**
  - React, React Router
  - Axios for HTTP
  - Responsive CSS (custom) for desktop + mobile

- **Backend**
  - Node.js, Express
  - JWT (`jsonwebtoken`), `bcryptjs`
  - `multer` for uploads
  - `pdfkit` for dynamic PDF creation

- **Data & Storage**
  - PostgreSQL (preferred), JSON fallback in `server/data/`
  - Supabase Storage / S3 / R2 (via `storage.js`) for images

---

## 📌 Notes & Future Ideas

- Existing flows are optimised for shift‑based work and compliance reporting.
- The architecture already supports:
  - Adding more checklist forms via `formsConfig.js` + overrides.
  - Extending the practitioner/vehicle models.
- Potential future enhancements:
  - Crew‑facing **mobile wrapper app** using Capacitor or React Native.
  - Push/email notifications for overdue checks.
  - Analytics dashboard for trusts (compliance over time, missing equipment trends).

If you’re evaluating AmbuCheck or considering contributing, feel free to open an issue or PR – this project is built to grow with real‑world ambulance operations. 🚑

