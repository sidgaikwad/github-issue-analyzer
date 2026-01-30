# AI Prompts Used During Development

This document contains all the prompts used with AI coding tools during the development of this GitHub Issue Analyzer project (TypeScript version).

## Project Setup Prompts

### 1. Initial TypeScript Project Structure

**Prompt to AI:**

```
I need to build a TypeScript/Node.js/Express-based GitHub issue analyzer with two endpoints:
/scan and /analyze. The /scan endpoint should fetch all open issues from a GitHub repo and
cache them locally. The /analyze endpoint should use an LLM to analyze cached issues based
on a user prompt. Help me set up the TypeScript project structure with proper configuration
files (package.json, tsconfig.json) and organize the code into separate modules.
```

**Context:** Used to set up initial TypeScript project structure with Express

---

### 2. TypeScript Configuration

**Prompt to AI:**

```
Create a tsconfig.json file for a Node.js/Express project that:
- Targets ES2020
- Uses CommonJS modules
- Has strict type checking enabled
- Compiles from src/ to dist/
- Includes source maps for debugging
- Works well with Express and modern Node.js
```

**Context:** Used to configure TypeScript compiler options

---

## Code Generation Prompts

### 3. TypeScript Type Definitions

**Prompt to AI:**

```
Create TypeScript interfaces for:
- GitHub issue with fields: id, title, body, html_url, created_at
- Cached repository data structure
- Request/response types for /scan endpoint
- Request/response types for /analyze endpoint
- Error response type
Put these in a types.ts file with proper JSDoc comments.
```

**Context:** Used to implement src/types.ts

---

### 4. Cache Service Module

**Prompt to AI:**

```
Create a TypeScript class CacheService for JSON file-based caching that:
- Has static methods for loading and saving cache
- Stores cache as {[repo: string]: {issues: Issue[], last_updated: string}}
- Uses fs module to read/write issues_cache.json
- Has methods: loadCache(), saveCache(), storeIssues(), getIssues(), hasRepo()
- Includes proper error handling
- Has JSDoc comments
Make it type-safe using the TypeScript interfaces we created.
```

**Context:** Used to implement src/cache.ts

---

### 5. GitHub Service Module

**Prompt to AI:**

```
Create a TypeScript class GitHubService for GitHub API integration that:
- Fetches all open issues using pagination
- Uses axios for HTTP requests
- Handles the GitHub REST API endpoint: GET /repos/{owner}/{repo}/issues
- Filters out pull requests
- Extracts only required fields: id, title, body, html_url, created_at
- Has a method validateRepoFormat() to check "owner/repo" format
- Includes proper error handling with axios error types
- Uses TypeScript interfaces for type safety
```

**Context:** Used to implement src/github.ts

---

### 6. LLM Service Module

**Prompt to AI:**

```
Create a TypeScript class LLMService for Anthropic Claude integration that:
- Initializes Anthropic client with API key from environment variable
- Has a method analyzeIssues(repo, issues, userPrompt) that:
  - Formats issues as text (truncate bodies to 500 chars)
  - Constructs system prompt for software project analysis
  - Calls Claude API with model 'claude-sonnet-4-20250514'
  - Uses max_tokens: 4000
  - Returns the analysis text
- Uses @anthropic-ai/sdk package
- Includes proper error handling and type safety
```

**Context:** Used to implement src/llm.ts

---

### 7. Express Application Structure

**Prompt to AI:**

```
Create a TypeScript Express application that:
- Uses express.json() middleware
- Initializes LLMService on startup
- Has POST /scan endpoint matching the exact requirements
- Has POST /analyze endpoint matching the exact requirements
- Has GET /health endpoint
- Uses proper TypeScript types for Request and Response
- Handles all error cases with appropriate HTTP status codes
- Validates request bodies
- Returns responses in exact format specified
Import and use the CacheService, GitHubService, and LLMService modules.
```

**Context:** Used to implement src/index.ts

---

## Testing Prompts

### 8. Test Suite Creation

**Prompt to AI:**

