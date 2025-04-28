"use server"

import { db } from "@/lib/db/dynamoDb"
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { revalidateTag } from "next/cache"

interface UpdateAnnotationFieldsParams {
  projectId: string | null
  annotationId: string
  pageNo: number
  updates: Record<string, string | number | boolean>
}

export const updateAnnotationFieldsServer = async ({
  projectId,
  annotationId,
  pageNo,
  updates,
}: UpdateAnnotationFieldsParams): Promise<boolean> => {
  try {
    if (!projectId || !pageNo || !annotationId || !updates || Object.keys(updates).length === 0) {
      console.error("Missing required params or updates")
      return false
    }

    const sortKey = `#${pageNo}#${annotationId}`

    // Build UpdateExpression and ExpressionAttributeValues dynamically
    let updateExpr = "SET"
    const exprAttrValues: Record<string, any> = {}

    const expressions: string[] = []

    for (const [key, value] of Object.entries(updates)) {
      const attrKey = `:${key}`
      expressions.push(`${key} = ${attrKey}`)

      exprAttrValues[attrKey] =
        typeof value === "number"
          ? { N: value.toString() }
          : typeof value === "boolean"
          ? { BOOL: value }
          : { S: String(value) }
    }

    updateExpr += " " + expressions.join(", ")

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
    revalidateTag("annotations")
    return true
  } catch (error) {
    console.error("Error updating annotation fields:", error)
    return false
  }
}
