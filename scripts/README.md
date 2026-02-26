# Lease Document Processing Skill

This skill automates the extraction and processing of lease agreements to generate comprehensive Q&A responses and executive summaries.

## Overview

The lease processor takes a PDF lease document and:

1. ✅ Extracts all text from the PDF
2. ✅ Answers all questions from the standard CSV question template
3. ✅ Generates Executive and General Summaries
4. ✅ Creates a structured JSON file with complete answers in the application's format
5. ✅ Automatically adds the location to the vendor list if it doesn't exist
6. ✅ Provides complete, detailed answers (not abbreviated to save tokens)

## Prerequisites

### 1. Install Poppler Utils

The script uses `pdftotext` to extract text from PDFs. Install it based on your OS:

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
apt-get install poppler-utils
```

**Verify installation:**
```bash
which pdftotext
```

### 2. Set Up Anthropic API Key

You need a valid Anthropic API key to use Claude for document processing.

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

To make it permanent, add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export ANTHROPIC_API_KEY=your_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

### 3. Install Dependencies

Dependencies are already installed if you've run `pnpm install`. The key packages are:

- `@anthropic-ai/sdk` - Claude API client
- `tsx` - TypeScript execution
- `@types/node` - Node.js type definitions

## Usage

### Basic Command

```bash
pnpm process-lease <path-to-pdf> <tenant-name> [<location>]
```

### Examples

**Process Billy Goat Tavern lease:**
```bash
pnpm process-lease "product-docs/Billy Goat Lease 2022.pdf" "Billy Goat Tavern" "Suite 210"
```

**Process Chef Art Smith lease:**
```bash
pnpm process-lease "product-docs/Chef Art Smith Lease May 11 2020.pdf" "Chef Art Smith's Reunion" "Suite 300"
```

**Process Navy Pier Parking Agreement:**
```bash
pnpm process-lease "product-docs/Navy Pier Parking Agreement.pdf" "Navy Pier Parking" "Parking Area"
```

### Parameters

1. **path-to-pdf** (required): Path to the lease PDF file
2. **tenant-name** (required): Legal or trade name of the tenant
3. **location** (optional): Suite number or location description (defaults to "TBD")

## Output

### 1. Q&A JSON File

The script generates a JSON file in `src/app/lib/` with the naming pattern `{tenant-name}-qa.json`.

**Example:** `src/app/lib/billy-goat-tavern-qa.json`

**Structure:**
```json
{
  "tenant": "Billy Goat Tavern",
  "questions": [
    {
      "question": "What is the legal name of the tenant?",
      "answer": "Complete detailed answer with formatting...",
      "sections": ["Section 1.1"],
      "pages": ["Page 1"],
      "exactLanguage": "Exact quote from the lease...",
      "interpretationNotes": "Contextual interpretation...",
      "confidence": "High",
      "confidenceReason": "Explicitly stated in the lease parties section",
      "caveats": "None identified.",
      "documentId": "BILLY_GOAT_LEASE_2022",
      "definitionType": "Explicit",
      "reviewRequired": false
    }
  ],
  "executiveSummary": {
    "tenant": "Billy Goat Tavern",
    "documentId": "BILLY_GOAT_LEASE_2022",
    "summary": "Comprehensive executive summary...",
    "keyTerms": { ... },
    "criticalDates": [ ... ],
    "majorObligations": { ... },
    "risks": [ ... ],
    "opportunities": [ ... ]
  }
}
```

### 2. Updated Vendor List

The script automatically updates `src/app/lib/mock-data.ts` to include the new vendor if it doesn't already exist.

## Question Template

The script processes all questions from `product-docs/Sphere AI Lease Queries Nov 4 2025.csv`, including:

### Core Questions
- Legal name of tenant
- Default rate of interest
- Lease commencement date
- First Lease Year
- Operating Hours
- Permitted Use
- Premises description and size
- Rent Commencement Date
- Tenant Notice Address
- Tenant Trade Name

### Lease Terms
- Premises delivery date and condition
- Term of the Lease
- Option to Renew
- Conditions to Exercise Renewal

### Financial Terms
- Base Rental due date
- Additional rental and percentage rent
- Gross Sales definition
- Sales reporting requirements
- Penalties for late reporting
- Radius Restriction
- Security Deposit or Letter of Credit

### Operational Requirements
- Operating hours penalties
- Tenant Improvement Timeline
- Exterminator Service provisions
- Co-tenancy requirements

### Responsibilities
- Landlord's Responsibility to Repair
- Tenant's Responsibility to Repair
- Specific repair responsibilities (structural, roof, doors, windows, etc.)
- Utilities responsibilities
- HVAC responsibilities
- Fire Protection System

### Legal Terms
- Assignment and transfer conditions
- Event of Default
- Remedies for Default
- Inspection and Access provisions
- Relocation provisions
- Force Majeure Clause

### Insurance
- General Liability limits
- Workers Compensation
- Contractor's Insurance

### Financial Schedules (Exhibit M)
- Base Rent per year and month
- Common Area Maintenance (CAM)
- Marketing Fee
- Percentage Rent charges and breakpoint
- First and final year of each term
- Annual increase percentages

## Answer Format

The script generates answers in the **exact same detailed format** used in the application:

✅ **Complete answers** with full details and context
✅ **Markdown formatting** (headings, bullets, bold text)
✅ **Specific numbers, dates, and amounts**
✅ **Examples and calculations** where relevant
✅ **Cross-references** to related sections
✅ **Detailed breakdowns** (e.g., penalty structures, obligations lists)

**NOT** abbreviated or summarized to save tokens!

### Example Answer Format

```markdown
**Late Sales Report Penalties:**

