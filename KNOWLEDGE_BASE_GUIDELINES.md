# Knowledge Base Maintenance Guidelines

**Document Version:** 1.0
**Last Updated:** February 27, 2026
**Maintainer:** Navy Pier AI Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure Requirements](#file-structure-requirements)
3. [Adding New Leases](#adding-new-leases)
4. [Adding New Questions](#adding-new-questions)
5. [Quality Standards](#quality-standards)
6. [Review Process](#review-process)
7. [Integration Workflow](#integration-workflow)
8. [Versioning & Updates](#versioning--updates)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Overview

The Navy Pier Tenant AI Knowledge Base consists of structured Markdown files that provide comprehensive answers to standard lease questions. This guide ensures consistency, quality, and maintainability as the knowledge base grows.

### Knowledge Base Components

```
knowledge/
├── README.md                              # Index and navigation
├── {tenant-name}-lease-knowledge.md       # Individual tenant files
└── KNOWLEDGE_BASE_GUIDELINES.md           # This document

src/app/lib/
├── {tenant-name}-qa.json                  # Source JSON data
└── enhanced-mock-responses.ts             # Application integration
```

### Document Relationships

```
PDF Lease → JSON Q&A → Markdown Knowledge → Application Integration
   ↓           ↓            ↓                    ↓
Original    Structured   Human-Readable      User-Facing
Document      Data        Reference            Responses
```

---

## File Structure Requirements

### Markdown Knowledge File Structure

Every lease knowledge file MUST follow this structure:

```markdown
# {Tenant Name} - Lease Knowledge Base

**Document ID:** {UNIQUE_IDENTIFIER}
**Tenant:** {Legal Entity Name}
**Location:** {Suite/Location Information}
**Lease Type:** {Type Description}

---

## Executive Summary
[3-5 paragraph overview]

---

## Important Note
[For non-standard agreements like parking agreements]

---

## Definitions
### Legal Name of Tenant
**Answer:** [Concise response]
**Details:** [Additional context]
**Source:** [Section and page references]
**Exact Language:** "[Direct quote]"
**Interpretation:** [Practical implications]
**Confidence Level:** High/Medium/Low
**Caveats:** [Warnings/limitations]
**⚠️ Review Required** [If applicable]

[Repeat for all definition questions]

---

## Article II - Delivery
[Delivery questions with same format]

---

## Article III - Term
[Term questions with same format]

[Continue through all articles...]

---

## Critical Dates & Deadlines
| Date | Event |
|------|-------|
| ... | ... |

---

## Key Risks & Opportunities
### Risks
- [List of risks]

### Opportunities
- [List of opportunities]

---

## Document References
- **Document ID:**
- **Execution Date:**
- **Landlord:**
- **Tenant:**
- **Total Pages:**
- **Key Exhibits:**

---

**Last Updated:** [Date]
**Status:** [Complete/In Progress/Review Required]
```

### Required Sections (Minimum)

Every knowledge file MUST include:
1. ✅ Header with tenant metadata
2. ✅ Executive Summary
3. ✅ Definitions section
4. ✅ Article sections matching CSV template
5. ✅ Critical Dates & Deadlines table
6. ✅ Risks & Opportunities analysis
7. ✅ Document References
8. ✅ Footer with update date and status

### Optional Sections

May include based on lease type:
- Important Notes (for non-standard agreements)
- Comparison tables (for multi-location tenants)
- Calculation examples (for complex financial terms)
- Cross-references (to related agreements)

---

## Adding New Leases

### Step 1: Process the Lease PDF

**Using the Automated Script:**

```bash
# Set API key
export ANTHROPIC_API_KEY=your_api_key_here

# Process the lease
pnpm process-lease "path/to/lease.pdf" "Tenant Name" "Location"

# Example:
pnpm process-lease "product-docs/New Tenant Lease 2026.pdf" "New Tenant LLC" "Suite 400"
```

This generates:
- `src/app/lib/new-tenant-llc-qa.json` (structured data)
- Updates `src/app/lib/mock-data.ts` (adds vendor)

**Manual Processing (if script unavailable):**

1. Read the lease document thoroughly
2. Create JSON file using this template: `src/app/lib/chef-art-smith-qa.json`
3. Answer all 72 questions from the CSV template
4. Include exact language, sources, and interpretations

### Step 2: Generate Markdown Knowledge File

**From JSON to Markdown:**

```bash
# Use the JSON file as reference
# Create new markdown file in knowledge/ directory
cp knowledge/chef-art-smith-lease-knowledge.md knowledge/new-tenant-lease-knowledge.md

# Edit the file with the new tenant's information
```

**Required File Naming Convention:**

```
{tenant-name-lowercase-hyphenated}-lease-knowledge.md

Examples:
✅ chef-art-smith-lease-knowledge.md
✅ billy-goat-tavern-lease-knowledge.md
✅ navy-pier-parking-knowledge.md
❌ Chef_Art_Smith.md (wrong casing and format)
❌ lease-knowledge.md (missing tenant name)
```

### Step 3: Update the Index

Edit `knowledge/README.md` to add the new tenant:

```markdown
### 4. [New Tenant Name](new-tenant-lease-knowledge.md)
**Document Type:** [Type]
**Tenant:** [Legal Name]
**Location:** [Location]
**Term:** [Term details]
**Size:** [Square footage]
**Key Features:**
- [Feature 1]
- [Feature 2]
```

Update comparison tables and statistics:

```markdown
| Feature | Chef Art Smith | Billy Goat | New Tenant |
|---------|---------------|------------|------------|
| **Size** | 3,200 sq ft | 2,850 sq ft | X,XXX sq ft |
| **Base Rent (Year 1)** | See Exhibit M | $15,000/mo | $X,XXX/mo |
```

### Step 4: Quality Check

Run through this checklist:

- [ ] All 72 CSV questions addressed (or marked N/A)
- [ ] Exact language quotes include section and page references
- [ ] Confidence levels assigned (High/Medium/Low)
- [ ] Caveats identified for ambiguous items
- [ ] Review flags (⚠️) added where needed
- [ ] Critical dates table complete and accurate
- [ ] Risks and opportunities analyzed
- [ ] Document formatted consistently
- [ ] Markdown syntax valid (no broken links)
- [ ] Spell check completed
- [ ] Legal terms used correctly

### Step 5: Commit and Document

```bash
# Add files
git add knowledge/new-tenant-lease-knowledge.md
git add knowledge/README.md
git add src/app/lib/new-tenant-qa.json

# Commit with descriptive message
git commit -m "Add knowledge base for New Tenant LLC lease

Created comprehensive knowledge file answering 72 standard lease questions for New Tenant LLC (X,XXX sq ft restaurant/retail space).

Key terms:
- Term: X years + Y renewal options
- Base rent: $X,XXX/mo starting
- Location: Suite XXX, Navy Pier

Includes executive summary, detailed Q&A by article, critical dates, and risk analysis. Derived from lease executed [date].

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Adding New Questions

### When to Add New Questions

Add new questions when:
- ✅ Client requests additional lease analysis
- ✅ Regulatory requirements change
- ✅ New lease clauses become standard
- ✅ Recurring user questions emerge
- ✅ Industry best practices evolve

### How to Add Questions

**Step 1: Update the CSV Template**

Edit `product-docs/Sphere AI Lease Queries Nov 4 2025.csv`:

```csv
Article XIX,
What is the [New Topic] defined as?,What is the [New Topic] defined as?
```

**Step 2: Update JSON Files**

Add to each `{tenant}-qa.json`:

```json
{
  "question": "What is the [New Topic] defined as?",
  "answer": "[Concise answer]",
  "sections": ["Section X.X", "Article XIX"],
  "pages": ["Page XX"],
  "exactLanguage": "\"[Direct quote from lease]\"",
  "interpretationNotes": "[Practical explanation]",
  "confidence": "High|Medium|Low",
  "confidenceReason": "[Why this confidence level]",
  "caveats": "[Any warnings or limitations]",
  "documentId": "DOCUMENT_ID",
  "definitionType": "Explicit|Implicit|Inferred|Not Found",
  "reviewRequired": true|false
}
```

**Step 3: Update Markdown Files**

Add new section to each knowledge file:

```markdown
## Article XIX - [New Topic]

### [New Topic] Definition

**Answer:** [Concise response]

**Details:**
- [Detail 1]
- [Detail 2]

**Source:** Section X.X - [Section Name] (Page XX)

**Exact Language:** "[Direct quote from lease]"

**Interpretation:** [Practical implications and explanations]

**Confidence Level:** High

**Caveats:** [Any warnings, ambiguities, or limitations]
```

**Step 4: Update README**

Add to question coverage section in `knowledge/README.md`:

```markdown
- Article XIX - [New Topic] (1 question)
```

Update total question count.

**Step 5: Document the Change**

Create a changelog entry:

```markdown
## [Version 1.1] - 2026-XX-XX

### Added
- New question: "What is the [New Topic] defined as?"
- Coverage for Article XIX provisions
- [Number] new answers across [number] lease files

### Changed
- Updated CSV template to version 1.1
- Expanded question coverage from 72 to [new total]
```

---

## Quality Standards

### Answer Quality Requirements

Every answer MUST meet these standards:

#### 1. Accuracy
- ✅ Direct quotes from source document
- ✅ Correct section and page references
- ✅ Verified against original lease
- ❌ No paraphrasing without quotes
- ❌ No assumptions or guesses

#### 2. Completeness
- ✅ Answers the full question
- ✅ Includes relevant context
- ✅ Identifies all applicable sections
- ❌ No partial answers without explanation
- ❌ No important details omitted

#### 3. Clarity
- ✅ Written in plain language
- ✅ Technical terms defined
- ✅ Structure aids understanding
- ❌ No legal jargon without explanation
- ❌ No ambiguous language

#### 4. Consistency
- ✅ Follows template structure
- ✅ Uses standard terminology
- ✅ Maintains formatting conventions
- ❌ No deviations from format
- ❌ No inconsistent naming

### Confidence Level Guidelines

**High Confidence:**
- Direct, explicit language in lease
- Unambiguous definition
- Single authoritative source
- No interpretation required

**Medium Confidence:**
- Implicit or inferred from context
- Multiple sources that align
- Minor interpretation required
- Industry standard application

**Low Confidence:**
- Not explicitly stated
- Conflicting information
- Significant interpretation needed
- Unusual or non-standard terms

### Definition Type Guidelines

**Explicit:**
- Directly stated in lease
- Formal definition provided
- Clear and unambiguous

**Implicit:**
- Implied by lease structure
- Standard industry interpretation
- Logically follows from other terms

**Inferred:**
- Requires analysis and interpretation
- Based on context and practice
- Not directly stated

**Not Found:**
- Information not in document
- Question not applicable
- No basis for answer

### Review Required Flags

Mark with ⚠️ **Review Required** when:
- Complex financial calculations
- Unusual or non-standard provisions
- Potential legal ambiguities
- Conflicting sections
- High-stakes obligations
- Penalty provisions
- Default consequences
- Assignment restrictions

---

## Review Process

### Self-Review Checklist

Before submitting for review, verify:

**Content Review:**
- [ ] All answers accurate and complete
- [ ] Exact language matches source document
- [ ] Section/page references correct
- [ ] Interpretations reasonable and justified
- [ ] Caveats identify all risks and ambiguities
- [ ] No information gaps or "TBD" placeholders

**Format Review:**
- [ ] Follows template structure exactly
- [ ] Markdown syntax valid
- [ ] Tables properly formatted
- [ ] Links work correctly
- [ ] Consistent heading levels
- [ ] No formatting errors

**Quality Review:**
- [ ] Confidence levels appropriate
- [ ] Definition types correct
- [ ] Review flags placed correctly
- [ ] Critical dates accurate
- [ ] Risks/opportunities comprehensive
- [ ] Executive summary reflects content

### Peer Review Process

**For New Lease Additions:**

1. **Technical Review** (Developer)
   - Verify JSON structure
   - Check markdown formatting
   - Test application integration
   - Validate data completeness

2. **Legal Review** (Legal Team/Subject Matter Expert)
   - Verify lease interpretation accuracy
   - Confirm risk assessments
   - Review flagged items
   - Validate legal terminology

3. **Business Review** (Property Management)
   - Confirm practical implications
   - Verify critical dates
   - Review financial terms
   - Check tenant information

**For Question Additions:**

1. **Relevance Review**
   - Question addresses real need
   - Applicable to multiple leases
   - Adds meaningful value
   - Not redundant with existing questions

2. **Feasibility Review**
   - Information typically available in leases
   - Can be consistently answered
   - Has clear definition
   - Worth the effort to maintain

### Review Approval

**Approval Requirements:**
- ✅ Technical reviewer sign-off
- ✅ Legal reviewer sign-off (for new leases)
- ✅ Business reviewer sign-off (for significant changes)
- ✅ All review comments addressed
- ✅ Quality checklist completed

**Approval Process:**

```bash
# Create pull request
git checkout -b knowledge-base/new-tenant-lease
git push origin knowledge-base/new-tenant-lease

# Request reviews on GitHub
# Address feedback
# Merge after approval
```

---

## Integration Workflow

### Application Integration Steps

**Step 1: Import JSON Data**

Edit `src/app/lib/enhanced-mock-responses.ts`:

```typescript
// Add import
import newTenantQA from './new-tenant-qa.json';

// Add to checkPredefinedQuestions function
if (vendorName.toLowerCase().includes('new tenant') ||
    vendorName.toLowerCase().includes('new tenant llc')) {
  for (const qa of newTenantQA.questions) {
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
        citations: [`${newTenantQA.tenant} Lease - ${qa.sections.join(', ')}`],
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

**Step 2: Add Vendor to Mock Data**

Edit `src/app/lib/mock-data.ts`:

```typescript
{
  id: "9",
  name: "New Tenant LLC",
  type: "Restaurant|Retail|Entertainment",
  location: "Suite XXX"
}
```

**Step 3: Test Integration**

```bash
# Start development server
pnpm dev

# Test queries:
# - "What is the legal name of the tenant?"
# - "What is the term of the lease?"
# - "When is base rent due?"

# Verify:
# ✅ Answers display correctly
# ✅ Citations show up
# ✅ Structured data complete
# ✅ Confidence levels visible
```

**Step 4: Update API Documentation**

Edit `BACKEND_API_CONTRACT.md` or `API_DOCUMENTATION.md`:

```markdown
### Supported Tenants

| Tenant | Coverage | Questions Answered |
|--------|----------|-------------------|
| ... | ... | ... |
| New Tenant LLC | Complete | 72 |
```

---

## Versioning & Updates

### Version Numbering

Knowledge base follows semantic versioning:

```
MAJOR.MINOR.PATCH

Examples:
1.0.0 - Initial release (3 tenants)
1.1.0 - Added new tenant (4 tenants)
1.1.1 - Fixed typos in Billy Goat file
2.0.0 - Added 10 new questions (breaking change to structure)
```

**Version Guidelines:**

- **MAJOR:** Breaking changes (new question structure, file reorganization)
- **MINOR:** New tenants, new questions (backward compatible)
- **PATCH:** Corrections, clarifications, formatting fixes

### Update Process

**For Corrections/Clarifications (PATCH):**

1. Identify the error or unclear section
2. Update affected markdown files
3. Update corresponding JSON files
4. Update "Last Updated" date in footer
5. Commit with descriptive message
6. No version change needed for minor fixes

**For New Content (MINOR):**

1. Add new lease or questions
2. Update all affected files
3. Update README.md
4. Increment MINOR version in README
5. Create changelog entry
6. Commit and tag release

**For Structural Changes (MAJOR):**

1. Document breaking changes
2. Create migration guide
3. Update all files to new structure
4. Increment MAJOR version
5. Create detailed changelog
6. Announce to team
7. Update dependent systems

### Changelog Format

Maintain `KNOWLEDGE_BASE_CHANGELOG.md`:

```markdown
# Knowledge Base Changelog

## [1.1.0] - 2026-03-15

### Added
- New Tenant LLC lease knowledge file (72 questions)
- Parking space allocation question across all leases
- Financial comparison table in README

### Changed
- Updated Billy Goat CAM calculations for accuracy
- Improved Executive Summary format
- Enhanced risk analysis sections

### Fixed
- Corrected Chef Art Smith renewal notice deadline
- Fixed broken links in Navy Pier Parking file
- Typo in Billy Goat percentage rent calculation

## [1.0.0] - 2026-02-27

### Added
- Initial knowledge base with 3 tenants
- 72-question coverage from CSV template
- Comprehensive guidelines documentation
```

---

## Troubleshooting

### Common Issues

#### Issue: Missing Information in Lease

**Problem:** Lease doesn't contain answer to standard question

**Solution:**
1. Mark answer as "Information not available in the provided lease extracts"
2. Set definition type to "Not Found"
3. Set confidence to "High" (high confidence it's not there)
4. Add caveat explaining typical location or impact
5. Flag for follow-up with property management

**Example:**
```markdown
**Answer:** Information not available in the provided lease extracts.

**Status:** This information would typically be found in Article IV (Operating Hours) but was not included in the available lease sections.

**Confidence Level:** High (high confidence information is not available)

**Caveat:** Without operating hours defined, tenant flexibility may be implied, or hours may be governed by Navy Pier facility hours. Recommend clarifying with property management.
```

#### Issue: Conflicting Information

**Problem:** Different sections of lease provide conflicting information

**Solution:**
1. Document both sources clearly
2. Note the conflict explicitly
3. Provide best interpretation
4. Flag with ⚠️ Review Required
5. Set confidence to Medium or Low
6. Recommend legal review

**Example:**
```markdown
**Answer:** Conflicting information found - requires legal review.

**Source 1:** Section 2.1 states term ends "May 31, 2030" (Page 3)
**Source 2:** Exhibit A states term ends "May 30, 2030" (Page 45)

**Interpretation:** The most likely date is May 31, 2030 based on the primary lease term section, with Exhibit A containing a typographical error. However, this discrepancy should be resolved through lease amendment.

**Confidence Level:** Medium

**⚠️ Review Required:** Legal review recommended to resolve conflicting dates.
```

#### Issue: Ambiguous Language

**Problem:** Lease uses unclear or ambiguous terms

**Solution:**
1. Quote the exact language
2. Provide reasonable interpretation
3. Note ambiguity explicitly
4. Identify potential impacts
5. Set appropriate confidence level
6. Flag if high-stakes

**Example:**
```markdown
**Answer:** [Provide best interpretation]

**Exact Language:** "Tenant shall maintain the Premises in 'good condition'"

**Interpretation:** The term "good condition" is subjective and not defined in the lease. Industry standard interpretation would be functional, clean, and free from damage beyond normal wear and tear. However, this could be subject to dispute.

**Confidence Level:** Medium

**Caveat:** The ambiguous "good condition" standard may lead to disputes about maintenance obligations. Recommend establishing clear written standards with property management.
```

#### Issue: JSON/Markdown Sync

**Problem:** JSON and Markdown files out of sync

**Solution:**
1. Identify which is more current/accurate
2. Update the other to match
3. Verify consistency across all questions
4. Run validation checks
5. Document the sync in commit message

**Prevention:**
- Always update both JSON and MD together
- Use JSON as source of truth
- Generate MD from JSON when possible
- Include sync verification in review checklist

### Validation Scripts

**Check File Completeness:**

```bash
# Count questions in JSON
jq '.questions | length' src/app/lib/chef-art-smith-qa.json

# Should output: 60 (or expected count)

# Check for "TBD" or placeholder text
grep -r "TBD\|TODO\|FIXME" knowledge/

# Should output: nothing (or identify items to complete)
```

**Validate Markdown Syntax:**

```bash
# Install markdown linter
npm install -g markdownlint-cli

# Run validation
markdownlint knowledge/*.md

# Fix issues automatically
markdownlint --fix knowledge/*.md
```

**Check Link Integrity:**

```bash
# Install link checker
npm install -g markdown-link-check

# Check all links
markdown-link-check knowledge/README.md
markdown-link-check knowledge/chef-art-smith-lease-knowledge.md
# etc.
```

---

## Best Practices

### Writing Guidelines

**DO:**
- ✅ Use clear, concise language
- ✅ Define technical terms
- ✅ Provide context and examples
- ✅ Quote exact lease language
- ✅ Cite sources accurately
- ✅ Identify risks and caveats
- ✅ Use consistent formatting
- ✅ Include practical implications

**DON'T:**
- ❌ Use legal jargon without explanation
- ❌ Make assumptions without basis
- ❌ Omit important details
- ❌ Skip source citations
- ❌ Ignore ambiguities
- ❌ Copy from other tenants without verification
- ❌ Leave placeholder text
- ❌ Forget to update dates

### Maintenance Schedule

**Monthly:**
- Review flagged items (⚠️ Review Required)
- Check for new questions from users
- Update any corrected information
- Validate link integrity

**Quarterly:**
- Review all critical dates
- Verify lease status changes
- Update financial calculations
- Review and update risk assessments

**Annually:**
- Comprehensive review of all files
- Update formatting to latest standards
- Verify all sources still accurate
- Major version update if needed

### Documentation Standards

**File Naming:**
```
✅ lowercase-with-hyphens.md
❌ CamelCase.md
❌ underscore_separated.md
❌ spaces in names.md
```

**Headings:**
```markdown
✅ # Primary Heading (H1) - once per file
✅ ## Secondary Heading (H2) - major sections
✅ ### Tertiary Heading (H3) - subsections
❌ #### (H4) - avoid unless necessary
```

**Lists:**
```markdown
✅ Consistent bullet type within section
✅ Proper indentation (2 spaces)
✅ Parallel structure
❌ Mixing bullets (-, *, +)
❌ Inconsistent formatting
```

**Tables:**
```markdown
✅ Aligned columns
✅ Header row
✅ Separator row
❌ Misaligned content
❌ Missing headers
```

**Code Blocks:**
```markdown
✅ Specify language for syntax highlighting
✅ Use fenced code blocks (```)
❌ Indented code blocks (hard to maintain)
```

### Collaboration Tips

**For Contributors:**
- Review existing files before adding new content
- Ask questions in pull requests
- Document your reasoning in commit messages
- Test application integration before submitting
- Respond promptly to review feedback

**For Reviewers:**
- Focus on accuracy first, formatting second
- Provide constructive feedback
- Suggest improvements, not just corrections
- Approve quickly when ready
- Document review in PR comments

**For Maintainers:**
- Keep guidelines updated
- Respond to questions quickly
- Share knowledge and expertise
- Recognize quality contributions
- Maintain consistent standards

---

## Quick Reference

### Standard Question Categories (72 Total)

| Category | Count | Articles |
|----------|-------|----------|
| Definitions | 8 | - |
| Delivery | 2 | Article II |
| Term | 3 | Article III |
| Operating Hours | 1 | Article IV |
| Rent & Financial | 10 | Article V |
| Improvements | 1 | Article VII |
| Services | 1 | Article VIII |
| Repairs | 8 | Article IX |
| Sponsorships | 1 | Article XI |
| Utilities | 4 | Article XII |
| Assignment | 1 | Article XVI |
| Default | 2 | Article XVII |
| Miscellaneous | 3 | Article XVIII |
| Premises | 1 | Exhibit A |
| Insurance | 3 | Exhibit K |
| Rent Schedule | 7 | Exhibit M |

### File Templates

**Quick Start - New Lease:**
```bash
# Copy template
cp knowledge/chef-art-smith-lease-knowledge.md knowledge/new-tenant-lease-knowledge.md

# Edit with new information
# Update all sections
# Replace all references to Chef Art Smith

# Add to index
# Edit knowledge/README.md
```

**Quick Start - New Question:**
```bash
# Add to CSV
echo "Article XX,New Question?,New Question?" >> product-docs/Sphere\ AI\ Lease\ Queries\ Nov\ 4\ 2025.csv

# Update each JSON file
# Add new question object

# Update each MD file
# Add new section

# Update README
# Increment question count
```

### Contact Information

**Questions about:**
- **Technical Implementation:** Development Team
- **Legal Accuracy:** Legal Team
- **Business Requirements:** Property Management Team
- **Process/Guidelines:** Knowledge Base Maintainer

---

## Appendix

### Glossary

**Terms used in this guide:**

- **Confidence Level:** Assessment of answer certainty (High/Medium/Low)
- **Definition Type:** How information is stated in lease (Explicit/Implicit/Inferred/Not Found)
- **Review Required:** Flag indicating legal or expert review needed
- **Caveat:** Warning or limitation about the answer
- **Exact Language:** Direct quote from lease document
- **Source:** Lease section and page where information found

### Resources

**Tools:**
- Markdown editor: VS Code with Markdown extensions
- JSON validator: jq, jsonlint
- Markdown linter: markdownlint-cli
- Link checker: markdown-link-check

**References:**
- Original CSV: `product-docs/Sphere AI Lease Queries Nov 4 2025.csv`
- Processing script: `scripts/process-lease.ts`
- Example files: All files in `knowledge/` directory
- Integration guide: `LEASE_PROCESSING_COMPLETE.md`

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-27 | Initial guidelines document |

---

**Document Owner:** Navy Pier AI Development Team
**Last Review:** February 27, 2026
**Next Review:** May 27, 2026 (Quarterly)
**Status:** ✅ Active
