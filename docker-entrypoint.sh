#!/bin/sh

set -e

# Function to wait for the database to be ready
wait_for_db() {
  echo "Waiting for database to be ready..."
  while ! nc -z postgres 5432; do
    sleep 1
  done
  echo "Database is ready!"
}

# Wait for the database
wait_for_db

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec node server.js