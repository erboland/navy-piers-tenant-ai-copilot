import * as React from "react";
import { ArrowLeft, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { VendorSelector } from "../components/vendor-selector";
import {
  EnhancedChatMessage,
  type EnhancedMessage,
} from "../components/enhanced-chat-message";
import { LoadingState } from "../components/loading-state";
import { ScrollArea } from "../components/ui/scroll-area";
import { mockVendors } from "../lib/mock-data";
import {
  generateExecutiveSummary,
  generateStandardSummary,
} from "../lib/enhanced-mock-responses";

type SummaryType = "executive" | "standard" | null;

export function QuickInfoScreen() {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [summaryType, setSummaryType] = React.useState<SummaryType>(null);
  const [summary, setSummary] = React.useState<EnhancedMessage | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateSummary = (type: "executive" | "standard") => {
    if (!selectedVendor) return;

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    setIsLoading(true);
    setSummaryType(type);

    setTimeout(() => {
      const generatedSummary =
        type === "executive"
          ? generateExecutiveSummary(vendor.name)
          : generateStandardSummary(vendor.name);
      setSummary(generatedSummary);
      setIsLoading(false);
    }, 1200);
  };

  const summaryOptions = [
    {
      id: "standard",
      title: "Detailed Summary",
      description:
        "Comprehensive analysis with detailed insights and full context",
      icon: FileText,
      color: "var(--color-lake-blue)",
    },
    {
      id: "executive",
      title: "Executive Summary",
      description:
        "High-level overview with key metrics and strategic recommendations",
      icon: Briefcase,
      color: "var(--color-harbor-teal)",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl tracking-tight">Quick Info Sheets</h1>
            <p className="text-lg text-muted-foreground">
              Select a vendor and choose your preferred summary format
            </p>
            <div className="max-w-md">
              <VendorSelector
                value={selectedVendor}
                onValueChange={(value) => {
                  setSelectedVendor(value);
                  setSummary(null);
                  setSummaryType(null);
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container max-w-6xl mx-auto px-4 py-12">
            {!selectedVendor ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl mb-2">Select a Vendor</h2>
                <p className="text-muted-foreground">
                  Choose a vendor from the dropdown above to get started
                </p>
              </div>
            ) : !summary && !isLoading ? (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl mb-2">Choose Summary Type</h2>
                  <p className="text-muted-foreground">
                    Select the format that best suits your needs
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {summaryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Card
                        key={option.id}
                        className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group border-2"
                        onClick={() =>
                          handleGenerateSummary(
                            option.id as "executive" | "standard",
                          )
                        }
                        style={{
                          transition: "all var(--transition-base)",
                          borderRadius: "var(--radius-lg)",
                        }}
                      >
                        <CardHeader className="space-y-4 p-6">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${option.color}15`,
                              transition: "transform var(--transition-fast)",
                            }}
                          >
                            <Icon
                              className="w-7 h-7"
                              style={{ color: option.color }}
                            />
                          </div>
                          <div className="space-y-2">
                            <CardTitle className="text-xl">
                              {option.title}
                            </CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              {option.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Type Toggle */}
                {summary && (
                  <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Summary Type:
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            summaryType === "standard" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleGenerateSummary("standard")}
                          disabled={isLoading}
                        >
                          Detailed
                        </Button>
                        <Button
                          variant={
                            summaryType === "executive" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleGenerateSummary("executive")}
                          disabled={isLoading}
                        >
                          Executive
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <Card>
                    <CardContent className="p-8">
                      <LoadingState />
                    </CardContent>
                  </Card>
                )}

                {/* Summary Display */}
                {summary && !isLoading && (
                  <EnhancedChatMessage message={summary} />
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
