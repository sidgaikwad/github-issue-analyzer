# Example cURL Commands for Testing

## Health Check

```bash
curl http://localhost:5000/health
```

## Scan a Repository

### Small Repository (for quick testing)

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python"
  }'
```

### Popular Repository (more issues)

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react"
  }'
```

### Large Repository

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "microsoft/vscode"
  }'
```

## Analyze Issues

### Theme Analysis

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "Find themes across recent issues and recommend what the maintainers should fix first"
  }'
```

### Bug Prioritization

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "Identify the most common bug categories and which should be prioritized"
  }'
```

### Feature Request Analysis

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "What features are users most frequently requesting?"
  }'
```

### Documentation Issues

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "Which issues are related to documentation gaps or confusion?"
  }'
```

### Security Analysis

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "Are there any security-related issues that need immediate attention?"
  }'
```

### User Experience Analysis

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "What user experience problems are mentioned most frequently?"
  }'
```

### Performance Analysis

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react",
    "prompt": "Identify all performance-related issues and rank them by severity"
  }'
```

## Error Case Testing

### Invalid Repo Format

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "invalid-format"
  }'
```

Expected response: 400 Bad Request

### Missing Repo Field

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response: 400 Bad Request

### Analyze Before Scan

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "nonexistent/repo",
    "prompt": "Analyze this"
  }'
```

Expected response: 404 Not Found

### Missing Prompt Field

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react"
  }'
```

Expected response: 400 Bad Request

### Non-existent Repository

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "thisdoesnotexist/noreallydoesnotexist"
  }'
```

Expected response: 500 Internal Server Error with GitHub API error message

## Advanced Usage

### Pretty Print JSON Response

If you have `jq` installed:

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "anthropics/anthropic-sdk-python"}' | jq
```

### Save Analysis to File

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "anthropics/anthropic-sdk-python",
    "prompt": "Provide a comprehensive analysis of all issues"
  }' > analysis_output.json
```

### Scan Multiple Repos at Once (using shell script)

```bash
#!/bin/bash
repos=("facebook/react" "microsoft/vscode" "tensorflow/tensorflow")

for repo in "${repos[@]}"
do
  echo "Scanning $repo..."
  curl -X POST http://localhost:5000/scan \
    -H "Content-Type: application/json" \
    -d "{\"repo\": \"$repo\"}"
  echo ""
done
```

### Chain Scan and Analyze

```bash
# Scan first
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "vercel/next.js"}'

# Then analyze (after scan completes)
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "vercel/next.js",
    "prompt": "What are the most critical issues affecting users?"
  }'
```

## Testing with Different Repositories

### Frontend Frameworks

```bash
# React
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "facebook/react"}'

# Vue
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "vuejs/vue"}'

# Svelte
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "sveltejs/svelte"}'
```

### Backend Frameworks

```bash
# Express
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "expressjs/express"}'

# NestJS
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "nestjs/nest"}'
```

### AI/ML Projects

```bash
# TensorFlow
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "tensorflow/tensorflow"}'

# PyTorch
curl -X POST http://localhost:5000/scan -H "Content-Type: application/json" -d '{"repo": "pytorch/pytorch"}'
```

## Performance Testing

### Measure Response Time

```bash
time curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "anthropics/anthropic-sdk-python"}'
```

### Verbose Output (see headers)

```bash
curl -v -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "anthropics/anthropic-sdk-python"}'
```

## Batch Analysis Prompts

Save this as `analyze_batch.sh`:

```bash
#!/bin/bash
REPO="facebook/react"

prompts=(
  "What are the most critical bugs?"
  "Which features are users requesting?"
  "Are there any security issues?"
  "What documentation gaps exist?"
  "Which issues affect performance?"
)

for prompt in "${prompts[@]}"
do
  echo "Analyzing: $prompt"
  curl -X POST http://localhost:5000/analyze \
    -H "Content-Type: application/json" \
    -d "{\"repo\": \"$REPO\", \"prompt\": \"$prompt\"}" \
    -o "analysis_$(echo "$prompt" | tr ' ' '_' | tr '[:upper:]' '[:lower:]').json"
  echo ""
  sleep 2  # Rate limiting courtesy
done
```

Make it executable and run:

```bash
chmod +x analyze_batch.sh
./analyze_batch.sh
```
