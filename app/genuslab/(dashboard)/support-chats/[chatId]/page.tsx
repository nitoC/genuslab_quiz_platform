"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge from "@/components/ui/Badge";
import { getSupportChat, replySupportChat, setSupportChatStatus } from "@/lib/api/apis";
import { CHAT_STATUS } from "@/features/support/chatStatus";
import { MdArrowBack, MdSend } from "react-icons/md";

const SENDER_STYLE: Record<string, string> = {
  USER: "bg-slate-100 text-slate-800 self-start rounded-tl-none",
  AI: "bg-blue-50 text-blue-900 self-start rounded-tl-none",
  STAFF: "bg-emerald-600 text-white self-end rounded-tr-none",
};

export default function SupportChatPage() {
  const { chatId } = useParams() as { chatId: string };
  const queryClient = useQueryClient();
  const [reply, setReply] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Polled so new user messages appear while staff have the chat open.
  const { data: chat, isLoading, isError } = useQuery({
    queryKey: ["support-chat", chatId],
    queryFn: async () => (await getSupportChat(chatId)).data?.payload,
    refetchInterval: 5000,
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages?.length]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["support-chat", chatId] });
    queryClient.invalidateQueries({ queryKey: ["support-chats"] });
    queryClient.invalidateQueries({ queryKey: ["support-chat-summary"] });
  };

  const send = useMutation({
    mutationFn: () => replySupportChat(chatId, reply.trim()),
    onSuccess: () => {
      setReply("");
      refresh();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Reply not sent. Please try again."),
  });

  const changeStatus = useMutation({
    mutationFn: (status: "AI" | "CLOSED") => setSupportChatStatus(chatId, status),
    onSuccess: (_, status) => {
      toast.success(status === "CLOSED" ? "Chat closed" : "Handed back to the AI");
      refresh();
    },
    onError: () => toast.error("Couldn't update the chat. Please try again."),
  });

  if (isLoading) return <p className="p-6 text-slate-400">Loading chat…</p>;
  if (isError || !chat) return <p className="p-6 text-rose-500">Couldn't load this chat.</p>;

  const closed = chat.status === "CLOSED";

  return (
    <div className="flex flex-col gap-6 w-full">
      <Link href="/genuslab/support-chats" className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800">
        <MdArrowBack /> All chats
      </Link>
      <AdminPageHeader title={chat.user?.name ?? "Support chat"} subtitle={`${chat.user?.email ?? ""}${chat.user?.phone ? ` · ${chat.user.phone}` : ""}`} />

      <AdminCard className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Badge status={CHAT_STATUS[chat.status]?.badge ?? "info"}>{CHAT_STATUS[chat.status]?.label ?? chat.status}</Badge>
          {chat.handoffReason && <span>Reason: {chat.handoffReason}</span>}
          {chat.assignedTo && <span>Handled by {chat.assignedTo.name}</span>}
        </div>
        {!closed && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeStatus.mutate("AI")}
              disabled={changeStatus.isPending || chat.status === "AI"}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Hand back to AI
            </button>
            <button
              type="button"
              onClick={() => changeStatus.mutate("CLOSED")}
              disabled={changeStatus.isPending}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
            >
              Close chat
            </button>
          </div>
        )}
      </AdminCard>

      <AdminCard className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
        {chat.messages.map((m: any) =>
          m.sender === "SYSTEM" ? (
            <p key={m.id} className="self-center rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
              {m.content}
            </p>
          ) : (
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${SENDER_STYLE[m.sender]}`}>
              <p className="mb-0.5 text-[11px] font-semibold opacity-70">
                {m.sender === "USER" ? chat.user?.name : m.sender === "AI" ? "AI assistant" : m.staff?.name || "Staff"}
                {" · "}
                {new Date(m.createdAt).toLocaleString()}
              </p>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ),
        )}
        <div ref={endRef} />
      </AdminCard>

      {closed ? (
        <p className="text-sm text-slate-400">This chat is closed. If the user writes again, a new chat starts.</p>
      ) : (
        <AdminCard>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (reply.trim()) send.mutate();
            }}
          >
            <label htmlFor="support-reply" className="sr-only">Reply</label>
            <textarea
              id="support-reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && reply.trim()) {
                  e.preventDefault();
                  send.mutate();
                }
              }}
              rows={2}
              maxLength={4000}
              placeholder="Write a reply. Enter sends, Shift+Enter for a new line."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!reply.trim() || send.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              <MdSend /> Send
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-400">
            Replying moves the chat to &quot;With staff&quot;; the AI stays quiet until you hand it back.
          </p>
        </AdminCard>
      )}
    </div>
  );
}
