// Mock vendors data
export interface Vendor {
  id: string;
  name: string;
  type: string;
  location: string;
}

export const mockVendors: Vendor[] = [
  { id: "1", name: "Giordano's Pizza", type: "Restaurant", location: "Suite 125" },
  { id: "2", name: "Harry Caray's Tavern", type: "Restaurant & Bar", location: "Suite 230" },
  { id: "3", name: "Ben & Jerry's", type: "Ice Cream Shop", location: "Suite 105" },
  { id: "4", name: "Pier Shop Souvenirs", type: "Retail", location: "Suite 180" },
  { id: "5", name: "Chicago's Dog House", type: "Fast Food", location: "Suite 142" },
];

// Mock financial data
export interface FinancialData {
  id: string;
  vendor: string;
  revenue: number;
  baseRent: number;
  percentageRent: number;
  paymentStatus: string;
  lastPaymentDate: string;
}

export const mockFinancialData: FinancialData[] = [
  {
    id: "1",
    vendor: "Giordano's Pizza",
    revenue: 2400000,
    baseRent: 18500,
    percentageRent: 72000,
    paymentStatus: "Current",
    lastPaymentDate: "2026-01-01",
  },
  {
    id: "2",
    vendor: "Harry Caray's Tavern",
    revenue: 3200000,
    baseRent: 24000,
    percentageRent: 136000,
    paymentStatus: "Current",
    lastPaymentDate: "2026-01-01",
  },
  {
    id: "3",
    vendor: "Ben & Jerry's",
    revenue: 980000,
    baseRent: 12000,
    percentageRent: 0,
    paymentStatus: "Current",
    lastPaymentDate: "2026-01-01",
  },
];

// Mock legal clauses
export interface LegalClause {
  id: string;
  vendor: string;
  clauseType: string;
  description: string;
  requiresAction: boolean;
}

export const mockLegalClauses: LegalClause[] = [
  {
    id: "1",
    vendor: "Giordano's Pizza",
    clauseType: "Use Restriction",
    description: "Permitted use: Full-service restaurant and bar",
    requiresAction: false,
  },
  {
    id: "2",
    vendor: "Giordano's Pizza",
    clauseType: "Exclusive Rights",
    description: "Exclusive right to operate Italian cuisine",
    requiresAction: false,
  },
  {
    id: "3",
    vendor: "Giordano's Pizza",
    clauseType: "Assignment",
    description: "Requires landlord approval, $5,000 fee",
    requiresAction: false,
  },
];

// Mock compliance records
export interface ComplianceRecord {
  id: string;
  vendor: string;
  documentType: string;
  status: "Current" | "Expiring Soon" | "Expired";
  expirationDate: string;
  issuingAuthority: string;
}

export const mockComplianceRecords: ComplianceRecord[] = [
  {
    id: "1",
    vendor: "Giordano's Pizza",
    documentType: "General Liability Insurance",
    status: "Expiring Soon",
    expirationDate: "2026-05-31",
    issuingAuthority: "Insurance Provider",
  },
  {
    id: "2",
    vendor: "Giordano's Pizza",
    documentType: "Health Department Permit",
    status: "Current",
    expirationDate: "2026-03-15",
    issuingAuthority: "Chicago Dept. of Health",
  },
  {
    id: "3",
    vendor: "Giordano's Pizza",
    documentType: "Liquor License",
    status: "Current",
    expirationDate: "2026-06-30",
    issuingAuthority: "Illinois Liquor Control",
  },
  {
    id: "4",
    vendor: "Giordano's Pizza",
    documentType: "Fire Safety Certificate",
    status: "Current",
    expirationDate: "2025-12-31",
    issuingAuthority: "Chicago Fire Dept.",
  },
];

// Mock operational details
export interface OperationalDetail {
  id: string;
  vendor: string;
  category: string;
  detail: string;
  value: string;
}

export const mockOperationalDetails: OperationalDetail[] = [
  {
    id: "1",
    vendor: "Giordano's Pizza",
    category: "Square Footage",
    detail: "Total Area",
    value: "2,400 sq ft",
  },
  {
    id: "2",
    vendor: "Giordano's Pizza",
    category: "Operating Hours",
    detail: "Standard Hours",
    value: "10:00 AM - 10:00 PM",
  },
  {
    id: "3",
    vendor: "Giordano's Pizza",
    category: "Lease Term",
    detail: "Commencement",
    value: "June 1, 2025",
  },
  {
    id: "4",
    vendor: "Giordano's Pizza",
    category: "Lease Term",
    detail: "Expiration",
    value: "June 30, 2030",
  },
];
