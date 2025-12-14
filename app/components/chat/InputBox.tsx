'use client';

import { Send, Loader2 } from 'lucide-react';
import { useState, useRef, KeyboardEvent } from 'react';

interface InputBoxProps {
    onSend: (message: string) => void;
    loading?: boolean;
}

export function InputBox({ onSend, loading = false }: InputBoxProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!message.trim() || loading) return;
        onSend(message);
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onInput={handleInput}
                            placeholder="Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile yeni satır)"
                            rows={1}
                            disabled={loading}
                            className="w-full resize-none rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 max-h-40 overflow-y-auto"
                            style={{ minHeight: '50px' }}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!message.trim() || loading}
                        className="p-3 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <p className="text-xs text-slate-500 mt-2 px-1">
                    BotExcel AI sizin asistanınızdır. Belgeleriniz hakkında sorular sorabilirsiniz.
                </p>
            </div>
        </div>
    );
}
