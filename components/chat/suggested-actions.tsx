"use client";

import { motion } from "framer-motion";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import type { VisibilityType } from "@/components/chat/visibility-selector";

interface SuggestedActionsProps {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

export function SuggestedActions({
  chatId,
  selectedVisibilityType,
  sendMessage,
}: SuggestedActionsProps) {
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
      label: "Contact & connect",
      action: "How can I get in touch or connect with Rahul?",
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
          <button
            type="button"
            onClick={() =>
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              })
            }
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex flex-col gap-1 w-full hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">{suggestedAction.label}</span>
          </button>
        </motion.div>
      ))}
    </div>
  );
}

