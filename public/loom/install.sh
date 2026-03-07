#!/bin/bash

set -e
echo "==================================="
echo "Welcome to the Loom Installer! :)"
echo ""
echo "Installing Loom! Please wait.."
echo "==================================="

mkdir -p "$HOME/.local/bin"

# download bin
if command -v curl >/dev/null 2>&1; then
    curl -sSL "https://virex.lol/loom/loom-lang" -o "$HOME/.local/bin/loom"
elif command -v wget >/dev/null 2>&1; then
    wget -qO "$HOME/.local/bin/loom" "https://virex.lol/loom/loom-lang"
else
    echo "Error: curl or wget is required to install Loom."
    exit 1
fi

chmod +x "$HOME/.local/bin/loom"

if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo "$HOME/.local/bin is not in your PATH."
    echo "Add this to your .bashrc, .zshrc, or whatever you're using:"
    echo 'export PATH="$HOME/.local/bin:$PATH"'
else
    echo "Loom is now installed at $HOME/.local/bin/loom"
fi

echo "You can try running: loom {program}.lm"
echo "have fun with your Loom programming experience!"
