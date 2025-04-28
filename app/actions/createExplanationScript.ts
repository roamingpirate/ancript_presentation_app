"use server";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: "us-east-1" });

export async function createExplanationScript(explanationText: string, model: string = "gemini") {
    try {
        if (!explanationText) {
            throw new Error("Explanation text is required.");
        }

        const params = {
            FunctionName: "createScriptFromExplanation",
            Payload: JSON.stringify({ explanationText, model }),
        };

        const command = new InvokeCommand(params);
        const response = await lambdaClient.send(command);

        const responsePayload = JSON.parse(Buffer.from(response.Payload!).toString());

        if (responsePayload.statusCode !== 200) {
            throw new Error(responsePayload.body || "Error generating explanation script.");
        }

        return {
            category: responsePayload.category,
            tone: responsePayload.tone,
            responseCode: responsePayload.responseCode,
            message: responsePayload.message,
        };
    } catch (error) {
        console.error("Error creating explanation script:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create explanation script.");
        }
        throw new Error("Failed to create explanation script.");
    }
}
