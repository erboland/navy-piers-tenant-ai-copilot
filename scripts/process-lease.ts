#!/usr/bin/env node

/**
 * Lease Document Processor
 *
 * This script processes a lease PDF document and generates:
 * 1. Complete answers to all questions from the CSV
 * 2. Executive and General summaries
 * 3. Updates the vendor list if needed
 *
 * Usage:
 *   pnpm process-lease <path-to-pdf> <tenant-name> [<location>]
 *
 * Example:
 *   pnpm process-lease "product-docs/Billy Goat Lease 2022.pdf" "Billy Goat Tavern" "Suite 210"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, basename } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { LeaseQADocument, CSVQuestion, ExecutiveSummary } from './types/lease-qa';

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CSV_PATH = 'product-docs/Sphere AI Lease Queries Nov 4 2025.csv';
const OUTPUT_DIR = 'src/app/lib';
const MOCK_DATA_PATH = 'src/app/lib/mock-data.ts';

// Validate environment
if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
  console.error('Please set it with: export ANTHROPIC_API_KEY=your_api_key');
  process.exit(1);
}

// Check if poppler-utils is installed
try {
  execSync('which pdftotext', { stdio: 'ignore' });
} catch {
  console.error('Error: poppler-utils is not installed');
  console.error('Please install it with:');
  console.error('  macOS: brew install poppler');
  console.error('  Ubuntu/Debian: apt-get install poppler-utils');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: pnpm process-lease <path-to-pdf> <tenant-name> [<location>]');
  console.error('Example: pnpm process-lease "product-docs/Billy Goat Lease 2022.pdf" "Billy Goat Tavern" "Suite 210"');
  process.exit(1);
}

const pdfPath = args[0];
const tenantName = args[1];
const location = args[2] || 'TBD';

// Validate PDF exists
if (!existsSync(pdfPath)) {
  console.error(`Error: PDF file not found: ${pdfPath}`);
  process.exit(1);
}

// Initialize Anthropic client with timeout settings
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  timeout: 120000, // 2 minutes
  maxRetries: 3,
});

/**
 * Retry helper for API calls with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`API call failed, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Extract text from PDF using pdftotext
 */
function extractPDFText(pdfPath: string): string {
  console.log(`Extracting text from ${pdfPath}...`);
  try {
    const text = execSync(`pdftotext "${pdfPath}" -`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error;
  }
}

/**
 * Parse CSV questions file
 */
function parseCSVQuestions(csvPath: string): CSVQuestion[] {
  console.log(`Parsing questions from ${csvPath}...`);
  const csvContent = readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  const questions: CSVQuestion[] = [];
  let currentCategory = '';

  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const col1 = parts[0]?.trim() || '';
      const col2 = parts[1]?.trim() || '';

      // Check if this is a category header
      if (col1 && !col2 && !col1.includes('?')) {
        currentCategory = col1;
      }
      // Check if this is a question
      else if (col2 && col2.includes('?')) {
        questions.push({
          category: currentCategory,
          question: col2
        });
      }
    }
  }

  console.log(`Found ${questions.length} questions`);
  return questions;
}

/**
 * Process a batch of questions with Claude
 */
