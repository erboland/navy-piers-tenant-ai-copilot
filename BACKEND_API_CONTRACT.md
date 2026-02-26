# Backend API Contract

**Version:** 1.0
**Last Updated:** 2026-02-26
**Status:** Ready for Implementation

## Overview

This document defines the REST API contract between the Navy Pier Tenant AI Copilot frontend and backend. The frontend is already prepared to consume these endpoints - the backend team should implement endpoints matching these exact specifications.

## Base URL

**Development:** `http://localhost:3001/api/v1`
**Production:** `https://your-domain.com/api/v1`

## Authentication

No authentication required for MVP. Future versions may add API key or session-based auth.

## Common Response Format

All successful responses follow this structure:

```json
{
  "success": true,
  "data": {
    /* endpoint-specific data */
  }
}
```

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": {} // Optional, only in development
  }
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Validation error (invalid request data)
- `404` - Resource not found
- `408` - Request timeout
- `429` - Rate limit exceeded
- `500` - Internal server error / AI service error

## Error Codes

| Code                  | HTTP Status | Description                      |
| --------------------- | ----------- | -------------------------------- |
| `VALIDATION_ERROR`    | 400         | Invalid request parameters       |
| `UNAUTHORIZED`        | 401         | Authentication required (future) |
| `NOT_FOUND`           | 404         | Resource not found               |
| `TIMEOUT`             | 408         | Request exceeded timeout limit   |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests                |
| `AI_SERVICE_ERROR`    | 500         | AI service unavailable           |
| `INTERNAL_ERROR`      | 500         | Unexpected server error          |

---

## Endpoints

### 1. Send Chat Message

Send a user question and receive AI-generated response with structured lease data.

**Endpoint:** `POST /api/v1/chat/message`

#### Request Body

```json
{
  "message": "What is the legal name of the tenant?",
  "vendorId": "chef-art-smith",
  "sessionId": "optional-session-123",
  "context": {
    "previousMessages": 3
  }
}
```

#### Request Schema

| Field                      | Type   | Required | Constraints          | Description                             |
| -------------------------- | ------ | -------- | -------------------- | --------------------------------------- |
| `message`                  | string | Yes      | 1-1000 chars         | User's question                         |
| `vendorId`                 | enum   | Yes      | See vendor IDs below | Tenant identifier                       |
| `sessionId`                | string | No       | -                    | Session tracking ID                     |
| `context.previousMessages` | number | No       | 0-10                 | Number of previous messages for context |

**Valid Vendor IDs:**

- `chef-art-smith` - Chef Art Smith's Reunion
- `billy-goat` - Billy Goat Tavern
- `navy-pier-parking` - Chicago Shakespeare Theater Parking

#### Response Body (Success)

```json
{
  "success": true,
  "data": {
    "message": {
      "role": "assistant",
      "content": "Art Smith Reunion, LLC",
      "citations": [
        "Chef Art Smith Lease - Executed May 11, 2020",
        "Lease Parties, Section 1.1 - Page 1"
      ],
      "structuredData": {
        "question": "What is the legal name of the tenant?",
        "answer": "Art Smith Reunion, LLC",
        "source": {
          "sections": ["Lease Parties", "Section 1.1"],
          "pages": ["Page 1"],
          "exactLanguage": "\"TENANT: Art Smith Reunion, LLC, a Delaware limited liability company...\""
        },
        "interpretation": "The legal entity that signed the lease is Art Smith Reunion, LLC, a Delaware limited liability company.",
        "confidence": {
          "level": "High",
          "reason": "Explicitly stated in the lease parties section at the beginning of the document."
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
    },
    "metadata": {
      "responseTime": 245,
      "source": "json",
      "tokensUsed": 0,
      "matchConfidence": 0.95
    }
  }
}
```

#### Response Schema

| Field                           | Type             | Required | Description                             |
| ------------------------------- | ---------------- | -------- | --------------------------------------- |
| `data.message`                  | EnhancedMessage  | Yes      | AI assistant's response                 |
| `data.message.role`             | string           | Yes      | Always "assistant"                      |
| `data.message.content`          | string           | Yes      | Main answer text (markdown supported)   |
| `data.message.citations`        | string[]         | No       | Source references                       |
| `data.message.structuredData`   | StructuredQAData | No       | Rich metadata (see below)               |
| `data.metadata.responseTime`    | number           | Yes      | Response time in milliseconds           |
| `data.metadata.source`          | enum             | Yes      | "json" or "ai"                          |
| `data.metadata.tokensUsed`      | number           | No       | AI tokens used (if source="ai")         |
| `data.metadata.matchConfidence` | number           | No       | Match confidence 0-1 (if source="json") |

