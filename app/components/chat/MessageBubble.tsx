'use client';

import { User, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isCodeBlock = message.content.includes('```');
    const parts = isCodeBlock ? message.content.split('```') : [message.content];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
            >
                {isUser ? <User className="w-4 h-4 text-slate-950" /> : <Bot className="w-4 h-4 text-slate-200" />}
            </div>

            <div className="flex-1 max-w-3xl">
                <div
                    className={`rounded-2xl px-4 py-3 ${isUser ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-100'
                        }`}
                >
                    {isCodeBlock ? (
                        <div className="space-y-2">
                            {parts.map((part, idx) => {
                                if (idx % 2 === 1) {
                                    const lines = part.split('\n');
                                    const language = lines[0]?.trim() || '';
                                    const code = lines.slice(1).join('\n');

                                    return (
                                        <div key={idx} className="relative">
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-1.5 rounded bg-slate-900/50 hover:bg-slate-900 transition-colors"
                                                >
                                                    {copied ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-3 h-3 text-slate-400" />
                                                    )}
                                                </button>
                                            </div>
                                            <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto text-sm">
                                                <code className={`language-${language}`}>{code}</code>
                                            </pre>
                                        </div>
                                    );
                                }
                                return <p key={idx} className="text-sm whitespace-pre-wrap">{part}</p>;
                            })}
                        </div>
                    ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-2">
                    <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
