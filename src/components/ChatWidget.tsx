"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoSendOutline, IoMicOutline, IoMicOffOutline, IoSparklesOutline, IoStar, IoCartOutline, IoChatbubblesOutline } from "react-icons/io5";
import { useVoiceSearch } from "@/lib/useVoiceSearch";
import { useCart, CartItem } from "@/context/CartContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type GiftProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  slug: string;
  rating: number;
  matchScore: number;
  matchReason: string;
};

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  products?: GiftProduct[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "ai",
    text: "Hi! I'm your GiftGenius AI assistant ✨\n\nTell me about the person you're gifting — who are they, what's the occasion, and your budget — and I'll find the perfect match!",
  },
];

const QUICK_REPLIES = [
  "🎁 Gift for Mom",
  "🎂 Birthday gift",
  "💼 Corporate gift",
  "👩 Gift for her under ₹1500",
  "🎤 Voice search",
];

let nextMessageId = 1;

// ─── Product Card Component ─────────────────────────────────────────────────

function ProductCard({ product }: { product: GiftProduct }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    addItem(cartItem);
  };

  return (
    <div className="flex gap-2.5 p-2 rounded-xl bg-[#0D0F1A] border border-[#2E2E38] hover:border-[#7C3AED]/30 transition-all group">
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1F2023]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`}>
          <p className="text-[11px] text-white font-medium truncate hover:text-[#9B87F5] transition-colors">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[11px] text-white font-bold">₹{product.price.toLocaleString()}</span>
          <span className="text-[9px] text-[#9CA3AF] line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="flex items-center gap-0.5 text-[9px] text-[#F59E0B] ml-1">
            <IoStar size={10} className="text-[#F59E0B]" />
            {product.rating}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[8px] text-[#10B981]">{product.matchReason}</span>
          <button
            onClick={handleAddToCart}
            className="text-[8px] px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#9B87F5] hover:bg-[#7C3AED] hover:text-white transition-all flex items-center gap-0.5"
          >
            <IoCartOutline size={10} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Widget ─────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Voice search — auto-sends after recognition
  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(transcript);
    setTimeout(() => sendMessage(transcript), 300);
  }, []);

  const { isListening, isSupported, toggleListening } = useVoiceSearch(handleVoiceResult);

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
      const products = data.products || [];

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${nextMessageId++}`,
          role: "ai",
          text: aiText,
          products,
        },
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

  // Handle quick reply — voice search opens mic, others send text
  const handleQuickReply = (reply: string) => {
    if (reply === "🎤 Voice search") {
      if (isSupported) {
        toggleListening();
      } else {
        sendMessage("I want to use voice search");
      }
      return;
    }
    sendMessage(reply);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Format AI text — bold, links, etc.
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-[#9CA3AF]">$1</em>')
      .replace(/~~(.*?)~~/g, '<del class="text-[#9CA3AF]/50">$1</del>');
  };

  return (
    <>
      {/* Floating Trigger — Voice Search Mic */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B87F5] shadow-lg shadow-[#7C3AED]/30 flex items-center justify-center hover:shadow-[#7C3AED]/50 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ display: open ? "none" : "flex" }}
        aria-label="Open AI Gift Advisor"
      >
        <IoMicOutline size={24} className="text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-[#7C3AED]/10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <IoSparklesOutline size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">
                  GiftGenius AI Advisor
                </div>
                <div className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  {isListening ? "🎤 Listening..." : "Online · AI + Voice enabled"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <IoCloseOutline size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0D0F1A]"
              style={{ maxHeight: 360 }}
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  {/* Message bubble */}
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#7C3AED] text-white rounded-br-sm"
                          : "bg-[#1F2023] text-white/90 rounded-bl-sm border border-[#2E2E38]"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <div
                          className="whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                        />
                      ) : (
                        <span className="whitespace-pre-line">{msg.text}</span>
                      )}
                    </div>
                  </div>

                  {/* Product Cards — render below AI message */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 space-y-2 pl-1">
                      {msg.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
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
            <div
              className="px-3 py-2 bg-[#0D0F1A] flex gap-2 overflow-x-auto border-t border-[#2E2E38]"
              style={{ scrollbarWidth: "none" }}
            >
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickReply(r)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border text-[#9CA3AF] hover:border-[#7C3AED]/40 hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0 ${
                    r === "🎤 Voice search"
                      ? "border-[#7C3AED]/30 bg-[#7C3AED]/5"
                      : "border-[#2E2E38]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Input with Voice */}
            <div className="p-3 bg-[#1F2023] flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder={isListening ? "🎤 Listening..." : "Describe who you're gifting..."}
                className="flex-1 bg-[#0D0F1A] rounded-full px-4 py-2.5 text-xs text-white placeholder:text-[#9CA3AF]/40 outline-none border border-[#2E2E38] focus:border-[#7C3AED]/40 transition-colors"
              />
              {/* Voice button */}
              {isSupported && (
                <button
                  onClick={toggleListening}
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isListening
                      ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30"
                      : "bg-[#0D0F1A] text-[#9CA3AF] hover:text-white border border-[#2E2E38] hover:border-[#7C3AED]/40"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <IoMicOffOutline size={14} />
                  ) : (
                    <IoMicOutline size={14} />
                  )}
                </button>
              )}
              <button
                onClick={() => sendMessage(input)}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-[#7C3AED] hover:bg-[#9B87F5] flex items-center justify-center text-white transition-colors flex-shrink-0 disabled:opacity-50"
              >
                <IoSendOutline size={14} />
              </button>
            </div>

            <div className="text-center text-[9px] text-[#9CA3AF]/40 py-1.5 bg-[#1F2023]">
              Powered by GiftGenius AI · NLU + Gift Discovery Engine
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
