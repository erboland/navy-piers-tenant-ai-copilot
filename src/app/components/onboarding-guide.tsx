import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  HelpCircle,
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export function OnboardingGuide() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const steps = [
    {
      title: "Welcome to Navy Pier Tenant AI",
      description:
        "Your intelligent assistant for managing tenant data, lease agreements, and vendor performance.",
      content: (
        <div className="space-y-4 py-4">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold text-primary mb-2">Key Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span>
                  Instant access to lease abstracts and financial data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span>AI-powered answers with source citations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span>Executive & Detailed summary generation</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            This quick guide will walk you through the two main ways to interact
            with the system.
          </p>
        </div>
      ),
    },
    {
      title: "Quick Info Sheets",
      description: "Generate standardized reports for any vendor.",
      content: (
        <div className="space-y-4 py-4">
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-lake-blue)]/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-[var(--color-lake-blue)]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <span className="font-semibold block mb-1">
                Executive Summary
              </span>
              <p className="text-sm text-muted-foreground">
                High-level overview focusing on revenue, key risks, and
                strategic recommendations.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <span className="font-semibold block mb-1">Detailed Summary</span>
              <p className="text-sm text-muted-foreground">
                Comprehensive abstract including all lease terms, compliance
                status, and operational clauses.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ask Questions from AI",
      description:
        "Get specific answers from lease documents and financial records.",
      content: (
        <div className="space-y-4 py-4">
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-harbor-teal)]/10 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-[var(--color-harbor-teal)]" />
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>
                Select a vendor (Try <strong>Chef Art Smith's Reunion</strong>{" "}
                for a full lease demo)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>Ask a question like "What are the renewal terms?"</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">3.</span>
              <span>
                Review the answer, confidence level, and source citations
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      setStep(0);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          New User Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[step].title}</DialogTitle>
          <DialogDescription>{steps[step].description}</DialogDescription>
        </DialogHeader>

        {steps[step].content}

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
          <div className="flex gap-1 justify-center sm:justify-start flex-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack} size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button onClick={handleNext} size="sm">
              {step === steps.length - 1 ? "Get Started" : "Next"}
              {step < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
