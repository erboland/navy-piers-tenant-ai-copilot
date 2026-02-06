import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare } from "lucide-react";
import { OnboardingGuide } from "../components/onboarding-guide";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function HomeScreen() {
  const navigate = useNavigate();

  const options = [
    {
      id: "quick-info",
      title: "View Quick Info Sheets",
      description: "Access executive and standard summaries for tenant data",
      icon: FileText,
      path: "/quick-info",
      color: "var(--color-lake-blue)",
    },
    {
      id: "chat",
      title: "Ask Questions from AI",
      description: "Interactive chat with AI assistant for detailed insights",
      icon: MessageSquare,
      path: "/chat",
      color: "var(--color-harbor-teal)",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1
            className="text-5xl md:text-6xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Navy Pier Tenant AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent assistant for tenant, lease, and vendor data
            analysis
          </p>
          <div className="pt-4">
            <OnboardingGuide />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group border-2 hover:border-primary/20"
                onClick={() => navigate(option.path)}
                style={{
                  transition: "all var(--transition-base)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <CardHeader className="space-y-6 p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${option.color}15`,
                      transition: "transform var(--transition-fast)",
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: option.color }} />
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-2xl">{option.title}</CardTitle>
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
    </div>
  );
}
