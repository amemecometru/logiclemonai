import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, AssessmentResult } from "../types";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  ShieldCheck, 
  Hammer, 
  Compass,
  ArrowRight
} from "lucide-react";

interface AuditorChatProps {
  assessmentResult: AssessmentResult | null;
}

export const AuditorChat: React.FC<AuditorChatProps> = ({ assessmentResult }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message from the auditor
  useEffect(() => {
    let welcomeText = "";
    if (assessmentResult) {
      welcomeText = `Hello! I have fully audited your systems and completed your strategic report. Your organization received an **AI Readiness Index of ${assessmentResult.readinessScore}/100**. 

Based on your profile, I've prioritized **${assessmentResult.recommendedTools.map(t => t.name).join(", ")}**.

I'm ready to dive into the details. Ask me anything, for example:
- *What specific security safeguards are highest priority for our compliance level?*
- *Can you explain Phase 1 of our implementation roadmap in more detail?*
- *How do we set up the team licenses for ChatGPT safely?*`;
    } else {
      welcomeText = `Greetings! I am your AI Tools Auditor. 

To give you highly tailored strategic advice, please complete the **Business Assessment** first! It takes about 2 minutes and evaluates your team size, tech stack maturity, budgets, and compliance standards. 

If you want to have a general chat about enterprise AI toolkits, compliance security (such as HIPAA, GDPR, or Zero Data Retention API contracts), or automation tools, feel free to ask your questions below!`;
    }

    setMessages([
      {
        id: "welcome",
        sender: "auditor",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [assessmentResult]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.filter(m => m.id !== "welcome"), // Exclude initial welcome in token history
          assessmentResult
        })
      });

      if (!response.ok) {
        throw new Error("Chat proxy failed to resolve.");
      }

      const data = await response.json();
      
      const auditorMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "auditor",
        text: data.reply || "I encountered an error compiling my response. Please try prompting again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, auditorMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "auditor",
        text: "I was unable to establish a secure analytical connection to our Gemini server node. Please ensure your API secrets are set up correctly in the AI Studio Settings menu.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Preset query chips
  const PRESET_QUERIES = assessmentResult ? [
    { text: "Detail Phase 1 Roadmap steps", icon: Hammer },
    { text: "Examine security & privacy risks", icon: ShieldCheck },
    { text: "Compare recommended tools cost", icon: Compass }
  ] : [
    { text: "What is Zero Data Retention?", icon: ShieldCheck },
    { text: "Explain LLM pricing metrics", icon: Compass },
    { text: "Recommend some startup AI tools", icon: Bot }
  ];

  // Helper to parse simple markdown bold and lists inside messages for rich text rendering
  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      let content: React.ReactNode = line;
      
      // Parse bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex);
        content = parts.map((part, partIdx) => 
          partIdx % 2 === 1 ? <strong key={partIdx} className="text-amber-400 font-bold">{part}</strong> : part
        );
      }

      // Check if it's a list item
      if (line.trim().startsWith("- ")) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs text-slate-300 pl-1 leading-relaxed mt-1">
            {line.trim().substring(2)}
          </li>
        );
      }

      // Check if it's a numbered list item
      if (/^\d+\.\s/.test(line.trim())) {
        const num = line.trim().match(/^\d+\.\s/)?.[0];
        return (
          <li key={lineIdx} className="ml-4 list-decimal text-xs text-slate-300 pl-1 leading-relaxed mt-1">
            {line.trim().substring(num?.length || 0)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-xs text-slate-300 leading-relaxed mb-2 last:mb-0">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[600px] border border-white/10 bg-white/[0.01] rounded-sm overflow-hidden shadow-2xl" id="chat-component">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-sm border border-amber-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-serif italic text-white block tracking-wide">Expert AI Systems Auditor</span>
            <span className="text-[10px] font-mono text-slate-500 block">Status: Online • Contextual Auditing active</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Analysis Engine</span>
          <span className="text-xs font-semibold text-amber-500 font-mono">Gemini-2.5-Flash</span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-transparent" id="messages-viewport">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`p-1.5 rounded-sm shrink-0 border ${
                isUser 
                  ? "bg-white/5 border-white/10 text-slate-400" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="space-y-1 max-w-[80%]">
                <div className={`p-4 rounded-sm text-xs border ${
                  isUser 
                    ? "bg-white/[0.03] border-white/10 text-slate-200" 
                    : "bg-black/40 border-white/5 text-slate-300"
                }`}>
                  {isUser ? (
                    <p className="text-xs leading-relaxed text-slate-200">{msg.text}</p>
                  ) : (
                    <div>{renderMessageText(msg.text)}</div>
                  )}
                </div>
                <span className={`text-[9px] font-mono text-slate-600 block ${isUser ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-start gap-3.5"
              id="typing-indicator"
            >
              <div className="p-1.5 rounded-sm shrink-0 border bg-amber-500/10 border-amber-500/20 text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex gap-1.5 items-center justify-center h-10 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Preset follow-ups */}
      <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex flex-wrap gap-2 items-center" id="preset-queries">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Follow-up suggestions:</span>
        </span>
        {PRESET_QUERIES.map((query) => {
          const QueryIcon = query.icon;
          return (
            <button
              key={query.text}
              onClick={() => handleSendMessage(query.text)}
              disabled={isTyping}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] hover:bg-white/5 disabled:opacity-50 text-[10px] text-slate-300 hover:text-white rounded-sm border border-white/10 hover:border-white/20 transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <QueryIcon className="w-3 h-3 text-amber-500" />
              <span>{query.text}</span>
            </button>
          );
        })}
      </div>

      {/* Input container */}
      <form onSubmit={handleFormSubmit} className="p-4 border-t border-white/10 bg-black/40 flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isTyping}
          placeholder={assessmentResult ? "Ask about roadmap timelines, specific tool parameters, or compliance guidelines..." : "Ask a general AI compliance or tooling question..."}
          className="flex-1 bg-black border border-white/10 focus:border-amber-500 rounded-sm py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 font-sans"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-white/5 disabled:text-slate-600 text-black rounded-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