#### StructuredQAData Schema

This is the most important part of the response. Include this when answering from structured lease data.

```typescript
{
  "question": string;           // Original or matched question
  "answer": string;             // Direct answer
  "source": {
    "sections": string[];       // Lease sections (e.g., ["Article III", "Section 3.1"])
    "pages": string[];          // Page references (e.g., ["Page 5", "Page 6"])
    "exactLanguage": string;    // Direct quote from lease document
  };
  "interpretation": string;     // Plain English explanation
  "confidence": {
    "level": "High" | "Medium" | "Low";
    "reason": string;           // Why this confidence level
  };
  "caveats": string;           // Warnings, limitations, ambiguities
  "metadata": {
    "documentId": string;       // Unique document identifier
    "definitionType": "Explicit" | "Implicit" | "Inferred" | "Not Found";
    "reviewRequired": boolean;  // Flag for legal review needed
  };
  "citations": string[];       // Formatted citations
}
```

#### Response Strategy (Recommended)

1. **JSON Match First** (70-80% of queries)
   - Match user question against pre-processed Q&A database
   - Use fuzzy matching (85%+ similarity threshold)
   - Return structured data from JSON files
   - Fast response, no AI cost

2. **AI Fallback** (20-30% of queries)
   - Use Claude Opus 4.6 or similar
   - Include full markdown knowledge base as context (RAG pattern)
   - Parse AI response into structured format
   - More flexible but higher latency

#### Data Sources

**JSON Q&A Files** (provided in `/src/app/lib/`):

- `chef-art-smith-qa.json` - 27 Q&A pairs
- `billy-goat-tavern-qa.json` - Q&A pairs
- `navy-pier-parking-qa.json` - Q&A pairs

**Markdown Knowledge Base** (provided in `/knowledge/`):

- `chef-art-smith-lease-knowledge.md`
- `billy-goat-tavern-lease-knowledge.md`
- `navy-pier-parking-knowledge.md`

#### Error Responses

**Validation Error Example:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid vendor ID provided",
    "details": {
      "field": "vendorId",
      "received": "invalid-vendor",
      "expected": ["chef-art-smith", "billy-goat", "navy-pier-parking"]
    }
  }
}
```

**AI Service Error Example:**

```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "AI service temporarily unavailable. Please try again.",
    "details": {} // Don't expose internal errors in production
  }
}
```

#### Request Validation Rules

- `message` must not be empty
- `message` must be <= 1000 characters
- `vendorId` must be one of the valid enum values
- `context.previousMessages` must be between 0-10 if provided

#### Performance Requirements

- Response time target: < 2 seconds
- Timeout: 30 seconds maximum
- Rate limiting: 30 requests per minute per IP (recommended)

---

### 2. Get Vendors List

Get list of available tenants/vendors.

**Endpoint:** `GET /api/v1/vendors`

#### Response Body

```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": "chef-art-smith",
        "name": "Art Smith Reunion, LLC",
        "displayName": "Chef Art Smith's Reunion",
        "description": "Southern cuisine restaurant on Ground Floor, Suite 300",
        "leaseType": "Commercial Restaurant Lease"
      },
      {
        "id": "billy-goat",
        "name": "Billy Goat Tavern (Navy Pier), LLC",
        "displayName": "Billy Goat Tavern",
        "description": "Restaurant & bar on Ground Floor, Suite 210",
        "leaseType": "Commercial Restaurant & Bar Lease"
      },
      {
        "id": "navy-pier-parking",
        "name": "Chicago Shakespeare Theater",
        "displayName": "Chicago Shakespeare Theater - Parking",
        "description": "Parking access and discount agreement",
        "leaseType": "Parking Agreement"
      }
    ]
  }
}
```

#### Response Schema

| Field                   | Type   | Required | Description                                |
| ----------------------- | ------ | -------- | ------------------------------------------ |
| `vendors[].id`          | string | Yes      | Unique vendor identifier (use in chat API) |
| `vendors[].name`        | string | Yes      | Legal entity name                          |
| `vendors[].displayName` | string | Yes      | UI-friendly name                           |
| `vendors[].description` | string | Yes      | Brief description                          |
| `vendors[].leaseType`   | string | Yes      | Type of agreement                          |

---

### 3. Health Check

Check API health status.

**Endpoint:** `GET /api/v1/health`

#### Response Body

```json
{
  "status": "ok",
  "timestamp": "2026-02-26T10:30:00.000Z",
  "services": {
    "claude": true,
    "database": true
  }
}
```

#### Response Schema

| Field               | Type    | Required | Description                           |
| ------------------- | ------- | -------- | ------------------------------------- |
| `status`            | enum    | Yes      | "ok", "degraded", or "error"          |
| `timestamp`         | string  | Yes      | ISO 8601 timestamp                    |
| `services.claude`   | boolean | No       | Claude AI availability                |
| `services.database` | boolean | No       | Database availability (if applicable) |

---

## CORS Configuration

The backend must allow requests from the frontend origin:

**Development:** `http://localhost:5173`
**Production:** `https://your-frontend-domain.com`

