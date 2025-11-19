
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat, Loader2, Minimize2 } from 'lucide-react';
import { createSousChefChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Helper to render formatted text (Simple Markdown Parser)
const FormattedMessage = ({ text, isModel }: { text: string, isModel: boolean }) => {
  // Split by newlines
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />; // spacer

        // Handle Lists
        if (isModel && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex gap-2 ml-1">
              <span className="text-orange-500 mt-1.5 text-[6px] shrink-0">●</span>
              <p className="leading-relaxed"><BoldParser text={content} /></p>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="leading-relaxed break-words">
             <BoldParser text={line} />
          </p>
        );
      })}
    </div>
  );
};

// Helper to parse **bold** text
const BoldParser = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export default function SousChefChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Xin chào! **Bếp Phó Dzui** nghe đây. Bạn cần giúp gì hông? 🍳' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Keep chat instance in ref to persist across renders
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat on first open
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createSousChefChat();
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const chat = chatRef.current;
      // Send message stream
      const result = await chat.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      // Add placeholder for model response
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullResponse += text;
        
        // Update the last message with accumulating text
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: fullResponse };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Úi, Bếp Phó đang hơi chóng mặt xíu. Bạn hỏi lại sau nhé! 😵‍💫' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-50 bottom-24 sm:bottom-8 right-4 sm:right-8 w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-full shadow-lg shadow-orange-200 flex items-center justify-center transition-all hover:scale-110 hover:rotate-3 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed z-50 bottom-20 sm:bottom-8 right-4 sm:right-8 w-[90vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-orange-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
        style={{ height: 'min(550px, 75vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-orange-500 text-white rounded-t-3xl shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <ChefHat size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Bếp Phó Dzui</h3>
              <span className="flex items-center gap-1 text-[10px] opacity-90 font-medium">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                Sẵn sàng hỗ trợ
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <Minimize2 size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF7ED] scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[88%] p-3.5 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-500 text-white rounded-br-none shadow-orange-200' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none shadow-gray-100'
                }`}
              >
                <FormattedMessage text={msg.text} isModel={msg.role === 'model'} />
              </div>
            </div>
          ))}
          
          {isTyping && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                 <Loader2 size={20} className="animate-spin text-orange-400" />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 rounded-b-3xl">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:border-orange-300 focus-within:bg-white focus-within:shadow-inner transition-all duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi gì đó..."
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-orange-500 text-white rounded-full disabled:opacity-50 hover:bg-orange-600 transition-transform hover:scale-105 shadow-md shadow-orange-100"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
