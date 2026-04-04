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
 import { onSnapshot } from "firebase/firestore";

useEffect(() => {
  if (!id) {
    setError("No candidate ID provided");
    setLoading(false);
    return;
  }

  let unsubscribe;

  const setupListener = async () => {
    try {
      const docRef = doc(db, "candidates", id);

      // ✅ REALTIME LISTENER
      unsubscribe = onSnapshot(
        docRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            setCandidate({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("Candidate not found");
          }

          setLoading(false);

          // ✅ ALSO CHECK UNLOCK STATUS
          await checkIfAlreadyUnlocked();
        },
        (err) => {
          console.error(err);
          setError("Failed to load candidate details");
          toast.error("Realtime fetch failed");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  setupListener();

  // ✅ CLEANUP (VERY IMPORTANT)
  return () => {
    if (unsubscribe) unsubscribe();
  };
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !candidate)
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;

  const getAvatar = (name) =>
    name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div className="flex gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold text-primary">
                {getAvatar(candidate.fullName)}
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  {candidate.fullName || "No Name"}
                </h1>

                <div className="flex gap-3 text-sm text-muted-foreground mt-2 flex-wrap">
                  <span className="flex gap-1 items-center">
                    <Briefcase size={14} />
                    {candidate.roleTitle || "Role"}
                  </span>
                  <span className="flex gap-1 items-center">
                    <MapPin size={14} />
                    {candidate.location || "Location"}
                  </span>
                  <span>{candidate.experience || 0} yrs</span>
                </div>

                {candidate.salaryExpectation && (
                  <div className="mt-2 text-primary font-semibold">
                    ₹{candidate.salaryExpectation.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-end gap-2">
              {!unlocked ? (
                <button
                  onClick={handleUnlock}
                  className="px-5 py-2 rounded-lg bg-primary text-white text-sm flex gap-2 items-center"
                >
                  <Lock size={14} />
                  {hasActiveSubscription ? "Unlock Profile" : "Get Subscription"}
                </button>
              ) : (
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                  Unlocked
                </span>
              )}

              {candidate.skills?.length >= 4 && (
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded flex gap-1 items-center">
                  <Sparkles size={12} /> AI Verified
                </span>
              )}
            </div>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {/* LEFT */}
            <div className="space-y-6">

              {/* CONTACT */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-3">Contact</h3>

                {hasActiveSubscription && unlocked ? (
                  <>
                    <p className="flex gap-2 text-sm items-center">
                      <Phone size={14} /> {candidate.phone || "Not provided"}
                    </p>
                    <p className="flex gap-2 text-sm items-center">
                      <Mail size={14} /> {candidate.email || "Not provided"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm flex gap-2 items-center text-muted-foreground">
                    <Lock size={14} /> Unlock to view contact
                  </p>
                )}
              </div>

              {/* SKILLS */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* LANGUAGES */}
              {candidate.languages?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Languages</h3>
                  <div className="flex gap-2 flex-wrap text-sm">
                    {candidate.languages.map((l, i) => (
                      <span key={i} className="px-2 py-1 bg-secondary/20 rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* SUMMARY */}
              {candidate.summary && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Summary</h3>
                  <p className="text-sm">{candidate.summary}</p>
                </div>
              )}

              {/* EXPERIENCE */}
              {candidate.workExperience && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Experience</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {candidate.workExperience}
                  </p>
                </div>
              )}

              {/* EDUCATION */}
              {candidate.education && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Education</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {candidate.education}
                  </p>
                </div>
              )}

              {/* PROJECTS */}
              {candidate.projects?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex gap-2 items-center">
                    <Code size={14} /> Projects
                  </h3>
                  {candidate.projects.map((p, i) => (
                    <div key={i} className="mb-2">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATIONS */}
              {candidate.certifications?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex gap-2 items-center">
                    <Award size={14} /> Certifications
                  </h3>
                  {candidate.certifications.map((c, i) => (
                    <p key={i} className="text-sm">• {c}</p>
                  ))}
                </div>
              )}

              {/* LINKS */}
              {(candidate.github || candidate.linkedin || candidate.portfolio) && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Links</h3>
                  {candidate.github && <a href={candidate.github} target="_blank" className="block text-primary">GitHub</a>}
                  {candidate.linkedin && <a href={candidate.linkedin} target="_blank" className="block text-primary">LinkedIn</a>}
                  {candidate.portfolio && <a href={candidate.portfolio} target="_blank" className="block text-primary">Portfolio</a>}
                </div>
              )}

              {/* RESUME */}
              {candidate.resumeUrl && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Resume</h3>

                  {hasActiveSubscription && unlocked ? (
                    <a href={candidate.resumeUrl} target="_blank" className="text-primary underline text-sm">
                      View / Download Resume
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground flex gap-2 items-center">
                      <Lock size={14} /> Unlock to view resume
                    </p>
                  )}
                </div>
              )}

              {/* ACHIEVEMENTS */}
              {candidate.achievements && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex gap-2 items-center">
                    <Star size={14} /> Achievements
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {candidate.achievements}
                  </p>
                </div>
              )}

            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default CandidateDetails;