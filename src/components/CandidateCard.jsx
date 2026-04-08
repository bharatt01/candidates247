import { motion } from "framer-motion";
import { Lock, Sparkles, Briefcase, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CandidateCard = ({ candidate, index, onClick }) => {
  const { user } = useAuth();
  const hasSubscription = user?.company?.hasActiveSubscription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(255,130,40,0.25)", transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[hsl(42,45%,96%)] border border-orange-900/20 rounded-xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 w-full"
    >
      {/* ===== PROFILE HEADER ===== */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center text-lg font-bold text-[hsl(32,88%,55%)]">
          {candidate.avatar || candidate.name?.[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
            {candidate.skills?.length >= 4 && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                <Sparkles size={10} /> AI Verified
              </span>
            )}
          </div>
         <p className="text-[15px] font-semibold text-foreground flex items-center gap-2 mt-1">
            <Briefcase size={14} className="text-primary shrink-0" /> {candidate.role}
          </p>
      <p className="text-[14px] font-semibold text-foreground flex items-center gap-2 mt-0.5">
            <MapPin size={13} className="text-muted-foreground shrink-0" /> {candidate.location} · {candidate.experience} yrs
          </p>
        </div>
      </div>

      <hr className="border-orange-900/10" />

      {/* ===== SKILLS ===== */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(32,88%,55%)] mb-2">
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {(candidate.skills || []).slice(0, 4).map((skill) => (
            <span key={skill} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold border border-[hsl(32,88%,55%)]/40 text-[hsl(32,88%,45%)] bg-[hsl(32,88%,55%)]/10"> 
              <span className="w-2 h-2 rounded-full bg-[hsl(32,88%,55%)] animate-pulse"></span>
              {skill}
            </span>
          ))}
          {candidate.skills?.length > 4 && (
            <span className="text-[11px] font-medium text-muted-foreground px-2 py-1">+{candidate.skills.length - 4} more</span>
          )}
        </div>
      </div>

      <hr className="border-orange-900/10" />

      {/* ===== CONTACT INFO (ONLY IF SUBSCRIBED) ===== */}
      {hasSubscription ? (
        <div className="flex flex-col gap-2 text-sm mt-2">
          <div className="flex items-center gap-2">
            <Phone size={14} /> {candidate.phone || "Not provided"}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} /> {candidate.email || "Not provided"}
          </div>
        </div>
      ) : (
        <div className="flex items-center font-semibold gap-2 text-sm text-foreground mt-2">
          <Lock size={14} /> Subscribe to view contact details
        </div>
      )}

      {/* ===== VIEW FULL PROFILE CTA ===== */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(32, 120, 244, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-lg hover:from-primary/90 hover:shadow-primary/25 transition-all duration-300 mt-auto pointer-events-auto z-10"
      >
        <ArrowRight size={16} className="mr-2" />
        View Full Profile
      </motion.button>
    </motion.div>
  );
};

export default CandidateCard;