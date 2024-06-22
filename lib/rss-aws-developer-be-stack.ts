import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class RssAwsDeveloperBeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: "Products",
    });

    const stocksTable = new dynamodb.Table(this, 'StocksTable', {
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      tableName: "Stocks",
    });

    const getProductsListLambda = new lambda.Function(this, 'GetProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      }
    });

    productsTable.grantReadWriteData(getProductsListLambda);
    stocksTable.grantReadWriteData(getProductsListLambda);

    const getProductsByIdLambda = new lambda.Function(this, 'GetProductsByIdFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsById.handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      }
    });

    productsTable.grantReadWriteData(getProductsByIdLambda);
    stocksTable.grantReadWriteData(getProductsByIdLambda);

    const api = new apigateway.RestApi(this, 'ProductsApi');

    const getProductsListAPI = api.root.addResource('products');
    getProductsListAPI.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));

    const getProductsByIdAPI = getProductsListAPI.addResource('{productId}');
    getProductsByIdAPI.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));
  }
}