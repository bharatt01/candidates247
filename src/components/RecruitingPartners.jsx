import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, Briefcase, Quote, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const partners = [
  {
    name: "TechFlow",
    fullName: "TechFlow Solutions",
    type: "Product",
    location: "Bangalore",
    focus: "Full-stack",
    quote: "Zero ramp-up time. They ship on day one.",
    by: "Rahul Sharma, CTO",
  },
  {
    name: "DataMind",
    fullName: "DataMind Analytics",
    type: "Consulting",
    location: "Hyderabad",
    focus: "Data Science",
    quote: "First analysts who actually understand business context.",
    by: "Priya Nair, Head of Talent",
  },
  {
    name: "CloudScale",
    fullName: "CloudScale Infra",
    type: "Cloud",
    location: "Pune",
    focus: "DevOps",
    quote: "60% of our junior cloud team now comes from here.",
    by: "Vikram Patel, VP Engineering",
  },
  {
    name: "NexGen",
    fullName: "NexGen Fintech",
    type: "Startup",
    location: "Mumbai",
    focus: "Backend",
    quote: "Built for startup speed. These grads learn faster than seniors.",
    by: "Ananya Gupta, Co-founder",
  },
  {
    name: "EduTech",
    fullName: "EduTech Innovators",
    type: "EdTech",
    location: "Delhi",
    focus: "UI/UX",
    quote: "Portfolio-ready. We hired three in one month.",
    by: "Karan Mehta, Design Lead",
  },
 
];


const RecruitingPartners = () => {
const navigate = useNavigate();
const OnClick = () => {
  navigate("/for-companies");
}

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const active = partners[activeIndex];

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(32,88%,85%)] rounded-full blur-[120px]" />
      </div>

      {/* Large background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[18vw] font-black text-[hsl(300,18%,16%)] whitespace-nowrap select-none"
        >
          {active.name.toUpperCase()}
        </motion.span>
      </div>
<div className="relative max-w-6xl mx-auto">

        {/* HEADER */}
       <div className="mb-20 text-center">
  <h2 className="text-6xl font-bold tracking-tight">
    Our Recruitment{" "}
    <span className="text-[hsl(32,88%,55%)]">
      Companies
    </span>
  </h2>
</div>

        {/* MAIN DISPLAY */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT — Giant active card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-10 lg:p-14 rounded-[2rem] relative overflow-hidden shadow-[0_20px_60px_rgba(180,120,40,0.08)] group hover:shadow-[0_30px_80px_rgba(180,120,40,0.12)] transition-shadow duration-500">
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32">
                    <div className="absolute top-0 right-0 w-full h-[3px] bg-[hsl(32,88%,55%)]" />
                    <div className="absolute top-0 right-0 h-full w-[3px] bg-[hsl(32,88%,55%)]" />
                  </div>

                  {/* Number */}
                  <span className="absolute top-8 right-10 text-8xl font-black text-[hsl(32,88%,55%)]/10">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(32,88%,55%)] font-bold">
                        {active.type}
                      </span>
                      <span className="w-1 h-1 bg-[hsl(300,12%,45%)]/30 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {active.location}
                      </span>
                    </div>

                    <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-[hsl(300,18%,16%)]">
                      {active.fullName}
                    </h3>

                    <div className="flex items-center gap-2 mb-8">
                      <Briefcase className="w-4 h-4 text-[hsl(32,88%,55%)]" />
                      <span className="text-sm text-[hsl(300,12%,45%)]">Hiring for {active.focus}</span>
                    </div>

                    {/* Quote */}
                    <div className="border-l-2 border-[hsl(32,88%,55%)] pl-6 py-2">
                      <Quote className="w-5 h-5 text-[hsl(32,88%,55%)]/30 mb-2" />
                      <p className="text-xl lg:text-2xl font-medium leading-relaxed text-[hsl(300,18%,16%)] italic">
                        "{active.quote}"
                      </p>
                      <p className="text-sm text-[hsl(300,12%,45%)] mt-4">— {active.by}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Vertical partner strip */}
          <div className="lg:col-span-5">
            <div className="space-y-2">
              {partners.map((partner, index) => (
                <motion.button
                  key={partner.name}
                  onClick={() => { setActiveIndex(index); setIsAutoPlaying(false); }}
                  className={`w-full text-left py-4 px-6 rounded-2xl border transition-all duration-300 group ${
                    activeIndex === index
                      ? "bg-[hsl(32,88%,55%)] text-white border-[hsl(32,88%,55%)] shadow-[0_10px_40px_rgba(212,160,23,0.3)]"
                      : "bg-white/60 backdrop-blur border-[hsl(38,35%,86%)] hover:bg-white hover:border-[hsl(32,88%,55%)]/30"
                  }`}
                  whileHover={{ x: activeIndex === index ? 0 : 8 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        activeIndex === index ? "bg-white/20" : "bg-[hsl(32,90%,95%)] group-hover:bg-[hsl(32,88%,55%)]/10"
                      }`}>
                        <Building2 className={`w-4 h-4 ${
                          activeIndex === index ? "text-white" : "text-[hsl(32,88%,55%)]"
                        }`} />
                      </div>
                      <div>
                        <span className={`text-sm font-bold tracking-tight block ${
                          activeIndex === index ? "text-white" : "text-[hsl(300,18%,16%)]"
                        }`}>
                          {partner.name}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider ${
                          activeIndex === index ? "text-white/70" : "text-[hsl(300,12%,45%)]"
                        }`}>
                          {partner.focus}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-mono ${
                      activeIndex === index ? "text-white/60" : "text-[hsl(300,12%,45%)]/40"
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-[2px] bg-[hsl(38,35%,90%)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[hsl(32,88%,55%)] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                key={activeIndex}
              />
            </div>
            <p className="text-[10px] text-[hsl(300,12%,45%)] mt-2 uppercase tracking-wider">
              {isAutoPlaying ? "" : "Click to explore"}
            </p>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-[hsl(38,35%,86%)]">
         
          <button onClick={OnClick} className="group bg-[hsl(32,88%,55%)] text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-[hsl(300,18%,16%)] transition-colors flex items-center gap-3 shadow-[0_10px_40px_rgba(212,160,23,0.3)]">
       Recruit from Us
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecruitingPartners;
