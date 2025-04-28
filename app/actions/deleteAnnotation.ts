"use server";

import { db } from "@/lib/db/dynamoDb";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";
import { revalidateTag } from "next/cache";

export interface DeleteAnnotationInput {
  projectId: string;
  pageNo: number;
  annotationNumber: string;
}

const deleteAnnotation = async ({
  projectId,
  pageNo,
  annotationNumber,
}: DeleteAnnotationInput) => {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user?.id) {
      throw new Error("User not authenticated.");
    }

    const sortKey = `#${pageNo}#${annotationNumber}`;
    const deletedAt = new Date().toISOString();

    const params = {
      TableName: "AncriptAnnotationTable",
      Key: {
        projectId: { S: projectId },
        "#pageId#annotationId": { S: sortKey },
      },
      UpdateExpression: "SET isDeleted = :true, deletedAt = :deletedAt",
      ExpressionAttributeValues: {
        ":true": { BOOL: true },
        ":deletedAt": { S: deletedAt },
      },
    };

    const command = new UpdateItemCommand(params);
    await db.send(command);

    revalidateTag("annotations");

    return { success: true };
  } catch (error) {
    console.error("Error soft-deleting annotation:", error);
    throw new Error("Failed to delete annotation. Please try again later.");
  }
};

export default deleteAnnotation;
