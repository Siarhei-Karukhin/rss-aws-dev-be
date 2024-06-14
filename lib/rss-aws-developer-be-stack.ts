import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class RssAwsDeveloperBeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsListLambda = new lambda.Function(this, 'GetProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
    });

    const getProductsByIdLambda = new lambda.Function(this, 'GetProductsByIdFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsById.handler',
    });

    const api = new apigateway.RestApi(this, 'ProductsApi');

    const getProductsListAPI = api.root.addResource('products');
    getProductsListAPI.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));

    const getProductsByIdAPI = getProductsListAPI.addResource('{productId}');
    getProductsByIdAPI.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));
  }
}