import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

function simulateLlmResponseMock(skillContent: string): string {
    // Simulate behavior change based on skill content
    let output = "# Generated Test Plan\n\n";

    if (skillContent.toLowerCase().includes("happy path")) {
        output += "## Happy Path Tests\n- GET /users: 200 OK\n- POST /users: 201 Created\n\n";
    }

    if (skillContent.toLowerCase().includes("boundary")) {
        output += "## Boundary Tests\n- POST /users: Long username test\n- GET /users/{id}: Max integer ID\n\n";
    }

    if (skillContent.toLowerCase().includes("negative")) {
        output += "## Negative Tests\n- GET /users/invalid-id: 404 Not Found\n- POST /users: Missing required fields\n\n";
    }

    if (skillContent.toLowerCase().includes("generate security tests")) {
        output += "## Security Tests\n- POST /users: SQL injection attempt\n- GET /users: Unauthorized access test\n\n";
    }

    return output;
}

async function simulateLlmResponse(skillPath: string, openapiSpecPath: string): Promise<string> {
    const skillContent = fs.readFileSync(skillPath, 'utf8');
    const openapiSpec = fs.readFileSync(openapiSpecPath, 'utf8');

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        console.log(`[AI Mode] Using Gemini to generate response for ${path.basename(skillPath)}...`);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = `You are a test generation agent. 
Using the provided OpenAPI specification and following the instructions in the Agent Skill, generate a detailed test plan in markdown format.

Important Guidelines:
1. Ensure the markdown output has a "# Generated Test Plan" title.
2. For each instruction in the Skill, generate a corresponding markdown section. Keep the exact words "Happy Path Tests", "Boundary Tests", "Negative Tests", and "Security Tests" in the headers (e.g. "## Happy Path Tests").

OpenAPI Spec:
${openapiSpec}

Agent Skill Instructions:
${skillContent}`;

            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("[AI Mode Error] Failed to generate content via Gemini:", error);
            console.log("[Fallback] Falling back to Mock Mode...");
            return simulateLlmResponseMock(skillContent);
        }
    } else {
        return simulateLlmResponseMock(skillContent);
    }
}

async function main() {
    const baseDir = __dirname;
    const openapiPath = path.join(baseDir, "sample-api/openapi.yaml");

    if (!process.env.GEMINI_API_KEY) {
        console.log("[Info] GEMINI_API_KEY env variable is not set. Running in Mock Mode.");
    }

    // Run for Skill v1
    const v1Skill = path.join(baseDir, "skills/api-testing-v1/SKILL.md");
    const v1Output = await simulateLlmResponse(v1Skill, openapiPath);
    fs.writeFileSync(path.join(baseDir, "expected-results/v1-output.md"), v1Output);
    console.log("Generated v1-output.md");

    // Run for Skill v2
    const v2Skill = path.join(baseDir, "skills/api-testing-v2/SKILL.md");
    const v2Output = await simulateLlmResponse(v2Skill, openapiPath);
    fs.writeFileSync(path.join(baseDir, "expected-results/v2-output.md"), v2Output);
    console.log("Generated v2-output.md");
}

main().catch(error => {
    console.error("Execution failed:", error);
    process.exit(1);
});
