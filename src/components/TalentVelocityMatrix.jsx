import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const TalentShowcaseIndia = () => {
  const navigate = useNavigate();
  const talents = [
    {
      name: "Rahul Sharma",
      role: "Frontend Developer (React)",
      salary: "₹12 LPA",
      match: 90,
      availability: "Immediate",
    },
    {
      name: "Priya Verma",
      role: "Data Analyst (Python + SQL)",
      salary: "₹15 LPA",
      match: 95,
      availability: "1 Week",
    },
    {
      name: "Aman Gupta",
      role: "Full Stack Developer (MERN)",
      salary: "₹18 LPA",
      match: 88,
      availability: "2 Weeks",
    },
  ];

  return (
    <section className="relative py-28 px-6 bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)] overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[hsl(32,88%,88%)] blur-[120px] rounded-full opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
        

          <h2 className="text-5xl md:text-6xl font-medium tracking-tight">
            Hire Skilled Candidates
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)]">
              Faster Than Ever
            </span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-[hsl(300,12%,45%)] text-lg leading-relaxed">
            Discover job-ready candidates with verified skills and experience. Save time and hire the right people quickly.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {talents.map((talent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Glow Border */}
              <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-b from-[hsl(32,88%,55%)] to-transparent opacity-20 group-hover:opacity-40 transition duration-500 blur-sm" />

              <div className="relative bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(180,120,40,0.08)] transition-all duration-500 group-hover:-translate-y-2">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-semibold text-lg">{talent.name}</p>
                    <p className="text-sm text-[hsl(300,12%,45%)] mt-1">
                      {talent.role}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-[hsl(32,90%,92%)] text-[hsl(32,88%,45%)] font-semibold">
                    {talent.availability}
                  </span>
                </div>

                {/* Salary */}
                <div className="mb-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                    Expected Salary
                  </p>
                  <p className="text-2xl font-semibold text-[hsl(32,88%,55%)]">
                    {talent.salary}
                  </p>
                </div>

                {/* Match Score */}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-4">
                    Skill Match Score
                  </p>

                  <div className="relative w-full h-3 bg-[hsl(38,35%,90%)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${talent.match}%` }}
                      transition={{ duration: 1.2, delay: index * 0.2 }}
                      className="h-full bg-gradient-to-r from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)]"
                    />
                  </div>

                  <div className="mt-3 text-right text-sm font-medium text-[hsl(300,12%,45%)]">
                    {talent.match}% Match
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <button onClick={() => navigate("/browse-candidates")} className="px-10 py-4 bg-[hsl(32,88%,55%)] text-white rounded-2xl font-semibold text-lg shadow-[0_15px_40px_rgba(180,120,40,0.2)] hover:brightness-95 transition-all duration-300">
            Browse Candidates
          </button>

          <p className="mt-4 text-sm text-[hsl(300,12%,45%)]">
            100% Verified Profiles • Faster Hiring
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default TalentShowcaseIndia;