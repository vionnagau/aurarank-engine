"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [queryId, setQueryId] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Soft Minimalist Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-2xl flex flex-col items-center"
      >

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-3">
            Aura<span className="font-medium">Rank</span>
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-widest">
            Semantic Alignment Engine
          </p>
        </div>

        {/* Glassmorphic Input Component */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

          <div className="relative backdrop-blur-xl bg-neutral-900/50 border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-3 transition-all focus-within:bg-neutral-900/80 focus-within:border-white/20">
            <Search className="w-5 h-5 text-neutral-500 ml-4" />

            <input
              type="number"
              placeholder="Enter query token ID (e.g., 3)"
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-neutral-600 py-3 px-2 text-lg"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
            />

            <button className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-neutral-200 transition-colors active:scale-95 duration-200">
              Rank
            </button>
          </div>
        </div>

      </motion.div>
    </main>
  );
}