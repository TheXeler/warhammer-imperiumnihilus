#!/bin/bash

ZIP_FILE="warhammer-imperiumnihilus.zip"

TEMP_DIR=$(mktemp -d)
cp -r ./* "$TEMP_DIR/"

EXCLUDE_LIST=(".idea" "package.sh" "package.bat")
for item in "${EXCLUDE_LIST[@]}"; do
    rm -rf "$TEMP_DIR/$item"
done

cd "$TEMP_DIR" || exit
zip -r "../$ZIP_FILE" .

cd ..
rm -rf "$TEMP_DIR"

echo "Done"
