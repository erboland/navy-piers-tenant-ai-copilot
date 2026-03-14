/**
 * Chat Welcome Component - Premium Million-Dollar AI Service Design
 *
 * Features:
 * - Mesh gradient background
 * - Glassmorphism input with focus glow
 * - Grid-based action chips with icons
 * - Refined typography hierarchy
 */

import * as React from "react";
import {
  Send,
  Paperclip,
  Building2,
  FileText,
  CalendarCheck,
  Wrench,
  Shield,
  Clock,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { NavyPierLogo } from "./navy-pier-logo";

interface ChatWelcomeProps {
  /** Currently selected vendor */
  selectedVendor: string;

  /** Callback when user sends a message */
  onSendMessage: (message: string) => void;

  /** Whether input is disabled */
  disabled?: boolean;
}

/**
 * Example prompts with icons for premium feel
 */
const examplePrompts = [
  {
    text: "What is the legal name of the tenant?",
    icon: FileText,
  },
  {
    text: "What is the size of the Premises?",
    icon: Building2,
  },
  {
    text: "Is there an Option to Renew?",
    icon: CalendarCheck,
  },
  {
    text: "What are the Tenant's Responsibility to Repair?",
    icon: Wrench,
  },
  {
    text: "What are the insurance requirements?",
    icon: Shield,
  },
  {
    text: "Show me the lease term details",
    icon: Clock,
  },
];

/**
 * ChatWelcome Component - Premium Design
 */
export function ChatWelcome({
  selectedVendor,
  onSendMessage,
  disabled = false,
}: ChatWelcomeProps) {
  const [message, setMessage] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!disabled) {
      onSendMessage(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Mesh Gradient Background - Subtle and Premium */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="w-full max-w-4xl space-y-10 sm:space-y-14">
        {/* Navy Pier Logo - Official Branding */}
        <div className="flex justify-center">
          <div className="w-32 sm:w-40 md:w-48">
            <NavyPierLogo className="w-full h-auto" />
          </div>
        </div>

        {/* Typography - Refined Hierarchy */}
        <div className="text-center space-y-3">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-semibold"
            style={{
              fontFamily: "Inter, var(--font-heading), system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            How can I help you today?
          </h1>
          <p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{
              lineHeight: "1.5",
              marginTop: "0.75rem",
            }}
          >
            {selectedVendor
              ? "Ask questions about tenant data and get AI-powered insights"
              : "Select a vendor above to begin"}
          </p>
        </div>

        {/* Premium Glassmorphism Input */}
        <form onSubmit={handleSubmit}>
          <div
            className={`relative transition-all duration-300 ${
              isFocused ? "scale-[1.02]" : "scale-100"
            }`}
          >
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur transition-all duration-300 ${
                isFocused ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask a question..."
                disabled={disabled || !selectedVendor}
                className="min-h-[80px] sm:min-h-[100px] resize-none pr-28 text-base sm:text-lg rounded-3xl
                           border-0 ring-1 ring-gray-200/50
                           bg-white/80 backdrop-blur-xl
                           focus:ring-2 focus:ring-cyan-500/30
                           transition-all duration-300
                           placeholder:text-muted-foreground/60"
                style={{
                  boxShadow: isFocused
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 60px -15px rgba(0, 201, 224, 0.3)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
                }}
                rows={3}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-gray-100/80"
                  disabled={disabled || !selectedVendor}
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button
                  type="submit"
                  disabled={disabled || !message.trim() || !selectedVendor}
                  size="icon"
                  className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg shadow-cyan-500/30"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Premium Action Chips - Grid Layout with Icons */}
        {selectedVendor && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-6 max-w-5xl mx-auto">
            {examplePrompts.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  disabled={disabled}
                  className="group relative px-4 py-3.5 rounded-xl bg-white/60 backdrop-blur-sm
                             border border-gray-200/60 text-left text-sm sm:text-base
                             transition-all duration-300
                             hover:bg-white/90 hover:border-gray-300/60 hover:shadow-lg hover:-translate-y-0.5
                             active:translate-y-0
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 p-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50
                                  group-hover:from-cyan-50 group-hover:to-cyan-100/50
                                  transition-colors duration-300"
                    >
                      <Icon className="h-4 w-4 text-gray-600 group-hover:text-cyan-700 transition-colors" />
                    </div>
                    <span className="flex-1 leading-relaxed text-gray-700 group-hover:text-gray-900 transition-colors">
                      {prompt.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
