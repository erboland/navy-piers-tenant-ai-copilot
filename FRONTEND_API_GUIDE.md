# Frontend API Integration Guide

## Overview

The frontend has been architected with a clean service layer that supports both **mock** and **real backend** API implementations. You can seamlessly switch between them using environment variables.

## Architecture

### Service Layer Pattern

```
UI Components (chat.tsx)
    ↓
API Client Interface (IApiClient)
    ↓
    ├─ MockApiClient (uses local JSON data)
    └─ HttpApiClient (calls real backend)
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to test
- ✅ Zero UI code changes when switching to real backend
- ✅ Type-safe with TypeScript
- ✅ Consistent error handling

## Quick Start

### 1. Using Mock API (Default)

Perfect for development without backend:

```bash
# .env or .env.local
VITE_USE_MOCK_API=true
```

Start the app:
```bash
npm run dev
```

The app will use mock responses from local JSON files.

### 2. Using Real Backend API

When backend is ready:

```bash
# .env or .env.local
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK_API=false
```

Start the app:
```bash
npm run dev
```

The app will make HTTP requests to the backend.

## File Structure

```
src/app/
├── types/
│   └── api.types.ts                    # API contracts and types
├── services/
│   ├── api-client.ts                   # Main export (factory)
│   ├── api-client.interface.ts         # Service interface
│   ├── api-client.mock.ts              # Mock implementation
│   └── api-client.http.ts              # HTTP implementation
├── utils/
│   └── vendor-mapping.ts               # Vendor ID mapping utilities
└── screens/
    └── chat.tsx                        # Uses apiClient service
```

## Using the API Client

### In Components

```typescript
import { apiClient } from '@/services/api-client';

// Simple usage
const response = await apiClient.sendSimpleMessage(
  'What is the legal name?',
  'chef-art-smith'
);

// Full request
const response = await apiClient.sendMessage({
  message: 'What is the legal name?',
  vendorId: 'chef-art-smith',
  sessionId: 'optional-session-id'
});

// Get vendors list
const vendors = await apiClient.getVendors();

// Health check
const health = await apiClient.getHealth();
```

### Error Handling

```typescript
import { apiClient, ApiError } from '@/services/api-client';

try {
  const response = await apiClient.sendSimpleMessage(message, vendorId);
  setMessages(prev => [...prev, response]);
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API errors
    console.error('API Error:', error.code, error.message);
    showErrorToast(error.message);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    showErrorToast('An unexpected error occurred');
  }
}
```

### Vendor ID Mapping

The UI uses numeric IDs ("6", "7", "8") but the API uses semantic IDs:

```typescript
import { toApiVendorId } from '@/utils/vendor-mapping';

const uiVendorId = "6"; // From vendor selector
const apiVendorId = toApiVendorId(uiVendorId); // "chef-art-smith"
```

**Mapping:**
- `"6"` → `"chef-art-smith"`
- `"7"` → `"billy-goat"`
- `"8"` → `"navy-pier-parking"`

## Environment Variables

### Development (.env.local)

```bash
# Use mock API for frontend development
VITE_USE_MOCK_API=true
```

### Testing with Real Backend (.env.local)

```bash
# Connect to local backend server
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK_API=false
```

### Production (.env.production)

```bash
# Connect to production backend
VITE_API_URL=https://api.your-domain.com/api/v1
VITE_USE_MOCK_API=false
```

## API Response Format

### Successful Response

```typescript
interface ChatMessageResponse {
  success: true;
  data: {
    message: EnhancedMessage;  // Already defined in your components
    metadata: {
      responseTime: number;
      source: 'json' | 'ai';
      tokensUsed?: number;
      matchConfidence?: number;
    };
  };
}
```

### Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'AI_SERVICE_ERROR' | 'INTERNAL_ERROR' | /* ... */;
    message: string;
    details?: unknown;
  };
}
```

## Testing

### Unit Testing API Client

```typescript
import { MockApiClient } from '@/services/api-client.mock';

describe('API Client', () => {
  const mockClient = new MockApiClient(0); // No delay for tests

  it('should send message successfully', async () => {
    const response = await mockClient.sendSimpleMessage(
      'What is the legal name?',
      'chef-art-smith'
    );

    expect(response.role).toBe('assistant');
    expect(response.structuredData).toBeDefined();
  });

  it('should throw validation error for invalid vendor', async () => {
    await expect(
      mockClient.sendSimpleMessage('test', 'invalid-vendor' as any)
    ).rejects.toThrow(ApiError);
  });
});
```

