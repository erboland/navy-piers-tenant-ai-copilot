#!/usr/bin/env bash
# Deploy sibling tenant-ai-backend + this app's production build to an Azure VM.
set -euo pipefail

VM_HOST="${VM_HOST:-48.217.185.114}"
VM_IP="${VM_IP:-$VM_HOST}"
SSH_USER="${SSH_USER:-azureuser}"
SSH_KEY="${SSH_KEY:-$HOME/Downloads/Navy Piers Key.pem}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COPILOT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKEND_ROOT="$(cd "${COPILOT_ROOT}/../tenant-ai-backend" && pwd)"

SSH_BASE=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=accept-new)
RSYNC_BASE=(rsync -avz --delete -e "ssh -i \"$SSH_KEY\" -o StrictHostKeyChecking=accept-new")

if [[ ! -f "${SSH_KEY}" ]]; then
  echo "SSH key not found: ${SSH_KEY}"
  exit 1
fi

if [[ ! -d "${BACKEND_ROOT}" ]]; then
  echo "Backend repo not found at ${BACKEND_ROOT}"
  exit 1
fi

chmod 600 "${SSH_KEY}" 2>/dev/null || true

echo "==> Frontend production build (${COPILOT_ROOT})"
cd "${COPILOT_ROOT}"
if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@10.24.0 --activate
fi
pnpm install
pnpm run build

echo "==> rsync backend → ${SSH_USER}@${VM_HOST}:~/tenant-ai-backend/"
"${RSYNC_BASE[@]}" \
  --exclude '.venv' \
  --exclude '__pycache__' \
  --exclude '*.pyc' \
  --exclude '.pytest_cache' \
  --exclude 'tenant_ai.db' \
  "${BACKEND_ROOT}/" "${SSH_USER}@${VM_HOST}:~/tenant-ai-backend/"

echo "==> rsync frontend dist → ${SSH_USER}@${VM_HOST}:~/navy-piers-dist/"
"${RSYNC_BASE[@]}" "${COPILOT_ROOT}/dist/" "${SSH_USER}@${VM_HOST}:~/navy-piers-dist/"

echo "==> rsync bootstrap script"
scp -i "${SSH_KEY}" -o StrictHostKeyChecking=accept-new \
  "${SCRIPT_DIR}/vm-bootstrap.sh" "${SSH_USER}@${VM_HOST}:~/vm-bootstrap.sh"

echo "==> Run bootstrap on VM"
"${SSH_BASE[@]}" "${SSH_USER}@${VM_HOST}" "chmod +x ~/vm-bootstrap.sh && VM_IP=${VM_IP} ~/vm-bootstrap.sh"

echo "==> Verify from laptop"
curl -fsS "http://${VM_HOST}/api/v1/health" && echo
curl -fsSI "http://${VM_HOST}/" | head -n 5

echo "Deploy finished."
