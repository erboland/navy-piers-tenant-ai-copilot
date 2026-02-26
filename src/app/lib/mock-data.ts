// Mock vendors data
export interface Vendor {
  id: string;
  name: string;
  type: string;
  location: string;
}

export const mockVendors: Vendor[] = [
  { id: "6", name: "Chef Art Smith's Reunion", type: "Restaurant", location: "Suite 300" },
  { id: "7", name: "Billy Goat Tavern", type: "Restaurant & Bar", location: "Suite 210" },
  { id: "8", name: "Chicago Shakespeare Theater", type: "Theater & Parking", location: "800 E. Grand Ave" },
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
    id: "6",
    vendor: "Chef Art Smith's Reunion",
    revenue: 3800000,
    baseRent: 28000,
    percentageRent: 184000,
    paymentStatus: "Current",
    lastPaymentDate: "2026-01-01",
  },
  {
    id: "7",
    vendor: "Billy Goat Tavern",
    revenue: 2100000,
    baseRent: 22000,
    percentageRent: 48000,
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
    id: "11",
    vendor: "Chef Art Smith's Reunion",
    clauseType: "Use Restriction",
    description: "Permitted use: Full-service restaurant specializing in Southern cuisine",
    requiresAction: false,
  },
  {
    id: "12",
    vendor: "Chef Art Smith's Reunion",
    clauseType: "Assignment",
    description: "Requires landlord consent, not to be unreasonably withheld",
    requiresAction: false,
  },
  {
    id: "13",
    vendor: "Billy Goat Tavern",
    clauseType: "Use Restriction",
    description: "Permitted use: Full-service restaurant and bar",
    requiresAction: false,
  },
  {
    id: "14",
    vendor: "Billy Goat Tavern",
    clauseType: "Assignment",
    description: "Requires landlord approval",
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
    id: "11",
    vendor: "Chef Art Smith's Reunion",
    documentType: "General Liability Insurance",
    status: "Current",
    expirationDate: "2026-05-11",
    issuingAuthority: "Insurance Provider",
  },
  {
    id: "12",
    vendor: "Chef Art Smith's Reunion",
    documentType: "Health Department Permit",
    status: "Current",
    expirationDate: "2026-04-15",
    issuingAuthority: "Chicago Dept. of Health",
  },
  {
    id: "13",
    vendor: "Chef Art Smith's Reunion",
    documentType: "Liquor License",
    status: "Current",
    expirationDate: "2026-05-31",
    issuingAuthority: "Illinois Liquor Control",
  },
  {
    id: "14",
    vendor: "Billy Goat Tavern",
    documentType: "General Liability Insurance",
    status: "Current",
    expirationDate: "2026-08-15",
    issuingAuthority: "Insurance Provider",
  },
  {
    id: "15",
    vendor: "Billy Goat Tavern",
    documentType: "Health Department Permit",
    status: "Current",
    expirationDate: "2026-07-20",
    issuingAuthority: "Chicago Dept. of Health",
  },
  {
    id: "16",
    vendor: "Billy Goat Tavern",
    documentType: "Liquor License",
    status: "Current",
    expirationDate: "2026-06-30",
    issuingAuthority: "Illinois Liquor Control",
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
    id: "21",
    vendor: "Chef Art Smith's Reunion",
    category: "Square Footage",
    detail: "Total Area",
    value: "Approximately 3,200 sq ft",
  },
  {
    id: "22",
    vendor: "Chef Art Smith's Reunion",
    category: "Operating Hours",
    detail: "Standard Hours",
    value: "11:00 AM - 11:00 PM",
  },
  {
    id: "23",
    vendor: "Chef Art Smith's Reunion",
    category: "Lease Term",
    detail: "Commencement",
    value: "May 11, 2020",
  },
  {
    id: "24",
    vendor: "Chef Art Smith's Reunion",
    category: "Lease Term",
    detail: "Premises Delivery",
    value: "May 1, 2020",
  },
  {
    id: "25",
    vendor: "Billy Goat Tavern",
    category: "Square Footage",
    detail: "Total Area",
    value: "Approximately 2,850 sq ft",
  },
  {
    id: "26",
    vendor: "Billy Goat Tavern",
    category: "Operating Hours",
    detail: "Standard Hours",
    value: "10:00 AM - 10:00 PM",
  },
  {
    id: "27",
    vendor: "Billy Goat Tavern",
    category: "Lease Term",
    detail: "Commencement",
    value: "June 1, 2022",
  },
  {
    id: "28",
    vendor: "Billy Goat Tavern",
    category: "Lease Term",
    detail: "Expiration",
    value: "May 31, 2032",
  },
];
