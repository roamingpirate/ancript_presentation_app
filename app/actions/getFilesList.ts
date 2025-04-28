"use server";
import { db } from "@/lib/db/dynamoDb";
import { UploadedFile } from "@/types/types";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { authOption } from "../api/auth/[...nextauth]/route";


const fetchFilesList = async (userId: string): Promise<UploadedFile[]> => {
    try {
        const params = {
            TableName: "AncriptFileTable",
            IndexName: "userId-index",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: userId }
            }
        };

        const command = new QueryCommand(params);
        const response = await db.send(command);

        if (!response.Items || response.Items.length === 0) {
            console.log("No files found.");
            return [];
        }

        const files: UploadedFile[] = response.Items.map(item => ({
            fileId: item.fileId?.S || "",
            fileName: item.fileName?.S || "Untitled",
            location: item.location?.S || "",
            dateOfCreation: item.dateOfCreation?.S || "1970-01-01T00:00:00Z",
            userId: item.userId?.S || "",
            imagesExtracted: item.imagesExtracted?.BOOL || false,
            imagesIdArray: item.imagesIdArray?.L?.map(img => img.S || "") || [],
            fileType: (item.fileType?.S as "PDF" | "PPT") || "PDF" 
        }));        

        files.sort((a, b) => new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime());

        console.log("Files Found:", files);
        return files;
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
};

export const getFilesList = unstable_cache(
    fetchFilesList,
    ["files_list"],
    { tags: ["files_list"], revalidate: 120 }
);

