"use server";

import { db } from "@/lib/db/dynamoDb";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidateTag } from "next/cache";

const moveFolder = async (
    folderId: string,
    newParentFolderId: string | null,
    previousParentFolderId: string | null
): Promise<boolean> => {
    
    try {
        // Update the folder's parentFolderId
        const updateFolderParams = {
            TableName: "AncriptFolderTable",
            Key: { folderId: { S: folderId } },
            UpdateExpression: "SET parentFolderId = :newParent",
            ExpressionAttributeValues: {
                ":newParent": newParentFolderId ? { S: newParentFolderId } : { NULL: true },
            },
            ConditionExpression: "attribute_exists(folderId)",
        };
        await db.send(new UpdateItemCommand(updateFolderParams));

        // Decrement itemsCount of the previous parent folder if it exists
        if (previousParentFolderId) {
            const decrementParams = {
                TableName: "AncriptFolderTable",
                Key: { folderId: { S: previousParentFolderId } },
                UpdateExpression: "SET itemsCount = itemsCount - :dec",
                ConditionExpression: "attribute_exists(folderId) AND itemsCount > :zero",
                ExpressionAttributeValues: {
                    ":zero": { N: "0" },
                    ":dec": { N: "1" },
                },
            };
            await db.send(new UpdateItemCommand(decrementParams));
        }

        // Increment itemsCount of the new parent folder if it exists
        if (newParentFolderId) {
            const incrementParams = {
                TableName: "AncriptFolderTable",
                Key: { folderId: { S: newParentFolderId } },
                UpdateExpression: "SET itemsCount = itemsCount + :inc",
                ExpressionAttributeValues: {
                    ":inc": { N: "1" },
                },
                ConditionExpression: "attribute_exists(folderId)",
            };
            await db.send(new UpdateItemCommand(incrementParams));
        }

        revalidateTag("folders_list");
        return true;

    } catch (error) {
        console.error("Error moving folder:", error);
        return false;
    }
};

export default moveFolder;
