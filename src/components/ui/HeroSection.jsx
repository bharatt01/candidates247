import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import herovideo from "@/assets/hero-video.mp4";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background: Video with a heavier, cleaner mask */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-30 scale-105"
          src={herovideo}
          autoPlay loop muted playsInline
        />
        {/* Deep vignette for focus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#050505_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Refined Badge: Ultra-slim and minimal */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="group cursor-pointer flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-orange-500/50 transition-colors mb-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">New</span>
            <div className="w-[1px] h-3 bg-white/20" />
            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors flex items-center gap-1">
              AI-Matched Expert Recruiting <ChevronRight size={14} />
            </span>
          </motion.div>

          {/* Headline: Thinner, larger, more airy */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-medium text-white tracking-tight leading-[0.95] mb-8"
          >
            Hire elite talent <br /> 
            <span className="font-light italic text-gray-500">effortlessly.</span>
          </motion.h1>

          {/* Subheading: More horizontal breathing room */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide"
          >
            A curated marketplace of the top 1% professionals. 
            No job boards, no noise—just the right fit, instantly.
          </motion.p>

          {/* Actions: Clean, non-distracting buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button onClick={() => navigate("/for-companies")} className="h-14 px-10 bg-white text-black hover:bg-orange-500 hover:text-white rounded-full font-semibold transition-all duration-300 flex items-center gap-2">
              For Companies <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/for-candidates")} className="h-14 px-10 text-white hover:text-orange-500 transition-colors font-medium">
              For Candidates
            </button>
          </motion.div>

          {/* Minimal Trust Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-24 flex flex-col items-center gap-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white">Powering Teams At</p>
            <div className="flex flex-wrap justify-center gap-10 grayscale invert opacity-70">
              {/* Replace these with simple SVG icons */}
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle bottom fade to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
};

export default HeroSection;