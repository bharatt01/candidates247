import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const LiveCandidatesStrip = () => {
  const candidates = [
    { name: "Rahul Sharma", role: "Frontend Developer", exp: "3 yrs", location: "Delhi" },
    { name: "Priya Verma", role: "Data Analyst", exp: "2 yrs", location: "Bangalore" },
    { name: "Aman Gupta", role: "MERN Developer", exp: "4 yrs", location: "Noida" },
    { name: "Sneha Kapoor", role: "UI/UX Designer", exp: "3 yrs", location: "Mumbai" },
    { name: "Vikas Yadav", role: "Backend Developer", exp: "5 yrs", location: "Gurgaon" },
  ];
const navigate = useNavigate();
  return (
    <section className="relative py-24 bg-[hsl(38,70%,96%)] overflow-hidden">

      {/* Top Heading */}

    

   <div className="max-w-6xl mx-auto px-6 mb-16">
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 bg-[hsl(32,88%,55%)] rounded-xl flex items-center justify-center flex-shrink-0">
      <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
    </div>

    <h2 className="text-4xl md:text-4xl font-semibold tracking-tight">
      Recently Hired{" "}
      <span className="text-[hsl(32,88%,55%)]">
        Candidates
      </span>
    </h2>
  </div>
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
    
    </section>
  );
};

export default LiveCandidatesStrip;