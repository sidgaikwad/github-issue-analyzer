/**
 * LLM Service - Handles integration with both Anthropic Claude and OpenAI APIs
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GitHubIssue } from "./types";

type LLMProvider = "anthropic" | "openai";

export class LLMService {
  private anthropicClient?: Anthropic;
  private openaiClient?: OpenAI;
  private provider: LLMProvider;

  constructor() {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Determine which provider to use
    if (anthropicKey) {
      this.provider = "anthropic";
      this.anthropicClient = new Anthropic({ apiKey: anthropicKey });
      console.log("Using Anthropic Claude for LLM analysis");
    } else if (openaiKey) {
      this.provider = "openai";
      this.openaiClient = new OpenAI({ apiKey: openaiKey });
      console.log("Using OpenAI for LLM analysis");
    } else {
      throw new Error(
        "Either ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable must be set",
      );
    }
  }

  /**
   * Analyze GitHub issues using configured LLM provider
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
      if (this.provider === "anthropic") {
        return await this.analyzeWithAnthropic(systemPrompt, fullPrompt);
      } else {
        return await this.analyzeWithOpenAI(systemPrompt, fullPrompt);
      }
    } catch (error: any) {
      throw new Error(`LLM API error: ${error.message}`);
    }
  }

  /**
   * Analyze using Anthropic Claude
   */
  private async analyzeWithAnthropic(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error("Anthropic client not initialized");
    }

    const message = await this.anthropicClient.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in LLM response");
    }

    return textContent.text;
  }

  /**
   * Analyze using OpenAI
   */
  private async analyzeWithOpenAI(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    if (!this.openaiClient) {
      throw new Error("OpenAI client not initialized");
    }

    const completion = await this.openaiClient.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No content in OpenAI response");
    }

    return response;
  }

  /**
   * Get the current LLM provider being used
   */
  getProvider(): LLMProvider {
    return this.provider;
  }
}
