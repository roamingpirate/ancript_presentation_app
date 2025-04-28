"use server";

import { db } from "@/lib/db/dynamoDb";
import { UploadedFile } from "@/types/types";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOption } from "../api/auth/[...nextauth]/route";

const addFile = async (
    fileName: string,
    location: string,
    fileType: string
): Promise<UploadedFile> => {
    try {
        const session = await getServerSession(authOption);
        if (!session?.user?.id) {
            throw new Error("User not authenticated.");
        }

        const fileId = crypto.randomUUID(); 
        const userId = session.user.id;
        const dateOfCreation = new Date().toISOString();
        const imagesExtracted = false;
        const imagesIdArray: string[] = [];

        const params = {
            TableName: "AncriptFileTable",
            Item: {
                fileId: { S: fileId },
                fileName: { S: fileName },
                location: { S: location },
                dateOfCreation: { S: dateOfCreation },
                userId: { S: userId },
                imagesExtracted: { BOOL: imagesExtracted },
                imagesIdArray: { L: imagesIdArray.map(id => ({ S: id })) },
                fileType: { S: fileType },
            },
        };

        const command = new PutItemCommand(params);
        await db.send(command);

        revalidateTag("files_list");

        return {
            fileId,
            fileName,
            location,
            dateOfCreation,
            userId,
            imagesExtracted,
            imagesIdArray,
            fileType,
        };
    } catch (error) {
        console.error("Error adding file:", error);
        throw new Error("Failed to add file. Please try again later.");
    }
};

export default addFile;
