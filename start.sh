#!/bin/bash
# Online Saathi - Startup Script
# ================================

cd "$(dirname "$0")"

# Clear any old cached MONGO_URI from codespaces
unset MONGO_URI

# Load environment from api/.env
if [ -f api/.env ]; then
    export $(grep -v '^#' api/.env | xargs)
    echo "✅ Loaded environment from api/.env"
fi

# Print info
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 Starting Online Saathi...                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Start the server
npm run start
