import type { BadgeStatus } from "@/components/ui/Badge";

// Labels for SupportChatStatus in the staff inbox.
export const CHAT_STATUS: Record<string, { label: string; badge: BadgeStatus }> = {
  WAITING: { label: "Waiting for staff", badge: "error" },
  HUMAN: { label: "With staff", badge: "warning" },
  AI: { label: "AI assistant", badge: "info" },
  CLOSED: { label: "Closed", badge: "inactive" },
};
