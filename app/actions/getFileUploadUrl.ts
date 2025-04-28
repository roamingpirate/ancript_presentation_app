"use server";
import { s3 } from "@/lib/db/dynamoDb";
import {PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";


export async function getPresignedUrlForFileUpload(fileName: string, fileType: string): Promise<{ uploadUrl: string , fileKey: string }> {
  try {
    const fileKey = `${uuidv4()}-${fileName}`; 

    const command = new PutObjectCommand({
      Bucket: 'ancript-uploads',
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return { uploadUrl, fileKey };
    
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL.");
  }
}
