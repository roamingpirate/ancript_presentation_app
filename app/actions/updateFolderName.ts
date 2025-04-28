"use server";
import { db } from "@/lib/db/dynamoDb";
import {  UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidateTag } from "next/cache";

export const updateFolderName = async (folderId: string, newFolderName: string): Promise<string> => {
    try {
        if (!folderId || !newFolderName) {
            return "Folder ID and new folder name are required.";
        }

        const params = {
            TableName: "AncriptFolderTable",
            Key: {
                folderId: { S: folderId }
            },
            UpdateExpression: "SET folderName = :newName",
            ExpressionAttributeValues: {
                ":newName": { S: newFolderName }
            },
        };

        const command = new UpdateItemCommand(params);
        await db.send(command);
        revalidateTag("folders_list");
        revalidateTag('folder_details');
        console.log(`Folder name updated successfully: ${newFolderName}`);
        return "Folder name updated successfully.";
    } catch (error) {
        console.error("Error updating folder name:", error);
        return "Error updating folder name.";
    }
};