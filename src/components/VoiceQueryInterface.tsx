'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Square, Loader2, Send, Bot, User } from 'lucide-react';

interface TextQueryResponse {
  success: boolean;
  response_text: string;
  audio_content: string;
  detected_language: string;
  processing_time: {
    [key: string]: number;
  };
  error?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'audio' | 'metrics';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  detectedLanguage?: string;
  processingTime?: { [key: string]: number };
}

export default function VoiceQueryInterface() {
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. Ask me anything and I\'ll provide both text and audio responses.',
      timestamp: new Date(),
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProcessTextQuery = async () => {
    if (!queryText.trim()) {
      setError('Please enter a text query');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: queryText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://coss-poc-be.vercel.app/process-text-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          text: queryText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TextQueryResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process text query');
      }

      // Add AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response_text,
        timestamp: new Date(),
        detectedLanguage: data.detected_language,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Convert base64 audio to playable URL and add audio message
      if (data.audio_content) {
        try {
          const audioData = atob(data.audio_content);
          const arrayBuffer = new ArrayBuffer(audioData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < audioData.length; i++) {
            uint8Array[i] = audioData.charCodeAt(i);
          }

          const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          
          const audioMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'audio',
            content: 'Audio Response',
            timestamp: new Date(),
            audioUrl: url,
          };

          setMessages(prev => [...prev, audioMessage]);
        } catch (audioError) {
          console.error('Error processing audio:', audioError);
          setError('Failed to process response audio');
        }
      }

      // Add processing metrics message
      const metricsMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        type: 'metrics',
        content: 'Processing Performance',
        timestamp: new Date(),
        processingTime: data.processing_time,
      };

      setMessages(prev => [...prev, metricsMessage]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQueryText('');
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleProcessTextQuery();
    }
  };

  const formatProcessingTime = (timeData: { [key: string]: number }) => {
    // Create a mapping for better display labels
    const labelMap: { [key: string]: string } = {
      'language_detection': '🔍 Language Detection',
      'Language Detection': '🔍 Language Detection',
      'nmt_to_english': '🌐 Translation to English',
      'Nmt To_english': '🌐 Translation to English',
      'nmt_from_english': '🌍 Translation from English',
      'Nmt From_english': '🌍 Translation from English',
      'llm': '🤖 LLM Processing',
      'Llm': '🤖 LLM Processing',
      'tts': '🎤 Text-to-Speech',
      'Tts': '🎤 Text-to-Speech',
      'total': '⏱️ Total Processing',
      'Total': '⏱️ Total Processing'
    };

    // Calculate total if not present
    const entries = Object.entries(timeData);
    const totalTime = entries.reduce((sum, [key, value]) => {
      if (key.toLowerCase() !== 'total') {
        return sum + value;
      }
      return sum;
    }, 0);

    // Add total if it doesn't exist
    const dataWithTotal = { ...timeData };
    if (!Object.keys(timeData).some(key => key.toLowerCase() === 'total')) {
      dataWithTotal['Total'] = totalTime;
    }

    return Object.entries(dataWithTotal).map(([key, value]) => {
      const displayLabel = labelMap[key] || labelMap[key.toLowerCase()] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const isTotal = key.toLowerCase() === 'total';
      
      return (
        <div key={key} className={`rounded-lg p-4 border-2 transition-all ${
          isTotal 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 shadow-lg' 
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
        }`}>
          <div className="text-center">
            <div className={`text-xl font-bold ${isTotal ? 'text-white' : 'text-blue-600'}`}>
              {value.toFixed(3)}s
            </div>
            <div className={`text-sm font-medium mt-2 ${isTotal ? 'text-blue-100' : 'text-gray-700'}`}>
              {displayLabel}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-6">
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-5 py-4">
              <p className="leading-relaxed text-base">{message.content}</p>
              <p className="text-xs text-blue-100 mt-2">{formatTime(message.timestamp)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'ai') {
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-gray-600">COSS AI </span>
                {message.detectedLanguage && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {message.detectedLanguage}
                  </span>
                )}
              </div>
              <p className="leading-relaxed text-gray-800 text-base">{message.content}</p>
              <p className="text-xs text-gray-500 mt-2">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'audio' && message.audioUrl) {
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="flex items-end gap-3 max-w-[75%]">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-600">Audio Response</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
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
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
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

                <audio
                  ref={audioRef}
                  onEnded={() => setIsPlaying(false)}
                  className="flex-1 min-w-0"
                  controls
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'metrics' && message.processingTime) {
      return (
        <div key={message.id} className="flex justify-center mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 max-w-full">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-base font-medium text-gray-600">Processing Performance</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formatProcessingTime(message.processingTime)}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">{formatTime(message.timestamp)}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-[800px] w-full max-w-6xl mx-auto border rounded-lg bg-white shadow-2xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">COSS AI</h1>
            <p className="text-sm text-blue-100">Powered by multilingual AI pipeline</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 bg-gray-50">
        {messages.map(renderMessage)}
        
        {/* Loading Message */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600">Processing your query...</span>
                </div>
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

      {/* Chat Input */}
      <div className="border-t bg-white p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[70px] max-h-[140px] resize-none border-gray-300 focus:border-blue-500 text-base p-4"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleProcessTextQuery} 
            disabled={isLoading || !queryText.trim()}
            className="h-[70px] px-8 bg-blue-500 hover:bg-blue-600 text-base"
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
