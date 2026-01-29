import * as React from "react";
import { ChatInput } from "../components/chat-input";
import {
  EnhancedChatMessage,
  type EnhancedMessage,
} from "../components/enhanced-chat-message";
import {
  ChatHistorySidebar,
  type ChatSession,
} from "../components/chat-history-sidebar";
import { VendorSelector } from "../components/vendor-selector";
import { LoadingState } from "../components/loading-state";
import { ScrollArea } from "../components/ui/scroll-area";
import { mockVendors } from "../lib/mock-data";
import { generateEnhancedCustomResponse } from "../lib/enhanced-mock-responses";

export function ChatScreen() {
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null,
  );
  const [messages, setMessages] = React.useState<EnhancedMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    setActiveSessionId(newSessionId);
    setMessages([]);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // In a real app, load messages for this session from storage
    setMessages([]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedVendor) return;
    if (!activeSessionId) createNewChat();

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    const userMessage: EnhancedMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Update or create session
    const sessionTitle =
      content.length > 50 ? content.substring(0, 50) + "..." : content;
    const currentSessionId = activeSessionId || `session-${Date.now()}`;

    setSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === currentSessionId);
      const newSession: ChatSession = {
        id: currentSessionId,
        title: sessionTitle,
        timestamp: new Date(),
        preview: content,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newSession;
        return updated;
      }
      return [newSession, ...prev];
    });

    if (!activeSessionId) {
      setActiveSessionId(currentSessionId);
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateEnhancedCustomResponse(content, vendor.name);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const showWelcomeState = !activeSessionId && messages.length === 0;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={createNewChat}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card shadow-sm shrink-0">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl tracking-tight">
                  Ask Questions from AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Interactive assistant for detailed tenant insights
                </p>
              </div>
              <div className="w-64">
                <VendorSelector
                  value={selectedVendor}
                  onValueChange={setSelectedVendor}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {showWelcomeState ? (
              <div className="container max-w-3xl mx-auto px-4 py-16">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl mb-3">Start a Conversation</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      {selectedVendor
                        ? "Ask questions about tenant data and get AI-powered insights"
                        : "Select a vendor from the dropdown above to begin"}
                    </p>
                  </div>
                  {selectedVendor && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
                      {[
                        "What are the key lease terms?",
                        "Show me financial performance",
                        "Are there any compliance issues?",
                        "What's the contract renewal date?",
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(suggestion)}
                          className="p-4 text-left border rounded-lg hover:bg-accent/50 transition-colors text-sm"
                          style={{
                            borderRadius: "var(--radius-md)",
                            transition:
                              "background-color var(--transition-fast)",
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="container max-w-4xl mx-auto px-4 py-8 pb-4">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <EnhancedChatMessage key={index} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-6 py-4">
                        <LoadingState />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Input */}
        <div className="border-t bg-background shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || !selectedVendor}
          />
        </div>
      </div>
    </div>
  );
}
