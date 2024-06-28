import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'ImportServiceStackBucket');

    const importProductsFileLambda = new lambda.Function(this, 'ImportProductsFileFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: new lambda.AssetCode('lambda'),
      handler: 'importProductsFile.handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    const importProductsFilePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject'],
      resources: [bucket.bucketArn + '/*'],
    });
    importProductsFileLambda.addToRolePolicy(importProductsFilePolicy);

    const api = new apigateway.RestApi(this, 'ImportServiceAPI');

    const importResource = api.root.addResource('import');
    importResource.addMethod('GET', new apigateway.LambdaIntegration(importProductsFileLambda));
  }
}
