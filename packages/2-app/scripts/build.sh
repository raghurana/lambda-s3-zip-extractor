#!/bin/bash

# Set the directory where the Lambda function zip files are located
SRC_DIR="./src/lambdas"
DIST_DIR="./dist"
PAGER="cat"

# Clean up the dist directory
rm -rf $DIST_DIR
echo "Cleaned up the dist directory"

# Build the Lambda functions
npx esbuild $SRC_DIR/* --entry-names=[dir]/[name]/index \
    --bundle --minify --sourcemap --platform=node --target=es2020 --outdir=$DIST_DIR --external:aws-sdk

echo "Built the Lambda functions"

# Zip the Lambda functions
for folder in $DIST_DIR/* ; do
    # Check if the current item in the loop is a directory
    if [ -d "$folder" ]; then
        function_name=$(basename "$folder")
        echo "Zipping $function_name"
        (cd "$folder" && zip -r "../${function_name}.zip" .)
        rm -rf "$folder"
    fi
done
echo "Zipped the Lambda functions"