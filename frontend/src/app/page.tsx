'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [query, setQuery] = useState('');
  const [timeWeight, setTimeWeight] = useState(0.5); // The Temporal Decay Lambda
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // The Framer Motion fix you successfully merged in Milestone 6
  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      // Pinging your FastAPI backend with the query AND the temporal weight
      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, time_weight: timeWeight }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            AuraRank Engine
          </h1>
          <p className="text-neutral-400">Deep Learning Retrieval & Agentic Interrogation</p>
        </div>

        {/* Control Panel (Glassmorphic) */}
        <form onSubmit={handleSearch} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Semantic Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., machine learning tutorials..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Temporal Decay Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-neutral-300">Temporal Decay ($\lambda$)</label>
              <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                {timeWeight.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={timeWeight}
              onChange={(e) => setTimeWeight(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-neutral-500 font-medium">
              <span>Pure Semantic Relevance</span>
              <span>Heavy Recency Bias</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Running Neural Pipeline...' : 'Execute Neural Search'}
          </button>
        </form>

        {/* Results Section */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {results.map((result, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-6 rounded-2xl bg-neutral-900 border border-white/5 space-y-4 hover:border-purple-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{result.title}</h3>

                {/* Telemetry Badges */}
                <div className="flex gap-2">
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                    Conf: {(result.confidence_score * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                    {result.latency_ms}ms
                  </span>
                </div>
              </div>

              <p className="text-sm text-neutral-400">{result.description}</p>

              {/* Agentic Reasoning Block */}
              {result.agentic_reasoning && (
                <div className="mt-4 p-4 rounded-xl bg-purple-900/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Gemini Interrogation</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {result.agentic_reasoning}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}