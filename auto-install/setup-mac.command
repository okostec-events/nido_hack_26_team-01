#!/bin/bash
set -e

# Move from auto-install/ up to the repo root (where index.html lives)
cd "$(dirname "$0")/.."
PROJECT_DIR="$(pwd)"

echo ""
echo "🚀 Nido Hack '26 — Auto Install (Mac)"
echo "======================================"
echo "Project folder: $PROJECT_DIR"
echo ""

# 1. Install Homebrew if missing
if ! command -v brew &> /dev/null; then
  echo "→ Installing Homebrew (will ask for your Mac password once)..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add brew to PATH for current session (Apple Silicon vs Intel)
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -f /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo "✓ Homebrew already installed"
fi

# 2. Install VS Code (skip if already present in /Applications)
echo ""
if [ -d "/Applications/Visual Studio Code.app" ]; then
  echo "✓ VS Code already installed, skipping"
else
  echo "→ Installing VS Code..."
  brew install --cask visual-studio-code
fi

# 3. Install GitHub Desktop (skip if already present)
if [ -d "/Applications/GitHub Desktop.app" ]; then
  echo "✓ GitHub Desktop already installed, skipping"
else
  echo "→ Installing GitHub Desktop..."
  brew install --cask github
fi

# 4. Install Node.js (skip if 'node' is already in PATH)
if command -v node &> /dev/null; then
  echo "✓ Node.js already installed ($(node --version)), skipping"
else
  echo "→ Installing Node.js..."
  brew install node
fi

# 5. Install Git (skip if 'git' is already in PATH)
if command -v git &> /dev/null; then
  echo "✓ Git already installed ($(git --version | cut -d' ' -f3)), skipping"
else
  echo "→ Installing Git..."
  brew install git
fi

# 6. Make sure 'code' CLI is available (VS Code must expose its CLI shim)
if ! command -v code &> /dev/null; then
  echo ""
  echo "⚠️  The 'code' command is not in your PATH yet. To install it:"
  echo "    Open VS Code → Cmd+Shift+P → 'Shell Command: Install code command in PATH'"
  echo "    Then re-run this script."
  open -a "Visual Studio Code" "$PROJECT_DIR"
  exit 0
fi

# 7. Install Cline AI extension (idempotent — skips if already installed)
echo ""
echo "→ Installing Cline AI extension..."
code --install-extension saoudrizwan.claude-dev

# 8. Open the project in VS Code
echo ""
echo "→ Opening project in VS Code..."
code "$PROJECT_DIR"

echo ""
echo "✅ Done! VS Code should now be open."
echo "   Next: in VS Code, double-click 'index.html' in the left sidebar"
echo "   to start the Hackathon Clicker game."
echo ""
