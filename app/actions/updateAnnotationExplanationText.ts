"use server"

import { db } from "@/lib/db/dynamoDb"
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { revalidateTag } from "next/cache"

export const updateAnnotationExplanationTextServer = async ({
  projectId,
  annotationId,
  pageNo,
  explanationText,
}: {
  projectId: string | null
  annotationId: string
  pageNo: number
  explanationText: string
}): Promise<boolean> => {
  try {
    if (!projectId || !annotationId || !explanationText || pageNo == null) {
      console.error("Missing required params.")
      return false
    }

    // Constructing the sort key using the page number and annotation ID
    const sortKey = `#${pageNo}#${annotationId}`

    const updateExpr = "SET explanationText = :explanationText"
    const exprAttrValues: Record<string, any> = {
      ":explanationText": { S: explanationText },
    }

    const command = new UpdateItemCommand({
      TableName: "AncriptAnnotationTable",
      Key: {
        projectId: { S: projectId },
        "#pageId#annotationId": { S: sortKey }, // Using the same sortKey construction as before
      },
      UpdateExpression: updateExpr,
      ExpressionAttributeValues: exprAttrValues,
    })

    await db.send(command)
    revalidateTag(`annotations`)
    return true
  } catch (error) {
    console.error("Error updating annotation explanation text:", error)
    return false
  }
}
