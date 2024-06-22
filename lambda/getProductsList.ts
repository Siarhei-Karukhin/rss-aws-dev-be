import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
};

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  try {
    const { Items: products } = await documentClient.send(new ScanCommand({ TableName: process.env.PRODUCTS_TABLE }));
    const { Items: stocks } = await documentClient.send(new ScanCommand({ TableName: process.env.STOCKS_TABLE }));

    const productsWithStocks = products?.map((product) => ({
      ...product,
      count: stocks?.find(({ product_id }) => product_id === product.id)?.count ?? 0,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(productsWithStocks),
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
