# Navy Pier Tenant AI - API Documentation

## Overview
This document outlines the API endpoints and JSON data models required by the Navy Pier Tenant AI front-end application.

---

## Supported Vendors

Currently, the system supports the following Navy Pier tenants:
- **Chef Art Smith's Reunion** (Restaurant, Suite 300)
- **Billy Goat Tavern** (Restaurant & Bar, Suite 210)

---

## Supported Questions by Vendor

### Chef Art Smith's Reunion
The following questions have full structured responses with source citations and confidence levels:

1. What is the legal name of the tenant?
2. What was the First Lease Year?
3. What is the Tenant Notice Address?
4. When is the Premises delivery date?
5. What is the size of the Premises?
6. Is there an Option to Renew and what is it?
7. What is the penalty for the Tenant not submitting their sales in the time?
8. What are the Landlord's Responsibility to Repair?
9. What are the Tenant's Responsibility to Repair?

### Billy Goat Tavern
The following questions have full structured responses:

1. What is the legal name of the tenant?
2. Is there an Option to Renew and what is it?
3. What are the Tenant's Responsibility to Repair?
4. What is the size of the Premises?

### All Vendors (Generic Fallback)
For questions not specifically mapped, the system provides generic responses for:
- Financial performance queries
- General lease terms
- Compliance status
- Operational information

---

## API Endpoints

### 1. Get Vendors List
**Endpoint:** `GET /api/vendors`

**Description:** Returns a list of all available vendors/tenants.

**Response Model:**
```json
{
  "vendors": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "location": "string"
    }
  ]
}
```

**Example Response:**
```json
{
  "vendors": [
    {
      "id": "6",
      "name": "Chef Art Smith's Reunion",
      "type": "Restaurant",
      "location": "Suite 300"
    },
    {
      "id": "7",
      "name": "Billy Goat Tavern",
      "type": "Restaurant & Bar",
      "location": "Suite 210"
    }
  ]
}
```

---

### 2. Chat Query API
**Endpoint:** `POST /api/chat/query`

**Description:** Submits a question about a specific tenant and receives an AI-powered response with structured data.

**Request Model:**
```json
{
  "vendorId": "string",
  "question": "string",
  "sessionId": "string (optional)"
}
```

**Request Example:**
```json
{
  "vendorId": "6",
  "question": "What is the legal name of the tenant?",
  "sessionId": "session-1234567890"
}
```

**Response Model:**
```json
{
  "role": "assistant",
  "content": "string (markdown formatted answer)",
  "structuredData": {
    "question": "string",
    "answer": "string (markdown formatted)",
    "source": {
      "sections": ["string"],
      "pages": ["string"],
      "exactLanguage": "string"
    },
    "interpretation": "string",
    "confidence": {
      "level": "High | Medium | Low",
      "reason": "string"
    },
    "caveats": "string",
    "metadata": {
      "documentId": "string",
      "definitionType": "string",
      "reviewRequired": boolean
    },
    "citations": ["string"]
  },
  "citations": ["string"]
}
```

**Response Example:**
```json
{
  "role": "assistant",
  "content": "Art Smith Reunion, LLC",
  "structuredData": {
    "question": "What is the legal name of the tenant?",
    "answer": "Art Smith Reunion, LLC",
    "source": {
      "sections": ["Lease Parties", "Section 1.1"],
      "pages": ["Page 1"],
      "exactLanguage": "\"TENANT: Art Smith Reunion, LLC, an Illinois limited liability company, doing business as Chef Art Smith's Reunion\""
    },
    "interpretation": "The legal entity name is explicitly stated in the opening section of the lease. The entity is registered in Illinois and operates under the trade name 'Chef Art Smith's Reunion'.",
    "confidence": {
      "level": "High",
      "reason": "Explicitly stated in the lease parties section with no ambiguity or qualifiers."
    },
    "caveats": "None identified.",
    "metadata": {
      "documentId": "Chef_Art_Smith_Lease_May_11_2020",
      "definitionType": "Explicit",
      "reviewRequired": false
    },
    "citations": [
      "Chef Art Smith Lease - Executed May 11, 2020",
      "Lease Parties, Section 1.1 - Page 1"
    ]
  },
  "citations": [
    "Chef Art Smith Lease - Executed May 11, 2020",
    "Lease Parties, Section 1.1 - Page 1"
  ]
}
```

---

### 3. Quick Info Sheet API

#### 3.1 Generate Executive Summary
**Endpoint:** `POST /api/quick-info/executive`

**Description:** Generates an executive-level FAQ-style summary with structured Q&A sections.

**Request Model:**
```json
{
  "vendorId": "string"
}
```

**Request Example:**
```json
{
  "vendorId": "6"
}
```

**Response Model:**
```json
{
  "vendorId": "string",
  "vendorName": "string",
  "summaryType": "executive",
  "questions": [
    {
      "question": "string",
      "answer": "string (markdown formatted)",
      "source": {
        "sections": ["string"],
        "pages": ["string"],
        "exactLanguage": "string"
      },
      "interpretation": "string",
      "confidence": {
        "level": "High | Medium | Low",
        "reason": "string"
      },
      "caveats": "string",
      "metadata": {
        "documentId": "string",
        "definitionType": "string",
        "reviewRequired": boolean
      },
      "citations": ["string"]
    }
  ]
}
```

