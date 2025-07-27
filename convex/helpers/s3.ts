import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConvexError } from 'convex/values';

import { getEnv } from './getEnv';

/** Cloudflare R2 with S3-compatible client. */
export const getS3 = () => {
  const env = getEnv();

  return new S3Client({
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    region: 'auto',
  });
};

const deleteObject = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: getEnv().R2_BUCKET_NAME,
    Key: key,
  });

  await getS3().send(deleteCommand);
};

export const s3 = {
  /** Delete an object in R2 by key. */
  deleteObject,
  /**
   * Generate a presigned URL that allows PUT uploads to a specific key. Also
   * returns a "publicUrl" for immediate display if needed.
   *
   * - We store only the `key` in DB, but the client can use `publicUrl` or
   *   `getBucketPublicUrl(key)`.
   */
  createPresignedFile: async (
    Key: string,
    {
      user,
    }: {
      user?: string;
    } = {}
  ) => {
    try {
      const metadata: Record<string, string> = {};

      if (user) {
        metadata.user = user;
      }

      const signedUrl = await getSignedUrl(
        getS3(),
        new PutObjectCommand({
          Bucket: getEnv().R2_BUCKET_NAME,
          ContentType: 'application/octet-stream',
          Key,
          Metadata: metadata,
        }),
        {
          expiresIn: 30,
        }
      );

      return { signedUrl, url: getCacheBustUrl(Key) };
    } catch {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Error creating S3 presigned url',
      });
    }
  },
  /** Move or rename an image by copying and deleting the original. */
  moveImage: async (source: string, target: string) => {
    const copyCommand = new CopyObjectCommand({
      Bucket: getEnv().R2_BUCKET_NAME,
      CopySource: `${getEnv().R2_BUCKET_NAME}/${source}`,
      Key: target,
    });

    try {
      await getS3().send(copyCommand);
    } catch {
      // error if not found
      return;
    }

    await deleteObject(source);

    return { url: getCacheBustUrl(target) };
  },
  /** Directly upload a file buffer from the server (if needed). */
  uploadImage: async ({
    key,
    buffer,
    metadata,
  }: {
    key: string;
    buffer: Buffer;
    metadata?: Record<string, string>;
  }) => {
    const putObjectCommand = new PutObjectCommand({
      Body: buffer,
      Bucket: getEnv().R2_BUCKET_NAME,
      ContentType: 'image/jpeg',
      Key: key,
      Metadata: metadata,
    });

    await getS3().send(putObjectCommand);

    return { url: getCacheBustUrl(key) };
  },
};

const getCacheBustUrl = (url: string) => {
  return `${url}?${Date.now().toString()}`;
};
