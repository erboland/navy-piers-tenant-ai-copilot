import * as React from "react";
import { MessageSquare, Database } from "lucide-react";
import { ChatInput } from "./components/chat-input";
import { ChatMessage } from "./components/chat-message";
import { DataExplorer } from "./components/data-explorer";
import { LoadingState } from "./components/loading-state";
import { QuickStartButtons } from "./components/quick-start-buttons";
import { VendorSelector } from "./components/vendor-selector";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { mockVendors } from "./lib/mock-data";
import {
  generateCustomResponse,
  generateExecutiveSummary,
  generateStandardSummary,
} from "./lib/mock-responses";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export default function App() {
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeView, setActiveView] = React.useState<"chat" | "data">("chat");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!selectedVendor) {
      return;
    }

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateCustomResponse(content, vendor.name);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleExecutiveSummary = () => {
    if (!selectedVendor) return;

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    setIsLoading(true);

    setTimeout(() => {
      const summary = generateExecutiveSummary(vendor.name);
      setMessages([summary]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStandardSummary = () => {
    if (!selectedVendor) return;

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    setIsLoading(true);

    setTimeout(() => {
      const summary = generateStandardSummary(vendor.name);
      setMessages([summary]);
      setIsLoading(false);
    }, 1500);
  };

  const showInitialState = messages.length === 0 && !isLoading;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      {selectedVendor && (
        <aside className="w-64 border-r bg-card flex flex-col h-full">
          <div className="p-4 border-b space-y-4">
            <h2 className="font-semibold">Vendor</h2>
            <VendorSelector
              value={selectedVendor}
              onValueChange={setSelectedVendor}
            />
          </div>
          <Separator />
          <div className="p-4 border-b">
            <h2 className="font-semibold">Navigation</h2>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <Button
                variant={activeView === "chat" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveView("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat View
              </Button>
              <Button
                variant={activeView === "data" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveView("data")}
              >
                <Database className="mr-2 h-4 w-4" />
                Data Explorer
              </Button>
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card shadow-sm shrink-0">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
                  Tenant AI Copilot
                </h1>
                <p className="text-muted-foreground">
                  Query and analyze tenant, lease, and vendor data using natural language
                </p>
              </div>
              {!selectedVendor && (
                <>
                  <Separator className="w-24" />
                  <div className="w-full max-w-md">
                    <VendorSelector
                      value={selectedVendor}
                      onValueChange={setSelectedVendor}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedVendor ? (
            <>
              {activeView === "chat" ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      {showInitialState ? (
                        <div className="container max-w-3xl mx-auto px-4 py-12">
                          <div className="flex flex-col items-center space-y-8">
                            <div className="text-center space-y-3">
                              <h2 className="scroll-m-20 text-3xl tracking-tight">
                                Get Started
                              </h2>
                              <p className="text-lg text-muted-foreground">
                                Choose a quick-start report or ask a specific question below
                              </p>
                            </div>
                            <QuickStartButtons
                              onExecutiveSummary={handleExecutiveSummary}
                              onStandardSummary={handleStandardSummary}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="container max-w-4xl mx-auto px-4 py-8 pb-4">
                          <div className="space-y-6">
                            {messages.map((message, index) => (
                              <ChatMessage key={index} {...message} />
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
                  <div className="border-t bg-background shrink-0">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <DataExplorer vendorId={selectedVendor} />
                </ScrollArea>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <h2 className="scroll-m-20 text-3xl tracking-tight">
                  Welcome to Tenant AI Copilot
                </h2>
                <p className="text-muted-foreground">
                  Please select a vendor from the dropdown above to get started with AI-powered insights
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}