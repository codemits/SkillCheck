import * as fs from 'fs';
import * as path from 'path';

function simulateLlmResponse(skillPath: string, openapiSpecPath: string): string {
    const skillContent = fs.readFileSync(skillPath, 'utf8');
    // Read openapiSpec to match original script behavior
    const openapiSpec = fs.readFileSync(openapiSpecPath, 'utf8');

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

function main() {
    const baseDir = __dirname;
    const openapiPath = path.join(baseDir, "sample-api/openapi.yaml");

    // Run for Skill v1
    const v1Skill = path.join(baseDir, "skills/api-testing-v1/SKILL.md");
    const v1Output = simulateLlmResponse(v1Skill, openapiPath);
    fs.writeFileSync(path.join(baseDir, "expected-results/v1-output.md"), v1Output);
    console.log("Generated v1-output.md");

    // Run for Skill v2
    const v2Skill = path.join(baseDir, "skills/api-testing-v2/SKILL.md");
    const v2Output = simulateLlmResponse(v2Skill, openapiPath);
    fs.writeFileSync(path.join(baseDir, "expected-results/v2-output.md"), v2Output);
    console.log("Generated v2-output.md");
}

main();
