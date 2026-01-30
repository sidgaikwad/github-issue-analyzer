# Changelog

## Version 1.1.0 - OpenAI Support Added

### New Features

✨ **Dual LLM Provider Support**

- Added OpenAI GPT-4 as an alternative to Anthropic Claude
- Automatic provider detection based on available API keys
- Seamless switching between providers without code changes

### What's Changed

#### Core Changes

- **src/llm.ts**: Refactored to support both Anthropic and OpenAI
  - New `LLMProvider` type: `'anthropic' | 'openai'`
  - Auto-detection logic in constructor
  - Separate methods: `analyzeWithAnthropic()` and `analyzeWithOpenAI()`
  - Provider logging on startup

#### Dependencies

- **package.json**: Added `openai: ^4.77.0`

#### Documentation Updates

- **README.md**: Updated with both API key options
- **QUICKSTART.md**: Added instructions for both providers
- **PROJECT_SUMMARY.md**: Updated technical stack and features
- **PROMPTS.md**: Added OpenAI integration prompts
- **LLM_PROVIDERS.md**: New comprehensive guide for LLM provider support

### How to Use

**Option A: Anthropic Claude (Default)**

```bash
export ANTHROPIC_API_KEY='your-key'
npm run dev
```

**Option B: OpenAI GPT-4**

```bash
export OPENAI_API_KEY='your-key'
npm run dev
```

### Provider Priority

If both API keys are set, the application uses this priority:

1. Anthropic Claude (primary)
2. OpenAI GPT-4 (fallback)

### Supported Models

| Provider  | Model                    | Max Tokens |
| --------- | ------------------------ | ---------- |
| Anthropic | claude-sonnet-4-20250514 | 4000       |
| OpenAI    | gpt-4o                   | 4000       |

### Migration Guide

**No breaking changes!** Existing installations continue to work:

- If you only have `ANTHROPIC_API_KEY` set → Works exactly as before
- If you only have `OPENAI_API_KEY` set → Uses OpenAI automatically
- Both keys set → Uses Anthropic by default

### Benefits

✅ **Flexibility**: Use whichever LLM provider you have access to
✅ **No Code Changes**: Just set different environment variable
✅ **Cost Options**: Choose based on your budget
✅ **Performance Options**: Choose based on speed vs. quality needs
✅ **High Availability**: Fallback option if one provider has issues

### Example Usage

```bash
# Install dependencies (includes new openai package)
npm install

# Use Claude
export ANTHROPIC_API_KEY='sk-ant-...'
npm run dev

# Or use OpenAI
export OPENAI_API_KEY='sk-proj-...'
npm run dev
```

### Testing

Both providers have been tested and produce high-quality analysis:

- ✅ Theme identification
- ✅ Bug prioritization
- ✅ Feature request analysis
- ✅ Security issue detection
- ✅ Documentation gap identification

### Documentation

New documentation added:

- 📄 **LLM_PROVIDERS.md**: Comprehensive provider comparison and guide
- 📝 Updated all existing docs with dual provider information

---

## Version 1.0.0 - Initial Release

### Features

- POST /scan endpoint for fetching GitHub issues
- POST /analyze endpoint for LLM analysis
- JSON file-based caching
- TypeScript implementation with full type safety
- Anthropic Claude integration
- Comprehensive documentation

---

**For questions or issues with OpenAI support, see LLM_PROVIDERS.md**
