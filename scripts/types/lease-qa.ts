/**
 * TypeScript interfaces for Lease Q&A data structure
 */

export interface QuestionAnswer {
  question: string;
  answer: string;
  sections: string[];
  pages: string[];
  exactLanguage: string;
  interpretationNotes: string;
  confidence: "High" | "Medium" | "Low";
  confidenceReason: string;
  caveats: string;
  documentId: string;
  definitionType: "Explicit" | "Implicit" | "Inferred" | "Not Found";
  reviewRequired: boolean;
}

export interface LeaseQADocument {
  tenant: string;
  questions: QuestionAnswer[];
}

export interface CSVQuestion {
  category: string;
  question: string;
}

export interface ExecutiveSummary {
  tenant: string;
  documentId: string;
  summary: string;
  keyTerms: {
    commencement: string;
    expiration: string;
    premisesSize: string;
    baseRent: string;
    renewalOptions: string;
  };
  criticalDates: Array<{
    date: string;
    description: string;
  }>;
  majorObligations: {
    landlord: string[];
    tenant: string[];
  };
  risks: string[];
  opportunities: string[];
}