async function processQuestionsWithClaude(
  pdfText: string,
  questions: CSVQuestion[],
  tenantName: string,
  documentId: string
): Promise<LeaseQADocument> {
  console.log(`Processing ${questions.length} questions with Claude API...`);

  const prompt = `You are a legal document analyst specializing in commercial real estate leases. You have been provided with a lease agreement for "${tenantName}".

LEASE DOCUMENT TEXT:
${pdfText}

---

Your task is to answer the following questions about this lease. For each question, provide:

1. **answer**: A complete, detailed answer in the format used in the existing application (see example below). Do NOT make answers short to save tokens - provide comprehensive answers with all relevant details, bullet points, formatting, and context.

2. **sections**: Array of lease sections where the information is found (e.g., ["Section 1.1", "Article III"])

3. **pages**: Array of page references where the information appears (e.g., ["Page 1", "Page 3"])

4. **exactLanguage**: The exact quoted text from the lease that supports your answer (in quotes)

5. **interpretationNotes**: Your interpretation and context about what this means practically

6. **confidence**: "High", "Medium", or "Low" based on how explicitly the information is stated

7. **confidenceReason**: Brief explanation of why you assigned this confidence level

8. **caveats**: Any important qualifications, limitations, or potential ambiguities

9. **definitionType**: "Explicit" if directly stated, "Implicit" if inferred from context, "Inferred" if you're making an educated guess, "Not Found" if not in the document

10. **reviewRequired**: true if a human should review this answer, false otherwise

EXAMPLE FORMAT (from Chef Art Smith's Reunion lease):
{
  "question": "What is the penalty for the Tenant not submitting their sales in the time?",
  "answer": "**Late Sales Report Penalties:**\\n\\n**Initial Penalty:**\\n- $500 for first 10 days late\\n- Applies per reporting period (monthly)\\n\\n**Escalating Penalty:**\\n- Additional $100 per day after initial 10-day period\\n- No cap specified on daily penalties\\n\\n**Additional Consequences:**\\n- Landlord may estimate percentage rent and bill Tenant\\n- Tenant loses right to dispute estimated amount if more than 30 days late\\n- Repeated violations (3+ in 12 months) constitute material default\\n- May trigger audit rights at Tenant's expense\\n\\n**Example:** 25 days late = $500 (first 10 days) + $1,500 (15 days × $100) = **$2,000 total penalty**",
  "sections": ["Section 5.3 (Sales Reporting)", "Section 5.4 (Late Report Penalties)", "Section 16.1 (Default)"],
  "pages": ["Page 11", "Page 12", "Page 28"],
  "exactLanguage": "...",
  "interpretationNotes": "...",
  "confidence": "High",
  "confidenceReason": "...",
  "caveats": "...",
  "documentId": "${documentId}",
  "definitionType": "Explicit",
  "reviewRequired": false
}

IMPORTANT INSTRUCTIONS:
- If a question cannot be answered from the document, set answer to "This information is not available in the lease document" and set definitionType to "Not Found"
- Provide COMPLETE answers with full detail - do not abbreviate or summarize to save tokens
- Use markdown formatting (**, bullets, etc.) to make answers clear and scannable
- Include specific numbers, dates, amounts, and details
- Cross-reference related sections when relevant
- Flag any ambiguities or areas requiring legal review

QUESTIONS TO ANSWER:
${questions.map((q, i) => `${i + 1}. [${q.category}] ${q.question}`).join('\n')}

Return your response as a valid JSON object with this structure:
{
  "tenant": "${tenantName}",
  "questions": [array of question-answer objects following the format above]
}`;

  try {
    const message = await retryWithBackoff(() =>
      anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 16000,
        temperature: 0,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    );

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json?\s*\n/, '').replace(/\n```\s*$/, '');
    }

    const result = JSON.parse(jsonText) as LeaseQADocument;
    console.log(`Successfully processed ${result.questions.length} questions`);
    return result;

  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Generate Executive Summary with Claude
 */
async function generateExecutiveSummary(
  pdfText: string,
  tenantName: string,
  documentId: string
): Promise<ExecutiveSummary> {
  console.log('Generating Executive Summary...');

  const prompt = `You are a legal document analyst. Analyze this lease agreement for "${tenantName}" and create a comprehensive Executive Summary.

LEASE DOCUMENT TEXT:
${pdfText}

---

Provide a JSON object with the following structure:

{
  "tenant": "${tenantName}",
  "documentId": "${documentId}",
  "summary": "A comprehensive 3-5 paragraph executive summary covering the key business terms, obligations, risks, and opportunities in this lease. Write in clear, business-friendly language.",
  "keyTerms": {
    "commencement": "Lease start date",
    "expiration": "Lease end date (including any known renewal periods)",
    "premisesSize": "Size and description of the premises",
    "baseRent": "Base rent amount and escalation terms",
    "renewalOptions": "Summary of renewal rights"
  },
  "criticalDates": [
    {
      "date": "YYYY-MM-DD or description",
      "description": "What happens on this date"
    }
  ],
  "majorObligations": {
    "landlord": ["List of landlord's major obligations"],
    "tenant": ["List of tenant's major obligations"]
  },
  "risks": ["List of potential risks or unfavorable terms for tenant"],
  "opportunities": ["List of beneficial terms or opportunities for tenant"]
}

Focus on business-critical information that executives need to know.`;

  try {
    const message = await retryWithBackoff(() =>
      anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 8000,
        temperature: 0,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    );

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    let jsonText = responseText.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json?\s*\n/, '').replace(/\n```\s*$/, '');
    }

    return JSON.parse(jsonText) as ExecutiveSummary;

  } catch (error) {
    console.error('Error generating executive summary:', error);
    throw error;
  }
}

