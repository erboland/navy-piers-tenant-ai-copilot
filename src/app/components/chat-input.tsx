import { Send } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-4xl mx-auto p-3 sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={disabled}
          className="min-h-[50px] sm:min-h-[60px] resize-none flex-1 text-sm sm:text-base"
          rows={2}
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          size="icon"
          className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] shrink-0"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}