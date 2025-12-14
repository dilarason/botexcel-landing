'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface ChatLayoutProps {
    children: ReactNode;
    conversations: Array<{ id: string; title: string; timestamp: Date }>;
    activeId?: string;
    onSelectConversation: (id: string) => void;
    onNewChat: () => void;
}

export function ChatLayout({
    children,
    conversations,
    activeId,
    onSelectConversation,
    onNewChat
}: ChatLayoutProps) {
    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar
                conversations={conversations}
                activeId={activeId}
                onSelect={onSelectConversation}
                onNewChat={onNewChat}
            />

            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
