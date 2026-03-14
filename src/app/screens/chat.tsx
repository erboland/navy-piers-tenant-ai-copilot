import * as React from "react";
import { Plus } from "lucide-react";
import { ChatInput } from "../components/chat-input";
import {
  EnhancedChatMessage,
  type EnhancedMessage,
} from "../components/enhanced-chat-message";
import { ChatWelcome } from "../components/chat-welcome";
import { VendorSelector } from "../components/vendor-selector";
import { LoadingState } from "../components/loading-state";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { apiClient, ApiError } from "../services/api-client";
import { toApiVendorId } from "../utils/vendor-mapping";

export function ChatScreen() {
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [conversationId, setConversationId] = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<EnhancedMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset conversation when vendor changes
  React.useEffect(() => {
    if (conversationId && messages.length > 0) {
      handleNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVendor]);

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedVendor) return;

    // Add user message to UI immediately (optimistic update)
    const userMessage: EnhancedMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiVendorId = toApiVendorId(selectedVendor);

      // Create conversation on first message
      if (!conversationId) {
        const title = content.substring(0, 50);
        const conversation = await apiClient.createConversation(apiVendorId, title);
        setConversationId(conversation.id);

        // Send first message
        const response = await apiClient.sendMessageInConversation(
          conversation.id,
          content
        );

        // Replace user message with backend version and add assistant message
        setMessages([
          {
            role: response.data.userMessage.role,
            content: response.data.userMessage.content,
            citations: response.data.userMessage.citations || undefined,
            structuredData: response.data.userMessage.structuredData || undefined,
          },
          {
            role: response.data.assistantMessage.role,
            content: response.data.assistantMessage.content,
            citations: response.data.assistantMessage.citations || undefined,
            structuredData: response.data.assistantMessage.structuredData || undefined,
          },
        ]);
      } else {
        // Send message to existing conversation
        const response = await apiClient.sendMessageInConversation(
          conversationId,
          content
        );

        // Add assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: response.data.assistantMessage.role,
            content: response.data.assistantMessage.content,
            citations: response.data.assistantMessage.citations || undefined,
            structuredData: response.data.assistantMessage.structuredData || undefined,
          },
        ]);
      }
    } catch (error) {
      // Error handling
      const errorMessage: EnhancedMessage = {
        role: "assistant",
        content:
          error instanceof ApiError
            ? `Sorry, I encountered an error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("[Chat] Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Premium Header with Context Bar */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-sm shrink-0">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1
                className="text-xl sm:text-2xl tracking-tight font-semibold"
                style={{
                  fontFamily: "Inter, var(--font-heading), system-ui, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Ask Questions from AI
              </h1>
              {selectedVendor && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Active context: <span className="font-medium text-gray-700">{selectedVendor}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-64">
                <VendorSelector
                  value={selectedVendor}
                  onValueChange={setSelectedVendor}
                />
              </div>
              {conversationId && (
                <Button
                  variant="outline"
                  onClick={handleNewChat}
                  className="hidden sm:flex rounded-xl border-gray-200/60 hover:bg-gray-50/80 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Welcome or Messages */}
      <div className="flex-1 overflow-hidden">
        {showWelcome ? (
          <ChatWelcome
            selectedVendor={selectedVendor}
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        ) : (
          <ScrollArea className="h-full">
            <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message, index) => (
                  <EnhancedChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 sm:px-6 py-3 sm:py-4">
                      <LoadingState />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Chat Input - Only show when NOT on welcome screen */}
      {!showWelcome && (
        <div className="shrink-0 border-t bg-card">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!selectedVendor || isLoading}
          />
        </div>
      )}

      {/* Mobile FAB for new chat */}
      {conversationId && (
        <Button
          onClick={handleNewChat}
          className="fixed bottom-20 right-4 sm:hidden rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
