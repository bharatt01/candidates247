import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  Users,
  Briefcase,
  Handshake,
  BarChart3,
  FileText,
  Mail,
  Phone,
  ChevronRight,
  Target,
  Sparkles,
  BookOpen,
  Award,
  Rocket,
  Layers,
  Zap,
  Globe,
} from "lucide-react";

const companiesContent = {
  title: "For Companies",
  subtitle: "Hire job-ready talent. Build your team with confidence.",
  links: [
    { label: "Post Hiring Requirements", icon: FileText, desc: "Submit your open roles and skill needs" },
    { label: "Browse Talent Pool", icon: Users, desc: "Explore pre-vetted candidate profiles" },
    { label: "Schedule Campus Drive", icon: Building2, desc: "Book a recruitment event at our center" },
    { label: "Partner With Us", icon: Handshake, desc: "Long-term hiring pipeline collaboration" },
    { label: "Training & Upskilling", icon: BarChart3, desc: "Custom corporate training programs" },
    { label: "Contact HR Team", icon: Mail, desc: "Speak directly with our placement cell" },
  ],
};

const candidatesContent = {
  title: "For Candidates",
  subtitle: "Land your dream role. Get trained, get placed.",
  links: [
    { label: "Explore Programs", icon: BookOpen, desc: "Full-stack, Data, Cloud & more tracks" },
    { label: "Skill Assessment", icon: Target, desc: "Test your skills and get a roadmap" },
    { label: "Resume Builder", icon: FileText, desc: "AI-powered resume and portfolio help" },
    { label: "Mock Interviews", icon: Sparkles, desc: "Practice with industry hiring managers" },
    { label: "Placement Support", icon: Rocket, desc: "End-to-end job search assistance" },
    { label: "Talk to Counselor", icon: Phone, desc: "Free career guidance session" },
  ],
};

