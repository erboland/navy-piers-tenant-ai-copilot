# Shadcn UI Implementation Guide

## Overview

This guide explains how to implement the new AI Message component using Shadcn UI's design system and components.

---

## Files Created

### 1. Core Components

```
src/app/components/
├── ai-message.tsx                    ← Main AI message component
├── enhanced-chat-message.tsx         ← Wrapper that handles both formats
└── ai-chat-demo.tsx                  ← Demo/example usage
```

### 2. Data & Logic

```
src/app/lib/
└── enhanced-mock-responses.ts        ← Returns structured data
```

---

## Shadcn Components Used

The implementation uses these Shadcn UI components:

### Already Installed (✅)
- ✅ `Card` (CardHeader, CardContent, CardFooter)
- ✅ `Badge`
- ✅ `Button`
- ✅ `Separator`
- ✅ `ScrollArea`

### Need to Install (📦)
- 📦 `Collapsible` (CollapsibleTrigger, CollapsibleContent)

---

## Installation Steps

### Step 1: Install Missing Shadcn Components

```bash
npx shadcn@latest add collapsible
```

This will create:
- `src/app/components/ui/collapsible.tsx`

### Step 2: Install Required Icons

The component uses `lucide-react` icons (already installed):
- ✅ `ChevronDown`
- ✅ `ChevronRight`
- ✅ `FileText`
- ✅ `AlertCircle`
- ✅ `CheckCircle2`
- ✅ `Info`

---

## Component Architecture

### Component Hierarchy

```
EnhancedChatMessage (wrapper)
    ├─ User Question (right-aligned bubble)
    └─ AIMessage (main component)
        ├─ Card
        │   ├─ CardHeader
        │   │   ├─ AI Icon + Label
        │   │   └─ Confidence Badge
        │   ├─ CardContent
        │   │   └─ Answer Text (with blue border)
        │   ├─ Expandable Sections (3x)
        │   │   ├─ Collapsible (Source & Evidence)
        │   │   ├─ Collapsible (Interpretation Notes)
        │   │   └─ Collapsible (Confidence & Caveats)
        │   └─ CardFooter
        │       └─ Citations
```

---

## Usage Examples

### Example 1: Basic Usage

```tsx
import { AIMessage } from "@/app/components/ai-message";

function MyComponent() {
  return (
    <AIMessage
      question="What is the Tenant Notice Address?"
      answer={`Art Smith Reunion, LLC
Attention: Arthur Smith
600 East Grand Avenue
Chicago, IL 60611`}
      source={{
        sections: ["Section 18.4 (Notices)"],
        pages: ["Page 32"],
        exactLanguage: "\"All notices, demands...\""
      }}
      interpretation="The address is explicitly defined..."
      confidence={{
        level: "High",
        reason: "Explicitly stated in lease..."
      }}
      caveats="None identified."
      metadata={{
        documentId: "Chef_Art_Smith_Lease_May_11_2020",
        definitionType: "Explicit",
        reviewRequired: false
      }}
      citations={[
        "Chef Art Smith Lease - May 11, 2020",
        "Section 18.4 - Page 32"
      ]}
    />
  );
}
```

### Example 2: Using Enhanced Chat Message (Recommended)

```tsx
import { EnhancedChatMessage } from "@/app/components/enhanced-chat-message";
import { generateEnhancedCustomResponse } from "@/app/lib/enhanced-mock-responses";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  
  const handleSendMessage = (question: string) => {
    // Add user message
    const userMessage = { role: "user", content: question };
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response (with structured data if available)
    const aiResponse = generateEnhancedCustomResponse(question, vendorName);
    setMessages(prev => [...prev, aiResponse]);
  };

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <EnhancedChatMessage key={index} message={message} />
      ))}
    </div>
  );
}
```

### Example 3: Demo with All Examples

```tsx
import { AIChatDemo } from "@/app/components/ai-chat-demo";

function DemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Assistant Demo</h1>
      <AIChatDemo />
    </div>
  );
}
```

---

## Customization

### Theming with Shadcn

The component automatically adapts to your Shadcn theme:

```css
/* Your existing theme in globals.css or theme.css */
:root {
  --primary: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
  /* etc... */
}
```

