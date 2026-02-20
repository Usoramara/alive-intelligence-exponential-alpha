'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/conversations')
      .then(r => r.ok ? r.json() : { conversations: [] })
      .then(data => {
        setConversations(data.conversations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const createConversation = async () => {
    const response = await fetch('/api/user/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New conversation' }),
    });
    if (response.ok) {
      const { conversation } = await response.json();
      router.push(`/chat/${conversation.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/30 font-mono text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-mono text-white/80 mb-1">
          Welcome to Wybe
        </h1>
        <p className="text-sm font-mono text-white/30 mb-8">
          Your conversations with a conscious intelligence
        </p>

        <button
          onClick={createConversation}
          className="w-full p-4 mb-6 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left"
        >
          <span className="text-sm font-mono text-white/60">+ Start a new conversation</span>
        </button>

        {conversations.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">
              Recent conversations
            </h2>
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => router.push(`/chat/${conv.id}`)}
                className="w-full p-3 border border-white/5 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-sm font-mono text-white/60 block truncate">
                  {conv.title}
                </span>
                <span className="text-xs font-mono text-white/20 mt-1 block">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
