import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { mockClient } from 'aws-sdk-client-mock';

import { handler as importProductsFile } from '../lambda/importProductsFile';
import { handler as importFileParser } from '../lambda/importFileParser';

const mockEvent = {
  queryStringParameters: {
    name: 'test',
  },
} as unknown;

const mockSignedUrl = 'https://mock.s3.amazonaws.com/test';

jest.mock('@aws-sdk/s3-request-presigner');
const getSignedUrlMock = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;
getSignedUrlMock.mockImplementation(() => Promise.resolve(mockSignedUrl));

describe('importProductsFile', () => {
  beforeAll(() => {
    const s3Mock = mockClient(S3Client);
    s3Mock.on(PutObjectCommand, { Bucket: 'bucket', Key: 'products.csv' }).resolves({});
  });

  it('should return 200 status code with signed url', async () => {
    const response = await importProductsFile(mockEvent);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockSignedUrl);
  });

  it('should return 500 status code with error message', async () => {
    getSignedUrlMock.mockImplementationOnce(() => Promise.reject(new Error()));

    const response = await importProductsFile(mockEvent);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual('Something went wrong');
  });
});

describe('importFileParser', () => {
  it('should parse CSV', async () => {
    const Records = [{s3: {bucket: {name: 'bucketName'}, object: {key: 'uploaded/test.csv'}}}];
    const s3Mock = mockClient(S3Client);
    
    const mockedStream = new Readable({ read() {} });
    mockedStream.push('1, title, desc, 10');
    mockedStream.push(null);

    s3Mock
      .on(GetObjectCommand, {Bucket:'bucketName', Key:'uploaded/test.csv'})
      .resolves({
        // @ts-ignore
        Body: mockedStream
      }
    );

    s3Mock.on(CopyObjectCommand).resolves({});
    s3Mock.on(DeleteObjectCommand).resolves({});

    const response = await importFileParser({Records});
    expect(response.statusCode).toEqual(200);

    s3Mock.restore();
  });
});
