import { motion } from "framer-motion";
import { Shield, Cpu, Target, Users, CheckCircle, Globe } from "lucide-react";

const stats = [
  { label: "Active Candidates", value: "12,400+", icon: Users },
  { label: "Companies", value: "850+", icon: Globe },
  { label: "Placements", value: "3,200+", icon: CheckCircle },
  { label: "Cities", value: "45+", icon: Target },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="mesh-gradient" />

      {/* ================= HERO ================= */}
      <section className="relative z-10 grid lg:grid-cols-2 items-center px-6 lg:px-12 pt-24 pb-20">
        {/* LEFT TEXT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black leading-tight"
          >
           <img src="/Images/logo.png" alt="Candidates247 Logo" className="h-12 w-auto object-contain scale-[6] origin-left -translate-x-10 mb-4" />
            <span className="block text-foreground text-2xl md:text-3xl mt-6 font-medium">
              Where Talent Meets Opportunityy
            </span>
          </motion.h1>

          <p className="mt-6 max-w-lg text-muted-foreground text-sm md:text-base leading-relaxed">
            Candidates247 is a next-generation hiring platform designed to remove
            friction from recruitment. We help companies discover real talent faster
            and empower candidates to get noticed — without noise or middlemen.
          </p>

          {/* TAGS WITH ICONS */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
              <Target size={16} /> Smart Matching
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
              <Shield size={16} /> Secure Data
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
              <Users size={16} /> Verified Candidates
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative mt-12 lg:mt-0">
          {/* GLOW */}
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/30 blur-3xl rounded-full opacity-30" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full opacity-30" />

          {/* GLASS CARD */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
            <p className="text-sm text-muted-foreground mb-3">
              Platform Highlights
            </p>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Smarter Hiring Experience
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> AI-verified candidates</li>
              <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Direct company connections</li>
              <li className="flex items-center gap-2"><Cpu size={16} className="text-primary" /> Smart Matching Algorithms</li>
              <li className="flex items-center gap-2"><Shield size={16} className="text-primary" /> Privacy & Security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= STATS STRIP ================= */}
      <section className="relative z-10 flex flex-wrap justify-center gap-6 px-6 mb-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg text-center flex flex-col items-center gap-2"
          >
            <stat.icon size={24} className="text-primary" />
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= BENTO ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-3 gap-5">
          <motion.div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10">
            <Target className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              To redefine hiring by creating a transparent ecosystem where companies
              hire faster and candidates get real opportunities without friction.
            </p>
          </motion.div>

          <motion.div className="p-6 rounded-3xl glass-card-hover">
            <Cpu className="text-primary mb-3" />
            <h4 className="font-semibold">AI Matching</h4>
            <p className="text-xs text-muted-foreground">
              Smart algorithms match candidates beyond keywords.
            </p>
          </motion.div>

          <motion.div className="p-6 rounded-3xl glass-card-hover">
            <Shield className="text-primary mb-3" />
            <h4 className="font-semibold">Privacy First</h4>
            <p className="text-xs text-muted-foreground">
              Your contact data stays protected until unlocked.
            </p>
          </motion.div>

          <motion.div className="md:col-span-2 p-8 rounded-3xl glass-card-hover">
            <Users className="text-primary mb-4" />
            <h3 className="text-xl font-semibold">Our Community</h3>
            <p className="text-sm text-muted-foreground">
              A growing network of skilled professionals across tech, product,
              design, and beyond — ready to build and innovate.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;