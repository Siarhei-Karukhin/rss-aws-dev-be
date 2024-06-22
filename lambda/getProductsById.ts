import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
};

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  try {
    const productsTableParams = {
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: event.pathParameters.productId,
      },
    };
    const { Item: product } = await documentClient.send(new GetCommand(productsTableParams));

    if (!product) {
      return {
        statusCode: 404,
        headers,
        body: 'Not found',
      };
    }

    const stocksTableParams = {
      TableName: process.env.STOCKS_TABLE,
      Key: {
        product_id: event.pathParameters.productId,
      },
    };
    const { Item: stock } = await documentClient.send(new GetCommand(stocksTableParams));

    const productWithStock = { ...product, count: stock?.count ?? 0 };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(productWithStock),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: 'Something went wrong',
    };
  }
};
