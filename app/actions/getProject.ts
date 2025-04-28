"use server";

import { db } from "@/lib/db/dynamoDb";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";
import { Project } from "@/types/types";

const getProject = async (projectId: string): Promise<Project | null> => {
    try {
        const session = await getServerSession(authOption);
        if (!session?.user?.id) {
            throw new Error("User not authenticated.");
        }

        const userId = session.user.id;

        const params = {
            TableName: "AncriptProjectTable",
            Key: {
                projectId: { S: projectId },
            },
        };

        const command = new GetItemCommand(params);
        const { Item } = await db.send(command);

        if (!Item) {
            throw new Error("Project not found.");
        }

        if (!Item.userId?.S || Item.userId.S !== userId) {
            throw new Error("Unauthorized access to project.");
        }

        return {
            projectId: Item.projectId?.S ?? "",
            fileId: Item.fileId?.S ?? "",
            folderId: Item.folderId?.S ?? "",
            projectName: Item.projectName?.S ?? "Untitled",
            creationDate: Item.creationDate?.S ?? new Date().toISOString(),
            pagesProcessedStatus: Item.pagesProcessedStatus?.S ?? "-1",
            pagesProcessProgress: Number(Item.pagesProcessProgress?.N ?? "0"),
            userId: Item.userId?.S ?? "",
        };
    } catch (error) {
        console.error("Error fetching project details:", error);
        throw new Error("Failed to fetch project details. Please try again later.");
    }
};

export default getProject;
