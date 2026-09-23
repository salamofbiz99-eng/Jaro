# Janor Cleaning — Render.com + Docker Setup

Full source code and deployment setup for **Janor Cleaning** configured for **Render.com** and **Docker**.

## 🚀 Overview

This application runs as a Node.js / Docker web service on Render with:
- **Framework**: Next.js App Router (via `vinext`)
- **Database**: Embedded SQLite (`./data/janor.db` or `./data/jaro.db`) via Node.js `node:sqlite`
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
| `ADMIN_EMAILS` | Admin email address | `admin@janor.nl` |
| `ADMIN_PASSWORD` | Admin password | `your-secure-password` |
| `RESEND_API_KEY` | Resend API key for sending quote emails | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Sender email for quote notifications | `requests@janor.nl` |

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
