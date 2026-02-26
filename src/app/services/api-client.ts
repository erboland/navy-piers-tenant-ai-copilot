/**
 * API Client Factory
 *
 * Central export for API client service.
 * Automatically selects the correct implementation (mock or HTTP)
 * based on environment configuration.
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
 * To switch between mock and real API:
 * - Set VITE_USE_MOCK_API=true in .env for mock
 * - Set VITE_USE_MOCK_API=false in .env for real HTTP API
 */

import type { IApiClient } from './api-client.interface';
import { MockApiClient } from './api-client.mock';
import { createHttpApiClient } from './api-client.http';

/**
 * Get the appropriate API client based on configuration
 */
function getApiClient(): IApiClient {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false';

  if (useMock) {
    console.log('[API] Using mock API client');
    return new MockApiClient();
  }

  console.log('[API] Using HTTP API client');
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
