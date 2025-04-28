"use server";

import { db } from "@/lib/db/dynamoDb";
import { Folder } from "@/types/types";
import { PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOption } from "../api/auth/[...nextauth]/route";

const addFolder = async (parentFolderId: string | null): Promise<Folder | null> => {
    try {
        const session = await getServerSession(authOption);
        console.log("session", session);
        if (!session?.user?.id) {
            throw new Error("User not authenticated.");
        }

        const userId = session.user.id;
        const folderId = crypto.randomUUID(); // Generate a unique ID
        const folderName = "Untitled";
        const folderCreationDate = new Date().toISOString();
        const itemsCount = 0;

        // Create new folder
        const params = {
            TableName: "AncriptFolderTable",
            Item: {
                folderId: { S: folderId },
                folderName: { S: folderName },
                folderCreationDate: { S: folderCreationDate },
                itemsCount: { N: itemsCount.toString() },
                parentFolderId: parentFolderId ? { S: parentFolderId } : { NULL: true },
                userId: { S: userId },
            },
        };

        const command = new PutItemCommand(params);
        await db.send(command);

        // Increment itemsCount of the parent folder if parentFolderId is provided
        if (parentFolderId) {
            const updateParams = {
                TableName: "AncriptFolderTable",
                Key: { folderId: { S: parentFolderId } },
                UpdateExpression: "SET itemsCount = itemsCount + :inc",
                ExpressionAttributeValues: {
                    ":inc": { N: "1" },
                },
                ConditionExpression: "attribute_exists(folderId)",
            };
            const updateCommand = new UpdateItemCommand(updateParams);
            await db.send(updateCommand);
        }

        revalidateTag("folders_list");

        return {
            folderId,
            folderName,
            folderCreationDate,
            itemsCount,
            parentFolderId,
            userId,
        };
    } catch (error) {
        console.error("Error adding folder:", error);
        return null;
    }
};

export default addFolder;
