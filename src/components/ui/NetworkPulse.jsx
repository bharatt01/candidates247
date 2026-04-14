import React from "react";
import { motion } from "framer-motion";

const HiringTrendsIndia = () => {
  const recentPlacements = [
    { name: "Rohit Mehta", role: "Backend Developer", company: "Fintech Startup", salary: "₹14 LPA" },
    { name: "Sneha Kapoor", role: "Frontend Developer", company: "E-commerce Brand", salary: "₹12 LPA" },
    { name: "Vikas Yadav", role: "Data Analyst", company: "SaaS Company", salary: "₹10 LPA" },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[hsl(32,88%,85%)] rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">

          <div className="space-y-6">
            
            <h2 className="text-5xl font-medium tracking-tight">
              Live Hiring Trends
            </h2>

            <p className="text-[hsl(300,12%,45%)] max-w-md leading-relaxed">
              See what’s happening in the job market right now. Track hiring activity, demand, and recent placements across companies.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex gap-12 bg-white/70 backdrop-blur-xl px-10 py-8 rounded-[2rem] border border-[hsl(38,35%,86%)] shadow-[0_20px_60px_rgba(180,120,40,0.08)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                New Profiles Uploaded
              </p>
              <p className="text-3xl font-semibold text-[hsl(32,88%,55%)]">
                1,240+
              </p>
            </div>

            <div className="w-px bg-[hsl(38,35%,86%)]" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                Companies Hiring
              </p>
              <p className="text-3xl font-semibold">
                320+
              </p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* RECENT PLACEMENTS */}
          <div className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(180,120,40,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-10">
              Recent Hires
            </p>

            <div className="space-y-6">
              {recentPlacements.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-[hsl(300,12%,45%)]">
                      {item.role}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[hsl(300,12%,45%)]">
                      {item.company}
                    </p>
                    <p className="text-sm font-semibold text-[hsl(32,88%,55%)]">
                      {item.salary}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* HIRING ACTIVITY */}
          <div className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(180,120,40,0.05)] flex flex-col">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-10">
              Hiring Activity
            </p>

            <div className="flex items-end gap-3 h-40">
              {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="flex-1 bg-[hsl(32,90%,85%)] hover:bg-[hsl(32,88%,55%)] rounded-full"
                />
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-[hsl(300,12%,45%)]">
              Hiring Activity: <span className="text-[hsl(32,88%,55%)] font-semibold">High</span>
            </p>
          </div>

          {/* TOP SKILLS */}
          <div className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(180,120,40,0.05)]">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-10">
              Top Skills in Demand
            </p>

            <div className="space-y-5">
              {[
                { skill: "React.js", count: 120 },
                { skill: "Node.js", count: 95 },
                { skill: "Python", count: 110 },
                { skill: "SQL / Data Analysis", count: 80 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-2">
                  <span>{item.skill}</span>
                  <span className="text-sm text-[hsl(32,88%,55%)] font-semibold">
                    {item.count} Jobs
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-20 pt-8 border-t border-[hsl(38,35%,86%)] flex justify-between text-xs text-[hsl(300,12%,45%)]">
          <span>Trusted by 500+ Companies</span>
          <div className="flex gap-6">
            <span>Delhi</span>
            <span>Bangalore</span>
            <span>Mumbai</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HiringTrendsIndia;