/**
 * Save Q&A results to JSON file
 */
function saveQAResults(qaData: LeaseQADocument, executiveSummary: ExecutiveSummary) {
  // Create filename from tenant name
  const filename = tenantName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-qa.json';

  const outputPath = join(OUTPUT_DIR, filename);

  // Combine Q&A and executive summary
  const output = {
    ...qaData,
    executiveSummary
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✓ Saved Q&A results to ${outputPath}`);
  return outputPath;
}

/**
 * Update vendor list in mock-data.ts
 */
function updateVendorList(tenantName: string, location: string) {
  console.log('Updating vendor list...');

  const mockDataContent = readFileSync(MOCK_DATA_PATH, 'utf-8');

  // Check if vendor already exists
  if (mockDataContent.includes(`name: "${tenantName}"`)) {
    console.log(`✓ Vendor "${tenantName}" already exists in vendor list`);
    return;
  }

  // Find the highest ID
  const idMatches = mockDataContent.match(/id: "(\d+)"/g);
  let maxId = 0;
  if (idMatches) {
    maxId = Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '0')));
  }
  const newId = (maxId + 1).toString();

  // Determine vendor type (simple heuristic)
  const type = tenantName.toLowerCase().includes('parking')
    ? 'Parking'
    : 'Restaurant';

  // Add new vendor to the array
  const vendorEntry = `  { id: "${newId}", name: "${tenantName}", type: "${type}", location: "${location}" },`;

  const updatedContent = mockDataContent.replace(
    /(export const mockVendors: Vendor\[] = \[[\s\S]*?)(\];)/,
    `$1${vendorEntry}\n$2`
  );

  writeFileSync(MOCK_DATA_PATH, updatedContent, 'utf-8');
  console.log(`✓ Added vendor "${tenantName}" (ID: ${newId}) to vendor list`);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🔍 Navy Pier Lease Document Processor\n');
  console.log(`Tenant: ${tenantName}`);
  console.log(`PDF: ${pdfPath}`);
  console.log(`Location: ${location}\n`);

  try {
    // Step 1: Extract PDF text
    const pdfText = extractPDFText(pdfPath);

    // Step 2: Parse CSV questions
    const questions = parseCSVQuestions(CSV_PATH);

    // Step 3: Generate document ID
    const documentId = basename(pdfPath, '.pdf')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_');

    // Step 4: Process questions with Claude
    const qaData = await processQuestionsWithClaude(
      pdfText,
      questions,
      tenantName,
      documentId
    );

    // Step 5: Generate executive summary
    const executiveSummary = await generateExecutiveSummary(
      pdfText,
      tenantName,
      documentId
    );

    // Step 6: Save results
    const outputPath = saveQAResults(qaData, executiveSummary);

    // Step 7: Update vendor list
    updateVendorList(tenantName, location);

    console.log('\n✅ Processing complete!');
    console.log(`\nNext steps:`);
    console.log(`1. Review the generated file: ${outputPath}`);
    console.log(`2. Import the Q&A data in enhanced-mock-responses.ts`);
    console.log(`3. Test queries against "${tenantName}"\n`);

  } catch (error) {
    console.error('\n❌ Error processing lease:', error);
    process.exit(1);
  }
}

main();
