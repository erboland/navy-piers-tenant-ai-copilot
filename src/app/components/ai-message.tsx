import * as React from "react";
import { cn } from "@/app/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, ChevronRight, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";

interface AIMessageProps {
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

export function AIMessage({
  question,
  answer,
  source,
  interpretation,
  confidence,
  caveats,
  metadata,
  citations,
}: AIMessageProps) {
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [interpretationOpen, setInterpretationOpen] = React.useState(false);
  const [confidenceOpen, setConfidenceOpen] = React.useState(false);

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConfidenceBadgeVariant = (level: string) => {
    switch (level) {
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="bg-muted rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[70%]">
          <p className="text-sm text-foreground">{question}</p>
        </div>
      </div>

      {/* AI Answer Card */}
      <Card className="shadow-sm border-border">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                <span className="text-xs">🤖</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                AI Assistant
              </span>
            </div>
            <Badge 
              variant={getConfidenceBadgeVariant(confidence.level)}
              className="gap-1.5"
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", getConfidenceColor(confidence.level))} />
              {confidence.level} Confidence
            </Badge>
          </div>
        </CardHeader>

        {/* Direct Answer */}
        <CardContent className="pb-4">
          <div className="relative pl-4 border-l-4 border-primary">
            <p className="text-lg font-semibold leading-relaxed text-foreground whitespace-pre-line">
              {answer}
            </p>
          </div>
        </CardContent>

        {/* Expandable Sections */}
        <div className="px-6 space-y-0">
          {/* Source & Evidence */}
          <Collapsible open={sourceOpen} onOpenChange={setSourceOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 px-0 py-3 h-auto font-normal"
              >
                <div className="flex items-center gap-2">
                  {sourceOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Source & Evidence</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Verified from lease
                </Badge>
              </Button>
            </CollapsibleTrigger>
            <Separator />
            <CollapsibleContent className="pt-4 pb-4 space-y-3 bg-blue-50/50 dark:bg-blue-950/10 -mx-6 px-6">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Document Section(s)</p>
                    <p className="text-sm text-foreground">{source.sections.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Page(s)</p>
                    <p className="text-sm text-foreground">{source.pages.join(", ")}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Exact Contract Language</p>
                <blockquote className="border-l-2 border-primary/30 pl-4 py-2 bg-background rounded-r-lg">
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {source.exactLanguage}
                  </p>
                </blockquote>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Interpretation Notes */}
          <Collapsible open={interpretationOpen} onOpenChange={setInterpretationOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-muted px-0 py-3 h-auto font-normal"
              >
                <div className="flex items-center gap-2">
                  {interpretationOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Interpretation Notes</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Additional context
                </Badge>
              </Button>
            </CollapsibleTrigger>
            <Separator />
            <CollapsibleContent className="pt-4 pb-4 bg-muted/30 -mx-6 px-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {interpretation}
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Confidence & Caveats */}
          <Collapsible open={confidenceOpen} onOpenChange={setConfidenceOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-yellow-50 dark:hover:bg-yellow-950/20 px-0 py-3 h-auto font-normal"
              >
                <div className="flex items-center gap-2">
                  {confidenceOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Confidence & Caveats</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Review details
                </Badge>
              </Button>
            </CollapsibleTrigger>
            <Separator />
            <CollapsibleContent className="pt-4 pb-4 space-y-4 bg-yellow-50/50 dark:bg-yellow-950/10 -mx-6 px-6">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Confidence: {confidence.level}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reason: {confidence.reason}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Caveats & Exceptions</p>
                    <p className="text-sm text-muted-foreground mt-1">{caveats}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Traceability Metadata</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Document ID: {metadata.documentId}</li>
                      <li>• Definition Type: {metadata.definitionType}</li>
                      <li>• Review Required: {metadata.reviewRequired ? "Yes" : "No"}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer Citations */}
        <CardFooter className="bg-muted/30 mt-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {citations.map((citation, index) => (
              <React.Fragment key={index}>
                <span>{citation}</span>
                {index < citations.length - 1 && <span className="text-muted-foreground/50">•</span>}
              </React.Fragment>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
