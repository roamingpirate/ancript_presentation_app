"use server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/db/dynamoDb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "AncriptUserTable";
const EMAIL_INDEX = "email-index";

export async function createUser(user: { name: string; email: string }): Promise<string> {
  try {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: EMAIL_INDEX,
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": user.email,
      },
    });

    const existingUser = await db.send(queryCommand);

    if (existingUser.Items && existingUser.Items.length > 0) {
      console.log("User Already Exists")
      return existingUser.Items[0].userId;
    }

    const newUserId = uuidv4();

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        userId: newUserId,
        name: user.name,
        email: user.email,
      },
    });

    await db.send(putCommand);
    return newUserId;
  } catch (error) {
    throw new Error("Failed to create or fetch user.");
  }
}
