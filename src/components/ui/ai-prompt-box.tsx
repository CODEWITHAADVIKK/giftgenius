"use client";

import React, { useState, useRef } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

interface PromptInputBoxProps {
  onSend: (message: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function PromptInputBox({
  onSend,
  placeholder = "Describe who you're gifting...",
  className = "",
  value: externalValue,
  onChange: externalOnChange,
}: PromptInputBoxProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;
  const setValue = isControlled ? externalOnChange || setInternalValue : setInternalValue;

  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return;
    setIsLoading(true);
    onSend(value.trim());
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1500));
    setValue("");
    setIsLoading(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`relative rounded-2xl border border-[#2E2E38] bg-[#1F2023]/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] focus-within:border-[#7C3AED]/50 focus-within:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300 ${className}`}
    >
      {/* Gradient border glow on focus */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#7C3AED]/0 via-[#7C3AED]/0 to-[#E8A87C]/0 opacity-0 focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-end gap-3 p-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex-shrink-0">
          <Sparkles className="h-5 w-5 text-[#9B87F5]" />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          className="flex-1 bg-transparent text-[#F9F5FF] placeholder-[#9CA3AF]/60 text-base resize-none outline-none min-h-[56px] max-h-[200px] leading-relaxed"
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none flex-shrink-0 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Bottom hint */}
      <div className="px-4 pb-3 flex items-center justify-between text-xs text-[#9CA3AF]/50">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI-Powered
        </span>
      </div>
    </div>
  );
}
