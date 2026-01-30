/**
 * Test script for GitHub Issue Analyzer
 * This script tests both /scan and /analyze endpoints
 */

import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:5000';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string): void {
  results.push({ name, passed, message });
  const icon = passed ? '✓' : '✗';
  console.log(`${icon} ${name}: ${message}`);
}

async function testHealth(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('Testing Health Endpoint');
  console.log('='.repeat(60));

  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.data);

    if (response.status === 200 && response.data.status === 'healthy') {
      logTest('Health Check', true, 'Server is healthy');
    } else {
      logTest('Health Check', false, 'Unexpected response');
    }
  } catch (error) {
    logTest('Health Check', false, `Failed: ${error}`);
  }
}

async function testScanEndpoint(repo: string): Promise<number> {
  console.log('\n' + '='.repeat(60));
  console.log(`Testing /scan endpoint with repo: ${repo}`);
  console.log('='.repeat(60));

  try {
    const payload = { repo };
    console.log('Request:', JSON.stringify(payload, null, 2));

    const response = await axios.post(`${BASE_URL}/scan`, payload);

    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.cached_successfully) {
      logTest(
        'Scan Endpoint',
        true,
        `Successfully cached ${response.data.issues_fetched} issues`
      );
      return response.data.issues_fetched;
    } else {
      logTest('Scan Endpoint', false, 'Unexpected response');
      return 0;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error response:', error.response?.data);
      logTest('Scan Endpoint', false, `Failed: ${error.message}`);
    } else {
      logTest('Scan Endpoint', false, `Failed: ${error}`);
    }
    return 0;
  }
}

async function testAnalyzeEndpoint(repo: string, prompt: string): Promise<boolean> {
  console.log('\n' + '='.repeat(60));
  console.log('Testing /analyze endpoint');
  console.log('='.repeat(60));

  try {
    const payload = { repo, prompt };
    console.log('Request:', JSON.stringify(payload, null, 2));

    const response = await axios.post(`${BASE_URL}/analyze`, payload);

    console.log(`Status: ${response.status}`);

    if (response.status === 200 && response.data.analysis) {
      const preview = response.data.analysis.substring(0, 200);
      console.log(`Analysis preview (first 200 chars):\n${preview}...`);
      logTest('Analyze Endpoint', true, 'Analysis completed successfully');
      return true;
    } else {
      logTest('Analyze Endpoint', false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error response:', error.response?.data);
      logTest('Analyze Endpoint', false, `Failed: ${error.message}`);
    } else {
      logTest('Analyze Endpoint', false, `Failed: ${error}`);
    }
    return false;
  }
}

async function testErrorCases(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('Testing Error Cases');
  console.log('='.repeat(60));

  // Test 1: Missing repo field in /scan
  console.log('\n1. Testing missing repo field in /scan...');
  try {
    await axios.post(`${BASE_URL}/scan`, {});
    logTest('Error: Missing Repo', false, 'Should have returned 400');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.log('Response:', error.response.data);
      logTest('Error: Missing Repo', true, 'Correctly returned 400');
    } else {
      logTest('Error: Missing Repo', false, 'Wrong error code');
    }
  }

  // Test 2: Invalid repo format
  console.log('\n2. Testing invalid repo format...');
  try {
    await axios.post(`${BASE_URL}/scan`, { repo: 'invalid' });
    logTest('Error: Invalid Format', false, 'Should have returned 400');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.log('Response:', error.response.data);
      logTest('Error: Invalid Format', true, 'Correctly returned 400');
    } else {
      logTest('Error: Invalid Format', false, 'Wrong error code');
    }
  }

  // Test 3: Analyze without scan
  console.log('\n3. Testing /analyze before /scan...');
  try {
    await axios.post(`${BASE_URL}/analyze`, {
      repo: 'nonexistent/repo',
      prompt: 'test'
    });
    logTest('Error: Repo Not Scanned', false, 'Should have returned 404');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('Response:', error.response.data);
      logTest('Error: Repo Not Scanned', true, 'Correctly returned 404');
    } else {
      logTest('Error: Repo Not Scanned', false, 'Wrong error code');
    }
  }

  // Test 4: Missing prompt field
  console.log('\n4. Testing missing prompt field in /analyze...');
  try {
    await axios.post(`${BASE_URL}/analyze`, { repo: 'test/repo' });
    logTest('Error: Missing Prompt', false, 'Should have returned 400');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.log('Response:', error.response.data);
      logTest('Error: Missing Prompt', true, 'Correctly returned 400');
    } else {
      logTest('Error: Missing Prompt', false, 'Wrong error code');
    }
  }
}

async function main(): Promise<void> {
  console.log('\n' + '#'.repeat(60));
  console.log('# GitHub Issue Analyzer - Test Suite (TypeScript)');
  console.log('#'.repeat(60));

  try {
    // Test health
    await testHealth();

    // Test error cases
    await testErrorCases();

    // Test with a repository
    const testRepo = 'anthropics/anthropic-sdk-python';

    console.log(`\n\nNote: This will fetch real data from GitHub for ${testRepo}`);
    console.log('This may take a minute depending on the number of issues...');

    // Test scan
    const issuesCount = await testScanEndpoint(testRepo);

    if (issuesCount > 0) {
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test analyze with different prompts
      const prompts = [
        'Summarize the main themes in these issues',
        'What are the top 3 most critical issues?',
        'Identify any security-related issues'
      ];

      for (let i = 0; i < prompts.length; i++) {
        console.log(`\n\nAnalysis Test ${i + 1}/${prompts.length}`);
        await testAnalyzeEndpoint(testRepo, prompts[i]);
        if (i < prompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    console.log(`Passed: ${passed}/${total}`);
    results.forEach(r => {
      const icon = r.passed ? '✓' : '✗';
      console.log(`${icon} ${r.name}`);
    });

    if (passed === total) {
      console.log('\n' + '='.repeat(60));
      console.log('All tests completed successfully! ✓');
      console.log('='.repeat(60));
    } else {
      console.log('\n' + '='.repeat(60));
      console.log(`${total - passed} test(s) failed`);
      console.log('='.repeat(60));
      process.exit(1);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
      console.error('\n✗ Error: Could not connect to server.');
      console.error('Make sure the server is running on http://localhost:5000');
      console.error('Run: npm run dev');
      process.exit(1);
    } else {
      console.error(`\n✗ Test failed with error:`, error);
      process.exit(1);
    }
  }
}

main();