```
Create a TypeScript test file that:
- Uses axios to make HTTP requests
- Tests the /health endpoint
- Tests the /scan endpoint with a real repository
- Tests the /analyze endpoint with multiple prompts
- Tests all error cases (missing fields, invalid format, repo not scanned)
- Tracks test results and prints a summary
- Has proper async/await handling
- Can be run with ts-node
Make it comprehensive but easy to read and understand.
```

**Context:** Used to implement src/test.ts

---

## LLM Integration Prompts

### 9. Anthropic SDK Integration

**Prompt to AI:**

```
Show me how to use the @anthropic-ai/sdk package in TypeScript to:
- Initialize the Anthropic client with API key
- Create a message with Claude Sonnet 4
- Use a system prompt and user prompt
- Extract text from the response (handle content blocks)
- Use proper TypeScript types from the SDK
- Handle API errors
Use the latest SDK version (0.40.0) patterns.
```

**Context:** Used to implement LLM API calls in src/llm.ts

---

### 10. LLM Prompt Construction

**Prompt used inside the /analyze endpoint:**

**System Prompt:**

```
You are an expert software project analyst. You analyze GitHub issues to identify
patterns, themes, and priorities. Provide clear, actionable insights based on the
issues provided.
```

**User Prompt Template:**

```
Analyze the following GitHub issues from the repository '{repo}'.

{user_prompt}

Here are the issues:

{issues_context}

Please provide a comprehensive analysis based on the request above.
```

**Context:** This is the actual prompt construction used in the application to guide the LLM's analysis. The system prompt sets the LLM's role, and the user prompt combines the user's request with formatted issue data.

---

## Debugging and Error Fixing Prompts

### 11. TypeScript Type Errors

**Prompt to AI:**

```
I'm getting TypeScript errors when using axios. How do I:
- Properly type axios responses
- Check if an error is an AxiosError
- Access error.response?.status safely
- Type the error parameter in catch blocks
Show me the correct TypeScript patterns for axios error handling.
```

**Context:** Used to fix TypeScript errors in GitHub and test modules

---

### 12. Async/Await Error Handling

**Prompt to AI:**

```
Review my Express endpoints and ensure:
- All async operations use await properly
- Errors are caught and return appropriate HTTP status codes
- TypeScript types are correct for async functions
- Response types match the defined interfaces
- Edge cases are handled (null checks, empty arrays)
```

**Context:** Used to improve error handling across all endpoints

---

### 13. Module Resolution

**Prompt to AI:**

```
I'm having TypeScript module resolution issues. Help me:
- Configure tsconfig.json for proper module resolution
- Set up proper imports/exports for ES modules vs CommonJS
- Fix "Cannot find module" errors
- Ensure ts-node works correctly with my configuration
```

**Context:** Used to fix module resolution issues during development

---

## Documentation Prompts

### 14. README Structure

**Prompt to AI:**

```
Create a comprehensive README for my TypeScript GitHub issue analyzer that includes:
- Project description
- Why I chose JSON file storage (with detailed justification)
- Installation instructions (npm install, API key setup)
- How to run the server (dev and production modes)
- API documentation with curl examples
- Project structure explanation
- Testing instructions
- Error handling details
- Technical decisions (TypeScript, Express, etc.)
Follow best practices for TypeScript project READMEs.
```

**Context:** Used to create the README.md file

---

### 15. Package.json Scripts

**Prompt to AI:**

```
Create appropriate npm scripts for a TypeScript Express project:
- "dev": Run with ts-node for development
- "build": Compile TypeScript to JavaScript
- "start": Run compiled JavaScript
- "test": Run test suite with ts-node
Make sure the scripts work cross-platform.
```

**Context:** Used to configure package.json scripts

---

## Configuration Prompts

### 16. Dependencies Selection

**Prompt to AI:**

```
What are the appropriate package versions for a TypeScript Node.js project in January 2025:
- express (with @types/express)
- axios
- @anthropic-ai/sdk
- typescript
- ts-node
- @types/node
I want stable, production-ready versions that work well together.
Include both dependencies and devDependencies.
```

**Context:** Used to specify exact versions in package.json

---

### 17. TypeScript Strict Mode

**Prompt to AI:**

```
I want to use TypeScript strict mode. What compiler options should I enable in tsconfig.json
to ensure:
- Maximum type safety
- Null checking
- Proper this binding
- No implicit any
- Strict function types
Explain each option briefly.
```

