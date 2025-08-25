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
      const response = await fetch("/api/processPipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerType,
          customerAppName: "FleetAnalyticsApp",
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
          <div className="flex items-end gap-3 max-w-[100%]">
            <div className="bg-black text-white rounded-2xl px-5 py-2">
              <p>{message.content}</p>
              {mounted && (
                <p className="text-xs text-black-100 mt-2">{formatTime(message.timestamp)}</p>
              )}
            </div>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      );
    }

    if (message.type === "ai") {
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className=" text-slate-800 rounded-2xl px-5 py-4 border border-slate-200">
              <p>{message.content}</p>
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
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div className="bg-grey-50 w-100 border border-slate-200 rounded-2xl px-5 py-4">
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
                className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-100"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-100 mt-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>

              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} controls className="mt-2 w-full" />
              {mounted && (
                <p className="text-xs text-slate-500 mt-3">{formatTime(message.timestamp)}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-[880px] w-390   rounded-lg bg-white shadow-1xl">
      {/* Chat Header */}
      <div className="bg-grey-50 text-white p-6 flex items-center justify-between rounded-t-lg border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div >
            <h1 className="text-xl text-slate-700 font-semibold ">COSS AI</h1>
            <p className="text-sm text-slate-500">Audio for Cust1, Text for Cust2</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 ">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex gap-2 items-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                <span className="text-sm text-slate-600">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-3">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="border-t bg-white p-6 rounded-b-lg border-slate-200">
        <div className="flex gap-4 items-end">
          <Textarea
            placeholder="Type your message..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[70px] max-h-[140px] resize-none border-slate-300 focus:border-black text-base p-4"
            disabled={isLoading}
          />
          <Button
            onClick={handleProcessTextQuery}
            disabled={isLoading || !queryText.trim()}
            className="h-[70px] px-8 bg-black hover:bg-grey-800 text-white text-base"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}