import { mockProducts } from './mockData';

const headers = {
  "Content-Type": "text/plain",
  "Access-Control-Allow-Origin" : "*",
};

export const handler = async (event: any) => {
  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockProducts),
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
