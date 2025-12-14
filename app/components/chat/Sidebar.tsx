'use client';

import { MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
    id: string;
    title: string;
    timestamp: Date;
}

interface SidebarProps {
    conversations: Conversation[];
    activeId?: string;
    onSelect: (id: string) => void;
    onNewChat: () => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNewChat }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-slate-200"
            >
                <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {(isOpen || isMobileOpen) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`
              fixed lg:relative top-0 left-0 h-screen
              ${isMobileOpen ? 'w-80' : 'w-0 lg:w-80'}
              bg-slate-900/95 backdrop-blur-sm border-r border-slate-800
              flex flex-col z-40
            `}
                    >
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-100">Sohbetler</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="hidden lg:block p-1 rounded hover:bg-slate-800 transition-colors"
                                >
                                    {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="lg:hidden p-1 rounded hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-3">
                            <button
                                onClick={onNewChat}
                                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Yeni Sohbet
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => onSelect(conv.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeId === conv.id
                                            ? 'bg-slate-800 text-slate-100'
                                            : 'text-slate-400 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <p className="text-sm font-medium truncate">{conv.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {conv.timestamp.toLocaleDateString('tr-TR')}
                                    </p>
                                </button>
                            ))}

                            {conversations.length === 0 && (
                                <div className="text-center py-8 text-sm text-slate-500">
                                    Henüz sohbet yok
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
