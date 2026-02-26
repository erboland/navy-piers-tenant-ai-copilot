# Navy Pier Tenant Lease Knowledge Base

This directory contains structured knowledge files for Navy Pier tenant leases and agreements. Each file provides comprehensive answers to the standard lease queries from the CSV template.

---

## Available Knowledge Files

### 1. [Chef Art Smith's Reunion](chef-art-smith-lease-knowledge.md)
**Document Type:** Commercial Restaurant Lease - Southern Cuisine
**Tenant:** Art Smith Reunion, LLC (d/b/a Chef Art Smith's Reunion)
**Location:** Suite 300, Ground Floor, Navy Pier
**Term:** 10 years (May 11, 2020 - May 10, 2030) + Two 5-year renewal options
**Size:** 3,200 square feet
**Key Features:**
- Southern cuisine specialization
- Two 5-year renewal options (potential 20-year occupancy)
- 12-month renewal notice requirement
- Comprehensive sales reporting with penalties
- Base rent + CAM + Marketing Fee + Percentage Rent

---

### 2. [Billy Goat Tavern](billy-goat-tavern-lease-knowledge.md)
**Document Type:** Commercial Restaurant & Bar Lease
**Tenant:** Billy Goat Tavern (Navy Pier), LLC
**Location:** Suite 210, Ground Floor, Navy Pier
**Term:** 10 years (June 1, 2022 - May 31, 2032) + One 5-year renewal option
**Size:** 2,850 square feet
**Key Features:**
- Full-service restaurant and bar operations
- One 5-year renewal option (potential 15-year occupancy)
- 180-day renewal notice requirement
- Detailed financial schedule with 5% biennial escalations
- Base rent: $15,000/mo (Year 1) to $18,233/mo (Year 10)
- Percentage rent: 6% over $3.7M breakpoint

---

### 3. [Chicago Shakespeare Theater - Parking Agreement](navy-pier-parking-knowledge.md)
**Document Type:** Parking Access and Discount Agreement
**Tenant:** Chicago Shakespeare Theater (CST)
**Location:** Navy Pier Parking Facilities (East & West Garages)
**Term:** Co-extensive with 1997 and 2016 theater leases
**Size:** Up to 417 parking spaces (15 free + 350 performance + 52 production)
**Key Features:**
- 15 free parking spaces
- 30% discount on up to 402 additional spaces
- Performance parking for three theaters
- Production/rehearsal parking (seasonal)
- **Note:** This is NOT a traditional lease - it's a parking access agreement

---

## Document Structure

Each knowledge file follows the same structure based on the standard lease queries:

### Sections Included:

1. **Executive Summary** - Overview of the agreement
2. **Definitions** - Legal name, trade name, premises, permitted use, etc.
3. **Article II - Delivery** - Commencement dates, delivery conditions
4. **Article III - Term** - Lease term, renewal options, conditions
5. **Article IV - Operating Hours** - Operating requirements
6. **Article V - Rent & Financial Terms** - Rent schedules, payment terms, sales reporting
7. **Article VII - Improvements** - Tenant improvement timelines
8. **Article VIII - Services** - Exterminator and other services
9. **Article IX - Repairs** - Landlord and tenant repair responsibilities
10. **Article XI - Sponsorships** - Exclusive sponsorship provisions
11. **Article XII - Utilities** - Utility responsibilities
12. **Article XVI - Assignment** - Transfer and assignment conditions
13. **Article XVII - Default** - Events of default and remedies
14. **Article XVIII - Miscellaneous** - Inspection, relocation, force majeure
15. **Exhibit A - Premises** - Floor plans
16. **Exhibit K - Insurance** - Insurance requirements
17. **Exhibit M - Rent Schedule** - Detailed financial schedules
18. **Critical Dates & Deadlines** - Important dates summary
19. **Key Risks & Opportunities** - Strategic analysis

---

## Answer Format

Each question includes:

- **Answer:** Concise response to the question
- **Details:** Additional context and specifics
- **Source:** Lease section and page references
- **Exact Language:** Direct quotes from the lease document
- **Interpretation:** Practical implications and explanations
- **Confidence Level:** High/Medium/Low (where applicable)
- **Caveats:** Warnings, ambiguities, or limitations
- **Review Required Flag:** ⚠️ for items needing legal review

---

## Question Coverage by CSV Template

All files answer the 72 standard questions from:
`product-docs/Sphere AI Lease Queries Nov 4 2025.csv`

### Question Categories:
- Full Lease Abstract & Executive Summary
- Definitions (8 questions)
- Article II - Delivery (2 questions)
- Article III - Term (3 questions)
- Article IV - Operating Hours (1 question)
- Article V - Rent & Financial (10 questions)
- Article VII - Improvements (1 question)
- Article VIII - Services (1 question)
- Article IX - Repairs (8 questions)
- Article XI - Sponsorships (1 question)
- Article XII - Utilities (4 questions)
- Article XVI - Assignment (1 question)
- Article XVII - Default (2 questions)
- Article XVIII - Miscellaneous (3 questions)
- Exhibit A - Premises (1 question)
- Exhibit K - Insurance (3 questions)
- Exhibit M - Rent Schedule (7 questions)

**Total: 72 questions** answered per lease (where applicable)

---

## Data Completeness

### Chef Art Smith's Reunion
- **Questions Answered:** 60 of 72
- **Confidence:** High for answered questions
- **Missing Data:** Some Exhibit M financial details, certain Article provisions
- **Review Required:** 4 questions flagged for legal review
- **Source Document:** Chef_Art_Smith_Lease_May_11_2020

### Billy Goat Tavern
- **Questions Answered:** 62 of 72
- **Confidence:** High for answered questions
- **Missing Data:** Some Article provisions not in available extracts
- **Review Required:** 0 questions flagged (complete financial data)
- **Source Document:** BILLY_GOAT_LEASE_2022

### Navy Pier Parking Agreement
- **Questions Answered:** 17 relevant questions
- **Confidence:** High for answered questions
- **Not Applicable:** 55 questions (parking agreement, not traditional lease)
- **Review Required:** 3 questions flagged for legal review
- **Source Document:** NAVY_PIER_PARKING_AGREEMENT_2016

---

## Integration with Application

These knowledge files are derived from JSON Q&A files located at:
- `src/app/lib/chef-art-smith-qa.json`
- `src/app/lib/billy-goat-tavern-qa.json`
- `src/app/lib/navy-pier-parking-qa.json`

### To Integrate:

1. **For AI/LLM Applications:**
   - Use these Markdown files as knowledge base context
   - Feed to RAG (Retrieval-Augmented Generation) systems
   - Index for semantic search

2. **For Web Applications:**
   - Import the JSON files in `enhanced-mock-responses.ts`
   - Reference these Markdown files for documentation
   - Display formatted answers from JSON data

3. **For Documentation:**
   - Share these Markdown files with stakeholders
   - Use for lease comparisons and analysis
   - Reference during lease negotiations

---

## Usage Examples

### Finding Rent Information
```markdown
See: Exhibit M - Rent Schedule section in each file

Billy Goat Tavern:
- Base Rent: $15,000/mo (Year 1) → $18,233/mo (Year 10)
- CAM: $2,375/mo (Year 1) → $2,887/mo (Year 10)
- Marketing Fee: $1,188/mo (Year 1) → $1,443/mo (Year 10)
- Percentage Rent: 6% over $3.7M breakpoint
```

### Comparing Renewal Options
```markdown
Chef Art Smith: Two 5-year renewals (12-month notice)
Billy Goat Tavern: One 5-year renewal (180-day notice)
Navy Pier Parking: Follows theater lease renewals (not explicit)
```

### Understanding Repair Responsibilities
```markdown
See: Article IX - Repairs section in each file

Landlord: Structural, roof, exterior, base building systems
Tenant: Interior, equipment, restaurant-specific (grease trap, hood, pest)
```

---

## Critical Dates Reference

### Chef Art Smith's Reunion
- Commencement: May 11, 2020
- Initial expiration: May 10, 2030
- First renewal notice deadline: May 10, 2029 (12 months before)
- Final possible expiration: May 10, 2040 (if both renewals exercised)

### Billy Goat Tavern
- Commencement: June 1, 2022
- Initial expiration: May 31, 2032
- Renewal notice deadline: December 3, 2031 (180 days before)
- Final possible expiration: May 31, 2037 (if renewal exercised)

### Navy Pier Parking
- Effective Date: February 5, 2016
- Expiration: When either theater lease expires (whichever first)

---

## Comparison Matrix

| Feature | Chef Art Smith | Billy Goat | Parking Agreement |
|---------|---------------|------------|-------------------|
| **Size** | 3,200 sq ft | 2,850 sq ft | 417 spaces (max) |
| **Base Rent (Year 1)** | See Exhibit M | $15,000/mo | No base rent |
| **Term** | 10 years | 10 years | Co-extensive |
| **Renewals** | 2×5 years | 1×5 years | Follows leases |
| **Renewal Notice** | 12 months | 180 days | Not specified |
| **Percentage Rent** | See Exhibit M | 6% over $3.7M | N/A |
| **Sales Report Penalty** | $500 + $100/day | $250 + $50/day | N/A |
| **Permitted Use** | Southern cuisine | Restaurant & bar | Theater parking |

---

## Files in This Directory

```
knowledge/
├── README.md (this file)
├── chef-art-smith-lease-knowledge.md
├── billy-goat-tavern-lease-knowledge.md
└── navy-pier-parking-knowledge.md
```

---

## Source Documents

### Original Lease PDFs
Located in `product-docs/` directory:
- Chef Art Smith Lease May 11 2020.pdf
- Billy Goat Lease 2022.pdf
- Navy Pier Parking Agreement.pdf

### Question Template
- `product-docs/Sphere AI Lease Queries Nov 4 2025.csv`

### JSON Q&A Files
Located in `src/app/lib/` directory:
- `chef-art-smith-qa.json`
- `billy-goat-tavern-qa.json`
- `navy-pier-parking-qa.json`

---

## Update History

| Date | Version | Changes |
|------|---------|---------|
| Feb 26, 2026 | 1.0 | Initial creation of all three knowledge files from JSON Q&A data |

---

## Contact & Support

For questions about these knowledge files or the lease data:
- Review the [LEASE_PROCESSING_COMPLETE.md](../LEASE_PROCESSING_COMPLETE.md) document
- Check the [scripts/README.md](../scripts/README.md) for processing documentation
- Examine the source JSON files for raw data

---

**Knowledge Base Status:** ✅ Complete and ready for use
**Last Updated:** February 26, 2026
**Documents:** 3 lease/agreement knowledge files
**Total Questions Answered:** 139 across all documents
