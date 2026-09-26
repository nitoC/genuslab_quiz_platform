"use client";

import {
  closeSupportConversation,
  getSupportConversation,
  requestSupportHuman,
  resumeSupportAi,
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

// Longest message a user can send (the backend enforces the same limit).
const MAX_MESSAGE = 250;

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

  // The server's copy is the only source of truth: every tab reloads it
  // when something changes, so tabs can't drift apart.
  const loadSeq = useRef(0);
  const sending = useRef(false); // this tab is streaming a reply
  const reloadAfterSend = useRef(false);
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const seq = ++loadSeq.current;
    try {
      const res = await getSupportConversation();
      if (seq !== loadSeq.current) return; // a newer load already started
      const convo = res.data?.payload;
      setMessages(convo ? convo.messages.map(fromServer) : []);
      setMode(convo?.status ?? "AI");
    } catch {
      if (seq === loadSeq.current) toast.error("Couldn't load your support chat. Please refresh.");
    } finally {
      if (seq === loadSeq.current) setIsLoaded(true);
    }
  }, []);

  // Coalesces bursts of change events; waits while this tab is mid-reply
  // so the streaming bubble isn't replaced halfway.
  const requestReload = useCallback(() => {
    if (sending.current) {
      reloadAfterSend.current = true;
      return;
    }
    if (reloadTimer.current) clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(load, 250);
  }, [load]);

  useEffect(() => {
    // The old version kept its own copy of the chat in the browser; that
    // copy could disagree with the server, so drop it.
    try {
      sessionStorage.removeItem("support_chat_messages");
    } catch {}
    load();
  }, [load]);

  // Changes from any tab, the AI, or staff arrive over the socket.
  useEffect(() => {
    if (!socket) return;
    socket.on("support-updated", requestReload);
    socket.on("support-message", requestReload);
    return () => {
      socket.off("support-updated", requestReload);
      socket.off("support-message", requestReload);
    };
  }, [socket, requestReload]);

  // Catch up when coming back to this tab (e.g. if the socket dropped).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") requestReload();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", requestReload);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", requestReload);
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
    };
  }, [requestReload]);

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
    sending.current = true;
    let failed = false;

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
      failed = true;
      // Say what actually went wrong, so it's clear whether to retry,
      // log in again or wait.
      const status = err?.response?.status;
      const text = !err?.response
        ? "Couldn't reach the server. Check your internet connection and try again in a moment."
        : status === 429
          ? "You're sending messages too quickly. Please wait a minute and try again."
          : status === 401
            ? "Your session has ended. Please log in again to keep chatting."
            : status === 400
              ? `That message couldn't be sent. Keep it under ${MAX_MESSAGE} characters and try again.`
              : status >= 500
                ? "Something went wrong on our side. Please try again, or tap Talk to a person."
                : "Sorry, your message couldn't be sent. Please try again.";
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== replyId),
        { id: replyId, sender: "SYSTEM", content: text },
      ]);
    } finally {
      setIsLoading(false);
      sending.current = false;
      // Swap the temporary bubbles for the saved messages (and pick up any
      // handoff), unless sending failed: then keep the error on screen.
      if (!failed || reloadAfterSend.current) {
        reloadAfterSend.current = false;
        if (!failed) load();
      }
    }
  };

  const backToAssistant = async () => {
    try {
      await resumeSupportAi();
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't switch back. Please try again.");
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
      await load();
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
              {/* Only before a staff member has replied. */}
              {mode === "WAITING" && (
                <button
                  type="button"
                  onClick={backToAssistant}
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-(--primary) hover:bg-white/5"
                >
                  <FaRobot size={13} /> Back to the assistant
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
                // No native maxLength: it cuts pastes silently. onChange trims
                // to the limit instead and says so.
                aria-describedby="support-input-count"
                onChange={(e) => {
                  const next = e.target.value;
                  // Pasting past the limit is cut to fit; say so once.
                  if (next.length > MAX_MESSAGE) {
                    toast.error(`Messages can be up to ${MAX_MESSAGE} characters`, {
                      id: "support-limit",
                    });
                  }
                  setInput(next.slice(0, MAX_MESSAGE));
                }}
                placeholder={
                  mode === "WAITING" || mode === "HUMAN"
                    ? "Write to our support team..."
                    : "Type your question or support request..."
                }
                className="w-full bg-transparent px-4 py-2.5 text-sm text-(--primary) placeholder-grey outline-none"
              />
              <span
                id="support-input-count"
                aria-live="polite"
                className={`shrink-0 text-xs tabular-nums ${
                  input.length >= MAX_MESSAGE ? "text-amber-400" : "text-grey"
                }`}
              >
                {input.length}/{MAX_MESSAGE}
              </span>
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
