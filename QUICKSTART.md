# Quick Start Guide - TypeScript Version

Get the GitHub Issue Analyzer running in under 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

This will install:

- Express (web framework)
- Axios (HTTP client)
- Anthropic SDK (LLM integration)
- TypeScript & ts-node (development tools)
- Type definitions

## 2. Set API Key

You need either an Anthropic or OpenAI API key:

- **Anthropic API**: Get one at https://console.anthropic.com/
- **OpenAI API**: Get one at https://platform.openai.com/api-keys

**Option A: Using Anthropic Claude (recommended)**

```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

**Option B: Using OpenAI GPT-4**

```bash
export OPENAI_API_KEY='your-api-key-here'
```

**Windows users (PowerShell):**

```powershell
# For Anthropic
$env:ANTHROPIC_API_KEY='your-api-key-here'

# For OpenAI
$env:OPENAI_API_KEY='your-api-key-here'
```

**Windows users (CMD):**

```cmd
REM For Anthropic
set ANTHROPIC_API_KEY=your-api-key-here

REM For OpenAI
set OPENAI_API_KEY=your-api-key-here
```

**Note**: The application will automatically detect which key is available. If both are set, Anthropic Claude will be used.

## 3. Start the Server

**Development mode (recommended for testing):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

You should see:

```
GitHub Issue Analyzer running on http://localhost:5000
Health check: http://localhost:5000/health
```

## 4. Test It Out

Open a new terminal and run:

```bash
# Step 1: Scan a repository
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "anthropics/anthropic-sdk-python"}'

# Step 2: Analyze the issues
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "What are the main themes in these issues?"
  }'
```

## 5. Run Automated Tests (Optional)

```bash
npm test
```

## Project Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm test` - Run automated test suite

## Troubleshooting

### "Connection refused"

- Make sure the server is running (`npm run dev`)
- Check if port 5000 is available

### "ANTHROPIC_API_KEY or OPENAI_API_KEY not found"

- Set one of the environment variables:
  - `export ANTHROPIC_API_KEY='your-key'` (for Claude)
  - `export OPENAI_API_KEY='your-key'` (for GPT-4)
- Verify:
  - `echo $ANTHROPIC_API_KEY` (Mac/Linux)
  - `echo $OPENAI_API_KEY` (Mac/Linux)
  - `echo %ANTHROPIC_API_KEY%` (Windows CMD)
  - `echo %OPENAI_API_KEY%` (Windows CMD)

### "Module not found" or TypeScript errors

- Install dependencies: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### "GitHub API rate limit"

- GitHub allows 60 requests/hour without authentication
- For higher limits, use a GitHub personal access token (optional)

### Port already in use

```bash
# Change port
PORT=3000 npm run dev
```

## What's Next?

- Check `EXAMPLES.md` for more curl commands
- Read `README.md` for full documentation
- Inspect `issues_cache.json` to see cached data
- Review `PROMPTS.md` to see how the project was built
- Explore `src/` directory to see TypeScript code structure

## Common Workflows

### Analyze Multiple Repositories

```bash
# Scan multiple repos
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "facebook/react"}'
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "microsoft/vscode"}'

# Analyze each one
curl -X POST http://localhost:5000/analyze -H "Content-Type: application/json" -d '{"repo": "facebook/react", "prompt": "Top priorities"}'
```

### Save Analysis Results

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "facebook/react", "prompt": "Complete analysis"}' \
  > react_analysis.json
```

### Check Cache Contents

```bash
cat issues_cache.json | jq
```

Or just open `issues_cache.json` in your text editor.

## Development Tips

### TypeScript Benefits

- Full type safety with IntelliSense
- Compile-time error checking
- Better refactoring support
- Self-documenting code

### File Structure

```
src/
├── index.ts      # Main Express app
├── types.ts      # Type definitions
├── cache.ts      # Caching logic
├── github.ts     # GitHub API
├── llm.ts        # LLM integration
└── test.ts       # Test suite
```

### Adding New Features

1. Define types in `types.ts`
2. Add logic to appropriate module
3. Update tests in `test.ts`
4. Run `npm run dev` to test

## Demo Video Script

For your live demo, follow this flow:

1. **Start server**: `npm run dev`
2. **Health check**: `curl http://localhost:5000/health`
3. **Scan repo**: Show scanning a small repo first
4. **Show cache**: Open `issues_cache.json` to show data
5. **Analyze**: Run 2-3 different analysis prompts
6. **Error handling**: Demonstrate error cases (invalid repo, missing prompt)
7. **Show code**: Highlight TypeScript type safety
8. **Explain storage choice**: Discuss JSON file vs alternatives

## Why TypeScript?

Benefits for this project:

- ✅ **Type Safety**: Catches errors at compile time
- ✅ **Better IDE Support**: Autocomplete and IntelliSense
- ✅ **Maintainability**: Self-documenting with types
- ✅ **Refactoring**: Safer code changes
- ✅ **Professional**: Industry-standard for Node.js projects

Good luck with your assessment! 🚀
