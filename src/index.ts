/**
 * GitHub Issue Analyzer with Local Caching + LLM Processing
 * A TypeScript/Express-based service for fetching, caching, and analyzing GitHub issues using LLMs.
 */

import express, { Request, Response } from "express";
import { CacheService } from "./cache";
import { GitHubService } from "./github";
import { LLMService } from "./llm";
import {
  ScanRequest,
  ScanResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  ErrorResponse,
} from "./types";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Initialize LLM service
let llmService: LLMService;
try {
  llmService = new LLMService();
} catch (error: any) {
  console.error("Failed to initialize LLM service:", error.message);
  console.error("Make sure ANTHROPIC_API_KEY environment variable is set");
  process.exit(1);
}

/**
 * Health check endpoint
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

/**
 * POST /scan
 * Fetch all open issues from a GitHub repository and cache them locally.
 *
 * Request body:
 *   {
 *     "repo": "owner/repository-name"
 *   }
 *
 * Response:
 *   {
 *     "repo": "owner/repository-name",
 *     "issues_fetched": 42,
 *     "cached_successfully": true
 *   }
 */
app.post("/scan", async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<ScanRequest>;

    // Validate request
    if (!body.repo) {
      const errorResponse: ErrorResponse = {
        error: "Missing 'repo' field in request body",
      };
      return res.status(400).json(errorResponse);
    }

    const repo = body.repo;

    // Validate repo format
    if (!GitHubService.validateRepoFormat(repo)) {
      const errorResponse: ErrorResponse = {
        error: "Invalid repo format. Expected 'owner/repository-name'",
      };
      return res.status(400).json(errorResponse);
    }

    // Fetch issues from GitHub
    const issues = await GitHubService.fetchAllIssues(repo);

    // Store in cache
    CacheService.storeIssues(repo, issues);

    // Send response
    const response: ScanResponse = {
      repo,
      issues_fetched: issues.length,
      cached_successfully: true,
    };

    res.json(response);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: error.message,
      cached_successfully: false,
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * POST /analyze
 * Analyze cached issues using an LLM with a natural-language prompt.
 *
 * Request body:
 *   {
 *     "repo": "owner/repository-name",
 *     "prompt": "Find themes across recent issues and recommend what the maintainers should fix first"
 *   }
 *
 * Response:
 *   {
 *     "analysis": "<LLM-generated text here>"
 *   }
 */
app.post("/analyze", async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<AnalyzeRequest>;

    // Validate request
    if (!body.repo || !body.prompt) {
      const errorResponse: ErrorResponse = {
        error: "Missing 'repo' or 'prompt' field in request body",
      };
      return res.status(400).json(errorResponse);
    }

    const { repo, prompt } = body as AnalyzeRequest;

    // Check if repo has been scanned
    if (!CacheService.hasRepo(repo)) {
      const errorResponse: ErrorResponse = {
        error: `Repository '${repo}' not yet scanned. Please call /scan first.`,
      };
      return res.status(404).json(errorResponse);
    }

    // Get cached issues
    const cachedData = CacheService.getIssues(repo);
    if (!cachedData) {
      const errorResponse: ErrorResponse = {
        error: `Failed to retrieve cached data for repository '${repo}'`,
      };
      return res.status(500).json(errorResponse);
    }

    const issues = cachedData.issues;

    // Handle edge case: no issues cached
    if (!issues || issues.length === 0) {
      const response: AnalyzeResponse = {
        analysis:
          "No issues found in the cache for this repository. The repository may not have any open issues.",
      };
      return res.json(response);
    }

    // Analyze issues using LLM
    const analysis = await llmService.analyzeIssues(repo, issues, prompt);

    // Send response
    const response: AnalyzeResponse = {
      analysis,
    };

    res.json(response);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`GitHub Issue Analyzer running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
