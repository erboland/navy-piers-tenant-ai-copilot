# Deploying to Azure VM (frontend + backend)

This guide covers the production layout used for **Navy Piers Tenant AI**: a single Ubuntu VM runs **Nginx** (static Vite build + reverse proxy) and **FastAPI** (systemd + uvicorn on localhost).

## Architecture

| Layer | Role |
|--------|------|
| **Nginx** | Serves `dist/` at `/`; proxies `/api/` → `http://127.0.0.1:8000` |
| **FastAPI** | Listens on `127.0.0.1:8000`; routes under `/api/v1/...` |
| **Vite app** | Built with `.env.production`: `VITE_API_URL=/api/v1`, `VITE_USE_MOCK_API=false` |

The automation assumes the backend lives in a **sibling directory** next to this repo:

```text
SphereInc/
  navy-piers-tenant-ai-copilot/    ← this repo (frontend + deploy scripts)
  tenant-ai-backend/               ← FastAPI backend (separate checkout)
```

If your backend path differs, edit `BACKEND_ROOT` in `scripts/deploy-azure-vm.sh`.

## Prerequisites

- **Azure NSG**: inbound **TCP 80** (and **443** when you add TLS).
- **SSH**: PEM key for `azureuser` (path may contain spaces; the deploy script quotes it for rsync).
- **VM**: Ubuntu 22.04/24.04 with `sudo` for `azureuser`.
- **Local**: Node **pnpm** (via Corepack), rsync, ssh, scp.

Small SKUs (e.g. **B1s**, 1 GiB RAM): the remote bootstrap script creates a **2 GiB swapfile** if none is active, so `pip install` and migrations do not OOM.

## One-command deploy (from your laptop)

From this repo root:

```bash
./scripts/deploy-azure-vm.sh
```

Defaults:

| Variable | Default |
|----------|---------|
| `VM_HOST` | `48.217.185.114` (SSH + rsync target) |
| `VM_IP` | same as `VM_HOST` (written into backend `.env` `CORS_ALLOW_ORIGINS` and Nginx `server_name`) |
| `SSH_USER` | `azureuser` |
| `SSH_KEY` | `$HOME/Downloads/Navy Piers Key.pem` |

Override example:

```bash
VM_HOST=203.0.113.50 VM_IP=203.0.113.50 SSH_KEY=~/.ssh/my.pem ./scripts/deploy-azure-vm.sh
```

What it does:

1. Runs **`pnpm install`** and **`pnpm run build`** (loads **`.env.production`**).
2. **Rsync** backend → `~/tenant-ai-backend/` on the VM (excludes `.venv`, `tenant_ai.db`, caches).
3. **Rsync** `dist/` → `~/navy-piers-dist/`.
4. Copies **`scripts/vm-bootstrap.sh`** and runs it on the VM.

## Remote bootstrap (`vm-bootstrap.sh`)

Runs on the VM (you normally do not invoke it by hand):

- Ensures **swap** (if missing).
- Installs **nginx**, **python3-venv**, **python3-pip**.
- Creates **`~/tenant-ai-backend/.venv`**, `pip install -r requirements.txt`, **`alembic upgrade head`**.
- Writes **`~/tenant-ai-backend/.env`** with `ENVIRONMENT=production`, `DATABASE_URL`, **`CORS_ALLOW_ORIGINS=http://<VM_IP>`**.
- Installs **`tenant-ai-backend`** systemd unit (uvicorn on **8000**).
- Configures Nginx site **`navy-piers`**, syncs static files to **`/var/www/navy-piers/dist/`**.
- Waits for **`/api/v1/health`** on localhost before finishing.

## Environment variables

### Frontend (build-time)

| File | Purpose |
|------|---------|
| **`.env.production`** | Production build: mock off, API base **`/api/v1`**. |
| **`.env`** / **`.env.example`** | Local dev: **`VITE_USE_MOCK_API`**, full **`VITE_API_URL`** if using a remote API. |

Mock vs HTTP client is controlled by **`VITE_USE_MOCK_API`** (`false` / `0` / `no` → real backend).

### Backend (runtime on VM)

Managed by bootstrap; adjust on server if you add a domain:

```env
ENVIRONMENT=production
DATABASE_URL=sqlite:///./tenant_ai.db
CORS_ALLOW_ORIGINS=http://YOUR_PUBLIC_IP_OR_ORIGIN
```

Multiple origins: comma-separated list, no spaces (or minimal — split is by comma).

After edits:

```bash
sudo systemctl restart tenant-ai-backend
```

## Verification

From any machine that can reach the VM:

```bash
curl -fsS http://<VM_HOST>/api/v1/health
curl -fsSI http://<VM_HOST>/ | head
```

Expect JSON `{"status":"ok"}` and **HTTP 200** for `/`.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| **502** on `/api/*` | Uvicorn not up yet or crashed — `journalctl -u tenant-ai-backend -n 50 --no-pager` |
| **502** right after deploy | Race resolved in script via wait loop; re-run bootstrap or wait a few seconds |
| Frontend talks to **localhost** API | Production build missing `.env.production` or **`VITE_USE_MOCK_API`** still mock |
| **CORS** errors | Add your browser origin to **`CORS_ALLOW_ORIGINS`** on the backend `.env` |
| **`npm run build`** | This repo uses **pnpm**; use **`pnpm run build`** |
| rsync **Permission denied (publickey)** | **`chmod 600`** on PEM; correct **`SSH_KEY`** path |

## TLS (optional)

Use **Certbot** (Let’s Encrypt) or Azure-managed certificates, then:

- Terminate HTTPS in Nginx.
- Extend **`CORS_ALLOW_ORIGINS`** with `https://your-domain`.

## Related files

- `scripts/deploy-azure-vm.sh` — laptop entrypoint.
- `scripts/vm-bootstrap.sh` — VM provisioning (called by deploy script).
- `src/app/config.ts` — **`VITE_USE_MOCK_API`** parsing.
- Backend CORS: **`cors_allow_origins`** / **`cors_origins()`** in the **`tenant-ai-backend`** settings module.