**Initial Penalty:**
- $500 for first 10 days late
- Applies per reporting period (monthly)

**Escalating Penalty:**
- Additional $100 per day after initial 10-day period
- No cap specified on daily penalties

**Additional Consequences:**
- Landlord may estimate percentage rent and bill Tenant
- Tenant loses right to dispute estimated amount if more than 30 days late
- Repeated violations (3+ in 12 months) constitute material default

**Example:** 25 days late = $500 + $1,500 = **$2,000 total penalty**
```

## Integration with Application

After processing a lease, follow these steps to integrate it:

### 1. Review the Generated JSON

```bash
cat src/app/lib/billy-goat-tavern-qa.json
```

Review the answers for:
- Accuracy and completeness
- Proper formatting
- Any items marked `reviewRequired: true`
- Any answers with `confidence: "Low"`

### 2. Import the Q&A Data

Edit `src/app/lib/enhanced-mock-responses.ts`:

```typescript
import billyGoatQA from './billy-goat-tavern-qa.json';
```

### 3. Add Response Logic

In the `checkPredefinedQuestions` function, add a new section:

```typescript
if (vendorName.toLowerCase().includes('billy goat')) {
  for (const qa of billyGoatQA.questions) {
    // ... matching logic
  }
}
```

### 4. Test the Integration

1. Start the development server: `pnpm dev`
2. Select the new vendor from the dropdown
3. Test various questions to ensure responses are working

## Troubleshooting

### Error: poppler-utils is not installed

**Solution:**
```bash
# macOS
brew install poppler

# Ubuntu/Debian
apt-get install poppler-utils
```

### Error: ANTHROPIC_API_KEY environment variable is not set

**Solution:**
```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

### Error: PDF file not found

**Solution:** Check the path to your PDF file. Use quotes if the path contains spaces:
```bash
pnpm process-lease "path with spaces/lease.pdf" "Tenant Name"
```

### Error: Maximum buffer exceeded

For very large PDFs, you may need to increase the buffer size in `scripts/process-lease.ts`:

```typescript
maxBuffer: 50 * 1024 * 1024 // 50MB instead of 10MB
```

### Incomplete or incorrect answers

The script uses Claude Opus 4.6 for maximum accuracy. If answers are incomplete:

1. Check if the PDF text extraction was successful
2. Verify the lease document is clear and readable
3. Review the confidence levels and caveats in the output
4. Manually review and edit the JSON file as needed

## Cost Considerations

Processing a single lease document uses:
- **Questions processing:** ~8,000-16,000 tokens output (depends on lease complexity)
- **Executive summary:** ~4,000-8,000 tokens output
- **Total cost per lease:** Approximately $0.50-$2.00 (based on Claude Opus 4.6 pricing)

The script uses `temperature: 0` for maximum consistency and accuracy.

## Advanced Usage

### Process Multiple Leases

Create a bash script to process multiple leases:

```bash
#!/bin/bash

# process-all-leases.sh
pnpm process-lease "product-docs/Lease1.pdf" "Tenant 1" "Suite 100"
pnpm process-lease "product-docs/Lease2.pdf" "Tenant 2" "Suite 200"
pnpm process-lease "product-docs/Lease3.pdf" "Tenant 3" "Suite 300"
```

### Custom Question Sets

To process a different set of questions, modify the `CSV_PATH` constant in `scripts/process-lease.ts`:

```typescript
const CSV_PATH = 'product-docs/my-custom-questions.csv';
```

### Batch Processing with Rate Limiting

For processing many leases, consider adding rate limiting to avoid API throttling:

```typescript
// Add delay between API calls
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
```

## Files Created/Modified

When you run the script, it will:

1. **Create:** `src/app/lib/{tenant-name}-qa.json` - Complete Q&A and summary
2. **Modify:** `src/app/lib/mock-data.ts` - Add vendor to the list (if new)

## Support

For issues or questions:

1. Check this README
2. Review the [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
3. Examine existing Q&A files like `chef-art-smith-qa.json` for examples
4. Check Claude API status: https://status.anthropic.com

## Future Enhancements

Potential improvements to this skill:

- [ ] Batch processing multiple PDFs
- [ ] OCR support for scanned PDFs
- [ ] Comparison mode (compare two lease versions)
- [ ] Alert detection (identify concerning clauses)
- [ ] Export to other formats (PDF, Word, etc.)
- [ ] Web interface for upload and processing
- [ ] Version control and change tracking
