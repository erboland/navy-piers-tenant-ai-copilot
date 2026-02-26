/**
 * API Client Service Interface
 *
 * This interface defines the contract for the API client service.
 * Different implementations (mock, real HTTP) can be swapped easily.
 *
 * Following the Dependency Inversion Principle:
 * - High-level modules (UI components) depend on this abstraction
 * - Low-level modules (HTTP client, mocks) implement this abstraction
 */

import type { EnhancedMessage } from '../components/enhanced-chat-message';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  VendorsResponse,
  HealthResponse,
  VendorId,
} from '../types/api.types';

/**
 * API Client Service
 *
 * Provides methods for all backend API interactions.
 */
export interface IApiClient {
  /**
   * Send a chat message and receive AI response
   *
   * @param request - Chat message request
   * @returns Promise resolving to chat response
   * @throws ApiError if request fails
   */
  sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse>;

  /**
   * Convenience method: Send message with minimal parameters
   *
   * @param message - User's question
   * @param vendorId - Vendor identifier
   * @returns Promise resolving to the assistant's message
   */
  sendSimpleMessage(message: string, vendorId: VendorId): Promise<EnhancedMessage>;

  /**
   * Get list of available vendors
   *
   * @returns Promise resolving to vendors list
   */
  getVendors(): Promise<VendorsResponse>;

  /**
   * Check API health status
   *
   * @returns Promise resolving to health status
   */
  getHealth(): Promise<HealthResponse>;
}

/**
 * API Error class
 *
 * Thrown when API requests fail.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
