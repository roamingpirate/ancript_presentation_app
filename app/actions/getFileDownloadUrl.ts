"use server";
import { s3 } from "@/lib/db/dynamoDb";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getFileDownloadUrl(fileKey: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: "ancript-uploads",
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); 

    return signedUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Failed to generate download URL.");
  }
}
