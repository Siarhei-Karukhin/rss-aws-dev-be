import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Import Lambda L2 construct
import * as lambda from 'aws-cdk-lib/aws-lambda';
//Import API Gateway L2 construct
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class RssAwsDeveloperBeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsListLambda = new lambda.Function(this, 'ProductsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
    });
    const getProductsListAPIGateway = new apigateway.LambdaRestApi(this, 'ProductsApi', {
      handler: getProductsListLambda,
      proxy: false,
    });
    getProductsListAPIGateway.root
      .addResource('products')
      .addMethod('GET');
  }
}