import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat, Loader2, Sparkles, Minimize2 } from 'lucide-react';
import { createRemixChat } from '@/services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import { Recipe } from '@/types';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface RecipeRemixChatProps {
    recipe: Recipe;
    onRemix: (remixRequest: string) => void;
    onClose: () => void;
}

// Helper: Formatted Message (Markdown-ish)
const FormattedMessage = ({ text, isModel }: { text: string, isModel: boolean }) => {
    const lines = text.split('\n');
    return (
        <div className="space-y-1.5">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;
                if (isModel && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
                    return (
                        <div key={idx} className="flex gap-2 ml-1">
                            <span className="text-orange-500 mt-1.5 text-[6px] shrink-0">●</span>
                            <p className="leading-relaxed"><BoldParser text={trimmed.substring(2)} /></p>
                        </div>
                    );
                }
                return <p key={idx} className="leading-relaxed"><BoldParser text={line} /></p>;
            })}
        </div>
    );
};

// Helper: Bold Parser
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

export default function RecipeRemixChat({ recipe, onRemix, onClose }: RecipeRemixChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Chào bạn! Mình là Bếp Phó Remix. Bạn muốn sửa đổi gì ở món **${recipe.name}** này hông? (Ví dụ: thêm cay, bỏ hành, đổi thịt...)` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatRef.current) {
            chatRef.current = createRemixChat(recipe.name);
        }
    }, [recipe.name]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            if (!chatRef.current) chatRef.current = createRemixChat(recipe.name);
            const result = await chatRef.current.sendMessageStream({ message: userMsg });

            let fullResponse = "";
            setMessages(prev => [...prev, { role: 'model', text: "" }]);

            for await (const chunk of result) {
                const text = (chunk as GenerateContentResponse).text || "";
                fullResponse += text;
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { role: 'model', text: fullResponse };
                    return newMsgs;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Úi, lỗi kết nối rồi. Bạn thử lại nha!' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleTriggerRemix = () => {
        // Combine recent user messages to form the remix context
        // Filter only user messages for the request context
        const userRequests = messages
            .filter(m => m.role === 'user')
            .map(m => m.text)
            .join(". ");

        if (!userRequests) {
            // Fallback if user clicked remix without typing anything? 
            // Force them to say something or just send "Remix it"
            return;
        }
        onRemix(userRequests);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-slide-up">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Sparkles size={20} className="text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="font-bold">Bếp Phó Remix</h3>
                            <p className="text-xs text-purple-100 opacity-90">Đang chỉnh sửa: {recipe.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-indigo-50 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-indigo-100 rounded-bl-none'
                                }`}>
                                <FormattedMessage text={msg.text} isModel={msg.role === 'model'} />
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                                <Loader2 size={16} className="animate-spin text-purple-600" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Action Bar */}
                <div className="p-3 bg-white border-t border-gray-100">
                    {/* Remix Trigger Button - Only show if there's user interaction */}
                    {messages.filter(m => m.role === 'user').length > 0 && (
                        <button
                            onClick={handleTriggerRemix}
                            className="w-full mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse-slow"
                        >
                            <Sparkles size={18} />
                            <span>Remix Công Thức Ngay!</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Thêm cay, bớt ngọt..."
                            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-700"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 bg-purple-600 text-white rounded-full disabled:opacity-50 hover:bg-purple-700"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