**Required Headers:**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

---

## Security Considerations

### Input Validation

- Sanitize all user input
- Validate vendorId against enum
- Limit message length to 1000 characters
- Use request schema validation (e.g., Zod, Joi)

### Rate Limiting

- Recommended: 30 requests per minute per IP
- Return 429 status code when exceeded
- Include `Retry-After` header

### Error Handling

- Never expose internal errors in production
- Use generic "AI service unavailable" messages
- Log detailed errors server-side only
- Include error codes for client-side handling

### Security Headers

- Use helmet.js or equivalent
- Enable CORS only for known origins
- Set appropriate Content-Security-Policy
- Add HSTS headers in production

---

## Testing Checklist

Before deployment, ensure:

- [ ] All endpoints return correct response format
- [ ] Validation errors return 400 with proper error codes
- [ ] CORS is configured for frontend origin
- [ ] Rate limiting works correctly
- [ ] Timeouts are handled gracefully
- [ ] Health endpoint responds quickly
- [ ] Chat endpoint handles both JSON match and AI fallback
- [ ] StructuredQAData format matches specification exactly
- [ ] Error responses don't leak sensitive information
- [ ] Response times are under 2 seconds for JSON matches
- [ ] AI responses include all required structured data fields

---

## Example cURL Commands

### Send Chat Message

```bash
curl -X POST http://localhost:3001/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the legal name of the tenant?",
    "vendorId": "chef-art-smith"
  }'
```

### Get Vendors

```bash
curl http://localhost:3001/api/v1/vendors
```

### Health Check

```bash
curl http://localhost:3001/api/v1/health
```

---

## Implementation Notes

### Recommended Tech Stack

- **Runtime:** Node.js 18+ or Python 3.11+
- **Framework:** Express (Node.js) or FastAPI (Python)
- **AI Integration:** Anthropic SDK (`@anthropic-ai/sdk` or `anthropic`)
- **Validation:** Zod (TypeScript) or Pydantic (Python)
- **Model:** Claude Opus 4.6 (`claude-opus-4-6`)

### Data Loading Strategy

1. Load all JSON Q&A files at startup into memory
2. Load markdown knowledge bases for RAG context
3. Implement fuzzy string matching for JSON queries
4. Cache frequent questions to reduce AI calls

### Response Time Optimization

- JSON matches should return in < 500ms
- AI calls may take 1-2 seconds
- Implement in-memory caching for exact question matches
- Use compression for large responses

### Cost Optimization

- Target 70-80% JSON match rate (no AI cost)
- Remaining 20-30% use AI (estimated $15/month for 1000 queries)
- Consider using Claude Haiku for simpler questions
- Implement aggressive caching

---

## Frontend Configuration

The frontend is already prepared and will automatically connect when you:

1. Deploy backend to a URL
2. Set `VITE_API_URL` environment variable on frontend
3. Set `VITE_USE_MOCK_API=false` to use real backend

**Frontend Environment Variables:**

```bash
# Use real backend API
VITE_API_URL=https://your-backend-api.com/api/v1
VITE_USE_MOCK_API=false

# Use mock API (default for development)
VITE_USE_MOCK_API=true
```

---

## TypeScript Type Definitions

The frontend provides complete TypeScript definitions in:

- `/src/app/types/api.types.ts` - Request/response types
- `/src/app/services/api-client.interface.ts` - Service interface

These can be copied to the backend if using TypeScript for end-to-end type safety.

---

## Support & Questions

For questions about this API contract, contact the frontend team or refer to:

- Frontend implementation: `/src/app/services/api-client.http.ts`
- Type definitions: `/src/app/types/api.types.ts`
- Mock implementation (reference): `/src/app/services/api-client.mock.ts`

---

**Contract Status:** ✅ **READY FOR IMPLEMENTATION**

The frontend is fully prepared to consume this API. Backend team can start implementation immediately.
