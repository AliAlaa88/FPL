#!/bin/bash
# Shell script to start backend and frontend

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "\033[36mStarting FPL Development Environment...\033[0m"

# Start server in background
(
    cd "$SCRIPT_DIR/server"
    echo -e "\033[33mInstalling npm dependencies...\033[0m"
    npm install
    echo -e "\033[32mStarting Express server...\033[0m"
    npm run dev
) &

# Start client in background
(
    cd "$SCRIPT_DIR/client"
    echo -e "\033[33mInstalling npm dependencies...\033[0m"
    npm install
    echo -e "\033[32mStarting Vite dev server...\033[0m"
    npm run dev
) &

echo -e "\033[32mBoth servers starting! Press Ctrl+C to stop both.\033[0m"

# Wait for both background processes
wait
