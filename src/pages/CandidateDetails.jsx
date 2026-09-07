import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  Sparkles,
  Briefcase,
  MapPin,
  Code,
  Award,
  Star,
  Globe,
  BookOpen,
  Lock,
} from "lucide-react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import useSubscription from "@/hooks/useSubscription";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const formatExperience = (exp) => {
  if (!exp && exp !== 0) return null;
  const years = Math.floor(exp);
  const months = Math.round((exp % 1) * 12);
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} yr${years !== 1 ? "s" : ""}`;
  return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
};

const Section = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={delay}
    className="glass-card rounded-xl p-4 sm:p-5 space-y-3 overflow-hidden w-full min-w-0"
  >
    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
      {Icon && <Icon size={13} className="text-primary shrink-0" />}
      {title}
    </h3>
    {children}
  </motion.div>
);

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { hasActiveSubscription, unlockCandidate } = useSubscription();

  const [unlocked, setUnlocked] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ CHECK PURCHASE
  const checkIfAlreadyUnlocked = async () => {
    if (!user?.uid || !id) return;

    try {
      const q = query(
        collection(db, "purchases"),
        where("companyId", "==", user.uid),
        where("candidateId", "==", id)
      );

      const snap = await getDocs(q);
      if (!snap.empty) setUnlocked(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH DATA
  useEffect(() => {
    if (!id) {
      setError("No candidate ID provided");
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const docSnap = await getDoc(doc(db, "candidates", id));

        if (docSnap.exists()) {
          setCandidate({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Candidate not found");
        }

        await checkIfAlreadyUnlocked();
      } catch (err) {
        console.error(err);
        setError("Failed to load candidate details");
        toast.error("Failed to load candidate");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, user]);

  // ✅ UNLOCK
  const handleUnlock = async () => {
    if (unlocked) return toast.info("Already unlocked");

    if (!hasActiveSubscription) {
      navigate("/subscription");
      return;
    }

    try {
      await unlockCandidate(id);
      setUnlocked(true);
      toast.success("Candidate unlocked!");
    } catch {
      toast.error("Unlock failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-foreground">Loading profile…</span>
        </div>
      </div>
    );

  if (error || !candidate)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-foreground text-sm text-center">{error || "Something went wrong"}</p>
      </div>
    );

  const getAvatar = (name) =>
    name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="mesh-gradient absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">

        {/* BACK */}
       <motion.button
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
 onClick={() => {
  if (window.history.state && window.history.state.idx > 0) {
    navigate(-1);
  } else {
    navigate("/browse-candidates");
  }
}}
  className="flex items-center gap-2 text-sm text-foreground hover:text-foreground mb-6 transition-colors group"
>
  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
  Back
</motion.button>

        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-card rounded-2xl p-5 sm:p-8 mb-6 overflow-hidden w-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 w-full min-w-0">

            {/* AVATAR + META */}
            <div className="flex gap-4 items-start min-w-0 w-full sm:w-auto">
              {/* Avatar */}
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg sm:text-xl font-bold text-primary border border-primary/10">
                {getAvatar(candidate.fullName)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {candidate.fullName || "No Name"}
                </h1>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-foreground mt-1.5">
                  {candidate.roleTitle && (
                    <span className="flex gap-1 items-center min-w-0 break-words">
                      <Briefcase size={12} className="shrink-0" />
                      <span className="break-words">{candidate.roleTitle}</span>
                    </span>
                  )}
                  {candidate.location && (
                    <span className="flex gap-1 items-center min-w-0 break-words">
                      <MapPin size={12} className="shrink-0" />
                      <span className="break-words">{candidate.location}</span>
                    </span>
                  )}
                  {candidate.experience !== undefined && (
                    <span className="flex gap-1 items-center text-foreground shrink-0">
                      {formatExperience(candidate.experience)} exp
                    </span>
                  )}
                </div>

                {candidate.salaryExpectation && (
                  <div className="mt-2 text-primary font-semibold text-sm sm:text-base break-words">
                    ₹{candidate.salaryExpectation.toLocaleString()}
                    <span className="text-xs text-foreground font-normal ml-1">/ yr</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA BADGES */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-wrap shrink-0">
              {!unlocked ? (
               <motion.button
  onClick={handleUnlock}
  animate={{
    scale: [1, 1.04, 1],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="px-4 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm flex gap-2 items-center font-medium hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
>
  <Lock size={13} className="shrink-0" />
  {hasActiveSubscription
    ? "Unlock Profile"
    : "Subscribe to Unlock Full Profile"}
</motion.button>
              ) : (
                <span className="text-xs bg-green-500/15 text-green-600 border border-green-500/20 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  ✓ Unlocked
                </span>
              )}

              {candidate.skills?.length >= 4 && (
                <span className="text-xs bg-secondary/20 text-secondary px-2.5 py-1 rounded-full flex gap-1 items-center border border-secondary/20 whitespace-nowrap">
                  <Sparkles size={11} className="shrink-0" /> AI Verified
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4 sm:space-y-5 min-w-0">

            {/* CONTACT */}
            <Section icon={Phone} title="Contact" delay={1}>
              {hasActiveSubscription && unlocked ? (
                <div className="space-y-2 min-w-0">
                  <p className="flex gap-2.5 text-sm items-center min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone size={13} className="text-primary" />
                    </span>
                    <span className="min-w-0 break-all">
                      {candidate.phone || "Not provided"}
                    </span>
                  </p>
                  <p className="flex gap-2.5 text-sm items-center min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail size={13} className="text-primary" />
                    </span>
                    <span className="min-w-0 break-all">
                      {candidate.email || "Not provided"}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex gap-2 items-center text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2.5 border border-dashed border-muted-foreground/20 min-w-0">
                  <Lock size={13} className="shrink-0" />
                  <span className="break-words">Unlock to view contact details</span>
                </div>
              )}
            </Section>

            {/* SKILLS — CLEAN BULLET-STYLE TAGS */}
            {candidate.skills?.length > 0 && (
              <Section icon={Code} title="Skills" delay={2}>
                <div className="flex flex-wrap gap-2 min-w-0">
                  {candidate.skills.map((skill, i) => (
                    <span
                      key={`${skill}-${i}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/10 max-w-full break-words"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="break-words">{skill}</span>
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {candidate.languages?.length > 0 && (
              <Section icon={Globe} title="Languages" delay={3}>
                <div className="flex gap-2 flex-wrap min-w-0">
                  {candidate.languages.map((lang, i) => (
                    <span
                      key={`${lang}-${i}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary/15 text-secondary rounded-lg border border-secondary/15 max-w-full break-words"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      <span className="break-words">{lang}</span>
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* INTERESTS */}
            {candidate.interests?.length > 0 && (
              <Section icon={Globe} title="Interests" delay={4}>
                <div className="flex gap-2 flex-wrap min-w-0">
                  {candidate.interests.map((interest, i) => (
                    <span
                      key={`${interest}-${i}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 rounded-lg text-xs border border-muted max-w-full break-words"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                      <span className="break-words">{interest}</span>
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* LINKS */}
            {(candidate.github || candidate.linkedin || candidate.portfolio) && (
              <Section icon={Globe} title="Links" delay={5}>
                <div className="space-y-2 min-w-0">
                  {candidate.github && (
                    <a
                      href={candidate.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 min-w-0"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">GH</span>
                      <span className="truncate">GitHub</span>
                    </a>
                  )}
                  {candidate.linkedin && (
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 min-w-0"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">LI</span>
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}
                  {candidate.portfolio && (
                    <a
                      href={candidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 min-w-0"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">PF</span>
                      <span className="truncate">Portfolio</span>
                    </a>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4 sm:space-y-5 min-w-0">

            {/* SUMMARY */}
            {candidate.summary && (
              <Section icon={BookOpen} title="Summary" delay={1}>
                <p className="text-sm leading-relaxed text-foreground break-words">{candidate.summary}</p>
              </Section>
            )}

            {/* EXPERIENCE */}
            {candidate.workExperience && (
              <Section icon={Briefcase} title="Experience" delay={2}>
                <div className="space-y-2 min-w-0">
                  {candidate.workExperience.split("\n").filter(Boolean).map((line, i) => (
                    <div key={i} className="flex gap-2 items-start min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <p className="text-sm leading-relaxed text-foreground break-words min-w-0">{line.trim()}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* EDUCATION */}
            {candidate.education && (
              <Section icon={BookOpen} title="Education" delay={3}>
                <div className="space-y-2 min-w-0">
                  {candidate.education.split("\n").filter(Boolean).map((line, i) => (
                    <div key={i} className="flex gap-2 items-start min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <p className="text-sm leading-relaxed text-foreground break-words min-w-0">{line.trim()}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* PROJECTS */}
            {candidate.projects?.length > 0 && (
              <Section icon={Code} title="Projects" delay={4}>
                <div className="space-y-4 min-w-0">
                  {candidate.projects.map((proj, i) => {
                    const title =
                      typeof proj === "string" ? proj : proj.title || "Untitled Project";
                    const description =
                      typeof proj === "string" ? null : proj.description || "";

                    return (
                      <div
                        key={i}
                        className="border-l-2 border-primary/30 pl-3.5 py-0.5 min-w-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <p className="text-sm font-semibold text-foreground leading-snug break-words min-w-0">
                            {title}
                          </p>
                        </div>
                        {description && (
                          <p className="text-xs text-foreground mt-1 leading-relaxed pl-3.5 break-words">
                            {description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* CERTIFICATIONS */}
            {candidate.certifications?.length > 0 && (
              <Section icon={Award} title="Certifications" delay={5}>
                <div className="space-y-2 min-w-0">
                  {candidate.certifications.map((cert, i) => (
                    <div key={`${cert}-${i}`} className="flex gap-2 items-start min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-sm break-words min-w-0">{cert}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ACHIEVEMENTS */}
            {candidate.achievements?.length > 0 && (
              <Section icon={Star} title="Achievements" delay={6}>
                <div className="space-y-2 min-w-0">
                  {candidate.achievements.map((ach, i) => (
                    <div key={`${ach}-${i}`} className="flex gap-2 items-start min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-sm break-words min-w-0">{ach}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateDetails;