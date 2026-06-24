'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Clean, direct endpoint match
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      });

      const data = await response.json();
      setResults(data.results || data || []);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono p-8 antialiased">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Minimalist Terminal Header */}
        <div className="border-b border-neutral-800 pb-6">
          <h1 className="text-xl font-bold tracking-widest text-neutral-100">AURARANK_ENGINE //</h1>
          <p className="text-xs text-neutral-500 mt-1">SYSTEM STATUS: ACTIVE // NEURAL RETRIEVAL PIPELINE</p>
        </div>

        {/* High-Tech Minimal Input */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative border border-neutral-800 focus-within:border-neutral-400 transition-colors bg-neutral-950 px-4 py-3 rounded">
            <span className="text-neutral-600 mr-2">&gt;</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEMANTIC QUERY..."
              className="bg-transparent text-white outline-none w-11/12 uppercase tracking-wider text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-neutral-800 hover:border-white hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest py-3 font-bold disabled:opacity-30"
          >
            {loading ? 'EXECUTING SEARCH...' : 'RUN PIPELINE'}
          </button>
        </form>

        {/* Streamlined Results Output */}
        <div className="space-y-6">
          {results.map((result, idx) => (
            <div key={idx} className="border border-neutral-900 bg-neutral-950 p-6 rounded space-y-3">
              <div className="flex justify-between items-baseline border-b border-neutral-900 pb-2">
                <h3 className="text-sm font-bold tracking-wide text-neutral-200 uppercase">{result.title}</h3>
                <span className="text-[10px] text-neutral-500 font-mono">
                  SCORE: {result.confidence_score ? (result.confidence_score * 100).toFixed(1) : '100'}%
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed uppercase">{result.description}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}