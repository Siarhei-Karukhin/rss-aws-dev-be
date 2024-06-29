import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PassThrough, Readable } from 'stream';
import csv from 'csv-parser';

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
};

const s3Client = new S3Client({});

export const handler = async (event: any) => {
  console.log('event: ', event);
  
  try {
    for (const record of event.Records) {
      console.log('record.s3', record.s3)
      const bucketName = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      console.log('key: ', key);
      const getAndDeleteObjectCommandParams = { Bucket: bucketName, Key: key };

      const { Body: data } = await s3Client.send(
        new GetObjectCommand(getAndDeleteObjectCommandParams)
      );
      
      if (!(data instanceof Readable)) {
        throw new Error('Data is not a readable stream');
      }

      await new Promise((resolve, reject) => {
        data
          .pipe(new PassThrough())
          .pipe(csv())
          .on('data', console.log)
          .on('error', (error: any) => reject(error))
          .on('end', async () => {
            const copyObjectCommandParams = {
              Bucket: bucketName,
              CopySource: `${bucketName}/${key}`,
              Key: key.replace('uploaded', 'parsed'),
            };
            console.log('copyObjectCommandParams: ', copyObjectCommandParams);
            await s3Client.send(
              new CopyObjectCommand(copyObjectCommandParams)
            );
            console.log('CopyObjectCommand ✔');
            await s3Client.send(
              new DeleteObjectCommand(getAndDeleteObjectCommandParams)
            );
            console.log('DeleteObjectCommand ✔');
            resolve(null);
          });
      });

      console.log('File parsed ✔');
    }

    return {
      statusCode: 200,
      headers,
      body: 'File parsed ✔',
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
