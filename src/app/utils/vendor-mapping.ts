/**
 * Vendor ID Mapping Utilities
 *
 * Maps between UI vendor IDs and API vendor IDs.
 * This allows the frontend to maintain backward compatibility
 * while using semantic IDs in the API.
 */

import type { VendorId } from '../types/api.types';

/**
 * Map UI vendor ID to API vendor ID
 */
export function toApiVendorId(uiVendorId: string): VendorId {
  const mapping: Record<string, VendorId> = {
    '6': 'chef-art-smith',
    '7': 'billy-goat',
    '8': 'navy-pier-parking',
    // Also support semantic IDs directly
    'chef-art-smith': 'chef-art-smith',
    'billy-goat': 'billy-goat',
    'navy-pier-parking': 'navy-pier-parking',
  };

  const apiId = mapping[uiVendorId];
  if (!apiId) {
    throw new Error(`Unknown vendor ID: ${uiVendorId}`);
  }

  return apiId;
}

/**
 * Map API vendor ID to UI vendor ID
 */
export function toUiVendorId(apiVendorId: VendorId): string {
  const mapping: Record<VendorId, string> = {
    'chef-art-smith': '6',
    'billy-goat': '7',
    'navy-pier-parking': '8',
  };

  return mapping[apiVendorId];
}

/**
 * Check if a vendor ID is valid
 */
export function isValidVendorId(vendorId: string): boolean {
  try {
    toApiVendorId(vendorId);
    return true;
  } catch {
    return false;
  }
}
