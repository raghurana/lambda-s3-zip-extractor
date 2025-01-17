import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class LambdaS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create source S3 bucket
    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      bucketName: 'source-bucket-20250117',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create destination S3 bucket
    const destinationBucket = new s3.Bucket(this, 'DestinationBucket', {
      bucketName: 'destination-bucket-20250117',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Lambda function
    const lambdaFunction = new lambda.Function(this, 'UnzipLambda', {
      functionName: 'unzip-lambda',
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      memorySize: 1024, // 1GB
      timeout: cdk.Duration.minutes(15),
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Event:', JSON.stringify(event));
          return {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!')
          };
        };
      `),
      environment: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--enable-source-maps',
        SOURCE_BUCKET: sourceBucket.bucketName,
        DESTINATION_BUCKET: destinationBucket.bucketName,
      },
    });

    sourceBucket.grantRead(lambdaFunction);
    destinationBucket.grantReadWrite(lambdaFunction);
  }
}
