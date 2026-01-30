/**
 * LLM Service - Handles integration with Anthropic Claude API
 */

import Anthropic from "@anthropic-ai/sdk";
import { GitHubIssue } from "./types";

export class LLMService {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Analyze GitHub issues using Claude LLM
   */
  async analyzeIssues(
    repo: string,
    issues: GitHubIssue[],
    userPrompt: string,
  ): Promise<string> {
    // Prepare issues data for LLM
    const issuesText = issues
      .map((issue) => {
        // Truncate body to 500 characters to manage context size
        const body = issue.body
          ? issue.body.substring(0, 500)
          : "No description";

        return `
Issue ID: ${issue.id}
Title: ${issue.title}
Body: ${body}
URL: ${issue.html_url}
Created: ${issue.created_at}
---`;
      })
      .join("\n");

    // Construct the system prompt
    const systemPrompt =
      "You are an expert software project analyst. You analyze GitHub issues to identify " +
      "patterns, themes, and priorities. Provide clear, actionable insights based on the issues provided.";

    // Construct the full prompt
    const fullPrompt = `Analyze the following GitHub issues from the repository '${repo}'.

${userPrompt}

Here are the issues:

${issuesText}

Please provide a comprehensive analysis based on the request above.`;

    try {
      const message = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
      });

      // Extract text from response
      const textContent = message.content.find(
        (block) => block.type === "text",
      );
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text content in LLM response");
      }

      return textContent.text;
    } catch (error: any) {
      throw new Error(`LLM API error: ${error.message}`);
    }
  }
}
