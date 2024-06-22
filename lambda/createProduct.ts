import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
};

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const newProduct = {
      id: uuidv4(),
      title: body?.title,
      description: body?.description,
      price: body?.price,
    };

    await documentClient.send(new PutCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: newProduct,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(newProduct),
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