**Response Example:**
```json
{
  "vendorId": "6",
  "vendorName": "Chef Art Smith's Reunion",
  "summaryType": "executive",
  "questions": [
    {
      "question": "What is the legal name of the tenant?",
      "answer": "Art Smith Reunion, LLC",
      "source": {
        "sections": ["Lease Parties", "Section 1.1"],
        "pages": ["Page 1"],
        "exactLanguage": "\"TENANT: Art Smith Reunion, LLC, an Illinois limited liability company, doing business as Chef Art Smith's Reunion\""
      },
      "interpretation": "The legal entity name is explicitly stated in the opening section of the lease.",
      "confidence": {
        "level": "High",
        "reason": "Explicitly stated in the lease parties section with no ambiguity or qualifiers."
      },
      "caveats": "None identified.",
      "metadata": {
        "documentId": "Chef_Art_Smith_Lease_May_11_2020",
        "definitionType": "Explicit",
        "reviewRequired": false
      },
      "citations": [
        "Chef Art Smith Lease - Executed May 11, 2020",
        "Lease Parties, Section 1.1 - Page 1"
      ]
    }
  ]
}
```

#### 3.2 Generate Detailed Summary
**Endpoint:** `POST /api/quick-info/detailed`

**Description:** Generates a comprehensive detailed summary in markdown format.

**Request Model:**
```json
{
  "vendorId": "string"
}
```

**Response Model:**
```json
{
  "role": "assistant",
  "content": "string (full markdown document with lease abstract)",
  "citations": ["string"]
}
```

**Response Example:**
```json
{
  "role": "assistant",
  "content": "# Detailed Summary\n## Chef Art Smith's Reunion\n\n### Lease Abstract\n\n#### Basic Information\n- **Tenant Name:** Chef Art Smith's Reunion\n- **Premises:** Suite 300, Ground Floor\n- **Square Footage:** 3,200 sq ft\n...",
  "citations": [
    "Lease Agreement - Executed May 11, 2020, Pages 1-24",
    "Insurance Certificate Log - Updated Weekly"
  ]
}
```

---

## Data Models

### Core Types

#### Vendor
```typescript
interface Vendor {
  id: string;
  name: string;
  type: string;
  location: string;
}
```

#### Confidence
```typescript
interface Confidence {
  level: "High" | "Medium" | "Low";
  reason: string;
}
```

#### Source
```typescript
interface Source {
  sections: string[];
  pages: string[];
  exactLanguage: string;
}
```

#### Metadata
```typescript
interface Metadata {
  documentId: string;
  definitionType: string;
  reviewRequired: boolean;
}
```

#### StructuredQAData
```typescript
interface StructuredQAData {
  question: string;
  answer: string;  // Markdown formatted
  source: Source;
  interpretation: string;
  confidence: Confidence;
  caveats: string;
  metadata: Metadata;
  citations: string[];
}
```

#### ChatMessage
```typescript
interface ChatMessage {
  role: "user" | "assistant";
  content: string;  // Markdown formatted
  citations?: string[];
  structuredData?: StructuredQAData;
}
```

#### QuickInfoExecutiveResponse
```typescript
interface QuickInfoExecutiveResponse {
  vendorId: string;
  vendorName: string;
  summaryType: "executive";
  questions: StructuredQAData[];
}
```

#### QuickInfoDetailedResponse
```typescript
interface QuickInfoDetailedResponse {
  role: "assistant";
  content: string;  // Full markdown document
  citations: string[];
}
```

---

## Executive Summary Question Set

Based on the mapping sheet (`product-docs/Sphere AI Lease Queries Nov 4 2025.csv`), the Executive Summary includes the following categories:

1. **Definitions** - Legal name, basic identifiers
2. **Permitted Use** - What the tenant is allowed to operate
3. **Premises** - Location and description
4. **Size** - Square footage
5. **Article III** - Lease term information
   - Term of the Lease
   - Option to Renew
   - Conditions for Renewal
6. **Article V** - Financial terms
   - Base Rental Due date
   - Additional rental/percentage rent due date
7. **Article IX** - Repair responsibilities
   - Landlord's Responsibilities
   - Tenant's Responsibilities
8. **Exhibit M** - Rent schedule
   - Base Rent per year/month
   - CAM per year/month
   - Marketing Fee per year/month
   - Percentage Rent and breakpoint

---

## Response Rendering

### Markdown Support
All `content` and `answer` fields support full Markdown syntax including:
- Headers (H1-H6)
- Bold/Italic text
- Lists (ordered and unordered)
- Tables
- Code blocks
- Blockquotes
- Links

### UI Components
The front-end renders responses using two primary components:

1. **AIMessage Component** (for structured data)
   - Main answer with markdown rendering
   - Collapsible "Source & Evidence" section
   - Collapsible "Interpretation Notes" section
   - Collapsible "Confidence & Caveats" section
   - Footer with citations

2. **ChatMessage Component** (for markdown-only responses)
   - Markdown-rendered content
   - Source citations footer

---

## Error Handling

### Error Response Model
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string (optional)"
  }
}
```

### Common Error Codes
- `VENDOR_NOT_FOUND` - The specified vendor ID does not exist
- `INVALID_REQUEST` - Request payload is malformed
- `QUESTION_NOT_SUPPORTED` - Question cannot be answered (fallback to generic response)
- `SERVER_ERROR` - Internal server error

---

## Notes for Backend Implementation

1. **Markdown Formatting**: All text responses should be formatted in Markdown. The front-end has robust markdown rendering with support for tables, lists, and formatted text.

2. **Confidence Levels**: Always include confidence metadata. This is displayed prominently in the UI.

3. **Citations**: Include specific document references with section and page numbers where possible.

4. **Structured Data**: When a question has a definitive answer from lease documents, always return `structuredData`. This enables the rich accordion UI.

5. **Fallback Responses**: For questions without specific data, return a structured response with generic information and citations to the tenant database.

6. **Session Management**: The chat API supports optional `sessionId` for maintaining conversation context across multiple queries.
