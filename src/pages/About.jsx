import { motion } from "framer-motion";
import { Shield, Cpu, Target, Users, CheckCircle, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";

const stats = [
  { label: "Active Candidates", value: "12,400+" },
  { label: "Companies Hiring", value: "850+" },
  { label: "Successful Placements", value: "3,200+" },
  { label: "Cities Covered", value: "45+" },
];

const bentoItems = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To connect elite talent with forward-thinking companies through a transparent, AI-powered marketplace that respects both candidate privacy and recruiter efficiency.",
    span: "md:col-span-2",
  },
  {
    icon: Cpu,
    title: "Our Technology",
    description: "AI-verified profiles, intelligent matching algorithms, and encrypted candidate data ensure only verified, high-quality connections.",
    span: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Contact details are encrypted until unlocked. We use industry-standard security to protect all candidate data.",
    span: "md:col-span-1",
  },
  {
    icon: Users,
    title: "Our Community",
    description: "A curated network of professionals across engineering, design, product, and data science — all vetted and ready to hire.",
    span: "md:col-span-2",
  },
];

const timeline = [
  { year: "2023", title: "Founded", description: "Started with a vision to fix recruitment." },
  { year: "2024", title: "AI Integration", description: "Launched AI-powered candidate verification." },
  { year: "2025", title: "Scale", description: "Expanded to 45+ cities across India." },
  { year: "2026", title: "Enterprise", description: "Serving 850+ companies with premium talent solutions." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />


      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            About <span className="glow-text">Prestige</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            The premium talent marketplace built for modern recruitment teams.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center"
            >
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {bentoItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`glass-card-hover p-6 ${item.span}`}
            >
              <item.icon size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground text-center mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {timeline.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 pb-8 last:pb-0"
              >
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <span className="text-xs font-bold text-primary">{event.year}</span>
                <h4 className="text-sm font-semibold text-foreground mt-0.5">{event.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;




