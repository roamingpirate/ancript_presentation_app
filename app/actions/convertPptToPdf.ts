"use server";
import { lambdaClient } from "@/lib/db/dynamoDb";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { LampDesk } from "lucide-react";



export const convertPptToPdf = async (pptFileKey: string): Promise<string> => {
    try {
        const lambdaName = "pptConvertFunction"; 
        const payload = JSON.stringify({ pptFileKey });

        const command = new InvokeCommand({
            FunctionName: lambdaName,
            Payload: new TextEncoder().encode(payload),
            InvocationType: "RequestResponse", 
        });

        console.log("Invoking Lambda function:", lambdaName, "with payload:", payload);

        const response = await lambdaClient.send(command);

        if (!response.Payload) {
            throw new Error("Lambda response is empty");
        }

        const lambdaResponse = JSON.parse(new TextDecoder().decode(response.Payload));
        console.log("Lambda response:", lambdaResponse);
        
        if (!lambdaResponse.pdfFileKey) {
            throw new Error(`Lambda did not return pdfFileKey ${lambdaResponse}`);
        }

        return lambdaResponse.pdfFileKey;

    } catch (error) {
        console.error("PPT to PDF conversion error:", error);
        throw error;
    }
};
