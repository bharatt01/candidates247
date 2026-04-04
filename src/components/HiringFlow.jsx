import React from "react";
import { motion } from "framer-motion";

const LiveCandidatesStrip = () => {
  const candidates = [
    { name: "Rahul Sharma", role: "Frontend Developer", exp: "3 yrs", location: "Delhi" },
    { name: "Priya Verma", role: "Data Analyst", exp: "2 yrs", location: "Bangalore" },
    { name: "Aman Gupta", role: "MERN Developer", exp: "4 yrs", location: "Noida" },
    { name: "Sneha Kapoor", role: "UI/UX Designer", exp: "3 yrs", location: "Mumbai" },
    { name: "Vikas Yadav", role: "Backend Developer", exp: "5 yrs", location: "Gurgaon" },
  ];

  return (
    <section className="relative py-24 bg-[hsl(38,70%,96%)] overflow-hidden">

      {/* Top Heading */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <p className="uppercase tracking-[0.3em] text-[11px] text-[hsl(300,12%,45%)] mb-4">
          Live Candidates
        </p>

        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Fresh Profiles
          <span className="block text-[hsl(32,88%,55%)]">
            Updated in Real-Time
          </span>
        </h2>
      </div>

      {/* Moving Strip */}
      <div className="relative w-full overflow-hidden">

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-6 w-max px-6"
        >
          {[...candidates, ...candidates].map((c, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-lg">{c.name}</p>

              <p className="text-sm text-[hsl(300,12%,45%)] mt-1">
                {c.role}
              </p>

              <div className="mt-4 flex justify-between text-xs text-[hsl(300,12%,45%)]">
                <span>{c.exp}</span>
                <span>{c.location}</span>
              </div>

              <div className="mt-5 pt-4 border-t border-[hsl(38,35%,88%)]">
                <span className="text-xs font-medium text-[hsl(32,88%,55%)]">
                  Available Now
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-[hsl(32,88%,55%)] text-white rounded-xl font-semibold hover:brightness-95 transition">
          View All Candidates
        </button>
      </div>
    </section>
  );
};

export default LiveCandidatesStrip;