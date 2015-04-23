#!/bin/bash
if [ -z "$1" ]; then
    FILE="secret.sh"
else
    FILE="$1"
fi

export NODE_PATH=$NODE_PATH:$(pwd):$(pwd)/src
export SQLITE3_DB_PATH=$(pwd)/dev.sqlite3

if [ -f "$FILE" ]; then
    source "$FILE"
fi
