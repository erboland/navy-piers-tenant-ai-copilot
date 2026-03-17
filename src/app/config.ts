/**
 * Application Configuration
 *
 * Central configuration for app behavior.
 * Toggle between mock and backend API modes here.
 */

/**
 * API Mode Configuration
 *
 * When true: Uses mock data, no backend required
 * When false: Connects to real backend API
 *
 * @default true (safe default - mock mode)
 */
export const IS_MOCKED = true;

/**
 * Backend API Base URL
 * Only used when IS_MOCKED = false
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
