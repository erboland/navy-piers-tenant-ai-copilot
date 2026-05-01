/**
 * Application Configuration
 *
 * Central configuration for app behavior.
 * Mock vs backend mode is controlled by `VITE_USE_MOCK_API` (see `.env` / `.env.production`).
 */

/**
 * Parse VITE_USE_MOCK_API for mock vs real HTTP API.
 * Unset or "true" / "1" → mock (safe default for local work).
 * "false" / "0" → real backend (required for production builds against Nginx).
 */
function parseMockMode(): boolean {
  const raw = import.meta.env.VITE_USE_MOCK_API;
  if (raw === undefined || raw === '') return true;
  const v = String(raw).trim().toLowerCase();
  return v !== 'false' && v !== '0' && v !== 'no';
}

export const IS_MOCKED = parseMockMode();

/**
 * Backend API Base URL
 * Only used when IS_MOCKED = false
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
