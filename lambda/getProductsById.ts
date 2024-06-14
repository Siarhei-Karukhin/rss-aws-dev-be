import { mockProducts } from './mockData';

const headers = {
  "Content-Type": "text/plain",
  "Access-Control-Allow-Origin" : "*",
};

export const handler = async (event: any) => {
  try {
    const product = mockProducts.find(({ id }) => id === event.pathParameters.productId);

    if (!product) {
      return {
        statusCode: 404,
        headers,
        body: 'Not found',
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
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
