# Quick Start Guide: Process a Lease Document

This guide will walk you through processing your first lease document in under 5 minutes.

## Step 1: Install Prerequisites (One-Time Setup)

### Install Poppler Utils

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils
```

**Verify installation:**
```bash
which pdftotext
# Should output: /usr/local/bin/pdftotext (or similar)
```

### Set Your Anthropic API Key

1. Get your API key from https://console.anthropic.com/
2. Set it as an environment variable:

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

**Make it permanent** (add to `~/.zshrc` or `~/.bashrc`):
```bash
echo 'export ANTHROPIC_API_KEY=your_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Process Your First Lease

### Example 1: Billy Goat Tavern

```bash
pnpm process-lease "product-docs/Billy Goat Lease 2022.pdf" "Billy Goat Tavern" "Suite 210"
```

**Expected output:**
```
🔍 Navy Pier Lease Document Processor

Tenant: Billy Goat Tavern
PDF: product-docs/Billy Goat Lease 2022.pdf
Location: Suite 210

Extracting text from product-docs/Billy Goat Lease 2022.pdf...
Parsing questions from product-docs/Sphere AI Lease Queries Nov 4 2025.csv...
Found 72 questions
Processing 72 questions with Claude API...
Successfully processed 72 questions
Generating Executive Summary...
✓ Saved Q&A results to src/app/lib/billy-goat-tavern-qa.json
Updating vendor list...
✓ Added vendor "Billy Goat Tavern" (ID: 8) to vendor list

✅ Processing complete!

Next steps:
1. Review the generated file: src/app/lib/billy-goat-tavern-qa.json
2. Import the Q&A data in enhanced-mock-responses.ts
3. Test queries against "Billy Goat Tavern"
```

### Example 2: Navy Pier Parking Agreement

```bash
pnpm process-lease "product-docs/Navy Pier Parking Agreement.pdf" "Navy Pier Parking" "Parking Area"
```

## Step 3: Review the Generated File

```bash
# View the generated JSON file
cat src/app/lib/billy-goat-tavern-qa.json

# Or open in your editor
code src/app/lib/billy-goat-tavern-qa.json
```

**Check for:**
- ✅ Completeness of answers
- ✅ Any questions marked `reviewRequired: true`
- ✅ Confidence levels (High/Medium/Low)
- ✅ Executive summary quality

## Step 4: Integrate into the Application

### 4.1 Import the JSON file

Edit [src/app/lib/enhanced-mock-responses.ts](src/app/lib/enhanced-mock-responses.ts):

```typescript
import chefArtSmithQA from './chef-art-smith-qa.json';
import billyGoatQA from './billy-goat-tavern-qa.json';  // Add this line
```

### 4.2 Add the response handler

In the same file, add a new section in `checkPredefinedQuestions`:

```typescript
// Check if this is for Billy Goat Tavern
if (vendorName.toLowerCase().includes('billy goat')) {
  for (const qa of billyGoatQA.questions) {
    const predefinedQuestion = qa.question.toLowerCase().trim();
    if (normalizedQuestion === predefinedQuestion ||
        normalizedQuestion.includes(predefinedQuestion) ||
        predefinedQuestion.includes(normalizedQuestion)) {

      const structuredData: StructuredQAData = {
        question: qa.question,
        answer: qa.answer,
        source: {
          sections: qa.sections,
          pages: qa.pages,
          exactLanguage: qa.exactLanguage,
        },
        interpretation: qa.interpretationNotes,
        confidence: {
          level: qa.confidence as "High" | "Medium" | "Low",
          reason: qa.confidenceReason,
        },
        caveats: qa.caveats,
        metadata: {
          documentId: qa.documentId,
          definitionType: qa.definitionType,
          reviewRequired: qa.reviewRequired,
        },
        citations: [`Billy Goat Lease - ${qa.sections.join(', ')}`],
      };

      return {
        role: "assistant",
        content: qa.answer,
        structuredData,
        citations: structuredData.citations,
      };
    }
  }
}
```

## Step 5: Test in the Application

1. Start the development server:
```bash
pnpm dev
```

2. Open your browser to http://localhost:5173 (or the port shown)

3. Select "Billy Goat Tavern" from the vendor dropdown

4. Try asking questions:
   - "What is the legal name of the tenant?"
   - "What is the size of the premises?"
   - "Is there an option to renew?"
   - "What are the tenant's repair responsibilities?"

5. Verify the responses match your expectations

## Common Issues

### "poppler-utils is not installed"
```bash
# Install poppler
brew install poppler  # macOS
sudo apt-get install poppler-utils  # Ubuntu/Debian
```

### "ANTHROPIC_API_KEY environment variable is not set"
```bash
# Set the API key
export ANTHROPIC_API_KEY=your_key_here

# Verify it's set
echo $ANTHROPIC_API_KEY
```

### "PDF file not found"
Use quotes around paths with spaces:
```bash
pnpm process-lease "path with spaces/lease.pdf" "Tenant Name"
```

### Vendor already exists
The script will skip adding the vendor if it already exists:
```
✓ Vendor "Billy Goat Tavern" already exists in vendor list
```

## Next Steps

- 📖 Read the full [README.md](README.md) for advanced usage
- 🔍 Review existing examples in [src/app/lib/chef-art-smith-qa.json](../src/app/lib/chef-art-smith-qa.json)
- 📝 Check the [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for application structure
- 🚀 Process more lease documents!

## Processing Time & Cost

- **Processing time:** 2-5 minutes per lease
- **API cost:** ~$0.50-$2.00 per lease (Claude Opus 4.6)
- **Questions processed:** All 72 questions from the CSV template
- **Output:** Complete JSON file with detailed answers

---

**That's it!** You're ready to process lease documents and integrate them into your Navy Pier Tenant AI application.
