import * as fs from 'fs';
import * as path from 'path';

function validate(outputFile: string): boolean {
    if (!fs.existsSync(outputFile)) {
        console.log(`Error: ${outputFile} not found.`);
        return false;
    }

    const content = fs.readFileSync(outputFile, 'utf8');

    const requiredSections = [
        "## Happy Path Tests",
        "## Boundary Tests",
        "## Negative Tests",
        "## Security Tests"
    ];

    const missing: string[] = [];
    for (const section of requiredSections) {
        if (!content.includes(section)) {
            missing.push(section.replace("## ", ""));
        }
    }

    if (missing.length > 0) {
        console.log(`FAIL - ${path.basename(outputFile)}`);
        console.log(`Missing Coverage: ${missing.join(', ')}`);
        return false;
    } else {
        console.log(`PASS - ${path.basename(outputFile)}`);
        return true;
    }
}

function main() {
    const baseDir = __dirname;
    const v1Res = validate(path.join(baseDir, "expected-results/v1-output.md"));
    console.log("-".repeat(20));
    const v2Res = validate(path.join(baseDir, "expected-results/v2-output.md"));

    if (!v1Res || v2Res) {
        // v1 should pass, v2 should fail
        if (!v1Res) {
            console.log("\nError: v1-output.md should have passed validation.");
        }
        if (v2Res) {
            console.log("\nError: v2-output.md should have failed validation.");
        }
    }
}

main();
