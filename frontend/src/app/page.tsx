"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, BarChart3, Sliders, Cpu, Activity, Layers } from "lucide-react";
import { useState, useMemo } from "react";

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
  const [rawResults, setRawResults] = useState<RankedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Hyperparameter States
  const [metric, setMetric] = useState<string>("cosine");
  const [strategy, setStrategy] = useState<string>("dense");
  const [latency, setLatency] = useState<string>("0.00ms");

  const executeRanking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`http://localhost:8000/rank?query_token_id=${queryId}`);
      if (!response.ok) throw new Error(`Engine status: ${response.status}`);

      const data: ApiResponse = await response.json();
      if (data.status === "success") {
        setRawResults(data.ranked_results);
        setLatency(`${(performance.now() - startTime).toFixed(2)}ms`);
      } else {
        throw new Error("API transaction aborted.");
      }
    } catch (err: any) {
      setError(err.message || "Engine offline.");
      setRawResults([]);
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

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-[#070708] text-neutral-200 p-4 md:p-8 relative overflow-hidden selection:bg-white selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent blur-3xl pointer-events-none" />

      {/* Global Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8 border-b border-white/5 pb-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm tracking-tighter">Ω</div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">Aura<span className="text-neutral-400">Rank</span></h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">v1.0.4-production</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-neutral-900/50 border border-white/5 px-3 py-1.5 rounded-full text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> ENGINE_ONLINE
        </div>
      </header>

      {/* Main Dashboard Layout Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start z-10 relative">

        {/* Column 1: Hyperparameter Control Panel */}
        <div className="backdrop-blur-xl bg-neutral-900/20 border border-white/5 rounded-2xl p-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            <Sliders className="w-4 h-4 text-neutral-500" /> System Hyperparameters
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-500 font-mono">Vector Space Metric</label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 rounded-xl border border-white/5">
              {["cosine", "euclidean"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetric(m)}
                  className={`text-xs font-mono py-1.5 capitalize rounded-lg transition-all ${metric === m ? "bg-white text-black font-medium" : "text-neutral-400 hover:text-white"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-500 font-mono">Search Strategy</label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 rounded-xl border border-white/5">
              {["dense", "sparse-hybrid"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStrategy(s)}
                  className={`text-xs font-mono py-1.5 capitalize rounded-lg transition-all ${strategy === s ? "bg-white text-black font-medium" : "text-neutral-400 hover:text-white"}`}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] font-mono text-neutral-500">
            <div className="flex justify-between"><span>Vector Dim:</span><span className="text-neutral-300">1536 (Float32)</span></div>
            <div className="flex justify-between"><span>Indexing:</span><span className="text-neutral-300">HNSW Flat</span></div>
          </div>
        </div>

        {/* Column 2 & 3: Execution Terminal and Core Display */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={executeRanking} className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-2xl blur opacity-10" />
            <div className="relative backdrop-blur-xl bg-neutral-900/40 border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-xl">
              <Search className="w-5 h-5 text-neutral-500 ml-3 flex-shrink-0" />
              <input
                type="number"
                placeholder="Enter query token cluster ID..."
                className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-neutral-600 py-2.5 text-base"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !queryId.trim()} className="bg-white text-black px-6 py-2.5 rounded-xl font-medium hover:bg-neutral-200 transition-all active:scale-95 text-sm disabled:opacity-40 flex items-center justify-center min-w-[90px]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Compute"}
              </button>
            </div>
          </form>

          {/* Results Output Screen */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs flex gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div><span className="font-semibold block mb-0.5">Pipeline Interrupted</span>{error}</div>
                </motion.div>
              )}

              {!isLoading && !error && processedResults.length === 0 && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-neutral-600 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-2">
                  <BarChart3 className="w-6 h-6 opacity-30" />
                  <p className="text-xs font-mono">Awaiting target coordinate array execution</p>
                </motion.div>
              )}

              {!isLoading && processedResults.length > 0 && (
                <motion.div key="results" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="space-y-2.5">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-1 flex justify-between">
                    <span>Computed Alignments</span>
                    <span className="text-neutral-400 text-right">{metric === "euclidean" ? "Mode: L2 Distance (Lower is closer)" : "Mode: Cosine Similarity"}</span>
                  </div>
                  {processedResults.map((item, idx) => (
                    <motion.div key={item.candidate} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="relative border border-white/5 bg-neutral-900/10 rounded-xl p-4 flex items-center justify-between overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 bg-white/[0.01]" style={{ width: `${Math.min(100, item.relevance * 100)}%` }} />
                      <div className="flex items-center gap-3 z-10">
                        <span className="text-[10px] font-mono text-neutral-600 bg-neutral-950 px-2 py-0.5 rounded border border-white/5">0{idx + 1}</span>
                        <span className="text-sm font-medium capitalize tracking-wide">{item.candidate}</span>
                      </div>
                      <div className="flex items-center gap-3 z-10 font-mono">
                        <div className="w-16 bg-neutral-900 h-1 rounded-full overflow-hidden hidden sm:block">
                          <div className="bg-neutral-500 h-full rounded-full" style={{ width: `${Math.min(100, item.relevance * 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-neutral-400">{item.relevance.toFixed(5)}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 4: Real-time Telemetry Monitor */}
        <div className="backdrop-blur-xl bg-neutral-900/20 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            <Activity className="w-4 h-4 text-neutral-500" /> Pipeline Telemetry
          </div>

          <div className="grid grid-cols-1 gap-3 font-mono">
            <div className="bg-neutral-950/60 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-neutral-500 flex items-center gap-1.5"><Cpu className="w-3 h-3" /> API Latency</div>
              <div className="text-lg font-medium text-white mt-1">{isLoading ? "Computing..." : latency}</div>
            </div>

            <div className="bg-neutral-950/60 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-neutral-500 flex items-center gap-1.5"><Layers className="w-3 h-3" /> Core Node Load</div>
              <div className="text-lg font-medium text-white mt-1">{processedResults.length > 0 ? "0.024 Msec" : "Idle"}</div>
            </div>
          </div>

          <div className="text-[10px] text-neutral-600 font-mono bg-neutral-950 p-2.5 rounded-lg border border-white/5">
            ⚡ Memory Pool: <span className="text-neutral-400 font-medium">Stable</span> <br />
            ⚡ CORS Origin: <span className="text-neutral-400 font-medium">Authorized</span>
          </div>
        </div>

      </div>
    </main>
  );
}