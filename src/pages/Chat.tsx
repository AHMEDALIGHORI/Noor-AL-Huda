import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, Volume2, Globe, Loader2, User, Bot, MessageCircle } from 'lucide-react';
import { getQuranicResponse, generateStoryAudio } from '../services/geminiService';
import { Language } from '../types';

const Chat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, audio?: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const languages: { code: Language, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ur', name: 'Urdu' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleSend = async (text: string, fromVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getQuranicResponse(text, language);
      const botMsg = { role: 'bot' as const, text: response };
      setMessages(prev => [...prev, botMsg]);
      
      // Auto-generate and play audio if user used voice input or voice mode is on
      if (fromVoice || isVoiceMode) {
        const audioUrl = await generateStoryAudio(response);
        if (audioUrl && audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying((messages.length + 1).toString());
          audioRef.current.onended = () => setIsPlaying(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (text: string, index: number) => {
    if (isPlaying === index.toString()) {
      audioRef.current?.pause();
      setIsPlaying(null);
      return;
    }

    setIsPlaying(index.toString());
    try {
      const audioUrl = await generateStoryAudio(text);
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setIsPlaying(null);
        }
      }
    } catch (error) {
      console.error(error);
      setIsPlaying(null);
    }
  };

  // Simple Web Speech API for Voice-to-Text
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript, true);
    };
    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-emerald-100 flex justify-between items-center bg-emerald-800 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl">Noor AI</h2>
            <p className="text-xs text-emerald-200">Quranic & Sunnah Guidance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isVoiceMode ? 'bg-gold text-emerald-900' : 'bg-emerald-700 text-emerald-200'}`}
          >
            <Volume2 size={14} />
            <span>{isVoiceMode ? 'Voice Mode On' : 'Voice Mode Off'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <Globe size={18} className="text-emerald-300" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-emerald-700 text-white text-sm rounded-lg px-2 py-1 outline-none border-none"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-cream/30">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-2">As-salamu alaykum</h3>
            <p className="text-emerald-600 max-w-sm mx-auto">
              I am Noor, your Islamic AI assistant. Ask me anything about the Quran, Sunnah, or life problems.
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-800 text-white' : 'bg-white border border-emerald-100 text-emerald-800'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' ? 'bg-emerald-800 text-white rounded-tr-none' : 'bg-white text-emerald-900 rounded-tl-none border border-emerald-50'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'bot' && (
                  <button 
                    onClick={() => playAudio(msg.text, idx)}
                    className={`mt-3 flex items-center space-x-1 text-xs font-medium ${isPlaying === idx.toString() ? 'text-gold' : 'text-emerald-600'}`}
                  >
                    <Volume2 size={14} />
                    <span>{isPlaying === idx.toString() ? 'Playing...' : 'Listen'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
              <Loader2 className="animate-spin text-emerald-800" size={20} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-emerald-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center space-x-3"
        >
          <button
            type="button"
            onClick={startRecording}
            className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow bg-emerald-50 border-none rounded-full px-6 py-3 text-emerald-900 focus:ring-2 focus:ring-emerald-800 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 disabled:opacity-50 transition-all shadow-md"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default Chat;
