# JARO Cleaning — Render.com + Docker Setup

Full source code and deployment setup for **JARO Cleaning** configured for **Render.com** and **Docker**.

## 🚀 Overview

This application runs as a Node.js / Docker web service on Render with:
- **Framework**: Next.js App Router (via `vinext`)
- **Database**: Embedded SQLite (`./data/jaro.db`) via Node.js `node:sqlite`
- **File Storage**: Local disk storage (`./data/uploads`)
- **Container**: Docker (`node:22-slim`)

---

## 🛠️ Deploying to Render.com

### 1. Repository Setup
1. Push code to your GitHub repository (e.g. `salamofbiz99-eng/Jaro`).
2. Log into [Render.com](https://render.com).

### 2. Create Web Service
1. Click **New +** → **Web Service**.
2. Connect your GitHub repository `Jaro`.
3. Render automatically detects `render.yaml` or you can manually select:
   - **Environment**: `Docker`
   - **Region**: `Frankfurt` (or preferred region)
   - **Plan**: `Free` (or Starter)

### 3. Environment Variables (in Render Dashboard)
Set the following environment variables in Render:

| Variable | Description | Example / Recommended |
|----------|-------------|-----------------------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Listening Port | `10000` |
| `ADMIN_USERNAME` | Admin login username | `admin@jaro-cleaning.nl` |
| `ADMIN_PASSWORD_SHA256` | SHA256 hash of admin password | `6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b` |
| `ADMIN_SESSION_SECRET` | Secret key for admin session tokens | `your-secret-key-32-chars-long` |
| `ADMIN_EMAILS` | Admin email address | `admin@jaro-cleaning.nl` |
| `ADMIN_PASSWORD` | Admin password | `your-secure-password-20-chars` |
| `RESEND_API_KEY` | Resend API key for sending quote emails | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Sender email for quote notifications | `requests@yourdomain.com` |

---

## 💻 Local Development

### Installation & Run
```sh
npm ci
npm run dev
```

### Build & Preview Locally
```sh
npm run build
npm run start
```

### Run Security & Auth Tests
```sh
npm test
```
