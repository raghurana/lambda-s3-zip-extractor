import { existsSync } from 'fs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3SyncClient } from 's3-sync-client';

// TODO: make this configurable
const s3Client = new S3Client({ region: 'ap-southeast-2' });

/**
 * Gets an S3 object as a readable stream
 * @param bucketName Source S3 bucket name
 * @param key S3 object key/path
 * @returns Readable stream of the S3 object
 */
export const getS3ObjectBytes = async (bucketName: string, key: string): Promise<Uint8Array> => {
  const response = await s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
  if (response.$metadata.httpStatusCode !== 200 || !response.Body)
    throw new Error(`Failed to get S3 object due to status code: ${response.$metadata.httpStatusCode}`);

  console.log(JSON.stringify(response.$metadata));
  return response.Body.transformToByteArray();
};

/**
 * Syncs a local directory to an S3 bucket using s3-sync-client
 * @param localPath Local directory path to sync
 * @param bucketName Target S3 bucket name
 * @param prefix Optional S3 prefix/path within the bucket
 */
export const syncS3Local = async (
  localPath: string,
  bucketName: string,
  prefix: string = '',
  maxConcurrentTransfers: number = 10,
): Promise<number> => {
  try {
    // Ensure the local path exists
    if (!existsSync(localPath)) throw new Error(`Local path does not exist: ${localPath}`);

    // Use s3-sync-client to sync the local directory
    const { sync } = new S3SyncClient({ client: s3Client });
    const output = await sync(localPath, `s3://${bucketName}/${prefix}`, {
      maxConcurrentTransfers: maxConcurrentTransfers,
      del: false,
    });

    console.log(`Successfully synced ${localPath} to s3://${bucketName}/${prefix}`);
    return output.created.length;
  } catch (error) {
    console.error('Error syncing local directory to S3:', error);
    throw error;
  }
};
