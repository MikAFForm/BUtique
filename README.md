# BUtique Setup (Fresh Machine)

These steps assume **nothing is installed**. Follow in order.

## 1) Install prerequisites
### Windows (terminal/PowerShell)
- Git (manual download): https://git-scm.com/downloads
- Node.js LTS: `winget install OpenJS.NodeJS.LTS`
- Python 3.12: `winget install Python.Python.3.12`

### macOS (terminal)
- Git (Xcode CLI): `xcode-select --install`
- Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Node.js LTS: `brew install node`
- Python 3.12: `brew install python`
### Manual downloads 
- Same for both OS 
	- Node https://nodejs.org/en/download 
	- Python https://www.python.org/downloads/

## 2) Clone the repo
```bash
git clone <https://github.com/MinsungKim0315/BUtique.git>
cd BUtique
```

## 3) Environment variables
Create `.env.local` in the repo root:
```
NEXT_PUBLIC_SUPABASE_URL=...your Supabase URL...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...anon key...
SUPABASE_SERVICE_ROLE_KEY=...service role key...
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```
Ensure your Supabase project already has the required schema (users, products, passwords, chat_sessions, messages).

## 4) Install dependencies
### Frontend (from repo root)
```bash
npm install
```
### Backend (from `backend/`)
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## 5) Run the backend (GraphQL API)
From `backend/` (same on macOS/Windows):
```bash
uvicorn app.main:app --reload --port 4000
```
GraphQL playground: `http://localhost:4000/graphql`.

## 6) Run the frontend
From repo root (same on macOS/Windows):
```bash
npm run dev
```
Open `http://localhost:3000`.

## 7) Authentication note
- Routes are guarded by a session cookie (`session_user_id`). Login sets it; `/creator` is allowed for sign-up.
- Static assets (`/icon.png`, etc.) and `/api` are public.

## 8) Tests (optional)
From repo root (same on macOS/Windows):
```bash
pytest --cov=backend --cov-report=term-missing
```

You’re ready to develop: backend on 4000, frontend on 3000.***
