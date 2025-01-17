import extract from 'extract-zip';
import { tmpdir } from 'os';
import { join } from 'path';
import { Handler, Context } from 'aws-lambda';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { getS3ObjectBytes, syncS3Local } from '../s3-util';

export const handler: Handler = async (event: unknown, context: Context) => {
  const sourceBucket = process.env.SOURCE_BUCKET;
  const destinationBucket = process.env.DESTINATION_BUCKET;
  if (!sourceBucket || !destinationBucket) throw new Error('SOURCE_BUCKET and DESTINATION_BUCKET must be set');

  const srcObjectKey = 'test.zip';
  const tempDir = join(tmpdir(), `unzip-lambda-${context.awsRequestId}`);
  if (!existsSync(tempDir)) mkdirSync(tempDir);
  console.log('Temp directory:', tempDir);

  console.log('Downloading S3 object...');
  const srcFileBytes = await getS3ObjectBytes(sourceBucket, srcObjectKey);
  const tempZipPath = join(tempDir, srcObjectKey);
  writeFileSync(tempZipPath, srcFileBytes);
  console.log('S3 object downloaded to: ', tempZipPath);

  console.log('Extracting zip file...');
  const extractionDir = join(tempDir, 'extracted');
  await extract(tempZipPath, { dir: extractionDir });
  console.log('Zip file successfully extracted to: ', extractionDir);

  console.log('Syncing extracted files to S3...');
  const numFilesSynced = await syncS3Local(extractionDir, destinationBucket);
  console.log(`Extracted files synced to S3. ${numFilesSynced} files synced.`);

  console.log('Cleaning up temp directory...');
  rmSync(tempDir, { recursive: true, force: true });
  console.log('Temp directory cleaned up.');

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
