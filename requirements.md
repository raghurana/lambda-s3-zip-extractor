## Project Overview

This project is a test to for the extract-zip npm package along with the s3-sync npm package to unzip files from one s3 location to a temp location in the lambda function and then upload the files to another s3 location via the s3-sync npm package.

## Requirements

1. Create a new CDK 2 project inside the `packages/1-infra` folder with 2 s3 buckets one called source-bucket and second called destination-bucket.
2. create a lamda func in the infra cdk prject with some inline hello world code that will be updated later via a cli command. Make sure the lambda function has read access to the source-bucket and write access to the destination-bucket. Pass the names of the buckets as environment variables to the lambda function.
3. Create a very simple typescript handler in the `packages/2-app` folder that will console.log the event object.
4. Create a new util module called s3-util that wraps the s3-client and add a function called syncS3Local that takes a local path and syncs it to a target s3 bucket using the s3-sync-client npm package.
5. Update the unzip-lambda to read source and destination bucket names from environment variables called SOURCE_BUCKET and DESTINATION_BUCKET.
6. Update the unzip-lambda.ts file to called getObjectStream from the s3-util module and use the extract-zip npm package to unzip the files from the source-bucket to a temp location in the lambda function and then upload the files to the destination-bucket using the syncS3Local func in s3-util module.

## Current File Structure

```
packages/
  1-infra
  2-app
```

## Relevant Docs

- https://www.npmjs.com/package/s3-sync-client
- https://www.npmjs.com/package/extract-zip
