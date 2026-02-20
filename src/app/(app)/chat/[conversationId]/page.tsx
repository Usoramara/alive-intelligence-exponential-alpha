'use client';

import { useState, use } from 'react';
import { MindProvider } from '@/components/mind-provider';
import { BrainMap } from '@/components/brain-map/brain-map';
import { SelfStatePanel } from '@/components/panels/self-state-panel';
import { EngineInspector } from '@/components/panels/engine-inspector';
import { SignalLog } from '@/components/panels/signal-log';
import { InputPanel } from '@/components/panels/input-panel';
import { ConversationPanel } from '@/components/panels/conversation-panel';
import { Face } from '@/components/face/face';
import { StreamPanel } from '@/components/panels/stream-panel';
import type { EngineId } from '@/core/constants';

export default function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const [selectedEngine, setSelectedEngine] = useState<EngineId | null>(null);

  return (
    <MindProvider conversationId={conversationId}>
      <main className="h-full w-full flex flex-col p-4 gap-4">
        {/* Main content */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left sidebar — state + conversation */}
          <aside className="w-72 shrink-0 flex flex-col gap-3 min-h-0">
            <SelfStatePanel />
            <EngineInspector engineId={selectedEngine} />
            <div className="flex-1 min-h-0">
              <ConversationPanel />
            </div>
          </aside>

          {/* Center — brain visualization */}
          <div className="flex-1 min-w-0">
            <BrainMap onSelectEngine={setSelectedEngine} />
          </div>

          {/* Right sidebar — face + inner life + signal log */}
          <aside className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-thin">
            <Face />
            <StreamPanel />
            <SignalLog />
          </aside>
        </div>

        {/* Bottom — input */}
        <div className="shrink-0">
          <InputPanel />
        </div>
      </main>
    </MindProvider>
  );
}
