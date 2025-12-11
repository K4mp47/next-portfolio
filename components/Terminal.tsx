"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, Terminal as TerminalIcon } from "lucide-react";
import { ChatMessage } from "@/types";
import { queryIntelligence } from "@/netlify/functions/query";

export const Terminal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      text: "HELLO. I AM THE PORTFOLIO AI. ASK ME ABOUT MY EXPERIENCE WITH REACT, NEXT.JS, OR CLOUD INFRASTRUCTURE.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await queryIntelligence(userMsg.text);
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-md max-w-4xl mx-auto my-24 border border-palantir-gray bg-palantir-dark/50 backdrop-blur relative overflow-hidden group">
      {/* Decorative Header */}
      <div className="h-10 border-b border-palantir-gray flex items-center px-4 bg-palantir-gray/10 justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-blue-500" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            /usr/bin/portfolio_chat
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-900/50 border border-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-900/50 border border-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-900/50 border border-green-500/50"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-96 overflow-y-auto p-6 font-mono text-sm space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] p-4 border rounded-md ${msg.role === "user"
                ? "bg-palantir-gray/30 border-gray-600 text-gray-200"
                : "bg-blue-950/20 border-blue-900/50 text-blue-100"
                }`}
            >
              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider opacity-70">
                {msg.role === "user" ? "VISITOR" : "ASSISTANT"} {"//"}
                {"     "}
                {msg.timestamp.toLocaleTimeString()}
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-4 bg-blue-950/10 border border-blue-900/30 flex items-center gap-2 text-blue-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs uppercase tracking-widest">
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-palantir-gray bg-black p-2 flex gap-2"
      >
        <span className="text-blue-500 font-mono py-2 pl-2">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 bg-transparent text-gray-200 font-mono text-sm focus:outline-none p-2 placeholder-gray-700"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
