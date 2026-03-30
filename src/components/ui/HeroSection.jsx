import React, { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

const HeroSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const ProfileCard = ({ name, role }) => (
    <>
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-[hsl(38,35%,88%)]" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[hsl(32,88%,55%)] border-2 border-white rounded-full" />
      </div>
      <div>
        <p className="text-sm font-bold text-[hsl(300,18%,16%)]">{name}</p>
        <p className="text-[11px] text-[hsl(300,12%,45%)] font-mono">{role}</p>
      </div>
    </>
  );

  return (
    <section className="relative min-h-screen bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)] overflow-hidden flex flex-col justify-center items-center font-sans">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[hsl(32,88%,85%)] via-[hsl(38,70%,96%)] to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(38,35%,90%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(38,35%,90%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Floating Profile Cards */}
{/* Floating Profile Cards */}
{/* Floating Profile Cards */}
<div className="absolute inset-0 max-w-[1400px] mx-auto pointer-events-none z-0 hidden lg:block">

  {/* Card 1 */}
  <motion.div
    animate={{ y: [12, -12, 12] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className="absolute top-[12%] left-[8%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] scale-95 opacity-70"

  >
    <ProfileCard name="Elena R." role="Staff Machine Learning" />
  </motion.div>

  {/* Card 2 */}
  <motion.div
    animate={{ y: [-10, 10, -10], x: [0, 8, 0] }}
    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    className="absolute top-[20%] right-[10%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.04)] opacity-70"
  >
    <ProfileCard name="Marcus T." role="Senior Backend Engineer" />
  </motion.div>

  {/* Card 3 */}
  <motion.div
    animate={{ y: [15, -15, 15] }}
    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    className="absolute bottom-[22%] left-[12%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] scale-95 opacity-70"
  >
    <ProfileCard name="Sophie L." role="Principal Frontend" />
  </motion.div>

  {/* Card 4 */}
  <motion.div
    animate={{ y: [-8, 8, -8], rotate: [-1, 1, -1] }}
    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    className="absolute bottom-[18%] right-[14%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.05)] opacity-70"
  >
    <ProfileCard name="Daniel K." role="DevOps Architect" />
  </motion.div>

  {/* Card 5 */}
  <motion.div
    animate={{ y: [10, -10, 10], x: [-6, 6, -6] }}
    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    className="absolute top-[35%] left-[4%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.04)] scale-95 opacity-70"
  >
    <ProfileCard name="Aarav P." role="AI Systems Engineer" />
  </motion.div>

  {/* Card 6 */}
  <motion.div
    animate={{ y: [-14, 14, -14] }}
    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    className="absolute top-[45%] right-[4%] bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] scale-90 opacity-70"
  >
    <ProfileCard name="Isabella M." role="Cloud Infrastructure Lead" />
  </motion.div>

</div>



      {/* Main Content */}
      <div className="relative z-20 w-full mx-auto px-6 text-center -mt-10">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="leading-[1.1] font-medium tracking-tighter mb-6 w-max mx-auto text-center"
        >
          <span className="text-[2.8rem] md:text-[3.5rem] lg:text-[4.5rem] text-[hsl(300,20%,8%)]
 block mb-2 whitespace-nowrap">
            View Candidates For Free.
          </span>

          <span className="text-[1.2rem] md:text-[1.8rem] lg:text-[2.5rem] bg-clip-text text-transparent bg-gradient-to-b from-[hsl(32,88%,55%)] to-[hsl(32,88%,40%)] whitespace-nowrap">
            Hire Talented, Experienced Candidates Across Profiles.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-xl text-[hsl(300,12%,45%)] text-lg md:text-xl font-light leading-relaxed mb-12"
        >
          Bypass the noise. Query a meticulously curated registry of elite technical talent. No agencies. No spam.
        </motion.p>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(32,88%,55%)] to-[hsl(32,88%,65%)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearching={setIsSearching}
          />

          <div className="mt-4 flex justify-center gap-6 text-[11px] font-mono text-[hsl(300,12%,45%)] uppercase tracking-widest">
            <span className="hover:text-[hsl(32,88%,55%)] cursor-pointer transition-colors">
              Press ⌘ + K to search
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;




