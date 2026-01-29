# PostgreSQL setup (AmbuCheck server)

The server uses **PostgreSQL** when `DATABASE_URL` is set; otherwise it falls back to JSON files in `server/data/`. This keeps local development simple and gives you persistent storage in production (e.g. on Render).

## Render

1. In the [Render Dashboard](https://dashboard.render.com/), create a **PostgreSQL** database (New → Database → PostgreSQL).
2. After it’s created, open the database and copy the **Internal Database URL** (or **External** if your app is not on Render).
3. In your **Web Service** (the Node backend):
   - **Environment** → Add environment variable:
   - **Key:** `DATABASE_URL`
   - **Value:** paste the connection string (e.g. `postgres://user:pass@host/dbname?sslmode=require` or the Internal URL Render shows).
4. Redeploy the web service. On startup it will create the tables automatically if they don’t exist.

## Local development with Postgres

1. Install PostgreSQL and create a database, e.g. `ambucheck`.
2. In the `server` folder, create a `.env` file (or set in your shell):
   ```env
   DATABASE_URL=postgresql://localhost:5432/ambucheck
   ```
3. Run `npm start` or `npm run dev`. Tables are created on first run.

## Local development without Postgres

Do **not** set `DATABASE_URL`. The server will use JSON files in `server/data/` (users, runsheets, form submissions, etc.). No database install needed.

## Schema

Tables are created automatically by `db.js` when `DATABASE_URL` is set. The SQL is in `schema.sql` for reference. Tables: `users`, `runsheets`, `form_submissions`, `equipment_checks`, `form_config_overrides`, `practitioners`, `vehicles`.
