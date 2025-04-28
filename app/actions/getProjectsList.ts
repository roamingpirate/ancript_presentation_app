"use server";
import { db } from "@/lib/db/dynamoDb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";

const fetchProjectsList = async (folderId: string): Promise<any> => {
    try {
        const params = {
            TableName: "AncriptProjectTable",
            IndexName: "folderId-index", 
            KeyConditionExpression: "folderId = :folderId",
            ExpressionAttributeValues: {
                ":folderId": { S: folderId }
            }
        };

        const command = new QueryCommand(params);
        const response = await db.send(command);

        if (!response.Items || response.Items.length === 0) {
            console.log("No Projects found.");
            return [];
        }

        const projects = response.Items.map(item =>
            Object.fromEntries(
                Object.entries(item).map(([key, value]) => [
                    key,
                    value.N ? Number(value.N) : value.S ?? value.B ?? null
                ])
            )
        );

        console.log("Projects Found:", projects);
        return projects;
    } catch (error) {
        console.error("Error fetching Projects:", error);
        return [];
    }
};

export const getProjectsList = unstable_cache(
    fetchProjectsList,  
    ["projects_list"],  
    { tags: ["projects_list"], revalidate: 120 }
);
