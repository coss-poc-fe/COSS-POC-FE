'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Loader2, Send, Bot, User } from "lucide-react";
import { PipelineApiResponse } from "@/types/pipeline";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "audio";
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export default function VoiceQueryInterface({ customerType = "customer1" }) {
  const [queryText, setQueryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI assistant. Type something to get a response.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

const handleProcessTextQuery = async () => {
  if (!queryText.trim()) return setError("Please enter a message");

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    type: "user",
    content: queryText.trim(),
    timestamp: new Date().toISOString(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);
  setError(null);

  try {
    // Map customerType to customerAppName dynamically
    const customerAppName =
      customerType === "cust1" ? "Customer1App" :
      customerType === "cust2" ? "Customer2App" :
      "defaultApp";

    const response = await fetch("/api/processPipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: customerType,
        customerAppName: customerAppName,  // now dynamic
        input: { text: queryText.trim(), language: "en" },
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const data: PipelineApiResponse = await response.json();

    if (customerType === "cust1" && data.pipelineOutput.TTS) {
      const binary = atob(data.pipelineOutput.TTS);
      const arrayBuffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) arrayBuffer[i] = binary.charCodeAt(i);
      const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "audio",
          content: "Audio Response",
          timestamp: new Date().toISOString(),
          audioUrl,
        },
      ]);
    } else if (customerType === "cust2" && data.pipelineOutput.LLM) {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.pipelineOutput.LLM || "No response",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error occurred");
  } finally {
    setIsLoading(false);
    setQueryText("");
    setTimeout(scrollToBottom, 100);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleProcessTextQuery();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const formatTime = (iso: string) => {
      if (!mounted) return null;
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (message.type === "user") {
      return (
        <div key={message.id} className="flex justify-end mb-6">
          <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%]">
            <div className="bg-black text-white rounded-2xl px-3 sm:px-5 py-2 break-words">
              <p className="text-sm sm:text-base">{message.content}</p>
              {mounted && (
                <p className="text-xs text-black-100 mt-2">{formatTime(message.timestamp)}</p>
              )}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        </div>
      );
    }

    if (message.type === "ai") {
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="text-slate-800 rounded-2xl px-3 sm:px-5 py-3 sm:py-4 border border-slate-200 break-words">
              <p className="text-sm sm:text-base">{message.content}</p>
              {mounted && (
                <p className="text-xs text-slate-500 mt-2">{formatTime(message.timestamp)}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (mounted && message.type === "audio" && message.audioUrl) {
  return (
    <div key={message.id} className="flex justify-start mb-6">
      <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="bg-gray-50 w-full border border-slate-200 rounded-2xl px-3 sm:px-5 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    audioRef.current.src = message.audioUrl!;
                    audioRef.current.play();
                    setIsPlaying(true);
                  }
                }
              }}
              className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-100 text-xs sm:text-sm"
            >
              {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  setIsPlaying(false);
                }
              }}
              className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-100 text-xs sm:text-sm"
            >
              <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              Stop
            </Button>
          </div>

          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} controls className="mt-2 w-full max-w-full" />
          {mounted && (
            <p className="text-xs text-slate-500 mt-3">{formatTime(message.timestamp)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
  }

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Chat Header */}
      <div className="bg-grey-50 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl text-slate-700 font-semibold truncate">COSS AI</h1>
            <p className="text-xs sm:text-sm text-slate-500 truncate">Audio for Cust1, Text for Cust2</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-emerald-400 rounded-full flex-shrink-0"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 min-h-0">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3 sm:px-5 py-3 sm:py-4 flex gap-2 items-center">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-slate-600" />
                <span className="text-xs sm:text-sm text-slate-600">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 sm:mx-6 mb-3 flex-shrink-0">
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-xs sm:text-sm break-words">{error}</p>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="border-t bg-white p-4 sm:p-6 border-slate-200 flex-shrink-0">
        <div className="flex gap-2 sm:gap-4 items-end">
          <Textarea
            placeholder="Type your message..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[50px] sm:min-h-[70px] max-h-[100px] sm:max-h-[140px] resize-none border-slate-300 focus:border-black text-sm sm:text-base p-3 sm:p-4"
            disabled={isLoading}
          />
          <Button
            onClick={handleProcessTextQuery}
            disabled={isLoading || !queryText.trim()}
            className="h-[50px] sm:h-[70px] px-4 sm:px-8 bg-black hover:bg-grey-800 text-white text-sm sm:text-base flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <Send className="h-4 w-4 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}