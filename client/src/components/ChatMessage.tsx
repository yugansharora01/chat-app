import { cn } from "@/lib/utils";
import { Pencil, Trash2, FileText, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  attachments?: Array<{ name: string; url: string; size: number }>;
  onEdit?: (newText: string) => void;
  onDelete?: () => void;
}

const ChatMessage = ({
  message,
  isUser,
  timestamp,
  attachments,
  onEdit,
  onDelete,
}: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);

  const handleSaveEdit = () => {
    if (onEdit && editText.trim()) {
      onEdit(editText);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-[var(--shadow-message)] transition-[var(--transition-smooth)] relative",
          isUser
            ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-fg))] rounded-br-md"
            : "bg-[hsl(var(--chat-ai-bg))] text-[hsl(var(--chat-ai-fg))] border border-border rounded-bl-md"
        )}
      >
        {isUser && !isEditing && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            {attachments && attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 hover:bg-background/70 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs opacity-60">
                      {(file.size / 1024).toFixed(1)}KB
                    </span>
                    <Download className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
            {message && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </p>
            )}
            {timestamp && (
              <span className="text-xs opacity-60 mt-1 block">
                {new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
