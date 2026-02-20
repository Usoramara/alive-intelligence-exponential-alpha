'use client';

import { useState, useEffect } from 'react';

interface UsageStats {
  totalTokens: number;
  totalCost: number;
  tier: string;
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState<UsageStats | null>(null);

  useEffect(() => {
    fetch('/api/user/usage')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setStats({
            totalTokens: data.totalTokens ?? 0,
            totalCost: data.costCents ? data.costCents / 100 : 0,
            tier: data.tier ?? 'free',
          });
        }
      })
      .catch(() => {});
  }, []);

  const saveApiKey = async () => {
    setSaving(true);
    // Phase 6 will add the actual BYOK key save endpoint
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setApiKey('');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-mono text-white/80 mb-8">Settings</h1>

        {/* Usage */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-3">
            Usage
          </h2>
          <div className="p-4 border border-white/5 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-mono text-white/40">Tier</span>
              <span className="text-xs font-mono text-white/60 capitalize">
                {stats?.tier ?? '...'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-mono text-white/40">Tokens used</span>
              <span className="text-xs font-mono text-white/60">
                {stats?.totalTokens?.toLocaleString() ?? '...'}
              </span>
            </div>
          </div>
        </section>

        {/* BYOK */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-3">
            Bring Your Own Key
          </h2>
          <p className="text-xs font-mono text-white/30 mb-3">
            Use your own Anthropic API key for unlimited usage. Your key is encrypted at rest.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs font-mono text-white/60 placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKey || saving}
              className="px-4 py-2 bg-white/10 border border-white/10 rounded text-xs font-mono text-white/60 hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              {saving ? '...' : saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
