#!/usr/bin/env bash
set -e

echo "Installing MCP servers for Codex..."

# Ensure Node exists
if ! command -v node &> /dev/null
then
  echo "Node.js not found. Installing..."

  if command -v brew &> /dev/null; then
    brew install node
  elif command -v apt &> /dev/null; then
    sudo apt update
    sudo apt install -y nodejs npm
  else
    echo "Install Node.js manually: https://nodejs.org"
    exit 1
  fi
fi

echo "Installing MCP servers..."

npm install -g \
@modelcontextprotocol/server-filesystem \
@playwright/mcp \
chrome-devtools-mcp

echo "Creating Codex MCP config..."

mkdir -p ~/.codex

cat > ~/.codex/config.toml <<EOF
[mcp_servers.filesystem]
command = "mcp-server-filesystem"
args = ["$PWD"]

[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp"]

[mcp_servers.chrome]
command = "npx"
args = ["-y", "chrome-devtools-mcp"]

[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
EOF

echo "Done. Restart Codex CLI."
