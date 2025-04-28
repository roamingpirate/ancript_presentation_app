"use server";
import { db } from "@/lib/db/dynamoDb";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";

const fetchFolder = async (folderId: string): Promise<any> => {
    console.log("cachedData");
    try {
        if (!folderId) {
            console.log("Folder Id is required.");
            return null;
        }

        const params = {
            TableName: "AncriptFolderTable",
            Key: {
                folderId: { S: folderId }
            }
        };

        const command = new GetItemCommand(params);
        const response = await db.send(command);

        if (!response.Item) {
            console.log("Folder not found.");
            return null;
        }

        const folder = Object.fromEntries(
            Object.entries(response.Item).map(([key, value]) => [
                key,
                value.N ? Number(value.N) : value.S ?? value.B ?? null,
            ])
        );

        console.log("Folder Details:", folder);
        return folder;
    } catch (error) {
        console.error("Error fetching folder details:", error);
        return null;
    }
};


export const getFolder = unstable_cache(
    fetchFolder,  
    [`folder_details`],      
    { tags: ["folder_details"], revalidate: 120 }
);
