'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Play, Pause, Square, Volume2, Loader2 } from 'lucide-react';

interface TTSResponse {
  success: boolean;
  audioContent?: string;
  config?: {
    audioFormat: string;
    samplingRate: number;
  };
  error?: string;
  details?: string;
}

export default function TTSInterface() {
  const [text, setText] = useState('India is my country.');
  const [language, setLanguage] = useState('en');
  const [gender, setGender] = useState('male');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'kn', label: 'Kannada' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'mr', label: 'Marathi' },
    { value: 'pa', label: 'Punjabi' },
  ];

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          language,
          gender,
        }),
      });

      const data: TTSResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate speech');
      }

      if (data.audioContent) {
        // Convert base64 to audio blob
        const audioData = atob(data.audioContent);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < audioData.length; i++) {
          uint8Array[i] = audioData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Text to Speech Generator
          </CardTitle>
          <CardDescription>
            Convert text to speech using the Dhruva TTS API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">Text to Convert</Label>
            <Textarea
              id="text-input"
              placeholder="Enter text to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Language and Gender Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender-select">Voice Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender-select">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !text.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Speech...
              </>
            ) : (
              'Generate Speech'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Generated Audio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    size="lg"
                    onClick={handlePlay}
                    className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isPlaying 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {isPlaying ? 'Pause' : 'Play Audio'}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleStop}
                    className="flex items-center gap-3 px-8 py-3 rounded-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Square className="h-5 w-5" />
                    <span className="font-medium">Stop</span>
                  </Button>

                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={handleAudioEnded}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
