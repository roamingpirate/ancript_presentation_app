"use server";

import getProjectDetails from "./getProject";
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: "us-east-1" });

export async function processProjectFile(projectId:string, fileId:string) {
    try {
        const projectDetails = await getProjectDetails(projectId);
        if (!projectDetails) {
            throw new Error("Project not found.");
        }

        const { pagesProcessedStatus, pagesProcessProgress } = projectDetails;

        if (pagesProcessedStatus === "1") {
            return { status: "done" };
        }

        if (pagesProcessedStatus === "0") {
            return { status: "processing", pagesProcessProgress };
        }

        // pagesProcessedStatus === "-1" (not started)

        const params = {
            FunctionName: "processProjectFile",
            InvocationType: InvocationType.Event,
            Payload: JSON.stringify({ projectId: projectDetails.projectId, fileId: projectDetails.fileId }),
        };

        const command = new InvokeCommand(params);
        await lambdaClient.send(command);

        return { status: "started", progress: 0 };
    } catch (error) {
        console.error("Error processing project file:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to process project file.");
        }
        throw new Error("Failed to process project file.");
    }
}
