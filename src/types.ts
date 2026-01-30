/**
 * Type definitions for GitHub Issue Analyzer
 */

export interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
}

export interface CachedRepo {
  issues: GitHubIssue[];
  last_updated: string;
}

export interface Cache {
  [repo: string]: CachedRepo;
}

export interface ScanRequest {
  repo: string;
}

export interface ScanResponse {
  repo: string;
  issues_fetched: number;
  cached_successfully: boolean;
}

export interface AnalyzeRequest {
  repo: string;
  prompt: string;
}

export interface AnalyzeResponse {
  analysis: string;
}

export interface ErrorResponse {
  error: string;
  cached_successfully?: boolean;
}
