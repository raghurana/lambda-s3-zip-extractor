## Project Overview

This project is a test to for the extract-zip npm package along with the s3-sync npm package to unzip files from one s3 location to a temp location in the lambda function and then upload the files to another s3 location via the s3-sync npm package.

## Requirements

1. Create a new CDK 2 project inside the `packages/1-infra` folder with 2 s3 buckets one called source-bucket and second called destination-bucket.
2. create a lamda func in the infra cdk prject with some inline hello world code that will be updated later via a cli command. Make sure the lambda function has read access to the source-bucket and write access to the destination-bucket. Pass the names of the buckets as environment variables to the lambda function.
3. Create a very simple typescript handler in the `packages/2-app` folder that will console.log the event object.

## Current File Structure

```
packages/
  1-infra
  2-app
```
