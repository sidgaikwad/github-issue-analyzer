# GitHub Issue Analyzer with Local Caching + LLM Processing

A TypeScript/Node.js/Express-based backend service that fetches GitHub issues, caches them locally, and analyzes them using Claude (Anthropic's LLM).

## Features

- **POST /scan**: Fetch and cache all open issues from a GitHub repository
- **POST /analyze**: Analyze cached issues using natural language prompts with LLM
- **Local JSON file caching**: Persistent storage that survives server restarts
- **Full TypeScript support**: Type-safe implementation with strict typing

## Storage Choice: JSON File Storage

### Why JSON File Storage?

I chose **JSON file storage** for the following reasons:

1. **Persistence**: Unlike in-memory storage, the cache survives server restarts, which is crucial for a production-like service
2. **Simplicity**: Easier to implement and debug than SQLite, with no need for schema management or SQL queries
3. **Human-readable**: The cache file can be easily inspected and debugged by opening `issues_cache.json` in any text editor
4. **Sufficient performance**: For the expected scale (hundreds to thousands of issues per repo), JSON file I/O is fast enough
5. **No dependencies**: Doesn't require SQLite bindings or database setup
6. **Perfect fit for this use case**: The data structure (nested dictionaries of issues per repo) maps naturally to JSON

**Trade-offs considered**:

- In-memory would be faster but loses data on restart (unacceptable)
- SQLite would be better for 10,000+ issues or complex queries, but adds unnecessary complexity for this project

## Prerequisites

- Node.js 18+ or higher
- npm or yarn
- **Either** Anthropic API key **or** OpenAI API key (for LLM analysis)
  - Anthropic API: https://console.anthropic.com/
  - OpenAI API: https://platform.openai.com/api-keys

## Installation

1. Clone this repository:

```bash
git clone <your-repo-url>
cd github-issue-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Set your API key (choose one):

**Option A: Using Anthropic Claude**

```bash
export ANTHROPIC_API_KEY='your-anthropic-api-key-here'
```

**Option B: Using OpenAI**

```bash
export OPENAI_API_KEY='your-openai-api-key-here'
```

The application will automatically detect which API key is available and use that provider. If both are set, Anthropic Claude will be used by default.

## Running the Server

### Development Mode (with TypeScript hot reload)

```bash
npm run dev
```

### Production Mode (compile and run)

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### 1. POST /scan

Fetches all open issues from a GitHub repository and caches them locally.

**Request:**

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react"
  }'
```

**Response:**

```json
{
  "repo": "facebook/react",
  "issues_fetched": 42,
  "cached_successfully": true
}
```

**Edge Cases Handled:**

- Invalid repo format
- GitHub API errors (rate limits, non-existent repos)
- Network failures

### 2. POST /analyze

Analyzes cached issues using a natural language prompt and Claude LLM.

**Request:**

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react",
    "prompt": "Find themes across recent issues and recommend what the maintainers should fix first"
  }'
```

**Response:**

```json
{
  "analysis": "Based on analysis of the issues, the main themes are:\n\n1. Performance issues with rendering...\n2. Documentation gaps...\n\n[Full LLM analysis here]"
}
```

**Edge Cases Handled:**

- Repo not yet scanned (returns 404 with helpful message)
- No issues cached (returns informative message)
- LLM API errors (returns 500 with error details)
- Large issue sets (truncates issue bodies to prevent context overflow)

## Project Structure

```
github-issue-analyzer/
├── src/
│   ├── index.ts          # Main Express application
│   ├── types.ts          # TypeScript type definitions
│   ├── cache.ts          # Cache service (JSON file operations)
│   ├── github.ts         # GitHub API integration
│   ├── llm.ts            # LLM integration (Anthropic/OpenAI)
│   └── test.ts           # Test suite
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── README.md            # This file
├── PROMPTS.md           # AI prompts used during development
├── issues_cache.json    # Local cache (created automatically)
└── .gitignore           # Git ignore rules
```

## Testing

### Run Automated Tests

```bash
npm test
```

### Manual Testing Examples

#### Example 1: Scan a repository

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "tensorflow/tensorflow"}'
```

#### Example 2: Analyze for bug patterns

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "tensorflow/tensorflow",
    "prompt": "Identify the most common bug categories and suggest which should be prioritized"
  }'
```

#### Example 3: Analyze for feature requests

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "tensorflow/tensorflow",
    "prompt": "What features are users most frequently requesting?"
  }'
```

## Error Handling

The service handles various error scenarios:

1. **Missing fields**: Returns 400 with clear error message
2. **Invalid repo format**: Returns 400 with validation error
3. **Repo not scanned**: Returns 404 prompting to call /scan first
4. **No issues found**: Returns 200 with informative message
5. **GitHub API errors**: Returns 500 with API error details
6. **LLM API errors**: Returns 500 with LLM error details

## Technical Decisions

### Language & Framework: TypeScript + Express

- **Type Safety**: Full TypeScript support prevents runtime errors
- **Mature Ecosystem**: Express is battle-tested and well-documented
- **Developer Experience**: Great tooling and IDE support

### LLM Provider: Anthropic Claude

- Using Claude Sonnet 4 for high-quality analysis
- 4000 token max output for comprehensive responses
- System prompt engineered for software project analysis

### Context Management

- Issue bodies truncated to 500 characters to manage context size
- All required fields (id, title, body, html_url, created_at) preserved
- Handles pagination to fetch all issues regardless of count

### API Design

- RESTful endpoints with clear naming
- JSON request/response format
- Proper HTTP status codes
- Comprehensive error messages
- Full TypeScript types for type safety

## Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm test` - Run test suite

## Environment Variables

- `ANTHROPIC_API_KEY` - Optional: Your Anthropic API key (for Claude)
- `OPENAI_API_KEY` - Optional: Your OpenAI API key (for GPT-4)
- `PORT` - Optional: Server port (default: 5000)

**Note**: You must set at least one LLM API key (either Anthropic or OpenAI). If both are set, Anthropic Claude will be used by default.

## LLM Provider Selection

The application supports two LLM providers:

### Anthropic Claude (Default)

- **Model**: claude-sonnet-4-20250514
- **Pros**: High-quality analysis, great at following instructions, excellent reasoning
- **Setup**: Set `ANTHROPIC_API_KEY` environment variable

### OpenAI GPT-4

- **Model**: gpt-4o
- **Pros**: Fast response times, widely available, consistent performance
- **Setup**: Set `OPENAI_API_KEY` environment variable

**Auto-detection**: The application automatically detects which API key is available:

1. If only one key is set, that provider is used
2. If both keys are set, Anthropic Claude is used (priority)
3. If neither key is set, the server will fail to start with a clear error message

When the server starts, it will log which provider it's using:

```
Using Anthropic Claude for LLM analysis
```

or

```
Using OpenAI for LLM analysis
```

## Future Enhancements

If this were a production system, consider:

- GitHub authentication for higher rate limits
- Incremental updates (only fetch new issues)
- SQLite for better performance at scale
- Rate limiting on endpoints
- Async processing for large repositories
- Chunking strategy for repositories with 1000+ issues
- Docker containerization
- CI/CD pipeline

## License

MIT

---

**Built for**: GitHub Issue Analyzer Assessment  
**Time**: 2 days  
**AI Tools Used**: Claude Code for development assistance  
**Language**: TypeScript  
**Framework**: Express.js
