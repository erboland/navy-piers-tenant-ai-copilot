import { FileText, LayoutList } from "lucide-react";
import { Button } from "./ui/button";

interface QuickStartButtonsProps {
  onExecutiveSummary: () => void;
  onStandardSummary: () => void;
  disabled?: boolean;
}

export function QuickStartButtons({
  onExecutiveSummary,
  onStandardSummary,
  disabled = false,
}: QuickStartButtonsProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <Button
        onClick={onExecutiveSummary}
        disabled={disabled}
        size="lg"
        className="gap-2"
      >
        <FileText className="h-5 w-5" />
        Executive Persona Summary
      </Button>
      <Button
        onClick={onStandardSummary}
        disabled={disabled}
        size="lg"
        variant="outline"
        className="gap-2"
      >
        <LayoutList className="h-5 w-5" />
        Standard / Detailed Summary
      </Button>
    </div>
  );
}
