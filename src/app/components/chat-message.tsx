import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-6 py-4 shadow-sm",
          role === "user"
            ? "bg-primary text-primary-foreground max-w-[80%]"
            : "bg-card border max-w-full"
        )}
      >
        {role === "assistant" ? (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-h1:text-4xl prose-h1:tracking-tight prose-h2:text-3xl prose-h2:tracking-tight prose-h3:text-2xl prose-h3:tracking-tight">
            <ReactMarkdown
              components={{
                table: ({ children }) => (
                  <div className="my-6 w-full overflow-y-auto">
                    <table className="w-full">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="[&_tr:last-child]:border-0">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    {children}
                  </td>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
            {citations && citations.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-semibold mb-2 text-foreground">Sources:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {citations.map((citation, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-primary font-medium">[{index + 1}]</span>
                      <span>{citation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
}