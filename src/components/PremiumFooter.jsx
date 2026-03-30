import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const PremiumFooterDarkWithIcons = () => {
  const links = [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const social = [
    { label: "LinkedIn", href: "#", icon: <FaLinkedin /> },
    { label: "Twitter", href: "#", icon: <FaTwitter /> },
    { label: "GitHub", href: "#", icon: <FaGithub /> },
  ];

  return (
    <footer className="relative bg-[hsl(345,18%,12%)] text-[hsl(38,90%,92%)] pt-20 pb-10 overflow-hidden">
      
      {/* Ambient Burnt Saffron Glow */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[hsl(32,88%,45%)] blur-[160px] opacity-30 pointer-events-none rounded-full" /> */}

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16">

        {/* Brand & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)]">
            JobPulse
          </h3>

          <p className="text-[hsl(38,35%,86%)] max-w-sm leading-relaxed">
            Connecting top-tier engineers with forward-thinking companies. Real-time hiring insights, curated talent, premium placements.
          </p>

          <button className="px-8 py-3 bg-[hsl(32,88%,55%)] text-white rounded-xl font-semibold shadow-[0_10px_30px_rgba(180,120,40,0.4)] hover:brightness-95 transition-all duration-300">
            Join the Talent Pool
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex-1 flex flex-col md:items-start"
        >
          <h4 className="text-lg font-semibold mb-6 text-[hsl(38,90%,92%)]">Quick Links</h4>
          <ul className="space-y-3">
            {links.map((link, i) => (
              <li key={i}>
                <a 
                  href={link.href} 
                  className="hover:underline hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex flex-col md:items-start"
        >
          <h4 className="text-lg font-semibold mb-6 text-[hsl(38,90%,92%)]">Connect With Us</h4>
          <div className="flex gap-6 mb-6">
            {social.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="text-[1.8rem] hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[hsl(38,35%,86%)] text-sm">
            © {new Date().getFullYear()} JobPulse. All rights reserved.
          </p>
        </motion.div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-[hsl(38,35%,40%)] pt-6 text-center text-[hsl(38,35%,86%)] text-sm">
        Built for premium talent placement • No agencies • Direct founder-led hiring
      </div>
    </footer>
  );
};

export default PremiumFooterDarkWithIcons;




