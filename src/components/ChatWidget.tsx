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
    text: "Hi! I'm your GiftGenius AI advisor 🎁 What occasion are you shopping for?",
  },
];

const QUICK_REPLIES = ["Gift for Mom", "Track order", "Corporate gifts", "Diwali gifts"];

const AI_RESPONSES: Record<string, string> = {
  "gift for mom": "Great choice! For Mom, I'd recommend our Kashmiri Pashmina Scarf (₹3,799) or the Crystal Aurora Lamp (₹1,899). Both are bestsellers! Would you like to see more options?",
  "track order": "I'd be happy to help track your order! Please share your order ID (format: GG-2026-XXXX) and I'll fetch the latest status for you.",
  "corporate gifts": "We offer premium corporate gifting solutions! Our packages start at ₹500/person and include custom branding, bulk discounts, and dedicated account management. Shall I connect you with our corporate team?",
  "diwali gifts": "Diwali is just 28 days away! 🪔 Our top picks: Designer Diya Set (₹999), Premium Dry Fruit Gift Box (₹2,499), and Silver Lakshmi Idol (₹4,999). Want me to find more based on your budget?",
};

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

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const key = Object.keys(AI_RESPONSES).find((k) =>
      text.toLowerCase().includes(k)
    );
    const aiText =
      key && AI_RESPONSES[key]
        ? AI_RESPONSES[key]
        : "That's a great question! Let me search our catalogue for the best options. In the meantime, you can try our Gift Finder for personalized recommendations! 🎁";

    setMessages((prev) => [
      ...prev,
      { id: `msg-${nextMessageId++}`, role: "ai", text: aiText },
    ]);
    setLoading(false);
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
          bg-gradient-to-br from-violet to-violet-light shadow-lg shadow-violet/30
          flex items-center justify-center text-2xl
          hover:shadow-violet/50 transition-shadow"
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
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] max-h-[550px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-violet/10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="liquid-glass-strong p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center text-base">
                🎁
              </div>
              <div className="flex-1">
                <div className="font-[var(--font-display)] text-sm font-bold text-white">
                  GiftGenius AI
                </div>
                <div className="text-[10px] text-teal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  Online · GPT-4o + Rasa NLU
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface"
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
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed font-[var(--font-body)] ${
                      msg.role === "user"
                        ? "bg-violet text-white rounded-br-sm"
                        : "bg-card text-white/90 rounded-bl-sm"
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
                      className="w-1.5 h-1.5 rounded-full bg-white/30"
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
            <div className="px-3 py-2 bg-surface flex gap-2 overflow-x-auto hide-scrollbar border-t border-white/5">
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => sendMessage(r)}
                  className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-white/50
                    hover:border-violet/40 hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0 font-[var(--font-body)]"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-card flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask about gifts, orders..."
                className="flex-1 bg-surface rounded-full px-4 py-2.5 text-xs text-white
                  placeholder:text-white/25 outline-none border border-white/[0.06]
                  focus:border-violet/40 transition-colors font-[var(--font-body)]"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-full bg-violet hover:bg-violet-light flex items-center justify-center
                  text-white transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center text-[9px] text-white/15 py-1.5 bg-card font-[var(--font-mono)]">
              Powered by GPT-4o + Rasa NLU
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
