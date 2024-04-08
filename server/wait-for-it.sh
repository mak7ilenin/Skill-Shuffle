#!/bin/bash
# Script to wait for a service to become available

host="$1"
port="$2"
timeout="${3:-60}"

# Wait for the specified host and port to become available
until nc -z "$host" "$port"; do
    >&2 echo "Database is unavailable - sleeping"
    sleep 1
    timeout=$((timeout - 1))
    if [ "$timeout" -eq 0 ]; then
        >&2 echo "Timeout reached - database unavailable"
        exit 1
    fi
done

# Wait for additional time to ensure that the database has finished importing the dump
# Adjust this sleep duration based on the expected time it takes to import the dump
sleep 30

>&2 echo "Database is available"