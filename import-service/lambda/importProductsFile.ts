import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
};

const s3Client = new S3Client({});

export const handler = async (event: any) => {
  console.log('event: ', event);
  
  try {
    const fileName = event.queryStringParameters.name;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      ContentType: 'text/csv',
    });
  
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
    
    return {
      statusCode: 200,
      headers,
      body: signedUrl,
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
