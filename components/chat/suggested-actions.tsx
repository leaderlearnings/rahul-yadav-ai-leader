"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import type { UIMessage } from "@/lib/types";

interface SuggestedActionsProps {
  chatId: string;
  messages: Array<UIMessage>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  setInput: Dispatch<SetStateAction<string>>;
}

export function SuggestedActions({
  chatId,
  messages,
  append,
  setInput,
}: SuggestedActionsProps) {
  if (messages.length > 0) {
    return null;
  }

  const suggestedActions = [
    {
      title: "What is Rahul's background?",
      label: "Experience & background",
      action: "Tell me about Rahul's professional background and experience.",
    },
    {
      title: "What are Rahul's key skills?",
      label: "Skills & expertise",
      action: "What are Rahul's key skills and areas of expertise?",
    },
    {
      title: "What has Rahul written about?",
      label: "LinkedIn insights",
      action: "What topics has Rahul written about on LinkedIn?",
    },
    {
      title: "How can I reach Rahul?",
      label: "Contact Rahul",
      action: "How can I get in touch with Rahul?",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-2 w-full"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, "", `/chat/${chatId}`);
              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">{suggestedAction.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
