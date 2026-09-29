import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Bot, User, Sparkles, RefreshCw, Trash2, Cpu } from 'lucide-react';
import { CountryTelemetry } from '../data/countriesData';
import { getAiSettings } from '../data/aiSettings';
import { sendAiChatMessage } from '../data/aiInferenceEngine';
import { hudAudio } from './AudioSynth';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiChatConsolePanelProps {
  activeCountry: CountryTelemetry;
  onOpenSettings?: () => void;
}

export const AiChatConsolePanel: React.FC<AiChatConsolePanelProps> = ({ activeCountry, onOpenSettings }) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: `[AI GATEWAY ACTIVE] Connected to Global Intelligence Network. Currently monitoring target sector: ${activeCountry.name} [${activeCountry.code}]. Ask any question regarding news, market stocks, defense, or global telemetry.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Update initial system prompt on country change (cap history to max 15 to prevent memory/DOM inflation)
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMessages((prev) => {
      const newMsg: Message = {
        id: `sys-${Date.now()}`,
        sender: 'assistant',
        text: `[TARGET SWITCHED] Target sector updated to: ${activeCountry.name} (${activeCountry.capital}). Synchronized local intelligence.`,
        timestamp: timeStr
      };
      const updated = [...prev, newMsg];
      return updated.length > 18 ? updated.slice(-18) : updated;
    });
  }, [activeCountry.id]);

  // Send Chat Message
  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isSending) return;

    hudAudio.playBeep(1400, 'sine', 0.05);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    const settings = getAiSettings();

    // Prepare history
    const history = messages.slice(-6).map((m) => ({
      role: m.sender,
      content: m.text
    }));

    try {
      const responseText = await sendAiChatMessage(textToSend, history, activeCountry.name, settings);
      hudAudio.playBeep(1800, 'sine', 0.06);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to send AI message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Speech Recognition (Microphone input)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser environment. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      hudAudio.playBeep(900, 'sine', 0.03);
    } else {
      hudAudio.playBeep(1600, 'sine', 0.05);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          // Optional auto-send
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleClearHistory = () => {
    hudAudio.playBeep(1000, 'sine', 0.04);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: `[TERMINAL RESET] Conversation logs cleared. Monitoring sector: ${activeCountry.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
  };

  const settings = getAiSettings();

  return (
    <div className="p-2.5 bg-[#06080d]/90 border border-slate-800/80 rounded-sm flex flex-col gap-2 flex-1 min-h-0 max-h-[380px] h-full select-none font-mono-tech relative overflow-hidden shadow-lg justify-between">
      
      {/* Top Console Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-orbitron text-[10px] font-bold text-red-200 tracking-wider">
            [AI INFERENCE TERMINAL]
          </span>
          <span className="text-[8px] px-1 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 font-bold">
            {settings.provider}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded transition-colors text-[9px]"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded text-[8px] font-bold flex items-center gap-1"
              title="Configure Gateway Endpoint"
            >
              <Cpu className="w-2.5 h-2.5 text-red-400" />
              <span>GATEWAY</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 text-[8.5px] shrink-0">
        <span className="text-slate-500 font-bold shrink-0">QUICK:</span>
        <button
          onClick={() => handleSend(`What are the top breaking news stories for ${activeCountry.name}?`)}
          className="px-1.5 py-0.5 bg-[#04060a] hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-300 rounded shrink-0 transition-colors"
        >
          📰 News Brief
        </button>
        <button
          onClick={() => handleSend(`What are the top stock gainers and losers in ${activeCountry.name}?`)}
          className="px-1.5 py-0.5 bg-[#04060a] hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-300 rounded shrink-0 transition-colors"
        >
          📈 Stocks (+5/-5)
        </button>
        <button
          onClick={() => handleSend(`Give me a defense & satellite status report for ${activeCountry.name}.`)}
          className="px-1.5 py-0.5 bg-[#04060a] hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-300 rounded shrink-0 transition-colors"
        >
          🛰️ Defense Status
        </button>
      </div>

      {/* Messages Scrollable Container (Flex-1 fills full available vertical box space, min-h-0 prevents flex blowout) */}
      <div className="flex-1 min-h-0 max-h-[185px] bg-[#030407] border border-slate-800/80 rounded p-2 overflow-y-auto flex flex-col gap-2 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 text-[9.5px] p-2 rounded border ${
              msg.sender === 'user'
                ? 'bg-red-950/40 border-red-800/80 ml-2 text-slate-100 self-end w-[92%]'
                : 'bg-slate-900/60 border-slate-800 mr-2 text-slate-200 self-start w-[94%]'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between text-[8px] pb-0.5 border-b border-slate-800/80">
              <span className={`font-bold flex items-center gap-1 ${msg.sender === 'user' ? 'text-red-400' : 'text-emerald-400'}`}>
                {msg.sender === 'user' ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
                {msg.sender === 'user' ? 'OPERATOR' : 'AI GATEWAY'}
              </span>
              <span className="text-slate-500 font-mono">{msg.timestamp}</span>
            </div>

            {/* Message Body Text */}
            <div className="font-sans leading-relaxed text-[10px] text-slate-200 whitespace-pre-wrap pt-0.5">
              {msg.text}
            </div>
          </div>
        ))}

        {/* Sending Loader State */}
        {isSending && (
          <div className="p-1.5 bg-slate-900/40 border border-slate-800 rounded text-[9px] text-amber-300 flex items-center gap-2 self-start animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
            <span>AI GATEWAY ANALYZING DATA FROM INTERNET...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Control & Voice Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-1 pt-1.5 border-t border-slate-800/80 shrink-0"
      >
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-1.5 rounded border transition-all ${
            isListening
              ? 'bg-red-600 text-white border-red-400 animate-pulse glow-red-sm'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={isListening ? 'Listening... Click to stop' : 'Click to Speak (Speech-to-Text)'}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5" />}
        </button>

        {/* Text Input Box */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'Listening to voice prompt...' : 'Enter query for AI Gateway...'}
          className="flex-1 px-2.5 py-1.5 bg-[#030509] border border-slate-800 focus:border-red-500/80 rounded text-slate-100 text-[10.5px] outline-none transition-colors placeholder:text-slate-600 font-sans"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white border border-red-400/80 rounded text-[10px] font-bold flex items-center gap-1 transition-all glow-red-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SEND</span>
        </button>
      </form>

    </div>
  );
};
