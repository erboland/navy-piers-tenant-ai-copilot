interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export function generateExecutiveSummary(vendorName: string): Message {
  return {
    role: "assistant",
    content: `# Executive Persona Summary
## ${vendorName}

### Key Financial Highlights

**Annual Performance**
- **Total Revenue (2025):** $2.4M
- **YoY Growth:** +12%
- **Rent Collection Rate:** 100%

**Lease Terms**
- **Base Rent:** $18,500/month
- **Percentage Rent:** 8% on gross sales over $1.5M
- **Lease Expiration:** June 30, 2030

### Key Risks & Flags

🔴 **CRITICAL:** Insurance certificate expires in 6 months (May 31, 2026)

🟡 **ATTENTION:** Upcoming lease renewal negotiation window opens in 90 days

### Performance Scorecard

| Metric | Score | Trend |
|--------|-------|-------|
| Financial Health | A | ↗ Improving |
| Compliance Status | A- | → Stable |
| Lease Adherence | A+ | ✓ Excellent |
| Operational Performance | B+ | ↗ Improving |

### Recent Activity
- Submitted renovation plans for approval (Jan 15, 2026)
- Completed fire safety inspection with no violations (Dec 10, 2025)
- Requested additional parking allocation (Nov 5, 2025)

### Recommended Actions
1. Schedule insurance renewal discussion
2. Initiate lease renewal conversation
3. Review renovation plan timeline
4. Monitor Q1 2026 sales performance`,
    citations: [
      "Lease Agreement - Executed June 1, 2025",
      "Monthly Financial Report - December 2025",
      "Compliance Dashboard - Updated January 2, 2026",
      "Property Management System - Last sync: Today",
    ],
  };
}

export function generateStandardSummary(vendorName: string): Message {
  return {
    role: "assistant",
    content: `# Standard / Detailed Summary
## ${vendorName}

### Lease Abstract

#### Basic Information
- **Tenant Name:** ${vendorName}
- **Premises:** Suite 125, Ground Floor
- **Square Footage:** 2,400 sq ft
- **Use:** Retail food and beverage operations
- **Commencement Date:** June 1, 2025
- **Expiration Date:** June 30, 2030
- **Term:** 5 years

#### Financial Terms

**Rent Structure**
- **Base Rent:** $18,500 per month ($7.71/sq ft)
- **Percentage Rent:** 8% of gross sales exceeding $1,500,000 annually
- **CAM Charges:** $3,200 per month
- **Total Monthly Obligation:** $21,700 (excluding percentage rent)

**Escalations**
- 3% annual increase on base rent effective each anniversary date
- CAM charges adjusted annually based on actual expenses

**Security Deposit**
- Amount: $55,500 (3 months base rent)
- Form: Cash deposit held in escrow

#### Operational Clauses

**Operating Hours**
- Standard: 10:00 AM - 10:00 PM, 7 days per week
- Holiday hours: Per Navy Pier special event schedule
- Early closure permitted with 48-hour notice

**Maintenance Responsibilities**
| Responsibility | Landlord | Tenant |
|----------------|----------|--------|
| Structural Repairs | ✓ | |
| HVAC Maintenance | | ✓ |
| Interior Repairs | | ✓ |
| Common Area Upkeep | ✓ | |
| Utilities (Electric) | | ✓ |
| Utilities (Water/Gas) | ✓ | |

**Insurance Requirements**
- General Liability: $2,000,000 per occurrence
- Property Insurance: Replacement cost coverage
- Workers' Compensation: Statutory limits
- Additional Insured: Navy Pier, Inc.

#### Legal & Compliance

**Use Restrictions**
- Permitted use: Full-service restaurant and bar
- Prohibited uses: Adult entertainment, firearms sales, cannabis retail
- Alcohol service: Licensed for beer, wine, and spirits

**Assignment & Subletting**
- Requires prior written consent from landlord
- Landlord consent not to be unreasonably withheld
- Assignment fee: $5,000 administrative charge

**Default & Remedies**
- Cure period: 10 business days for monetary defaults
- Cure period: 30 days for non-monetary defaults
- Late payment fee: 5% of amount due plus $100 administrative charge

**Termination Rights**
- Landlord: Force majeure, condemnation, or tenant default
- Tenant: None (except for landlord breach after cure period)

#### Current Compliance Status

**Required Certifications** ✓ All Current
- Health Department Permit (Exp: 03/15/2026)
- Liquor License (Exp: 06/30/2026)
- Fire Safety Certificate (Exp: 12/31/2025)
- ADA Compliance Verification (On file)

**Insurance Status**
- General Liability: Current (Exp: 05/31/2026) ⚠️ Renewal due soon
- Property Insurance: Current (Exp: 05/31/2026)
- Workers' Comp: Current (Exp: 12/31/2025)

### Special Provisions

**Exclusive Use Clause**
Tenant has exclusive right to operate full-service Italian cuisine within Navy Pier premises during lease term.

**Co-Tenancy Clause**
If anchor tenant vacates, tenant may reduce base rent by 25% until anchor space is re-leased.

**Renovation Rights**
Tenant approved for kitchen expansion project (estimated completion Q2 2026, budget $175,000).`,
    citations: [
      "Lease Agreement - Executed June 1, 2025, Pages 1-24",
      "First Amendment to Lease - Renovation Approval, January 15, 2026",
      "Insurance Certificate Log - Updated Weekly",
      "Tenant Compliance Database - Real-time sync",
    ],
  };
}

