import { createServerFn } from "@tanstack/react-start";
import { getAuthSessionFn } from "../lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getPresignedUrlFn = createServerFn({ method: "POST" })
  .validator((data: { filename: string; contentType: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      const accountId = process.env.R2_ACCOUNT_ID;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
      const bucketName = process.env.R2_BUCKET_NAME;
      const publicUrl = process.env.R2_PUBLIC_URL;

      if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        throw new Error("R2 credentials are not fully configured in environment variables.");
      }

      const S3 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      // Sanitize filename to avoid weird characters in URL
      const safeFilename = data.filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileKey = `courses/${Date.now()}_${Math.random().toString(36).substring(7)}_${safeFilename}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        ContentType: data.contentType,
      });

      const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
      
      const finalUrl = `s3://${fileKey}`;

      return { signedUrl, finalUrl };
    } catch (error: any) {
      console.error("Error generating presigned URL:", error);
      throw new Error(error.message);
    }
  });

import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getDownloadUrlFn = createServerFn({ method: "POST" })
  .validator((data: { s3Url: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      const accountId = process.env.R2_ACCOUNT_ID;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
      const bucketName = process.env.R2_BUCKET_NAME;

      if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        throw new Error("R2 credentials missing");
      }

      if (!data.s3Url.startsWith("s3://")) {
        throw new Error("Invalid S3 URL");
      }

      const S3 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      });

      const fileKey = data.s3Url.replace("s3://", "");
      const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
      
      const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
      return { url: signedUrl };
    } catch (error: any) {
      console.error("Error generating download URL:", error);
      throw new Error(error.message);
    }
  });
