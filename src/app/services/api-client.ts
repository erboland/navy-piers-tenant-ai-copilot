/**
 * API Client Factory
 *
 * Central export for API client service.
 * Automatically selects the correct implementation (mock or HTTP)
 * based on configuration.
 *
 * Usage in components:
 * ```typescript
 * import { apiClient } from '@/services/api-client';
 *
 * const response = await apiClient.sendSimpleMessage(
 *   'What is the legal name?',
 *   'chef-art-smith'
 * );
 * ```
 *
 * To switch between mock and real API, set `VITE_USE_MOCK_API` in `.env`:
 * - true / unset = mock mode (no backend)
 * - false = backend mode (`VITE_API_URL` must point at `/api/v1` or full API URL)
 */

import type { IApiClient } from './api-client.interface';
import { MockApiClient } from './api-client.mock';
import { createHttpApiClient } from './api-client.http';
import { IS_MOCKED } from '../config';

/**
 * Get the appropriate API client based on configuration
 */
function getApiClient(): IApiClient {
  if (IS_MOCKED) {
    console.log('%c[API Mode] MOCK', 'background: #4ade80; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
    console.log('→ Using mock data (no backend required)');
    console.log('→ To switch: set VITE_USE_MOCK_API=false in .env');
    return new MockApiClient();
  }

  console.log('%c[API Mode] BACKEND', 'background: #60a5fa; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('→ Connecting to backend API');
  console.log('→ Backend:', import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1');
  return createHttpApiClient();
}

/**
 * Singleton API client instance
 *
 * This is the primary export that should be used throughout the app.
 */
export const apiClient = getApiClient();

/**
 * Re-export types and classes for direct usage if needed
 */
export { ApiError } from './api-client.interface';
export type { IApiClient } from './api-client.interface';
export { MockApiClient } from './api-client.mock';
export { HttpApiClient, createHttpApiClient } from './api-client.http';
