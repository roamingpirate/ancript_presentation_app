"use server";

import { db } from "@/lib/db/dynamoDb";
import { Project } from "@/types/types";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOption } from "../api/auth/[...nextauth]/route";
import { pages } from "next/dist/build/templates/app-page";

const createProject = async (fileId: string, folderId: string): Promise<Project | null> => {
    try {
        const session = await getServerSession(authOption);
        if (!session?.user?.id) {
            throw new Error("User not authenticated.");
        }

        const userId = session.user.id;
        const projectId = crypto.randomUUID(); 
        const projectName = "Untitled";
        const creationDate = new Date().toISOString();
        const pagesProcessedStatus = "-1"; 

        const params = {
            TableName: "AncriptProjectTable",
            Item: {
                projectId: { S: projectId },
                fileId: { S: fileId },
                folderId: { S: folderId },
                projectName: { S: projectName },
                creationDate: { S: creationDate },
                pagesProcessedStatus: { S: pagesProcessedStatus },
                pagesProcessProgress: { N: "0" },
                userId: { S: userId },
            },
        };

        const command = new PutItemCommand(params);
        await db.send(command);

        revalidateTag("projects_list");

        return {
            projectId,
            fileId,
            folderId,
            projectName,
            creationDate,
            pagesProcessedStatus,
            userId,
            pagesProcessProgress: 0,
        };
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project. Please try again later.");
    }
};

export default createProject;
