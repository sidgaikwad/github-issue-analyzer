/**
 * Cache Service - Handles JSON file-based storage for GitHub issues
 */

import * as fs from "fs";
import * as path from "path";
import { Cache, CachedRepo, GitHubIssue } from "./types";

const CACHE_FILE = path.join(process.cwd(), "issues_cache.json");

export class CacheService {
  /**
   * Load the cache from the JSON file
   */
  static loadCache(): Cache {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, "utf-8");
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error("Error loading cache:", error);
      return {};
    }
  }

  /**
   * Save the cache to the JSON file
   */
  static saveCache(cache: Cache): void {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving cache:", error);
      throw new Error("Failed to save cache to file");
    }
  }

  /**
   * Store issues for a repository
   */
  static storeIssues(repo: string, issues: GitHubIssue[]): void {
    const cache = this.loadCache();
    cache[repo] = {
      issues,
      last_updated: new Date().toISOString(),
    };
    this.saveCache(cache);
  }

  /**
   * Retrieve issues for a repository
   */
  static getIssues(repo: string): CachedRepo | null {
    const cache = this.loadCache();
    return cache[repo] || null;
  }

  /**
   * Check if a repository has been cached
   */
  static hasRepo(repo: string): boolean {
    const cache = this.loadCache();
    return repo in cache;
  }
}
