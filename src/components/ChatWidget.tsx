"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "ai",
    text: "Hi! I'm your GiftGenius AI advisor 🎁 Tell me about who you're gifting and I'll find the perfect match!",
  },
];

const QUICK_REPLIES = ["Gift for Mom", "Gift for him", "Birthday gift", "Corporate gifts", "Budget under ₹1000"];

let nextMessageId = 1;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `msg-${nextMessageId++}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build history for context (last 10 messages)
      const history = messages
        .filter((m) => m.id !== "0")
        .slice(-10)
        .map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const aiText = data.reply || "I'm having trouble right now. Please try again!";

      setMessages((prev) => [
        ...prev,
        { id: `msg-${nextMessageId++}`, role: "ai", text: aiText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${nextMessageId++}`,
          role: "ai",
          text: "Sorry, I'm having trouble connecting. Please try again! 🎁",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
          bg-gradient-to-br from-[#7C3AED] to-[#9B87F5] shadow-lg shadow-[#7C3AED]/30
          flex items-center justify-center text-2xl
          hover:shadow-[#7C3AED]/50 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ display: open ? "none" : "flex" }}
      >
        🎁
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] max-h-[550px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-[#7C3AED]/10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="bg-[#1F2023] border-b border-[#2E2E38] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E8A87C] flex items-center justify-center text-base">
                🎁
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">
                  GiftGenius AI
                </div>
                <div className="text-[10px] text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Online · AI-Powered
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#9CA3AF] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0D0F1A]"
              style={{ maxHeight: 320 }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-[#7C3AED] text-white rounded-br-sm"
                        : "bg-[#1F2023] text-white/90 rounded-bl-sm border border-[#2E2E38]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex gap-1.5 pl-2">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        delay: i * 0.12,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-3 py-2 bg-[#0D0F1A] flex gap-2 overflow-x-auto border-t border-[#2E2E38]"
                 style={{ scrollbarWidth: "none" }}>
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => sendMessage(r)}
                  className="text-[10px] px-3 py-1.5 rounded-full border border-[#2E2E38] text-[#9CA3AF]
                    hover:border-[#7C3AED]/40 hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-[#1F2023] flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask about gifts, orders..."
                className="flex-1 bg-[#0D0F1A] rounded-full px-4 py-2.5 text-xs text-white
                  placeholder:text-[#9CA3AF]/40 outline-none border border-[#2E2E38]
                  focus:border-[#7C3AED]/40 transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-full bg-[#7C3AED] hover:bg-[#9B87F5] flex items-center justify-center
                  text-white transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center text-[9px] text-[#9CA3AF]/40 py-1.5 bg-[#1F2023]">
              Powered by GiftGenius AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
// v2 - AI-powered chat with /api/chat backend
