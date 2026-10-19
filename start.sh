#!/bin/bash
set -e

echo "Starting PetConnect backend..."
node backend/server.js &

echo "Starting PetConnect frontend..."
node node_modules/vite/bin/vite.js