const ForCompaniesCandidates = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const ROTATION_INTERVAL = 10000; // 10 seconds
  const PROGRESS_UPDATE = 50; // Update every 50ms

  const content = activeTab === "companies" ? companiesContent : candidatesContent;

  useEffect(() => {
    // Progress bar animation
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (PROGRESS_UPDATE / ROTATION_INTERVAL) * 100;
      });
    }, PROGRESS_UPDATE);

    // Tab rotation
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => (prev === "companies" ? "candidates" : "companies"));
      setProgress(0);
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(32,88%,85%)] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-[0.9] mb-4">
     Our Services, Features and Advantages
          </h2>
          <p className="text-[hsl(300,12%,45%)] max-w-lg mx-auto">
            Choose your path. We have tailored resources for both sides of the hiring table.
          </p>
        </div>

        {/* DESKTOP: Left selectors stacked (Candidates top, Companies bottom) + Right content */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 min-h-[500px]">

          {/* LEFT COLUMN — Selectors stacked vertically */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* TOP — For Candidates */}
            <motion.div
              className={`relative overflow-hidden rounded-[2rem] border p-8 text-left transition-all duration-500 group flex-1 ${
                activeTab === "candidates"
                  ? "bg-[hsl(32,88%,55%)] text-white border-[hsl(32,88%,55%)] shadow-[0_20px_60px_rgba(212,160,23,0.3)]"
                  : "bg-white/80 backdrop-blur-xl border-[hsl(38,35%,86%)] hover:border-[hsl(32,88%,55%)]/50 hover:shadow-[0_10px_40px_rgba(180,120,40,0.1)]"
              }`}
              whileHover={{ x: activeTab === "candidates" ? 0 : 8 }}
            >
              {/* Progress bar for Candidates */}
              {activeTab === "candidates" && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white/60"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0 }}
                  />
                </div>
              )}
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  activeTab === "candidates" ? "bg-white/20" : "bg-[hsl(32,90%,95%)] group-hover:bg-[hsl(32,88%,55%)]/10"
                }`}>
                  <GraduationCap className={`w-7 h-7 ${activeTab === "candidates" ? "text-white" : "text-[hsl(32,88%,55%)]"}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">For Candidates</h3>
                <p className={`text-sm leading-relaxed ${activeTab === "candidates" ? "text-white/70" : "text-[hsl(300,12%,45%)]"}`}>
                  Looking for a job? Explore training, placements, and career support.
                </p>
                <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${
                  activeTab === "candidates" ? "text-white" : "text-[hsl(32,88%,55%)]"
                }`}>
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <span className={`absolute -bottom-4 -right-4 text-8xl font-black transition-opacity ${
                activeTab === "candidates" ? "text-white/10" : "text-[hsl(32,88%,55%)]/5"
              }`}>
                01
              </span>
            </motion.div>

            {/* BOTTOM — For Companies */}
            <motion.div
              className={`relative overflow-hidden rounded-[2rem] border p-8 text-left transition-all duration-500 group flex-1 ${
                activeTab === "companies"
                  ? "bg-[hsl(32,88%,55%)] text-white border-[hsl(32,88%,55%)] shadow-[0_20px_60px_rgba(212,160,23,0.3)]"
                  : "bg-white/80 backdrop-blur-xl border-[hsl(38,35%,86%)] hover:border-[hsl(32,88%,55%)]/50 hover:shadow-[0_10px_40px_rgba(180,120,40,0.1)]"
              }`}
              whileHover={{ x: activeTab === "companies" ? 0 : 8 }}
            >
              {/* Progress bar for Companies */}
              {activeTab === "companies" && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white/60"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0 }}
                  />
                </div>
              )}
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  activeTab === "companies" ? "bg-white/20" : "bg-[hsl(32,90%,95%)] group-hover:bg-[hsl(32,88%,55%)]/10"
                }`}>
                  <Building2 className={`w-7 h-7 ${activeTab === "companies" ? "text-white" : "text-[hsl(32,88%,55%)]"}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">For Companies</h3>
                <p className={`text-sm leading-relaxed ${activeTab === "companies" ? "text-white/70" : "text-[hsl(300,12%,45%)]"}`}>
                  Hiring? Partner with us to access trained, job-ready talent.
                </p>
                <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${
                  activeTab === "companies" ? "text-white" : "text-[hsl(32,88%,55%)]"
                }`}>
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <span className={`absolute -bottom-4 -right-4 text-8xl font-black transition-opacity ${
                activeTab === "companies" ? "text-white/10" : "text-[hsl(32,88%,55%)]/5"
              }`}>
                02
              </span>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Content Area */}
          <div className="lg:col-span-8 relative">
            <AnimatePresence mode="wait">
              {content ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_60px_rgba(180,120,40,0.08)] h-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-[hsl(32,88%,55%)] rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] font-semibold">
                      {content.title}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold mb-8">{content.subtitle}</h4>

                  <div className="grid sm:grid-cols-2 gap-4 flex-1">
                    {content.links.map((link, i) => {
                      const Icon = link.icon;
                      return (
                        <motion.button
                          key={link.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="group text-left p-5 rounded-2xl bg-[hsl(38,70%,98%)] border border-[hsl(38,35%,90%)] hover:border-[hsl(32,88%,55%)]/40 hover:bg-[hsl(32,90%,97%)] transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[hsl(32,90%,95%)] flex items-center justify-center shrink-0 group-hover:bg-[hsl(32,88%,55%)] transition-colors duration-300">
                              <Icon className="w-5 h-5 text-[hsl(32,88%,55%)] group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm mb-1 group-hover:text-[hsl(32,88%,55%)] transition-colors">{link.label}</h5>
                              <p className="text-xs text-[hsl(300,12%,45%)] leading-relaxed">{link.desc}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-[hsl(32,88%,55%)] opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-semibold">Get started</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-[hsl(38,35%,86%)] border-dashed rounded-[2rem] p-8 lg:p-10 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-[hsl(32,90%,95%)] rounded-3xl flex items-center justify-center mb-6">
                    <Layers className="w-10 h-10 text-[hsl(32,88%,55%)]/30" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Please Choose</h4>
                  <p className="text-[hsl(300,12%,45%)] text-sm max-w-xs">
                    Click <span className="font-semibold text-[hsl(32,88%,55%)]">For Candidates</span> or{" "}
                    <span className="font-semibold text-[hsl(32,88%,55%)]">For Companies</span> to see available options.
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-[hsl(300,12%,45%)]/40">
                    <GraduationCap className="w-5 h-5" />
                    <Zap className="w-4 h-4" />
                    <Building2 className="w-5 h-5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE: Stacked buttons + expandable content */}
        <div className="lg:hidden">
          {/* Button row */}
          <div className="flex gap-3 mb-6">
            <div
              className={`flex-1 py-4 px-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                activeTab === "candidates"
                  ? "bg-[hsl(32,88%,55%)] text-white border-[hsl(32,88%,55%)] shadow-[0_10px_30px_rgba(212,160,23,0.3)]"
                  : "bg-white/80 backdrop-blur border-[hsl(38,35%,86%)]"
              }`}
            >
              {activeTab === "candidates" && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white/60"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0 }}
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === "candidates" ? "bg-white/20" : "bg-[hsl(32,90%,95%)]"
                }`}>
                  <GraduationCap className={`w-5 h-5 ${activeTab === "candidates" ? "text-white" : "text-[hsl(32,88%,55%)]"}`} />
                </div>
                <div>
                  <span className="font-bold text-sm block">For Candidates</span>
                  <span className={`text-[10px] uppercase tracking-wider ${activeTab === "candidates" ? "text-white/60" : "text-[hsl(300,12%,45%)]"}`}>
                    Find jobs
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`flex-1 py-4 px-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                activeTab === "companies"
                  ? "bg-[hsl(32,88%,55%)] text-white border-[hsl(32,88%,55%)] shadow-[0_10px_30px_rgba(212,160,23,0.3)]"
                  : "bg-white/80 backdrop-blur border-[hsl(38,35%,86%)]"
              }`}
            >
              {activeTab === "companies" && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white/60"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0 }}
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === "companies" ? "bg-white/20" : "bg-[hsl(32,90%,95%)]"
                }`}>
                  <Building2 className={`w-5 h-5 ${activeTab === "companies" ? "text-white" : "text-[hsl(32,88%,55%)]"}`} />
                </div>
                <div>
                  <span className="font-bold text-sm block">For Companies</span>
                  <span className={`text-[10px] uppercase tracking-wider ${activeTab === "companies" ? "text-white/60" : "text-[hsl(300,12%,45%)]"}`}>
                    Hiring talent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile content area */}
          <AnimatePresence mode="wait">
            {content ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(180,120,40,0.08)]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-[hsl(32,88%,55%)] rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(300,12%,45%)] font-semibold">
                      {content.title}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-5">{content.subtitle}</h4>

                  <div className="space-y-3">
                    {content.links.map((link, i) => {
                      const Icon = link.icon;
                      return (
                        <motion.button
                          key={link.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group w-full text-left p-4 rounded-xl bg-[hsl(38,70%,98%)] border border-[hsl(38,35%,90%)] hover:border-[hsl(32,88%,55%)]/40 transition-all duration-300 flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[hsl(32,90%,95%)] flex items-center justify-center shrink-0 group-hover:bg-[hsl(32,88%,55%)] transition-colors duration-300">
                            <Icon className="w-5 h-5 text-[hsl(32,88%,55%)] group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-sm group-hover:text-[hsl(32,88%,55%)] transition-colors">{link.label}</h5>
                            <p className="text-xs text-[hsl(300,12%,45%)]">{link.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[hsl(300,12%,45%)]/30 group-hover:text-[hsl(32,88%,55%)] transition-colors" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/60 backdrop-blur-xl border border-[hsl(38,35%,86%)] border-dashed rounded-[2rem] p-8 text-center"
              >
                <div className="w-16 h-16 bg-[hsl(32,90%,95%)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[hsl(32,88%,55%)]/30" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[hsl(300,12%,45%)]">
                  Tap <span className="font-semibold text-[hsl(32,88%,55%)]">For Candidates</span> or{" "}
                  <span className="font-semibold text-[hsl(32,88%,55%)]">For Companies</span> above to explore options.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-16 pt-6 border-t border-[hsl(38,35%,86%)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[hsl(300,12%,45%)]">
              <div className="flex items-center gap-2 text-[hsl(32,88%,55%)] font-semibold">
      
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForCompaniesCandidates;