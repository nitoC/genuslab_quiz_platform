"use client";

import { sendSupportMessage } from "@/lib/api/apis";
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaCircleNotch } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "support_chat_messages";

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load persisted messages from sessionStorage on mount
  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (err) {
      console.error("Failed to load messages from sessionStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Save messages to sessionStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error("Failed to save messages to sessionStorage:", err);
    }
  }, [messages, isLoaded]);

  // Auto-scroll to bottom as incoming streaming chunks land
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoaded) {
      scrollToBottom();
    }
  }, [messages, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await sendSupportMessage(updatedMessages);

      if (!response.data) throw new Error("No response body text stream found");

      const stream = response.data as unknown as ReadableStream;
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        completeResponse += chunkText;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: completeResponse }
              : msg,
          ),
        );
      }
    } catch (err) {
      console.error("Error streaming backend data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        <Header title="AI Support Assistant" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 max-w-5xl w-full mx-auto gap-4">
          {/* Chat Messages Scrolling Window */}
          <GlassCard className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between chat-scrollbar">
            {!isLoaded ? (
              /* Loading State during Session Retrieval */
              <div className="my-auto flex items-center justify-center text-grey text-sm gap-2">
                <FaCircleNotch className="animate-spin" size={14} />
                <span>Restoring chat history...</span>
              </div>
            ) : messages.length === 0 ? (
              /* Empty Placeholder State */
              <div className="my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-blue/10 text-blue border border-blue/20">
                  <FaRobot size={36} />
                </div>
                <div className="max-w-md space-y-1">
                  <h2 className="text-lg font-semibold text-(--primary)">
                    How can we help you today?
                  </h2>
                  <p className="text-sm text-grey">
                    Ask questions about your account, active quizzes, rewards,
                    or platform navigation.
                  </p>
                </div>
              </div>
            ) : (
              /* Active Stream Messages */
              <div className="space-y-4 chat-scrollbar">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full shrink-0 ${
                          isUser
                            ? "bg-blue/20 text-blue border border-blue/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {isUser ? <FaUser size={12} /> : <FaRobot size={12} />}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm sm:text-sm rounded-2xl ${
                          isUser
                            ? "bg-blue/20 text-white border border-blue/30 rounded-tr-none"
                            : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                        }`}
                      >
                        {msg.content ? (
                          <ReactMarkdown
                            components={{
                              // Ensure links open in a new tab with styled colors
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue underline font-medium hover:opacity-80 transition-opacity"
                                />
                              ),
                              // Ensure bold text stands out properly
                              strong: ({ node, ...props }) => (
                                <strong
                                  {...props}
                                  className="font-bold text-white"
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  {...props}
                                  className="mb-2 last:mb-0 leading-relaxed"
                                />
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

          {/* User Input Bar */}
          <GlassCard className="shrink-0 p-2 sm:p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question or support request..."
                className="w-full bg-transparent px-4 py-2.5 text-sm sm:text-sm text-(--primary) placeholder-grey outline-none"
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
