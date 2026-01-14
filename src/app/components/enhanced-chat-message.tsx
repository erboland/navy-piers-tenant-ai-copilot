import * as React from "react";
import { AIMessage } from "./ai-message";
import { ChatMessage } from "./chat-message";

// Enhanced message type that supports structured Q&A data
export interface StructuredQAData {
  question: string;
  answer: string;
  source: {
    sections: string[];
    pages: string[];
    exactLanguage: string;
  };
  interpretation: string;
  confidence: {
    level: "High" | "Medium" | "Low";
    reason: string;
  };
  caveats: string;
  metadata: {
    documentId: string;
    definitionType: string;
    reviewRequired: boolean;
  };
  citations: string[];
}

export interface EnhancedMessage {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  structuredData?: StructuredQAData;
}

interface EnhancedChatMessageProps {
  message: EnhancedMessage;
}

export function EnhancedChatMessage({ message }: EnhancedChatMessageProps) {
  // If message has structured data, use the new AIMessage component
  if (message.role === "assistant" && message.structuredData) {
    return (
      <div className="w-full">
        {/* Show user question from structured data */}
        <div className="flex justify-end mb-3">
          <div className="bg-muted rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[70%]">
            <p className="text-sm text-foreground">{message.structuredData.question}</p>
          </div>
        </div>
        {/* Show AI answer with structured format */}
        <AIMessage
          question={message.structuredData.question}
          answer={message.structuredData.answer}
          source={message.structuredData.source}
          interpretation={message.structuredData.interpretation}
          confidence={message.structuredData.confidence}
          caveats={message.structuredData.caveats}
          metadata={message.structuredData.metadata}
          citations={message.structuredData.citations}
        />
      </div>
    );
  }

  // Otherwise use the traditional ChatMessage component
  return (
    <ChatMessage
      role={message.role}
      content={message.content}
      citations={message.citations}
    />
  );
}
