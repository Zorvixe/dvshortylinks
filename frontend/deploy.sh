#!/bin/bash
cd /var/www/dvshortylinks/frontend
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
