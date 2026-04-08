import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const steps = [
  {
    title: "BUILD PROFILE",
    desc: "Add skills, projects, experience",
  },
  {
    title: "OPTIMIZE",
    desc: "Make it sharp, ATS-friendly",
  },
  {
    title: "GET DISCOVERED",
    desc: "Companies find you directly",
  },
  {
    title: "GET SHORTLISTED",
    desc: "Recruiters reach out instantly",
  },
];

const CurvedFlow = () => {
    const navigate = useNavigate();
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">

      {/* 🔥 HEADING */}
      <div className="max-w-5xl mx-auto mb-12 lg:mb-20">
        <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold leading-tight lg:leading-[1.05]">
          <span className="block text-foreground">Your Journey</span>
          <span className="block text-primary">To Getting Hired</span>
        </h2>
      </div>

      {/* 🔥 FLOW */}
      <div className="max-w-5xl mx-auto relative">

        {/* CURVED PATH (ONLY DESKTOP) */}
        <svg
          className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 5 10 C 30 0, 70 0, 95 20 S 30 50, 5 70 S 70 90, 95 95"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="transparent"
            opacity="0.4"
          />
        </svg>

        {/* MOBILE LINE */}
        <div className="lg:hidden absolute left-4 top-0 w-[2px] h-full bg-primary/30" />

        {/* STEPS */}
        <div className="relative space-y-12 lg:space-y-20">

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`flex ${
                i % 2 === 0
                  ? "lg:justify-start"
                  : "lg:justify-end"
              }`}
            >
              <div className="w-full lg:w-[300px] relative group">

                {/* DOT */}
                <div className="absolute lg:static left-[-2px] top-4 w-3 h-3 bg-primary rounded-full" />

                {/* CARD */}
                <div className="ml-6 lg:ml-0 p-5 lg:p-6 rounded-2xl border border-border bg-background/60 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

                  <div className="text-xs text-primary/70 mb-1 tracking-wider">
                    STEP {i + 1}
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {step.desc}
                  </p>

                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 🔥 CTA */}
      <div className="max-w-5xl mx-auto mt-16 lg:mt-24">
        <h3 className="text-xl sm:text-2xl lg:text-5xl font-bold text-foreground">
          Build once. Get hired continuously.
        </h3>

        <button onClick={() => navigate("/for-candidates")} className="mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-2xl text-sm sm:text-lg hover:scale-105 transition">
          Create Your Profile →
        </button>
      </div>

    </section>
  );
};

export default CurvedFlow;