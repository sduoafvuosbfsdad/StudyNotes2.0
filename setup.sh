#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '\n[setup] %s\n' "$1"
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

install_with_apt() {
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y "$@"
}

install_docker() {
  if need_cmd docker; then
    log "Docker already installed: $(docker --version)"
    return
  fi

  log "Installing Docker Engine + CLI + Compose plugin..."
  install_with_apt ca-certificates curl gnupg

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  arch="$(dpkg --print-architecture)"
  codename="$(. /etc/os-release && echo "${VERSION_CODENAME}")"

  cat >/etc/apt/sources.list.d/docker.list <<EOL
deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${codename} stable
EOL

  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  if need_cmd systemctl; then
    systemctl enable docker || true
    systemctl start docker || true
  fi

  log "Installed: $(docker --version)"
}

verify_docker() {
  log "Checking Docker + Compose..."
  docker --version
  docker compose version
  docker compose config >/dev/null
  log "Docker is ready."
}

main() {
  install_docker
  verify_docker
}

main "$@"
