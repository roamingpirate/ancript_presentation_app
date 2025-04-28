"use server";
import { db } from "@/lib/db/dynamoDb";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidateTag } from "next/cache";

export const updateProjectName = async (projectId: string, newProjectName: string): Promise<string> => {
    try {
        if (!projectId || !newProjectName) {
            return "Project ID and new project name are required.";
        }

        const params = {
            TableName: "AncriptProjectTable",
            Key: {
                projectId: { S: projectId }
            },
            UpdateExpression: "SET projectName = :newName",
            ExpressionAttributeValues: {
                ":newName": { S: newProjectName }
            },
        };

        const command = new UpdateItemCommand(params);
        await db.send(command);
        revalidateTag("projects_list");
        revalidateTag("project_details");
        console.log(`Project name updated successfully: ${newProjectName}`);
        return "Project name updated successfully.";
    } catch (error) {
        console.error("Error updating project name:", error);
        return "Error updating project name.";
    }
};
