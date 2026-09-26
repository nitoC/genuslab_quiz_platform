"use client";

import {
  closeSupportConversation,
  getSupportConversation,
  requestSupportHuman,
  sendSupportMessage,
} from "@/lib/api/apis";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaCircleNotch,
  FaHeadset,
  FaCircleInfo,
} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import { useSocket } from "@/store/useSocket";

type Sender = "USER" | "AI" | "STAFF" | "SYSTEM";
type Mode = "AI" | "WAITING" | "HUMAN" | "CLOSED";

interface Message {
  id: string;
  sender: Sender;
  content: string;
  staffName?: string;
}

const fromServer = (m: any): Message => ({
  id: m.id,
  sender: m.sender,
  content: m.content,
  staffName: m.staff?.name,
});

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("AI");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket((s: any) => s.socket);

  // The conversation lives on the server, so it survives reloads and
  // devices, and staff can see it.
  const load = useCallback(async () => {
    try {
      const res = await getSupportConversation();
      const convo = res.data?.payload;
      setMessages(convo ? convo.messages.map(fromServer) : []);
      setMode(convo?.status ?? "AI");
    } catch {
      toast.error("Couldn't load your support chat. Please refresh.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Staff replies (and hand-back/close notes) arrive live.
  useEffect(() => {
    if (!socket) return;
    const onMessage = (m: any) => {
      setMessages((prev) =>
        prev.some((p) => p.id === m.id) ? prev : [...prev, fromServer(m)],
      );
      if (m.sender === "STAFF") setMode("HUMAN");
      if (m.status) setMode(m.status === "CLOSED" ? "CLOSED" : m.status);
    };
    socket.on("support-message", onMessage);
    return () => socket.off("support-message", onMessage);
  }, [socket]);

  useEffect(() => {
    if (isLoaded) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    // A closed chat starts fresh on the next message.
    if (mode === "CLOSED") {
      setMessages([]);
      setMode("AI");
    }

    const now = Date.now();
    const replyId = `r${now}`;
    // While the AI has the chat, show its typing bubble straight away; the
    // server only answers once the first words are ready.
    const aiTurn = mode === "AI" || mode === "CLOSED";
    setMessages((prev) => [
      ...prev,
      { id: `u${now}`, sender: "USER", content: text },
      ...(aiTurn ? [{ id: replyId, sender: "AI" as Sender, content: "" }] : []),
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendSupportMessage(text);
      const replyMode = response.headers?.["x-support-mode"];

      if (replyMode === "human" || replyMode === "error") {
        // Joined the staff queue, or the AI is unavailable: show the notice
        // (if any) as a system line in place of the typing bubble.
        const notice = await readAll(response.data);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== replyId),
          ...(notice ? [{ id: replyId, sender: "SYSTEM" as Sender, content: notice }] : []),
        ]);
        if (replyMode === "human") setMode((m) => (m === "HUMAN" ? "HUMAN" : "WAITING"));
        return;
      }

      const reader = (response.data as ReadableStream).getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: full } : m)),
        );
      }
      // An empty reply would leave the typing bubble spinning forever.
      if (!full.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId
              ? { ...m, sender: "SYSTEM", content: "No reply came back. Please ask again, or tap Talk to a person." }
              : m,
          ),
        );
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const text =
        status === 429
          ? "You're sending messages too quickly. Please wait a moment and try again."
          : "Sorry, your message couldn't be sent. Please try again.";
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== replyId),
        { id: replyId, sender: "SYSTEM", content: text },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const talkToPerson = async () => {
    try {
      await requestSupportHuman("Tapped Talk to a person");
      await load();
      toast.success("Our support team has been notified");
    } catch {
      toast.error("Couldn't reach support. Please try again.");
    }
  };

  const endChat = async () => {
    try {
      await closeSupportConversation();
      setMessages([]);
      setMode("AI");
    } catch {
      toast.error("Couldn't end the chat. Please try again.");
    }
  };

  const banner =
    mode === "WAITING"
      ? "Waiting for a member of our support team. They'll reply here, and you'll get a notification."
      : mode === "HUMAN"
        ? "You're chatting with our support team."
        : null;

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        <Header title="Support" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 max-w-5xl w-full mx-auto gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-grey">
              {mode === "AI" || mode === "CLOSED"
                ? "Our assistant answers first. Need a person? Tap the button."
                : banner}
            </p>
            <div className="flex gap-2">
              {(mode === "AI" || mode === "CLOSED") && (
                <button
                  type="button"
                  onClick={talkToPerson}
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-(--primary) hover:bg-white/5"
                >
                  <FaHeadset size={13} /> Talk to a person
                </button>
              )}
              {messages.length > 0 && mode !== "CLOSED" && (
                <button
                  type="button"
                  onClick={endChat}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm text-grey hover:bg-white/5"
                >
                  End chat
                </button>
              )}
            </div>
          </div>

          <GlassCard className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between chat-scrollbar">
            {!isLoaded ? (
              <div className="my-auto flex items-center justify-center text-grey text-sm gap-2">
                <FaCircleNotch className="animate-spin" size={14} />
                <span>Loading your chat...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-blue/10 text-blue border border-blue/20">
                  <FaRobot size={36} />
                </div>
                <div className="max-w-md space-y-1">
                  <h2 className="text-lg font-semibold text-(--primary)">
                    How can we help you today?
                  </h2>
                  <p className="text-sm text-grey">
                    Ask about your account, quizzes, rewards or payments. For a
                    payment or reward problem, tap Talk to a person.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  if (msg.sender === "SYSTEM") {
                    return (
                      <div key={msg.id} className="flex justify-center">
                        <p className="flex max-w-[90%] items-start gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-grey">
                          <FaCircleInfo className="mt-0.5 shrink-0" size={11} />
                          {msg.content}
                        </p>
                      </div>
                    );
                  }
                  const isUser = msg.sender === "USER";
                  const isStaff = msg.sender === "STAFF";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`p-2 rounded-full shrink-0 ${
                          isUser
                            ? "bg-blue/20 text-blue border border-blue/30"
                            : isStaff
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-green/20 text-green border border-green/30"
                        }`}
                      >
                        {isUser ? <FaUser size={12} /> : isStaff ? <FaHeadset size={12} /> : <FaRobot size={12} />}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm rounded-2xl ${
                          isUser
                            ? "bg-blue/20 text-white border border-blue/30 rounded-tr-none"
                            : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                        }`}
                      >
                        {isStaff && (
                          <p className="mb-1 text-xs font-semibold text-amber-400">
                            {msg.staffName || "Support team"}
                          </p>
                        )}
                        {msg.content ? (
                          <ReactMarkdown
                            components={{
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue underline font-medium hover:opacity-80 transition-opacity"
                                />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong {...props} className="font-bold text-white" />
                              ),
                              p: ({ node, ...props }) => (
                                <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          <span className="flex items-center gap-2 text-grey italic">
                            <FaCircleNotch className="animate-spin" size={12} />
                            Generating response...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </GlassCard>

          <GlassCard className="shrink-0 p-2 sm:p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                id="support-input"
                type="text"
                value={input}
                maxLength={2000}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "WAITING" || mode === "HUMAN"
                    ? "Write to our support team..."
                    : "Type your question or support request..."
                }
                className="w-full bg-transparent px-4 py-2.5 text-sm text-(--primary) placeholder-grey outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 bg-blue hover:opacity-90 text-white shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading ? (
                  <FaCircleNotch className="animate-spin" size={14} />
                ) : (
                  <>
                    <span>Send</span>
                    <FaPaperPlane size={12} />
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}

async function readAll(stream: any): Promise<string> {
  if (!stream?.getReader) return "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}
