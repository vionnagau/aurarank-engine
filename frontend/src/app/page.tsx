"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, BarChart3 } from "lucide-react";
import { useState } from "react";

// Strict Type Definitions for API Payload
interface RankedResult {
  candidate: string;
  relevance: number;
}

interface ApiResponse {
  status: string;
  ranked_results: RankedResult[];
}

export default function Home() {
  const [queryId, setQueryId] = useState<string>("");
  const [results, setResults] = useState<RankedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeRanking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Connects directly to the FastAPI local endpoint
      const response = await fetch(`http://localhost:8000/rank?query_token_id=${queryId}`);

      if (!response.ok) {
        throw new Error(`Engine responded with status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === "success") {
        setResults(data.ranked_results);
      } else {
        throw new Error("API transaction failed unexpectedly.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to communicate with AuraRank Engine.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation configuration for staggered list entries
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-white selection:text-black">

      {/* Soft Minimalist Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-2xl flex flex-col items-center">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-light tracking-tight mb-2">
            Aura<span className="font-medium">Rank</span>
          </h1>
          <p className="text-neutral-400 text-xs uppercase tracking-widest">
            Semantic Alignment Engine
          </p>
        </motion.div>

        {/* Input Control Panel */}
        <form onSubmit={executeRanking} className="w-full relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000" />

          <div className="relative backdrop-blur-xl bg-neutral-900/40 border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-3 focus-within:bg-neutral-900/70 focus-within:border-white/20 transition-all duration-300">
            <Search className="w-5 h-5 text-neutral-500 ml-4 flex-shrink-0" />

            <input
              type="number"
              placeholder="Enter query token ID (e.g., 3)"
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-neutral-600 py-3 px-2 text-lg"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !queryId.trim()}
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-neutral-200 transition-all active:scale-95 duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:active:scale-100 flex items-center gap-2 min-w-[110px] justify-center h-[52px]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Rank"}
            </button>
          </div>
        </form>

        {/* Execution Output (Dynamic Context Rendering) */}
        <div className="w-full min-h-[250px]">
          <AnimatePresence mode="wait">

            {/* Error Feedback State */}
            {error && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3 backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-0.5">Connection Error</h4>
                  <p className="text-red-400/80">{error}. Is your FastAPI microservice online at port 8000?</p>
                </div>
              </motion.div>
            )}

            {/* Empty Visual State */}
            {!isLoading && !error && results.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-neutral-600 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2"
              >
                <BarChart3 className="w-8 h-8 opacity-40" />
                <p className="text-sm">Awaiting pipeline execution payload</p>
              </motion.div>
            )}

            {/* Staggered Results Panel */}
            {!isLoading && results.length > 0 && (
              <motion.div
                key="results-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-3 w-full"
              >
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 mb-1">
                  Vector Alignment Rankings
                </div>
                {results.map((item, index) => (
                  <motion.div
                    key={item.candidate}
                    variants={itemVariants}
                    className="relative border border-white/10 backdrop-blur-md bg-neutral-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm overflow-hidden"
                  >
                    {/* Visual Bar representation of confidence metric */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-white/[0.02] transition-all duration-1000 ease-out"
                      style={{ width: `${item.relevance * 100}%` }}
                    />

                    <div className="flex items-center gap-4 z-10">
                      <span className="text-xs font-mono text-neutral-600 bg-neutral-900 px-2 py-1 rounded border border-white/5">
                        0{index + 1}
                      </span>
                      <span className="font-medium text-neutral-200 capitalize tracking-wide">
                        {item.candidate}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 z-10">
                      <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="bg-neutral-400 h-full rounded-full"
                          style={{ width: `${item.relevance * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-semibold text-neutral-400">
                        {(item.relevance).toFixed(4)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}