The component uses these CSS variables:
- `--primary` - Answer border, confidence badge
- `--muted` - Question bubble background
- `--border` - Card borders
- `--foreground` - Text color
- `--muted-foreground` - Secondary text

### Color Customization

To customize confidence badge colors:

```tsx
// In ai-message.tsx
const getConfidenceColor = (level: string) => {
  switch (level) {
    case "High":
      return "bg-green-500";  // Change to your color
    case "Medium":
      return "bg-yellow-500"; // Change to your color
    case "Low":
      return "bg-orange-500"; // Change to your color
  }
};
```

### Spacing Customization

Adjust spacing via Tailwind classes:

```tsx
// In ai-message.tsx

// Card spacing
<Card className="shadow-sm border-border"> // Add: p-6 for more padding

// Answer text spacing
<div className="relative pl-4 border-l-4"> // Change pl-4 to pl-6

// Section spacing
<div className="space-y-0"> // Change to space-y-2
```

---

## Integration with Existing App

### Step 1: Update App.tsx

```tsx
// src/app/App.tsx
import { EnhancedChatMessage } from "./components/enhanced-chat-message";
import { generateEnhancedCustomResponse, generateExecutiveSummary, generateStandardSummary } from "./lib/enhanced-mock-responses";

export default function App() {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  
  const handleSendMessage = (content: string) => {
    if (!selectedVendor) return;

    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;

    const userMessage: EnhancedMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = generateEnhancedCustomResponse(content, vendor.name);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleExecutiveSummary = () => {
    const vendor = mockVendors.find((v) => v.id === selectedVendor);
    if (!vendor) return;
    
    const summary = generateExecutiveSummary(vendor.name);
    setMessages([summary]);
  };

  // ... rest of component

  return (
    // ... existing JSX
    <div className="messages-container">
      {messages.map((message, index) => (
        <EnhancedChatMessage key={index} message={message} />
      ))}
    </div>
  );
}
```

### Step 2: Update Type Imports

```tsx
// At the top of App.tsx
import type { EnhancedMessage } from "./components/enhanced-chat-message";
```

---

## Responsive Behavior

The component is fully responsive using Shadcn's approach:

### Desktop (> 768px)
```tsx
<div className="max-w-[85%] md:max-w-[70%]"> // Question bubble
```

### Mobile (< 768px)
```tsx
// Automatically adjusts via Tailwind breakpoints
// No additional configuration needed
```

---

## Accessibility Features

The component includes full ARIA support:

### Collapsible Sections

```tsx
<CollapsibleTrigger asChild>
  <Button
    role="button"
    aria-expanded={sourceOpen}
    aria-controls="source-content"
  >
    Source & Evidence
  </Button>
</CollapsibleTrigger>

<CollapsibleContent id="source-content">
  {/* Content */}
</CollapsibleContent>
```

### Keyboard Navigation
- ✅ Tab to navigate through sections
- ✅ Enter/Space to expand/collapse
- ✅ Focus indicators (via Shadcn Button)

### Screen Reader Support
- ✅ Proper heading hierarchy
- ✅ Aria labels on interactive elements
- ✅ Semantic HTML structure

---

## Performance Considerations

### Optimizations Built-In

1. **Lazy Rendering**: Collapsible content only renders when expanded
2. **React.memo**: Consider wrapping for large lists
3. **Efficient Re-renders**: Uses local state for expand/collapse

### Example with React.memo

```tsx
import { memo } from "react";

export const AIMessage = memo(function AIMessage({ ... }) {
  // Component code
});
```

---

## Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AIMessage } from "./ai-message";

describe("AIMessage", () => {
  it("renders answer prominently", () => {
    render(<AIMessage {...mockProps} />);
    expect(screen.getByText(mockProps.answer)).toBeInTheDocument();
  });

  it("expands source section on click", () => {
    render(<AIMessage {...mockProps} />);
    const sourceButton = screen.getByText("Source & Evidence");
    fireEvent.click(sourceButton);
    expect(screen.getByText(/Exact Contract Language/)).toBeVisible();
  });

  it("shows correct confidence badge", () => {
    render(<AIMessage {...mockProps} confidence={{ level: "High" }} />);
    expect(screen.getByText("High Confidence")).toBeInTheDocument();
  });
});
```

---

## Shadcn Styling Patterns

### Using cn() Utility

```tsx
import { cn } from "@/app/lib/utils";

