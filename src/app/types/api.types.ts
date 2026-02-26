/**
 * API Type Definitions
 *
 * These types define the contract between frontend and backend.
 * Backend team should implement endpoints that match these interfaces exactly.
 */

import type { EnhancedMessage } from '../components/enhanced-chat-message';

/**
 * Vendor/Tenant identifier
 */
export type VendorId = 'chef-art-smith' | 'billy-goat' | 'navy-pier-parking';

/**
 * API Request: Send a chat message
 * POST /api/v1/chat/message
 */
export interface ChatMessageRequest {
  /** User's question (1-1000 characters) */
  message: string;

  /** Vendor/tenant identifier */
  vendorId: VendorId;

  /** Optional session ID for conversation tracking */
  sessionId?: string;

  /** Optional context for multi-turn conversations */
  context?: {
    /** Number of previous messages to include as context */
    previousMessages?: number;
  };
}

/**
 * API Response: Chat message response
 * POST /api/v1/chat/message
 */
export interface ChatMessageResponse {
  success: true;
  data: {
    /** The AI assistant's response message */
    message: EnhancedMessage;

    /** Response metadata */
    metadata: {
      /** Response time in milliseconds */
      responseTime: number;

      /** Where the answer came from */
      source: 'json' | 'ai';

      /** Number of tokens used (if AI-generated) */
      tokensUsed?: number;

      /** Confidence score for JSON matches (0-1) */
      matchConfidence?: number;
    };
  };
}

/**
 * API Response: Vendor list
 * GET /api/v1/vendors
 */
export interface VendorsResponse {
  success: true;
  data: {
    vendors: Vendor[];
  };
}

/**
 * Vendor information
 */
export interface Vendor {
  /** Unique vendor identifier */
  id: VendorId;

  /** Full legal name */
  name: string;

  /** Display name for UI */
  displayName: string;

  /** Brief description */
  description: string;

  /** Type of lease/agreement */
  leaseType: string;
}

/**
 * API Response: Health check
 * GET /api/v1/health
 */
export interface HealthResponse {
  /** Service status */
  status: 'ok' | 'degraded' | 'error';

  /** Server timestamp */
  timestamp: string;

  /** Individual service health */
  services?: {
    claude?: boolean;
    database?: boolean;
  };
}

/**
 * API Error Response
 * All error responses follow this format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    /** Error code for programmatic handling */
    code: ErrorCode;

    /** User-friendly error message */
    message: string;

    /** Additional error details (dev mode only) */
    details?: unknown;
  };
}

/**
 * Standard error codes
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'      // 400: Invalid request data
  | 'UNAUTHORIZED'          // 401: Authentication required
  | 'NOT_FOUND'            // 404: Resource not found
  | 'RATE_LIMIT_EXCEEDED'  // 429: Too many requests
  | 'TIMEOUT'              // 408: Request timeout
  | 'AI_SERVICE_ERROR'     // 500: AI service unavailable
  | 'INTERNAL_ERROR';      // 500: Unexpected server error

/**
 * API Client configuration
 */
export interface ApiConfig {
  /** Base URL for API endpoints */
  baseUrl: string;

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Enable request/response logging */
  debug?: boolean;
}
