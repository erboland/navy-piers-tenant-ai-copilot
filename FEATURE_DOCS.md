# Predefined Q&A Feature Documentation

## Overview

This feature allows the application to provide consistent, predefined answers to specific lease-related questions. When a user asks one of the predefined questions, the system will always return the same accurate answer sourced from the actual lease document.

## How It Works

### 1. Q&A Data Structure

The predefined questions and answers are stored in a JSON file: `src/app/lib/chef-art-smith-qa.json`

```json
{
  "tenant": "Chef Art Smith's Reunion",
  "questions": [
    {
      "question": "What is the legal name of the tenant?",
      "answer": "The legal name of the tenant is Art Smith Reunion, LLC..."
    }
  ]
}
```

### 2. Question Matching

The system uses fuzzy matching to identify when a user's question matches a predefined question:

- Case-insensitive comparison
- Partial matching (e.g., "legal name" will match "What is the legal name of the tenant?")
- Works for both exact matches and similar phrasings

### 3. Current Predefined Questions

For **Chef Art Smith's Reunion**, the following questions have predefined answers:

1. **What is the legal name of the tenant?**
   - Returns: Art Smith Reunion, LLC information

2. **What was the First Lease Year?**
   - Returns: May 11, 2020 (lease commencement date)

3. **What is the Tenant Notice Address?**
   - Returns: Complete mailing address for formal notices

4. **When is the Premises delivery date?**
   - Returns: May 1, 2020 (10 days before lease commencement)

## Usage

### For End Users

1. Select **Chef Art Smith's Reunion** from the vendor dropdown
2. Type any of the predefined questions (exactly or similar phrasing)
3. Receive the consistent, accurate answer

Example queries that will work:
- "What is the legal name of the tenant?"
- "legal name of tenant"
- "tenant legal name"
- "what is the first lease year"
- "first lease year?"
- "tenant notice address"
- "what is the notice address"
- "premises delivery date"
- "when was premises delivered"

### For Developers

To add more predefined Q&A:

1. Edit `src/app/lib/chef-art-smith-qa.json`
2. Add new question-answer pairs to the `questions` array
3. The system will automatically pick them up

Example:
```json
{
  "question": "What is the lease expiration date?",
  "answer": "The lease expires on June 30, 2030, with two 5-year renewal options."
}
```

### Adding Q&A for New Tenants

1. Create a new JSON file: `src/app/lib/[tenant-name]-qa.json`
2. Import it in `src/app/lib/mock-responses.ts`
3. Update the `checkPredefinedQuestions` function to handle the new tenant

## Benefits

- **Consistency**: Same question always gets the same accurate answer
- **Accuracy**: Answers sourced directly from lease documents
- **Speed**: No AI processing needed for known questions
- **Reliability**: No risk of AI hallucination or incorrect interpretation

## Testing

To test the feature:

1. Run the development server: `npm run dev`
2. Select "Chef Art Smith's Reunion" from the dropdown
3. Type each of the four predefined questions
4. Verify you receive consistent, accurate responses

## Data Sources

All answers for Chef Art Smith's Reunion are extracted from:
- **Document**: Chef Art Smith Lease May 11 2020.pdf
- **Pages**: Various sections throughout the 47-page lease agreement
- **Verification**: Cross-referenced with lease abstract and property management system
