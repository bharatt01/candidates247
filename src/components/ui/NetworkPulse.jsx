import React from "react";
import { motion } from "framer-motion";

const NetworkPulse = () => {
  const recentPlacements = [
    { name: "Julian P.", role: "Staff DevOps", company: "A-Series Startup", salary: "$240k" },
    { name: "Sarah L.", role: "Principal Frontend", company: "Fintech Unicorn", salary: "$215k" },
    { name: "Marcus W.", role: "Rust Engineer", company: "Web3 Protocol", salary: "$190k" },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">

      {/* Saffron Glow Background */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[hsl(32,88%,85%)] rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[hsl(32,90%,94%)] border border-[hsl(38,35%,86%)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(32,88%,55%)] animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[hsl(300,12%,45%)]">
                Live Market Feed
              </span>
            </div>

            <h2 className="text-5xl font-medium tracking-tight">
              Network Pulse
            </h2>

            <p className="text-[hsl(300,12%,45%)] max-w-md leading-relaxed">
              Real-time liquidity insights from our private talent exchange.
              Verified placements updated continuously.
            </p>
          </div>

          {/* Metrics Panel */}
          <div className="flex gap-12 bg-white/70 backdrop-blur-xl px-10 py-8 rounded-[2rem] border border-[hsl(38,35%,86%)] shadow-[0_20px_60px_rgba(180,120,40,0.08)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                Velocity
              </p>
              <p className="text-3xl font-semibold text-[hsl(32,88%,55%)]">
                +12.4%
              </p>
            </div>

            <div className="w-px bg-[hsl(38,35%,86%)]" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                Active Roles
              </p>
              <p className="text-3xl font-semibold">
                142
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* PLACEMENTS */}
          <div className="relative bg-white/75 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(180,120,40,0.05)]">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-12">
              Recent Placements
            </p>

            <div className="space-y-8">
              {recentPlacements.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>
                    <p className="text-sm text-[hsl(300,12%,45%)] mt-1">
                      {item.role}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[hsl(300,12%,45%)] italic">
                      {item.company}
                    </p>
                    <p className="text-sm font-semibold mt-1 text-[hsl(32,88%,55%)]">
                      {item.salary}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* HIRING INTENSITY */}
          <div className="relative bg-white/75 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(180,120,40,0.05)] flex flex-col">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-10">
              Hiring Intensity
            </p>

            <div className="flex items-end gap-3 h-40">
              {[40, 70, 45, 90, 65, 80, 50, 95, 70, 100].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="flex-1 bg-[hsl(32,90%,85%)] hover:bg-[hsl(32,88%,55%)] transition-all duration-300 rounded-full"
                />
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-[hsl(38,35%,88%)] text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[hsl(300,12%,45%)]">
                Market Liquidity:
                <span className="text-[hsl(32,88%,55%)] font-semibold"> Optimal</span>
              </p>
            </div>
          </div>

          {/* DEMAND CLUSTERS */}
          <div className="relative bg-white/75 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(180,120,40,0.05)]">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-12">
              High Demand Clusters
            </p>

            <div className="space-y-6">
              {[
                { skill: "Distributed Rust", count: 14 },
                { skill: "LLM Orchestration", count: 22 },
                { skill: "React Server Components", count: 31 },
                { skill: "Solana / Anchor", count: 9 },
              ].map((stack, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-[hsl(38,35%,88%)]">
                  <span>
                    {stack.skill}
                  </span>
                  <span className="text-xs font-semibold text-[hsl(32,88%,55%)]">
                    {stack.count} Roles
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER BAR */}
        <div className="mt-20 pt-10 border-t border-[hsl(38,35%,86%)] flex justify-between items-center text-[11px] uppercase tracking-[0.25em] text-[hsl(300,12%,45%)]">
          <span>Privacy Shield Active • Direct Hire Protocol</span>
          <div className="flex gap-8">
            <span>SF</span>
            <span>LDN</span>
            <span>NYC</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NetworkPulse;




