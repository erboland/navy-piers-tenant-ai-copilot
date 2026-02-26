/**
 * HTTP API Client Implementation
 *
 * This implementation makes real HTTP requests to the backend API.
 * It implements the same interface as the mock client, allowing
 * seamless switching via configuration.
 *
 * Usage:
 * - Production environment
 * - Integration testing with real backend
 * - When backend API is ready and deployed
 */

import type { IApiClient } from './api-client.interface';
import type { EnhancedMessage } from '../components/enhanced-chat-message';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  VendorsResponse,
  HealthResponse,
  VendorId,
  ApiErrorResponse,
  ApiConfig,
} from '../types/api.types';
import { ApiError } from './api-client.interface';

/**
 * HTTP API Client
 *
 * Makes real HTTP requests to backend API endpoints.
 */
export class HttpApiClient implements IApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly debug: boolean;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.debug = config.debug || false;
  }

  /**
   * Send a chat message to backend
   */
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    return this.request<ChatMessageResponse>('POST', '/chat/message', request);
  }

  /**
   * Convenience method: Send simple message
   */
  async sendSimpleMessage(message: string, vendorId: VendorId): Promise<EnhancedMessage> {
    const response = await this.sendMessage({ message, vendorId });
    return response.data.message;
  }

  /**
   * Get vendors list from backend
   */
  async getVendors(): Promise<VendorsResponse> {
    return this.request<VendorsResponse>('GET', '/vendors');
  }

  /**
   * Check backend health
   */
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/health');
  }

  /**
   * Generic HTTP request handler
   */
  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      if (this.debug) {
        console.log(`[API] ${method} ${url}`, body);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (this.debug) {
        console.log(`[API] Response ${response.status}:`, data);
      }

      // Handle error responses
      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new ApiError(
          errorData.error.message,
          errorData.error.code,
          response.status,
          errorData.error.details
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          'Request timeout - please try again',
          'TIMEOUT',
          408
        );
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(
          'Network error - please check your connection',
          'INTERNAL_ERROR',
          0,
          { originalError: error.message }
        );
      }

      // Re-throw ApiErrors
      if (error instanceof ApiError) {
        throw error;
      }

      // Unknown error
      throw new ApiError(
        'An unexpected error occurred',
        'INTERNAL_ERROR',
        500,
        { originalError: error }
      );
    }
  }
}

/**
 * Create HTTP client instance from environment configuration
 */
export function createHttpApiClient(): HttpApiClient {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  const debug = import.meta.env.DEV || false;

  return new HttpApiClient({
    baseUrl,
    debug,
  });
}
