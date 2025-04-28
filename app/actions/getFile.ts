"use server";
import { db } from "@/lib/db/dynamoDb";
import { UploadedFile } from "@/types/types";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";

const fetchFile = async (fileId: string): Promise<UploadedFile | null> => {
    console.log("cachedFileData");
    try {
        if (!fileId) {
            console.log("File Id is required.");
            return null;
        }

        const params = {
            TableName: "AncriptFileTable",
            Key: {
                fileId: { S: fileId },
            },
        };

        const command = new GetItemCommand(params);
        const response = await db.send(command);

        if (!response.Item) {
            console.log("File not found.");
            return null;
        }

        const file: UploadedFile = {
            fileId: response.Item.fileId.S!,
            fileName: response.Item.fileName.S!,
            location: response.Item.location.S!,
            dateOfCreation: response.Item.dateOfCreation.S!,
            userId: response.Item.userId.S!,
            imagesExtracted: response.Item.imagesExtracted.BOOL!,
            imagesIdArray: response.Item.imagesIdArray?.L?.map(item => item.S!) || [],
            fileType: response.Item.fileType.S!,
        };

        console.log("File Details:", file);
        return file;
    } catch (error) {
        console.error("Error fetching file details:", error);
        return null;
    }
};

export const getFile = unstable_cache(
    fetchFile,
    [`file_details`],
    { tags: ["file_details"], revalidate: 120 }
);
