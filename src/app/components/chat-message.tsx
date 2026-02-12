import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/utils";
import { FileText, ClipboardList, Info, AlertTriangle } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  const isDetailedSummary = content.includes("# Detailed Summary");

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-6 py-5 shadow-sm transition-all duration-200",
          role === "user"
            ? "bg-primary text-primary-foreground max-w-[85%] md:max-w-[75%] rounded-tr-none"
            : cn(
                "bg-card border max-w-full rounded-tl-none",
                isDetailedSummary && "border-primary/20 shadow-md ring-1 ring-primary/5"
              ),
        )}
      >
        {role === "assistant" ? (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-heading prose-h1:text-3xl prose-h1:text-primary prose-h1:mb-6 prose-h2:text-2xl prose-h2:text-primary/90 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-xl prose-h3:text-primary/80 prose-h3:mt-6">
            {isDetailedSummary && (
              <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 w-fit">
                <ClipboardList className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Lease Abstract & Detailed Analysis</span>
              </div>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="my-6 w-full overflow-hidden rounded-xl border border-border shadow-sm">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50 border-b border-border">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-border">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="transition-colors hover:bg-muted/30">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="h-10 px-4 text-left align-middle font-semibold text-foreground uppercase tracking-wider text-[10px]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-4 align-middle text-muted-foreground leading-relaxed">
                    {children}
                  </td>
                ),
                ul: ({ children }) => (
                  <ul className="my-4 space-y-2 list-none pl-0">
                    {children}
                  </ul>
                ),
                li: ({ children }) => {
                  // Check if content matches "Key: Value" or "**Key:** Value"
                  const contentText = React.Children.toArray(children).join("");
                  const isKeyValue = contentText.includes(":") || (typeof children === "string" && children.includes(":"));
                  
                  if (isKeyValue) {
                    return (
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pb-2 border-b border-border/40 last:border-0 group">
                        <span className="shrink-0 font-medium text-foreground/80 sm:w-1/3 group-hover:text-primary transition-colors">
                          {React.Children.map(children, child => {
                            if (React.isValidElement(child) && child.type === 'strong') {
                              return child.props.children;
                            }
                            if (typeof child === 'string' && child.includes(':')) {
                              return child.split(':')[0].trim();
                            }
                            return child;
                          })}
                        </span>
                        <span className="text-muted-foreground flex-1">
                          {React.Children.map(children, child => {
                            if (React.isValidElement(child) && child.type === 'strong') {
                              return null;
                            }
                            if (typeof child === 'string' && child.includes(':')) {
                              return child.split(':')[1].trim();
                            }
                            return child;
                          })}
                        </span>
                      </li>
                    );
                  }
                  
                  return (
                    <li className="flex gap-3 items-start py-1">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      <div className="text-muted-foreground flex-1">{children}</div>
                    </li>
                  );
                },
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="relative rounded bg-muted/80 px-[0.4rem] py-[0.2rem] font-mono text-[0.85rem] font-medium text-foreground">
                      {children}
                    </code>
                  ) : (
                    <div className="my-4 rounded-lg bg-muted/50 p-4 border border-border">
                      <code className={cn("block font-mono text-sm overflow-x-auto", className)}>{children}</code>
                    </div>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/20 pl-6 py-2 italic text-muted-foreground bg-primary/5 rounded-r-lg my-6">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
            {citations && citations.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/60 bg-muted/20 -mx-6 px-6 pb-2 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-3.5 h-3.5 text-primary/60" />
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                    Source Citations
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {citations.map((citation, index) => (
                    <li key={index} className="flex gap-2 items-start group">
                      <span className="text-[10px] font-bold bg-primary/10 text-primary w-5 h-5 flex items-center justify-center rounded shrink-0 group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs text-muted-foreground leading-normal line-clamp-2 italic">
                        {citation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
      </div>
    </div>
  );
}