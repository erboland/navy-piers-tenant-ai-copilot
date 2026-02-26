/**
 * Mock API Client Implementation
 *
 * This implementation simulates backend API responses using local data.
 * It provides the same interface as the real HTTP client, making it easy
 * to swap implementations without changing UI code.
 *
 * Usage:
 * - Development/testing without backend
 * - Demos and presentations
 * - Frontend development before backend is ready
 */

import type { IApiClient } from './api-client.interface';
import type { EnhancedMessage } from '../components/enhanced-chat-message';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  VendorsResponse,
  HealthResponse,
  VendorId,
} from '../types/api.types';
import { ApiError } from './api-client.interface';
import { generateEnhancedCustomResponse } from '../lib/enhanced-mock-responses';

/**
 * Mock API Client
 *
 * Simulates API responses with realistic delays and error conditions.
 */
export class MockApiClient implements IApiClient {
  private readonly simulatedDelay: number;

  constructor(simulatedDelay = 800) {
    this.simulatedDelay = simulatedDelay;
  }

  /**
   * Send a chat message (mock implementation)
   */
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    // Validate request
    this.validateRequest(request);

    // Simulate network delay
    await this.delay(this.simulatedDelay);

    const startTime = Date.now();

    // Map vendorId to vendor name for existing mock response function
    const vendorName = this.getVendorName(request.vendorId);

    // Generate response using existing mock logic
    const message = generateEnhancedCustomResponse(request.message, vendorName);

    const responseTime = Date.now() - startTime;

    return {
      success: true,
      data: {
        message,
        metadata: {
          responseTime,
          source: message.structuredData ? 'json' : 'ai',
          matchConfidence: message.structuredData ? 0.95 : undefined,
        },
      },
    };
  }

  /**
   * Convenience method: Send simple message
   */
  async sendSimpleMessage(message: string, vendorId: VendorId): Promise<EnhancedMessage> {
    const response = await this.sendMessage({ message, vendorId });
    return response.data.message;
  }

  /**
   * Get vendors list (mock implementation)
   */
  async getVendors(): Promise<VendorsResponse> {
    await this.delay(this.simulatedDelay);

    return {
      success: true,
      data: {
        vendors: [
          {
            id: 'chef-art-smith',
            name: "Art Smith Reunion, LLC",
            displayName: "Chef Art Smith's Reunion",
            description: 'Southern cuisine restaurant on Ground Floor, Suite 300',
            leaseType: 'Commercial Restaurant Lease',
          },
          {
            id: 'billy-goat',
            name: 'Billy Goat Tavern (Navy Pier), LLC',
            displayName: 'Billy Goat Tavern',
            description: 'Restaurant & bar on Ground Floor, Suite 210',
            leaseType: 'Commercial Restaurant & Bar Lease',
          },
          {
            id: 'navy-pier-parking',
            name: 'Chicago Shakespeare Theater',
            displayName: 'Chicago Shakespeare Theater - Parking',
            description: 'Parking access and discount agreement',
            leaseType: 'Parking Agreement',
          },
        ],
      },
    };
  }

  /**
   * Health check (mock implementation)
   */
  async getHealth(): Promise<HealthResponse> {
    await this.delay(100);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        claude: true,
        database: true,
      },
    };
  }

  /**
   * Validate request data
   */
  private validateRequest(request: ChatMessageRequest): void {
    if (!request.message || request.message.trim().length === 0) {
      throw new ApiError(
        'Message cannot be empty',
        'VALIDATION_ERROR',
        400,
        { field: 'message' }
      );
    }

    if (request.message.length > 1000) {
      throw new ApiError(
        'Message exceeds maximum length of 1000 characters',
        'VALIDATION_ERROR',
        400,
        { field: 'message', maxLength: 1000 }
      );
    }

    const validVendors: VendorId[] = ['chef-art-smith', 'billy-goat', 'navy-pier-parking'];
    if (!validVendors.includes(request.vendorId)) {
      throw new ApiError(
        'Invalid vendor ID',
        'VALIDATION_ERROR',
        400,
        { field: 'vendorId', validValues: validVendors }
      );
    }
  }

  /**
   * Map vendor ID to display name for legacy mock response function
   */
  private getVendorName(vendorId: VendorId): string {
    const vendorMap: Record<VendorId, string> = {
      'chef-art-smith': "Chef Art Smith's Reunion",
      'billy-goat': 'Billy Goat Tavern',
      'navy-pier-parking': 'Chicago Shakespeare Theater',
    };
    return vendorMap[vendorId];
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Singleton instance for convenience
 * Can be imported and used directly in components
 */
export const mockApiClient = new MockApiClient();
