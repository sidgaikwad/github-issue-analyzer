/**
 * GitHub Service - Handles fetching issues from GitHub API
 */

import axios from "axios";
import { GitHubIssue } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubService {
  /**
   * Fetch all open issues from a GitHub repository
   * Handles pagination to retrieve all issues
   */
  static async fetchAllIssues(repo: string): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const response = await axios.get(
          `${GITHUB_API_BASE}/repos/${repo}/issues`,
          {
            params: {
              state: "open",
              page,
              per_page: perPage,
            },
          },
        );

        if (response.data.length === 0) {
          break;
        }

        // Filter out pull requests and extract required fields
        for (const item of response.data) {
          // Skip pull requests (they appear in issues endpoint)
          if ("pull_request" in item) {
            continue;
          }

          issues.push({
            id: item.id,
            title: item.title,
            body: item.body || "",
            html_url: item.html_url,
            created_at: item.created_at,
          });
        }

        page++;
      }

      return issues;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`GitHub API error: ${status} - ${message}`);
      }
      throw error;
    }
  }

  /**
   * Validate repository format
   */
  static validateRepoFormat(repo: string): boolean {
    return repo.includes("/") && repo.split("/").length === 2;
  }
}
