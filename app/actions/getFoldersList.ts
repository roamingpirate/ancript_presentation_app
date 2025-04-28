"use server";
import { cache } from "react";
import { db } from "@/lib/db/dynamoDb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";
import { Folder } from "@/types/types";

const fetchFoldersList = async (parentFolderId: string): Promise<any> => {
    try {
        const params = {
            TableName: "AncriptFolderTable",
            IndexName: "parentFolderId-index",
            KeyConditionExpression: "parentFolderId = :parentFolderId",
            ExpressionAttributeValues: {
                ":parentFolderId": { S: parentFolderId }
            }
        };

        const command = new QueryCommand(params);
        const response = await db.send(command);

        if (!response.Items || response.Items.length === 0) {
            console.log("No folders found.");
            return [];
        }

        const folders: Folder[] = response.Items.map(item => ({
            folderId: item.folderId?.S || "",
            folderName: item.folderName?.S || "Untitled",
            folderCreationDate: item.folderCreationDate?.S || "1970-01-01T00:00:00Z",
            itemsCount: item.itemsCount?.N ? Number(item.itemsCount.N) : 0,
            parentFolderId: item.parentFolderId?.S || null,
            userId: item.userId?.S || ""
        }));

        folders.sort((a, b) => new Date(b.folderCreationDate).getTime() - new Date(a.folderCreationDate).getTime());

        console.log("Folders Found:", folders);
        return folders;
        
    } catch (error) {
        console.error("Error fetching folders:", error);
        return [];
    }
};

export const getFoldersList = unstable_cache(
    fetchFoldersList,  
    [`folders_list`],      
    { tags: ["folders_list"], revalidate: 120 }
);