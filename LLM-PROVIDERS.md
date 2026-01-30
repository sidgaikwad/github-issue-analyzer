# LLM Provider Support

This application supports two LLM providers: **Anthropic Claude** and **OpenAI GPT-4**. The system automatically detects which API key is available and uses the appropriate provider.

## Supported Providers

### 1. Anthropic Claude (Default)

**Model**: `claude-sonnet-4-20250514`

**Strengths**:

- Exceptional reasoning and analysis capabilities
- Great at following complex instructions
- Excellent for technical analysis
- Strong understanding of software development context

**API Key Setup**:

```bash
export ANTHROPIC_API_KEY='your-anthropic-key'
```

**Get API Key**: https://console.anthropic.com/

### 2. OpenAI GPT-4

**Model**: `gpt-4o`

**Strengths**:

- Fast response times
- Widely available and familiar
- Consistent performance
- Great general-purpose analysis

**API Key Setup**:

```bash
export OPENAI_API_KEY='your-openai-key'
```

**Get API Key**: https://platform.openai.com/api-keys

## How Provider Selection Works

The application uses the following logic:

1. **Check for Anthropic API key first**
   - If `ANTHROPIC_API_KEY` is set → Use Claude
2. **Check for OpenAI API key**
   - If `OPENAI_API_KEY` is set → Use GPT-4
3. **If both are set**
   - Anthropic Claude takes priority
4. **If neither is set**
   - Server fails to start with error message

## Startup Messages

When you start the server, you'll see one of these messages:

```
Using Anthropic Claude for LLM analysis
```

or

```
Using OpenAI for LLM analysis
```

This confirms which provider is being used.

## Switching Between Providers

To switch providers, simply change which environment variable is set:

### Switch to Claude

```bash
export ANTHROPIC_API_KEY='your-anthropic-key'
unset OPENAI_API_KEY
npm run dev
```

### Switch to OpenAI

```bash
export OPENAI_API_KEY='your-openai-key'
unset ANTHROPIC_API_KEY
npm run dev
```

## API Configuration

Both providers are configured with similar parameters:

| Parameter     | Anthropic Claude         | OpenAI GPT-4 |
| ------------- | ------------------------ | ------------ |
| Model         | claude-sonnet-4-20250514 | gpt-4o       |
| Max Tokens    | 4000                     | 4000         |
| System Prompt | ✓                        | ✓            |
| User Prompt   | ✓                        | ✓            |

## Code Implementation

The dual provider support is implemented in `src/llm.ts`:

```typescript
export class LLMService {
  private anthropicClient?: Anthropic;
  private openaiClient?: OpenAI;
  private provider: LLMProvider;

  constructor() {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      this.provider = "anthropic";
      this.anthropicClient = new Anthropic({ apiKey: anthropicKey });
    } else if (openaiKey) {
      this.provider = "openai";
      this.openaiClient = new OpenAI({ apiKey: openaiKey });
    } else {
      throw new Error("Either ANTHROPIC_API_KEY or OPENAI_API_KEY must be set");
    }
  }
}
```

## Performance Comparison

Based on typical usage:

| Metric                      | Anthropic Claude | OpenAI GPT-4 |
| --------------------------- | ---------------- | ------------ |
| Response Time               | ~3-5 seconds     | ~2-4 seconds |
| Analysis Quality            | Excellent        | Excellent    |
| Technical Understanding     | Superior         | Very Good    |
| Cost per 1K tokens (input)  | $3.00            | $2.50        |
| Cost per 1K tokens (output) | $15.00           | $10.00       |

_Note: Prices are approximate and may vary. Check provider websites for current pricing._

## Which Provider Should You Use?

### Choose Anthropic Claude if:

- You need the highest quality technical analysis
- You're analyzing complex software architecture issues
- You want superior reasoning capabilities
- Cost is less of a concern than quality

### Choose OpenAI GPT-4 if:

- You need faster response times
- You're already familiar with OpenAI's ecosystem
- You want consistent, reliable performance
- You prefer slightly lower costs

### Recommendation

For this GitHub Issue Analyzer project, **both providers work excellently**. The choice comes down to:

- **API availability**: Use whichever key you have access to
- **Performance needs**: OpenAI is slightly faster
- **Quality needs**: Claude excels at complex technical analysis
- **Cost**: OpenAI is slightly more economical

## Testing Both Providers

You can easily test both providers:

```bash
# Test with Claude
export ANTHROPIC_API_KEY='your-key'
unset OPENAI_API_KEY
npm run dev
# Run your analysis...

# Test with OpenAI
unset ANTHROPIC_API_KEY
export OPENAI_API_KEY='your-key'
npm run dev
# Run the same analysis...
```

Compare the results to see which provider works better for your specific use case.

## Troubleshooting

### Error: "Either ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable must be set"

**Solution**: Set at least one API key:

```bash
export ANTHROPIC_API_KEY='your-key'
# or
export OPENAI_API_KEY='your-key'
```

### Error: "LLM API error: ..."

**Possible causes**:

1. Invalid API key
2. API rate limits exceeded
3. Network connectivity issues
4. Insufficient API credits

**Solution**:

- Verify your API key is correct
- Check your API usage/limits in the provider's console
- Try again after a few moments

### Both keys set but wrong provider used

**Expected behavior**: Anthropic Claude takes priority when both keys are set.

**To force OpenAI**: Unset the Anthropic key:

```bash
unset ANTHROPIC_API_KEY
```

## Future Enhancements

Potential improvements for LLM provider support:

1. **Manual Provider Selection**
   - Add environment variable: `LLM_PROVIDER=openai` or `LLM_PROVIDER=anthropic`
2. **Provider-Specific Endpoints**
   - `/analyze/claude` - Force Claude
   - `/analyze/openai` - Force GPT-4
3. **Multiple Model Support**
   - Allow choosing different models (e.g., GPT-4-turbo, Claude Opus)
4. **Cost Tracking**
   - Track API usage and costs per provider
5. **Response Comparison**
   - Get analysis from both providers simultaneously

## Conclusion

The dual LLM provider support makes this application flexible and accessible:

- ✅ Works with whichever API key you have
- ✅ No code changes needed to switch providers
- ✅ Both providers produce high-quality analysis
- ✅ Automatic detection and configuration
- ✅ Clear logging of which provider is in use

Choose the provider that best fits your needs, budget, and availability!