export function generateCustomResponse(question: string, vendorName: string): Message {
  // Simple keyword-based responses for demo purposes
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("revenue") || lowerQuestion.includes("sales") || lowerQuestion.includes("financial")) {
    return {
      role: "assistant",
      content: `## Financial Performance for ${vendorName}

### Revenue Summary
Based on the latest financial data, ${vendorName} has demonstrated strong financial performance:

- **2025 Total Revenue:** $2.4M
- **Q4 2025 Revenue:** $680,000
- **Year-over-Year Growth:** +12%
- **Average Monthly Sales:** $200,000

### Rent Payments
- **Base Rent (Monthly):** $18,500
- **Percentage Rent Triggered:** Yes (8% on sales over $1.5M)
- **2025 Percentage Rent Paid:** $72,000
- **Total Rent Obligation (2025):** $294,000

### Payment History
${vendorName} has maintained a perfect payment record with 100% on-time rent payments for the past 12 months.

### Trend Analysis
The 12% year-over-year growth indicates strong operational performance. Q4 typically represents the highest revenue quarter due to holiday season foot traffic at Navy Pier.`,
      citations: [
        "Monthly Financial Report - December 2025",
        "Percentage Rent Calculation Worksheet - 2025",
        "Payment History Log - Last 12 months",
      ],
    };
  }

  if (lowerQuestion.includes("lease") || lowerQuestion.includes("contract") || lowerQuestion.includes("terms")) {
    return {
      role: "assistant",
      content: `## Lease Information for ${vendorName}

### Current Lease Terms

**Lease Period**
- **Commencement:** June 1, 2025
- **Expiration:** June 30, 2030
- **Remaining Term:** 4 years, 5 months
- **Renewal Options:** Two 5-year options

**Financial Terms**
- **Base Rent:** $18,500/month ($7.71/sq ft)
- **Annual Escalation:** 3%
- **Next Escalation Date:** June 1, 2026
- **New Base Rent (2026):** $19,055/month

### Important Dates

| Event | Date | Days Until |
|-------|------|-----------|
| Insurance Renewal | May 31, 2026 | 148 days |
| Lease Renewal Window Opens | March 31, 2026 | 87 days |
| Annual Rent Increase | June 1, 2026 | 149 days |

### Key Clauses
- **Use Clause:** Retail food & beverage only
- **Assignment:** Requires landlord approval
- **Exclusive Rights:** Italian cuisine exclusivity
- **Co-Tenancy Protection:** 25% rent reduction if anchor tenant vacates`,
      citations: [
        "Lease Agreement - Executed June 1, 2025",
        "Lease Abstract Database",
      ],
    };
  }

  if (lowerQuestion.includes("compliance") || lowerQuestion.includes("permit") || lowerQuestion.includes("insurance")) {
    return {
      role: "assistant",
      content: `## Compliance Status for ${vendorName}

### Current Status: ✓ COMPLIANT

All required certifications and insurance policies are currently valid. However, several items require attention in the coming months.

### Insurance Certificates

| Policy Type | Status | Expiration | Action Required |
|-------------|--------|-----------|-----------------|
| General Liability | ✓ Current | May 31, 2026 | Renewal in 5 months |
| Property Insurance | ✓ Current | May 31, 2026 | Renewal in 5 months |
| Workers' Comp | ✓ Current | Dec 31, 2025 | Renewal in 11 months |

⚠️ **Action Item:** Schedule insurance renewal meeting with ${vendorName} for April 2026.

### Operating Permits

| Permit | Status | Expiration | Issuing Authority |
|--------|--------|-----------|------------------|
| Health Department | ✓ Current | Mar 15, 2026 | Chicago Dept. of Health |
| Liquor License | ✓ Current | Jun 30, 2026 | Illinois Liquor Control |
| Fire Safety | ✓ Current | Dec 31, 2025 | Chicago Fire Dept. |

### Recent Inspections
- **Fire Safety Inspection:** Passed with 0 violations (Dec 10, 2025)
- **Health Inspection:** Passed with minor recommendations (Nov 2, 2025)
- **ADA Compliance:** Verified compliant (Jun 1, 2025)`,
      citations: [
        "Compliance Dashboard - Updated daily",
        "Insurance Certificate Log",
        "Inspection Records Database",
      ],
    };
  }

  // Default response
  return {
    role: "assistant",
    content: `## Response for ${vendorName}

I can help you with information about ${vendorName}, including:

- **Financial Performance:** Revenue, rent payments, and financial trends
- **Lease Details:** Terms, important dates, and renewal information
- **Compliance Status:** Insurance, permits, and inspection records
- **Operational Information:** Hours, square footage, and special provisions

Please ask a specific question, or use one of the quick-start buttons above to generate a comprehensive summary.

### Quick Examples:
- "What is the current revenue for this vendor?"
- "When does the lease expire?"
- "Show me the compliance status"
- "What are the payment terms?"`,
    citations: ["Tenant Database - Navy Pier System"],
  };
}
