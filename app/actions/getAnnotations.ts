"use server";

import { db } from "@/lib/db/dynamoDb";
import { Annotation } from "@/store/slices/editorSlice";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";

const fetchAnnotations = async (projectId: string): Promise<Annotation[]> => {
  try {
    if (!projectId) {
      console.error("projectId is required.");
      return [];
    }

    const params = {
      TableName: "AncriptAnnotationTable",
      KeyConditionExpression: "projectId = :pid",
      FilterExpression:
        "attribute_not_exists(isDeleted) OR isDeleted = :false",
      ExpressionAttributeValues: {
        ":pid": { S: projectId },
        ":false": { BOOL: false },
      },
    };

    const command = new QueryCommand(params);
    const response = await db.send(command);

    const annotations: Annotation[] = (response.Items || []).map((item) => ({
      annotationId: item.annotationId?.S!,
      pageNo: parseInt(item.pageNo.N!),
      x: parseFloat(item.x.N!),
      y: parseFloat(item.y.N!),
      avatarId: item.avatarId.S!,
      avatarImgId: item.avatarImgId.S!,
      createdAt: item.createdAt.S!,
      scale: parseFloat(item.scale?.N!),
      rotation: parseFloat(item.rotation?.N!),
      currentStage: parseInt(item.currentStage.N!),
      explanationText: item.explanationText.S!,
      script: item.script?.S!
    }));

    return annotations;
  } catch (error) {
    console.error("Error fetching annotations:", error);
    return [];
  }
};

export const getAnnotations = unstable_cache(fetchAnnotations, [`annotations`], {
  tags: [`annotations`],
  revalidate: 60,
});
