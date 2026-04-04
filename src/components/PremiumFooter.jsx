import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const PremiumFooterDarkWithIcons = () => {
  const links = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "For Companies", path: "/for-companies" },
    { label: "For Candidates", path: "/for-candidates" },
  
    // { label: "Contact", path: "/contact" },
  ];
const navigate = useNavigate();
  const social = [
    { label: "LinkedIn", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "GitHub", href: "#" },
  ];

  return (
    <footer className="relative bg-[hsl(345,18%,12%)] text-[hsl(38,90%,92%)] pt-20 pb-10 overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16">

        {/* Brand & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/Images/logo.png"
              alt="Candidates247 Logo"
              className="h-12 w-auto object-contain scale-[4] origin-left brightness-0 invert -translate-x-6"
            />
          </div>

          <p className="text-[hsl(38,35%,86%)] max-w-sm leading-relaxed">
            Connecting skilled candidates with growing companies. Fast hiring, verified profiles, and better opportunities.
          </p>

          <button onClick={() => navigate("/browse-candidates")} className="px-8 py-3 bg-[hsl(32,88%,55%)] text-white rounded-xl font-semibold shadow-[0_10px_30px_rgba(180,120,40,0.4)] hover:brightness-95 transition-all duration-300">
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
          <h4 className="text-lg font-semibold mb-6 text-[hsl(38,90%,92%)]">
            Quick Links
          </h4>

          <ul className="space-y-3">
            {links.map((link, i) => (
              <li key={i}>
                <Link
                  to={link.path}
                  className="hover:underline hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
                >
                  {link.label}
                </Link>
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
          <h4 className="text-lg font-semibold mb-6 text-[hsl(38,90%,92%)]">
            Connect With Us
          </h4>

          <div className="flex gap-6 mb-6">
            <a
              href="#"
              className="text-[1.8rem] hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-[1.8rem] hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-[1.8rem] hover:text-[hsl(32,88%,55%)] transition-colors duration-300"
            >
              <FaGithub />
            </a>
          </div>

          <p className="text-[hsl(38,35%,86%)] text-sm">
            © {new Date().getFullYear()} Candidates247. All rights reserved.
          </p>
        </motion.div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-[hsl(38,35%,40%)] pt-6 text-center text-[hsl(38,35%,86%)] text-sm">
        Trusted hiring platform • Verified candidates • Faster recruitment
      </div>
    </footer>
  );
};

export default PremiumFooterDarkWithIcons;