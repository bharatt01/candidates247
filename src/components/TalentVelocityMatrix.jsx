import React from "react";
import { motion } from "framer-motion";

const TalentVelocityMatrix = () => {
  const talents = [
    {
      name: "Aarav S.",
      stack: "Senior Rust Systems",
      salary: "$210k",
      velocity: 92,
      availability: "2 Weeks",
    },
    {
      name: "Mila K.",
      stack: "ML Infrastructure",
      salary: "$240k",
      velocity: 97,
      availability: "Immediate",
    },
    {
      name: "Jonah R.",
      stack: "Distributed React",
      salary: "$185k",
      velocity: 84,
      availability: "3 Weeks",
    },
  ];

  return (
    <section className="relative py-32 px-6 bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)] overflow-hidden">

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[hsl(32,88%,88%)] blur-[140px] rounded-full opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="uppercase tracking-[0.4em] text-[11px] text-[hsl(300,12%,45%)] mb-6">
            Talent Velocity Matrix
          </p>

          <h2 className="text-5xl md:text-6xl font-medium tracking-tight">
            Hire Before
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)]">
              The Market Moves.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-[hsl(300,12%,45%)] text-lg leading-relaxed">
            High-performance engineers circulate fast. Our velocity index predicts placement speed before demand spikes.
          </p>
        </motion.div>

        {/* Grid */}
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

              <div className="relative bg-white/75 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-[2rem] p-10 shadow-[0_30px_60px_rgba(180,120,40,0.08)] transition-all duration-500 group-hover:-translate-y-2">

                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="font-semibold text-lg">
                      {talent.name}
                    </p>
                    <p className="text-sm text-[hsl(300,12%,45%)] mt-1">
                      {talent.stack}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-[hsl(32,90%,92%)] text-[hsl(32,88%,45%)] font-semibold">
                    {talent.availability}
                  </span>
                </div>

                {/* Salary */}
                <div className="mb-10">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-2">
                    Compensation Band
                  </p>
                  <p className="text-3xl font-semibold text-[hsl(32,88%,55%)]">
                    {talent.salary}
                  </p>
                </div>

                {/* Velocity Bar */}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] mb-4">
                    Placement Velocity
                  </p>

                  <div className="relative w-full h-3 bg-[hsl(38,35%,90%)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${talent.velocity}%` }}
                      transition={{ duration: 1.2, delay: index * 0.2 }}
                      className="h-full bg-gradient-to-r from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)]"
                    />
                  </div>

                  <div className="mt-3 text-right text-sm font-medium text-[hsl(300,12%,45%)]">
                    {talent.velocity}% Market Match Strength
                  </div>
                </div>

              </div>
            </motion.div>
          ))}

        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <button className="px-10 py-4 bg-[hsl(32,88%,55%)] text-white rounded-2xl font-semibold text-lg shadow-[0_15px_40px_rgba(180,120,40,0.2)] hover:brightness-95 transition-all duration-300">
            Access Private Talent Pool
          </button>

          <p className="mt-4 text-sm text-[hsl(300,12%,45%)]">
            Limited intake • Direct founder-led matching
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default TalentVelocityMatrix;