**Context:** Used to configure strict TypeScript settings

---

## Code Review and Optimization Prompts

### 18. Code Quality Review

**Prompt to AI:**

```
Review my TypeScript code for:
- Proper use of TypeScript features (interfaces, types, generics)
- Error handling completeness
- Async/await patterns
- Module organization and separation of concerns
- JSDoc comments quality
- Security issues (API key handling, input validation)
- Performance considerations
Suggest specific improvements with code examples.
```

**Context:** Used for final code review and refinement

---

### 19. Type Safety Improvements

**Prompt to AI:**

```
Review my type definitions and ensure:
- All external API responses are properly typed
- Request/response types match exactly
- No use of 'any' except where absolutely necessary
- Proper use of union types for error handling
- Type guards where needed
- Generics where appropriate
```

**Context:** Used to improve type safety throughout the codebase

---

## Testing and Validation Prompts

### 20. Test Coverage

**Prompt to AI:**

```
What test cases should I include for the /scan and /analyze endpoints?
Consider:
- Happy path scenarios
- Error scenarios (400, 404, 500)
- Edge cases (empty repos, large repos, no cache)
- Different analysis prompt types
Give me specific test scenarios to implement.
```

**Context:** Used to design comprehensive test suite

---

---

## OpenAI Integration Prompts (Added Later)

### 21. Adding OpenAI Support

**Prompt to AI:**

```
I want to add support for OpenAI API as an alternative to Anthropic Claude in my LLM service.
Update the LLMService class to:
- Support both Anthropic and OpenAI
- Auto-detect which API key is available (ANTHROPIC_API_KEY or OPENAI_API_KEY)
- Use Anthropic as default if both are set
- Use GPT-4o model for OpenAI
- Keep the same interface (analyzeIssues method)
- Add private methods for each provider
- Log which provider is being used on startup
Show me the complete TypeScript implementation.
```

**Context:** Used to add dual LLM provider support to the application

---

### 22. Updating Dependencies for OpenAI

**Prompt to AI:**

```
I've added OpenAI support to my TypeScript application. What version of the openai npm package
should I use that's compatible with:
- Node.js 18+
- TypeScript 5.3+
- Express 4.18
- Existing @anthropic-ai/sdk 0.40.0

Give me the exact version to add to package.json dependencies.
```

**Context:** Used to determine correct OpenAI package version

---

### 23. Documentation for Dual Provider Support

**Prompt to AI:**

```
I've added support for both Anthropic Claude and OpenAI to my GitHub issue analyzer.
Help me document this feature by:
1. Updating the README with both API key options
2. Explaining the auto-detection logic
3. Creating a comparison table of both providers
4. Adding troubleshooting for API key issues
5. Showing how users can switch between providers

Make it clear and user-friendly.
```

**Context:** Used to update documentation with OpenAI support information

---

## Summary of Prompt Usage Strategy

Throughout this project, I used AI tools (Claude) to:

1. **Architecture**: Design TypeScript module structure and separation of concerns
2. **Implementation**: Generate type-safe code for each module
3. **Configuration**: Set up TypeScript, npm scripts, and dependencies
4. **Problem-solving**: Debug TypeScript errors, module resolution, async patterns
5. **Documentation**: Create comprehensive README and code comments
6. **Testing**: Build automated test suite with proper TypeScript types
7. **Refinement**: Review code for type safety, error handling, and best practices

**Key Learning**: TypeScript requires more upfront planning for types and interfaces, but the AI assistance helped create a fully type-safe implementation that catches errors at compile time rather than runtime.

**TypeScript-Specific Benefits**:

- Type definitions caught potential errors before runtime
- IDE autocomplete improved development speed
- Refactoring was safer with compile-time type checking
- Code is more maintainable and self-documenting

---

**Total Development Time**: ~6 hours (including TypeScript setup, testing, and documentation)
**AI Tool**: Claude (via Claude.ai and Claude Code)
**Prompt Strategy**: Iterative - start with project structure and types, then implement each module with proper types, then test and refine
**Language**: TypeScript 5.3+ with strict mode enabled
