"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Loader2, Send, Bot, User } from "lucide-react";
import { PipelineApiResponse } from "@/types/pipeline";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "audio";
  content: string;
  timestamp: Date;
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
      timestamp: new Date(),
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProcessTextQuery = async () => {
    if (!queryText.trim()) {
      setError("Please enter a message");
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: queryText.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/processPipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "cust1",
          customerAppName: "FleetAnalyticsApp",
          input: { text: queryText.trim(), language: "en" },
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const data: PipelineApiResponse = await response.json();

      if (customerType === "customer1" && data.pipelineOutput.TTS) {
        // AUDIO response for cust1
        const binary = atob(data.pipelineOutput.TTS);
        const arrayBuffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          arrayBuffer[i] = binary.charCodeAt(i);
        }
        const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audioMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "audio",
          content: "Audio Response",
          timestamp: new Date(),
          audioUrl,
        };
        setMessages((prev) => [...prev, audioMessage]);

      } else if (customerType === "customer2" && data.pipelineOutput.LLM) {
        // TEXT response for cust2
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.pipelineOutput.LLM,
          timestamp: new Date(),
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
    const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (message.type === "user") {
      return (
        <div key={message.id} className="flex justify-end mb-6">
          <div className="flex items-end gap-3 max-w-[100%]">
            <div className="bg-blue-500 text-white rounded-2xl px-5 py-2">
              <p>{message.content}</p>
              <p className="text-xs text-blue-100 mt-2">{formatTime(message.timestamp)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-5 py-4">
              <p>{message.content}</p>
              <p className="text-xs text-gray-500 mt-2">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        </div>
      );
    }

    if (message.type === "audio" && message.audioUrl) {
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
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
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>

              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} controls />
              <p className="text-xs text-gray-500 mt-3">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-[900px] w-full max-w-7xl mx-auto border rounded-lg bg-white shadow-1xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">COSS AI</h1>
            <p className="text-sm text-blue-100">Audio for Cust1, Text for Cust2</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 bg-gray-50">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-5 py-4 flex gap-2 items-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">Processing...</span>
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
      <div className="border-t bg-white p-6">
        <div className="flex gap-4 items-end">
          <Textarea
            placeholder="Type your message..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[70px] max-h-[140px] resize-none border-gray-300 focus:border-blue-500 text-base p-4"
            disabled={isLoading}
          />
          <Button
            onClick={handleProcessTextQuery}
            disabled={isLoading || !queryText.trim()}
            className="h-[70px] px-8 bg-blue-500 hover:bg-blue-600 text-base"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
