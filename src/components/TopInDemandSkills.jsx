    import React, { useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Code, Terminal, Zap, Cloud, Brain, Database, Shield, Layers, BarChart3, Smartphone, Palette, GitBranch, Globe, Cpu } from "lucide-react";

const skills = [
  { name: "React.js", demand: 98, trend: "up", salary: "₹8–22 LPA", icon: Code, category: "Frontend" },
  { name: "Python", demand: 96, trend: "up", salary: "₹7–20 LPA", icon: Terminal, category: "Backend" },
  { name: "Node.js", demand: 94, trend: "up", salary: "₹7–18 LPA", icon: Zap, category: "Backend" },
  { name: "AWS / Cloud", demand: 92, trend: "up", salary: "₹10–25 LPA", icon: Cloud, category: "DevOps" },
  { name: "Machine Learning", demand: 90, trend: "up", salary: "₹12–30 LPA", icon: Brain, category: "AI/ML" },
  { name: "SQL / PostgreSQL", demand: 88, trend: "stable", salary: "₹6–16 LPA", icon: Database, category: "Data" },
  { name: "Cybersecurity", demand: 86, trend: "up", salary: "₹10–24 LPA", icon: Shield, category: "Security" },
  { name: "TypeScript", demand: 84, trend: "up", salary: "₹8–20 LPA", icon: Code, category: "Frontend" },
  { name: "Docker / K8s", demand: 82, trend: "up", salary: "₹10–22 LPA", icon: Layers, category: "DevOps" },
  { name: "Data Science", demand: 80, trend: "stable", salary: "₹10–28 LPA", icon: BarChart3, category: "Data" },
  { name: "React Native", demand: 78, trend: "down", salary: "₹7–16 LPA", icon: Smartphone, category: "Mobile" },
  { name: "UI/UX Design", demand: 76, trend: "stable", salary: "₹6–18 LPA", icon: Palette, category: "Design" },
  { name: "DevOps / CI-CD", demand: 74, trend: "up", salary: "₹10–24 LPA", icon: GitBranch, category: "DevOps" },
  { name: "Blockchain", demand: 72, trend: "down", salary: "₹9–20 LPA", icon: Globe, category: "Emerging" },
  { name: "System Design", demand: 70, trend: "up", salary: "₹15–35 LPA", icon: Cpu, category: "Architecture" },
];

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-600" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-[hsl(300,12%,45%)]" />;
};

const TopInDemandSkills = () => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-[hsl(32,88%,85%)] rounded-full blur-[140px]" />
      </div>

<div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
         <div className="flex items-center gap-4">
  <div className="w-10 h-10 bg-[hsl(32,88%,55%)] rounded-xl flex items-center justify-center shrink-0">
    <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
  </div>

 <div className="text-3xl font-semibold tracking-tight">
    <div>Top In-Demand Skills</div>
    
  </div>
</div>

          {/* Scroll Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-[hsl(38,35%,86%)] flex items-center justify-center hover:bg-[hsl(32,88%,55%)] hover:text-white hover:border-[hsl(32,88%,55%)] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-[hsl(38,35%,86%)] flex items-center justify-center hover:bg-[hsl(32,88%,55%)] hover:text-white hover:border-[hsl(32,88%,55%)] transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HORIZONTAL SCROLL CARDS */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
                className="group flex-shrink-0 w-[300px] snap-start bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] p-6 rounded-[1.5rem] shadow-[0_10px_40px_rgba(180,120,40,0.06)] hover:shadow-[0_20px_60px_rgba(180,120,40,0.12)] transition-all duration-300 hover:border-[hsl(32,88%,55%)]/30 hover:-translate-y-1"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[hsl(32,90%,95%)] rounded-xl flex items-center justify-center group-hover:bg-[hsl(32,88%,55%)] transition-colors duration-300">
                      <Icon className="w-4 h-4 text-[hsl(32,88%,55%)] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{skill.name}</h3>
                      <p className="text-[10px] text-[hsl(300,12%,45%)] uppercase tracking-wider">{skill.category}</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-[hsl(32,88%,55%)]/10 group-hover:text-[hsl(32,88%,55%)]/15 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Demand Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-[hsl(300,12%,45%)] uppercase tracking-[0.2em]">Demand</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={skill.trend} />
                      <span className="text-xs font-bold text-[hsl(32,88%,55%)]">{skill.demand}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[hsl(38,35%,90%)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.demand}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.04 }}
                      viewport={{ once: true }}
                      className="h-full bg-[hsl(32,88%,55%)] rounded-full"
                    />
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-[hsl(38,35%,90%)]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[hsl(300,12%,45%)] block mb-0.5">Salary</span>
                    <span className="text-xs font-semibold">{skill.salary}</span>
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                    skill.trend === "up" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    skill.trend === "down" ? "bg-red-50 text-red-600 border border-red-200" :
                    "bg-[hsl(38,40%,95%)] text-[hsl(300,12%,45%)] border border-[hsl(38,35%,86%)]"
                  }`}>
                    {skill.trend === "up" ? "Rising" : skill.trend === "down" ? "Cooling" : "Stable"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOOTER */}
       

      </div>
    </section>
  );
};

export default TopInDemandSkills;
