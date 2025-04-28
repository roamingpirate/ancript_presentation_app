"use server";

import { db } from "@/lib/db/dynamoDb";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";
import { revalidateTag } from "next/cache";

export interface AnnotationInput {
  projectId: string | null;
  pageNo: number;
  x: number;
  y: number;
  annotationNumber: number;
  avatarId: string;
  avatarImgId: string;
}

const addAnnotation = async ({
  projectId,
  pageNo,
  x,
  y,
  avatarId,
  annotationNumber,
  avatarImgId,
}: AnnotationInput) => {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user?.id) {
      throw new Error("User not authenticated.");
    }

    if (!projectId) {
      return;
    }

    const annotationId = crypto.randomUUID();
    const sortKey = `#${pageNo}#${annotationId}`;
    const createdAt = new Date().toISOString();

    // Add entry to AncriptAnnotationTable
    const annotationParams = {
      TableName: "AncriptAnnotationTable",
      Item: {
        projectId: { S: projectId },
        '#pageId#annotationId': { S: sortKey },
        annotationId: { S: annotationId },
        pageNo: { N: pageNo.toString() },
        x: { N: x.toString() },
        y: { N: y.toString() },
        avatarId: { S: avatarId },
        avatarImgId: { S: avatarImgId },
        userId: { S: session.user.id },
        createdAt: { S: createdAt },
        Scale: { N: "1" },
        Rotation: { N: "0" },
        currentStage: {N : "1"},
        explanationText: {S: ""},
        script: {S: ""}
      },
    };

    const annotationCommand = new PutItemCommand(annotationParams);
    await db.send(annotationCommand);

    revalidateTag("annotations");

    return {
      annotationId,
      pageNo,
      x,
      y,
      avatarId,
      avatarImgId,
      createdAt,
      currentStage : 1,
      explanationText: "",
      script: ""
    };
  } catch (error) {
    console.error("Error adding annotation:", error);
    throw new Error("Failed to add annotation. Please try again later.");
  }
};

export default addAnnotation;