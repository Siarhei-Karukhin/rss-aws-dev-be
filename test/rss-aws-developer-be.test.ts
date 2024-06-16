import { handler as getProductsList } from '../lambda/getProductsList';
import { handler as getProductsById } from '../lambda/getProductsById';

describe('Products service', () => {
  it('should return 200 statusCode for getProductsList', async () => {
    const response = await getProductsList({});

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 statusCode for getProductsById', async () => {
    const response = await getProductsById({ pathParameters: { productId: '3' } });

    expect(response.statusCode).toEqual(200);
  });

  it('should return 404 statusCode for getProductsById', async () => {
    const response = await getProductsById({ pathParameters: { productId: '4' } });

    expect(response.statusCode).toEqual(404);
  });
});