<div className={cn(
  "base-styles",
  isExpanded && "expanded-styles",
  variant === "primary" && "primary-styles"
)}>
```

### Shadcn Color Patterns

```tsx
// Success/Green
className="text-green-600 dark:text-green-500"

// Warning/Yellow  
className="text-yellow-600 dark:text-yellow-500"

// Error/Red
className="text-red-600 dark:text-red-500"

// Info/Blue
className="text-blue-600 dark:text-blue-500"
```

### Shadcn Spacing Patterns

```tsx
// Card spacing
<Card className="p-6">        // Padding
<CardHeader className="pb-3"> // Bottom padding
<CardContent className="pb-4"> // Bottom padding

// Gap spacing
<div className="space-y-4">   // Vertical gap
<div className="gap-2">        // Flex gap
```

---

## Common Issues & Solutions

### Issue 1: Collapsible Not Found

**Error:** `Cannot find module 'collapsible'`

**Solution:**
```bash
npx shadcn@latest add collapsible
```

### Issue 2: Icons Not Rendering

**Error:** Icons show as empty boxes

**Solution:** Verify lucide-react is installed:
```bash
npm install lucide-react
```

### Issue 3: Dark Mode Issues

**Problem:** Colors don't adapt to dark mode

**Solution:** Use Shadcn's color tokens:
```tsx
// ❌ Don't use fixed colors
className="bg-blue-100 text-blue-900"

// ✅ Use Shadcn tokens
className="bg-blue-50 dark:bg-blue-950/20 text-foreground"
```

### Issue 4: TypeScript Errors

**Error:** Type errors with confidence level

**Solution:** Ensure proper type imports:
```tsx
import type { StructuredQAData } from "./enhanced-chat-message";
```

---

## Migration from Old to New Format

### Before (Old ChatMessage)

```tsx
<ChatMessage
  role="assistant"
  content={markdownContent}
  citations={citations}
/>
```

### After (New Enhanced Format)

```tsx
<EnhancedChatMessage
  message={{
    role: "assistant",
    content: markdownContent,  // Fallback
    citations: citations,
    structuredData: qaData     // Optional: enables new UI
  }}
/>
```

**Benefits:**
- ✅ Backward compatible (works without structuredData)
- ✅ Progressive enhancement (better UI when data available)
- ✅ Gradual migration path

---

## Advanced Customization

### Custom Confidence Badge

```tsx
// Create custom badge component
function CustomConfidenceBadge({ level }: { level: string }) {
  return (
    <Badge variant={getVariant(level)} className="gap-2">
      <span className="text-xs">🎯</span>
      <span>{level}</span>
    </Badge>
  );
}

// Use in AIMessage
<CustomConfidenceBadge level={confidence.level} />
```

### Custom Section Icons

```tsx
import { Database, BookOpen, Shield } from "lucide-react";

// Customize icons per section
const sectionIcons = {
  source: <Database className="h-4 w-4" />,
  interpretation: <BookOpen className="h-4 w-4" />,
  confidence: <Shield className="h-4 w-4" />,
};
```

---

## Summary

### What You Get

✅ **Fully Themed**: Uses your Shadcn theme automatically
✅ **Accessible**: ARIA labels, keyboard nav, screen readers
✅ **Responsive**: Mobile-first, works on all devices
✅ **Dark Mode**: Automatic dark mode support
✅ **Type Safe**: Full TypeScript support
✅ **Extensible**: Easy to customize and extend

### Next Steps

1. **Install**: Run `npx shadcn@latest add collapsible`
2. **Copy**: Use the components from this guide
3. **Test**: Run `npm run dev` and test with demo
4. **Integrate**: Replace old ChatMessage with EnhancedChatMessage
5. **Customize**: Adjust colors, spacing, etc. to match your brand

---

**Status:** ✅ Ready for Implementation with Shadcn UI
**Design System:** Shadcn + Tailwind + Radix UI
**Components:** All production-ready and tested
