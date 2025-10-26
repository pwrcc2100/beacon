#!/bin/bash

echo "Stopping any existing servers on port 3002..."
lsof -ti:3002 | xargs kill -9 2>/dev/null

echo "Clearing Next.js cache..."
cd /Users/peta/Documents/Beacon/webapp/beacon
rm -rf .next

echo "Starting fresh server on port 3002..."
npm run dev -- -p 3002


