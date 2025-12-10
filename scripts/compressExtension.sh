#!/bin/bash

OUTPUT_FILE="extension.zip"

if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
fi

zip -r "$OUTPUT_FILE" . -x "*.md" "scripts/*" ".*" "*.zip"

echo "Extension compressed to $OUTPUT_FILE"
