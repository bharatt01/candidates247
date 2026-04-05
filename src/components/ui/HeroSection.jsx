import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import herovideo from "@/assets/hero-video.mp4";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center bg-gray-900 overflow-hidden">

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-30"
          src={herovideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-start">
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl lg:text-7xl font-medium text-white leading-tight mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.7)]"
        >
          On This Website - <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            Hire & Get Hired
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-200 text-lg md:text-2xl font-light mb-12 leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
        >
          <span className="block mb-4">
            Companies can view and browse candidates freely.<br />Hire highly cost-effectively.
          </span>
          <span className="block text-amber-400">
            Candidates can build their ATS-friendly profile and be seen & hired.
          </span>
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <button
            onClick={() => navigate("/for-companies")}
            className="h-14 px-10 bg-amber-500 hover:bg-amber-600 text-black rounded-full font-semibold flex items-center gap-2 transition duration-300 shadow-lg"
          >
            For Companies <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate("/for-candidates")}
            className="h-14 px-10 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full font-medium transition-all duration-300"
          >
            For Candidates
          </button>
        </motion.div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent" />

    </section>
  );
};

export default HeroSection;