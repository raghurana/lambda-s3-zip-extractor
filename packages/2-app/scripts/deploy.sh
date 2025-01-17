#!/bin/bash

DIST_DIR="./dist"
PAGER="cat"

# Update the Lambda functions
for zip_file in "$DIST_DIR"/*.zip; do
    # Extract the function name from the zip file name (without extension)
    function_name=$(basename "$zip_file" .zip)
    echo "Updating Lambda function: $function_name"
    
    # Use AWS CLI to update the Lambda function code
    aws lambda update-function-code \
        --function-name "$function_name" \
        --zip-file "fileb://$zip_file" \
        --publish
    
    # Check if the update was successful
    if [ $? -eq 0 ]; then
        echo "Successfully updated $function_name"
    else
        echo "Failed to update $function_name"
    fi
    
    echo "----------------------------------------"
done

# echo "All Lambda functions updated successfully."