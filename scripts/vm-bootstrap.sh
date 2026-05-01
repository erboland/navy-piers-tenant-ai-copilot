#!/usr/bin/env bash
# Run on the Azure VM after rsync (invoked by deploy-azure-vm.sh).
set -euo pipefail

VM_IP="${VM_IP:?Set VM_IP to the public IP (e.g. 48.217.185.114)}"
BACKEND_DIR="${HOME}/tenant-ai-backend"
FRONTEND_DIST="${HOME}/navy-piers-dist"

echo "==> VM bootstrap for ${VM_IP}"

if [[ ! -d "${BACKEND_DIR}" ]]; then
  echo "Missing ${BACKEND_DIR}. Run deploy-azure-vm.sh from your laptop first."
  exit 1
fi

if [[ ! -d "${FRONTEND_DIST}" ]]; then
  echo "Missing ${FRONTEND_DIST}."
  exit 1
fi

# Swap for small SKU (idempotent-ish)
if ! swapon --show | grep -q '/swapfile'; then
  echo "==> Adding 2G swap"
  sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> apt packages"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx python3-venv python3-pip

echo "==> Backend venv + deps"
cd "${BACKEND_DIR}"
python3 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
./.venv/bin/alembic upgrade head

cat > "${BACKEND_DIR}/.env" << EOF
ENVIRONMENT=production
DATABASE_URL=sqlite:///./tenant_ai.db
CORS_ALLOW_ORIGINS=http://${VM_IP}
EOF

sudo tee /etc/systemd/system/tenant-ai-backend.service >/dev/null << EOF
[Unit]
Description=Tenant AI Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=${USER}
WorkingDirectory=${BACKEND_DIR}
EnvironmentFile=${BACKEND_DIR}/.env
ExecStart=${BACKEND_DIR}/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable tenant-ai-backend
sudo systemctl restart tenant-ai-backend

for _ in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:8000/api/v1/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "==> Nginx"
sudo mkdir -p /var/www/navy-piers
sudo rsync -a --delete "${FRONTEND_DIST}/" /var/www/navy-piers/dist/

sudo tee /etc/nginx/sites-available/navy-piers >/dev/null << NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${VM_IP};

    root /var/www/navy-piers/dist;
    index index.html;

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_pass http://127.0.0.1:8000;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/navy-piers /etc/nginx/sites-enabled/navy-piers
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "==> Health checks (localhost)"
curl -fsS "http://127.0.0.1:8000/api/v1/health" && echo
curl -fsSI "http://127.0.0.1/" | head -n 3

echo "Done. Open http://${VM_IP}/ and http://${VM_IP}/api/v1/health"
