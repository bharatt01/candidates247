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
} from "lucide-react";
import { Lock } from "lucide-react";
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
    className="glass-card rounded-xl p-4 sm:p-5 space-y-3"
  >
    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
      {Icon && <Icon size={13} className="text-primary" />}
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
          <span className="text-sm text-muted-foreground">Loading profile…</span>
        </div>
      </div>
    );

  if (error || !candidate)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-muted-foreground text-sm text-center">{error || "Something went wrong"}</p>
      </div>
    );

  const getAvatar = (name) =>
    name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  console.log(candidate);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* BACK */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </motion.button>

        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-card rounded-2xl p-5 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

            {/* AVATAR + META */}
            <div className="flex gap-4 items-start">
              {/* Avatar */}
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg sm:text-xl font-bold text-primary border border-primary/10">
                {getAvatar(candidate.fullName)}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                  {candidate.fullName || "No Name"}
                </h1>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1.5">
                  {candidate.roleTitle && (
                    <span className="flex gap-1 items-center">
                      <Briefcase size={12} />
                      {candidate.roleTitle}
                    </span>
                  )}
                  {candidate.location && (
                    <span className="flex gap-1 items-center">
                      <MapPin size={12} />
                      {candidate.location}
                    </span>
                  )}
                  {candidate.experience !== undefined && (
                    <span className="flex gap-1 items-center text-muted-foreground">
                    {formatExperience(candidate.experience)} exp
                    </span>
                  )}
                </div>

                {candidate.salaryExpectation && (
                  <div className="mt-2 text-primary font-semibold text-sm sm:text-base">
                    ₹{candidate.salaryExpectation.toLocaleString()}
                    <span className="text-xs text-muted-foreground font-normal ml-1">/ yr</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA BADGES */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-wrap">
              {!unlocked ? (
                <button
                  onClick={handleUnlock}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm flex gap-2 items-center font-medium hover:opacity-90 active:scale-95 transition-all shrink-0"
                >
                  <Lock size={13} />
                  {hasActiveSubscription ? "Unlock Profile" : "Get Subscription"}
                </button>
              ) : (
                <span className="text-xs bg-green-500/15 text-green-600 border border-green-500/20 px-2.5 py-1 rounded-full font-medium">
                  ✓ Unlocked
                </span>
              )}

              {candidate.skills?.length >= 4 && (
                <span className="text-xs bg-secondary/20 text-secondary px-2.5 py-1 rounded-full flex gap-1 items-center border border-secondary/20">
                  <Sparkles size={11} /> AI Verified
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4 sm:space-y-5">

            {/* CONTACT */}
            <Section icon={Phone} title="Contact" delay={1}>
              {hasActiveSubscription && unlocked ? (
                <div className="space-y-2">
                  <p className="flex gap-2.5 text-sm items-center">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone size={13} className="text-primary" />
                    </span>
                    {candidate.phone || "Not provided"}
                  </p>
                  <p className="flex gap-2.5 text-sm items-center">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail size={13} className="text-primary" />
                    </span>
                    {candidate.email || "Not provided"}
                  </p>
                </div>
              ) : (
                <div className="flex gap-2 items-center text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5 border border-dashed border-muted-foreground/20">
                  <Lock size={13} />
                  Unlock to view contact details
                </div>
              )}
            </Section>

            {/* SKILLS */}
            {candidate.skills?.length > 0 && (
              <Section icon={Code} title="Skills" delay={2}>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-lg border border-primary/10 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {candidate.languages?.length > 0 && (
              <Section icon={Globe} title="Languages" delay={3}>
                <div className="flex gap-2 flex-wrap">
                  {candidate.languages.map((l, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs bg-secondary/15 text-secondary rounded-lg border border-secondary/15"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* INTERESTS */}
            {candidate.interests?.length > 0 && (
              <Section icon={Globe} title="Interests" delay={4}>
                <div className="flex gap-2 flex-wrap">
                  {candidate.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-muted/60 rounded-lg text-xs border border-muted"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* LINKS */}
            {(candidate.github || candidate.linkedin || candidate.portfolio) && (
              <Section icon={Globe} title="Links" delay={5}>
                <div className="space-y-2">
                  {candidate.github && (
                    <a
                      href={candidate.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 truncate"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">GH</span>
                      GitHub
                    </a>
                  )}
                  {candidate.linkedin && (
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 truncate"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">LI</span>
                      LinkedIn
                    </a>
                  )}
                  {candidate.portfolio && (
                    <a
                      href={candidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 truncate"
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">PF</span>
                      Portfolio
                    </a>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4 sm:space-y-5">

            {/* SUMMARY */}
            {candidate.summary && (
              <Section icon={BookOpen} title="Summary" delay={1}>
                <p className="text-sm leading-relaxed text-muted-foreground">{candidate.summary}</p>
              </Section>
            )}

            {/* EXPERIENCE */}
            {candidate.workExperience && (
              <Section icon={Briefcase} title="Experience" delay={2}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {candidate.workExperience}
                </p>
              </Section>
            )}

            {/* EDUCATION */}
            {candidate.education && (
              <Section icon={BookOpen} title="Education" delay={3}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {candidate.education}
                </p>
              </Section>
            )}

            {/* PROJECTS */}
            {candidate.projects?.length > 0 && (
              <Section icon={Code} title="Projects" delay={4}>
                <div className="space-y-4">
                  {candidate.projects.map((proj, i) => {
                    const title =
                      typeof proj === "string" ? proj : proj.title || "Untitled Project";
                    const description =
                      typeof proj === "string" ? null : proj.description || "";

                    return (
                      <div
                        key={i}
                        className="border-l-2 border-primary/30 pl-3.5 py-0.5"
                      >
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {title}
                        </p>
                        {description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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
                <div className="space-y-1.5">
                  {candidate.certifications.map((c, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ACHIEVEMENTS */}
            {candidate.achievements?.length > 0 && (
              <Section icon={Star} title="Achievements" delay={6}>
                <div className="space-y-1.5">
                  {candidate.achievements.map((a, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{a}</span>
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