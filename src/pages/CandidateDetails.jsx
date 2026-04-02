import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Sparkles,
  Briefcase,
  MapPin,
  GraduationCap,
  Code,
  Award,
  Star,
  Globe,
  BookOpen,
} from 'lucide-react';
import { Lock } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
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

  const checkIfAlreadyUnlocked = async () => {
    if (!user?.uid || !id) return;

    try {
      const q = query(
        collection(db, "purchases"),
        where("companyId", "==", user.uid),
        where("candidateId", "==", id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        setUnlocked(true);
      }
    } catch (err) {
      console.error("Unlock check error:", err);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('No candidate ID provided');
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'candidates', id));

        if (docSnap.exists()) {
          setCandidate({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Candidate not found');
        }

        await checkIfAlreadyUnlocked();
      } catch (err) {
        console.error(err);
        setError('Failed to load candidate details');
        toast.error('Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, user]);

  const handleUnlock = async () => {
    if (unlocked) {
      toast.info("Already unlocked");
      return;
    }

    if (!hasActiveSubscription) {
      navigate("/subscription");
      return;
    }

    try {
      await unlockCandidate(id);
      setUnlocked(true);
      toast.success("Candidate unlocked successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unlock candidate");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !candidate) return <div className="min-h-screen flex items-center justify-center">{error}</div>;

  const getAvatar = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background relative">

      {/* Background Glow */}
      <div className="mesh-gradient absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >

          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">

            <div className="flex gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold text-primary">
                {getAvatar(candidate.fullName || candidate.name)}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {candidate.fullName || candidate.name}
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} /> {candidate.roleTitle || candidate.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {candidate.location}
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
                  className="px-5 py-2 rounded-lg bg-primary text-white text-sm flex items-center gap-2 shadow-md hover:scale-105 transition"
                >
                  <Lock size={14} />
                  {hasActiveSubscription ? "Unlock Profile" : "Get Subscription"}
                </button>
              ) : (
                <span className="px-3 py-1 bg-green-500/20 text-green-600 text-xs rounded-full">
                  Unlocked
                </span>
              )}

              {candidate.skills?.length >= 4 && (
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> AI Verified
                </span>
              )}
            </div>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {/* LEFT */}
            <div className="space-y-6">

              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-3">Contact</h3>
                {hasActiveSubscription && unlocked ? (
                  <>
                    <p className="flex gap-2 items-center text-sm">
                      <Phone size={14} /> {candidate.phone || "Not provided"}
                    </p>
                    <p className="flex gap-2 items-center text-sm">
                      <Mail size={14} /> {candidate.email || "Not provided"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground flex gap-2 items-center">
                    <Lock size={14} /> Unlock to view contact
                  </p>
                )}
              </div>

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
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {candidate.summary && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Summary</h3>
                  <p className="text-sm">{candidate.summary}</p>
                </div>
              )}

              {candidate.workExperience && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Experience</h3>
                  <p className="text-sm whitespace-pre-wrap">{candidate.workExperience}</p>
                </div>
              )}

              {candidate.education && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold mb-3">Education</h3>
                  <p className="text-sm whitespace-pre-wrap">{candidate.education}</p>
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