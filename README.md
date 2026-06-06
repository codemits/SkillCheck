# Skill Validation Demo

This project demonstrates that **Agent Skills** are behavior-defining artifacts. Even when the LLM and the prompt remain the same, changing the Skill changes the Agent's behavior.

## Key Concept
- **Same Agent**
- **Different Skill**
- **Different Behavior**

## Project Structure
- `skills/`: Contains two versions of the API Testing skill.
- `sample-api/`: A simple OpenAPI specification.
- `run_demo.ts`: Simulates the AI response based on the loaded skill.
- `validate_skill.ts`: Validates if the generated output meets the quality requirements.

## Running the Demo

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Outputs**:
   By default, the demo runs in a local **Mock Mode** (zero setup required).
   
   To run the demo using a **real Gemini AI model**, set your `GEMINI_API_KEY` environment variable before running:
   ```bash
   # Run in Mock Mode (Default)
   npm run demo

   # Run with Real Gemini AI
   export GEMINI_API_KEY="your-api-key-here"
   npm run demo
   ```

3. **Validate Results**:
   ```bash
   npm run validate
   ```

## Expected Results & Behavior Comparison

| Test Category | Skill Version 1 (with security) | Skill Version 2 (no security) |
| :--- | :---: | :---: |
| **Happy Path** | ✓ | ✓ |
| **Boundary** | ✓ | ✓ |
| **Negative** | ✓ | ✓ |
| **Security** | ✓ | ✗ |
| **Validation Result** | **PASS** | **FAIL** (Missing Security) |

### Summary of Findings
- **Skill v1**: Successfully triggered all four testing layers as specified in the instructions.
- **Skill v2**: Correctly omitted security tests because they were removed from the instructions.

### Why this matters
Changing a Skill definition directly alters the output of the AI system. Without explicit validation of the Skill *itself*, system-wide regressions (like missing security coverage) can occur silently.

## Conclusion
This demo shows why Skill validation is critical for AI systems. As we move towards Agent-based architectures, the instructions we provide (Skills) must be validated to ensure consistent and safe behavior.

## Contributors
* **Mohit Kumar** ([@codemits](https://github.com/codemits))