### Integration Testing with Backend

```typescript
import { HttpApiClient } from '@/services/api-client.http';

describe('HTTP API Client Integration', () => {
  const httpClient = new HttpApiClient({
    baseUrl: 'http://localhost:3001/api/v1',
    timeout: 10000,
    debug: true
  });

  it('should communicate with real backend', async () => {
    const response = await httpClient.sendSimpleMessage(
      'What is the legal name?',
      'chef-art-smith'
    );

    expect(response.role).toBe('assistant');
  });
});
```

## Troubleshooting

### Issue: "Network error" when using real backend

**Solution:**
1. Ensure backend is running on the correct port
2. Check CORS is configured for `http://localhost:5173`
3. Verify `VITE_API_URL` is correct

```bash
# Test backend directly
curl http://localhost:3001/api/v1/health
```

### Issue: Mock responses not working

**Solution:**
1. Verify `VITE_USE_MOCK_API=true` in .env
2. Restart dev server after changing .env
3. Check browser console for "[API] Using mock API client" message

### Issue: Type errors with EnhancedMessage

**Solution:**
The API client returns the exact same `EnhancedMessage` type your components already use. No changes needed.

### Issue: Vendor ID mismatch errors

**Solution:**
Use the `toApiVendorId()` utility:

```typescript
import { toApiVendorId } from '@/utils/vendor-mapping';
const apiId = toApiVendorId(uiVendorId);
```

## Migration Checklist

When backend is ready, follow these steps:

- [ ] Backend deployed and accessible
- [ ] Backend implements all endpoints in `BACKEND_API_CONTRACT.md`
- [ ] CORS configured for frontend origin
- [ ] Test backend health endpoint: `curl http://backend/api/v1/health`
- [ ] Test chat endpoint with curl (see contract doc)
- [ ] Update `.env.local`: `VITE_API_URL=<backend-url>`
- [ ] Update `.env.local`: `VITE_USE_MOCK_API=false`
- [ ] Restart frontend dev server
- [ ] Test chat interface manually
- [ ] Verify error handling works
- [ ] Check browser network tab for API calls
- [ ] Deploy to production with production backend URL

## Advanced Usage

### Custom API Client

Create your own implementation:

```typescript
import type { IApiClient } from '@/services/api-client.interface';

class CustomApiClient implements IApiClient {
  async sendMessage(request) {
    // Your custom implementation
  }
  // ... implement other methods
}

// Use it
const customClient = new CustomApiClient();
const response = await customClient.sendSimpleMessage('test', 'chef-art-smith');
```

### Request Interceptors

Modify HTTP client for logging/auth:

```typescript
class LoggingHttpClient extends HttpApiClient {
  async sendMessage(request) {
    console.log('[Request]', request);
    const response = await super.sendMessage(request);
    console.log('[Response]', response);
    return response;
  }
}
```

### Retry Logic

Add retry for failed requests:

```typescript
async function sendWithRetry(message: string, vendorId: VendorId, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiClient.sendSimpleMessage(message, vendorId);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Best Practices

### 1. Always Handle Errors

```typescript
// ✅ Good
try {
  const response = await apiClient.sendSimpleMessage(message, vendorId);
  // handle response
} catch (error) {
  // handle error
}

// ❌ Bad
const response = await apiClient.sendSimpleMessage(message, vendorId);
```

### 2. Use Type Guards

```typescript
if (error instanceof ApiError) {
  // TypeScript knows error.code, error.statusCode exist
  console.error(error.code, error.statusCode);
}
```

### 3. Import from Main Module

```typescript
// ✅ Good
import { apiClient } from '@/services/api-client';

// ❌ Avoid
import { MockApiClient } from '@/services/api-client.mock';
```

### 4. Validate Vendor IDs

```typescript
import { isValidVendorId, toApiVendorId } from '@/utils/vendor-mapping';

if (isValidVendorId(vendorId)) {
  const apiId = toApiVendorId(vendorId);
  // safe to use
}
```

## Support

For questions or issues:
1. Check `BACKEND_API_CONTRACT.md` for API specification
2. Review type definitions in `src/app/types/api.types.ts`
3. Look at example usage in `src/app/screens/chat.tsx`
4. Check mock implementation in `src/app/services/api-client.mock.ts`

---

**Status:** ✅ Frontend is ready to connect to backend when available!
