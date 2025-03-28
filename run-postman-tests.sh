#!/bin/bash

set -e

echo "Starting Docker containers"
docker-compose up -d

echo "Waiting for the API to be ready"
sleep 5

echo "Running Postman tests"
newman run Store-Webapi.postman_collection.json --delay-request 250 --insecure

echo "Shutting down Docker containers"
docker-compose down

echo "Tests done"
