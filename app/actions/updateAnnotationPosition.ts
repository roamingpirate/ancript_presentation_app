"use server"

import { db } from "@/lib/db/dynamoDb"
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { revalidateTag } from "next/cache"

export const updateAnnotationPositionServer = async ({
  projectId,
  annotationId,
  pageNo,
  x,
  y,
  scale,
}: {
  projectId: string | null
  annotationId: string
  pageNo: number
  x: number
  y: number
  scale?: number
}): Promise<boolean> => {
  try {
    if (!projectId || !pageNo || !annotationId || pageNo == null) {
      console.error("Missing required params.")
      return false
    }

    const sortKey = `#${pageNo}#${annotationId}`

    let updateExpr = "SET x = :x, y = :y, pageNo = :pageNo"
    const exprAttrValues: Record<string, any> = {
      ":x": { N: x.toString() },
      ":y": { N: y.toString() },
      ":pageNo": { N: pageNo.toString() },
    }

    if (scale !== undefined) {
      updateExpr += ", scale = :scale"
      exprAttrValues[":scale"] = { N: scale.toString() }
    }

    const command = new UpdateItemCommand({
      TableName: "AncriptAnnotationTable",
      Key: {
        projectId: { S: projectId },
        "#pageId#annotationId": { S: sortKey },
      },
      UpdateExpression: updateExpr,
      ExpressionAttributeValues: exprAttrValues,
    })

    await db.send(command)
    revalidateTag(`annotations`)
    return true
  } catch (error) {
    console.error("Error updating annotation position:", error)
    return false
  }
}
