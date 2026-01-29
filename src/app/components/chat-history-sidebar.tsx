import * as React from "react";
import { Plus, MessageSquare, Trash2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatHistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatHistorySidebarProps) {
  const navigate = useNavigate();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          style={{
            borderRadius: "var(--radius-md)",
            transition: "all var(--transition-fast)",
          }}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat Sessions */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No chat history yet
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group relative rounded-md p-3 cursor-pointer transition-colors",
                  activeSessionId === session.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/50",
                )}
                onClick={() => onSelectSession(session.id)}
                style={{
                  transition: "background-color var(--transition-fast)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate mb-1">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(session.timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/home")}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </aside>
  );
}
