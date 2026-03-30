import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Briefcase, MapPin, Phone, Mail, Sparkles, GraduationCap, Code, Award, Globe, Star, BookOpen } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error(err);
        setError('Failed to load candidate details');
        toast.error('Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading candidate details...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground mb-2">{error || 'Candidate not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Avatar fallback
  const getAvatar = (name) => {
    if (!name) return '?';
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return initials;
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-background relative pt-4">
        <div className="mesh-gradient absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Candidates
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {getAvatar(candidate.fullName || candidate.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{candidate.fullName || candidate.name}</h1>
                  {candidate.skills?.length >= 4 && (
                    <div className="flex items-center gap-1 text-xs font-medium bg-secondary/20 px-2.5 py-1 rounded-full text-secondary">
                      <Sparkles size={12} />
                      AI Verified
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    <span>{candidate.roleTitle || candidate.role}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{candidate.experience || 0} yrs exp</span>
                  </div>
                </div>
                {candidate.salaryExpectation && (
                  <p className="text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
                    ₹{candidate.salaryExpectation.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Contact & Core Info */}
              <div className="space-y-6">
                {/* Contact */}
                <div className="glass-card p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                    <Phone size={16} />
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{candidate.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{candidate.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                      <Sparkles size={16} />
                      Key Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-xs font-medium text-primary rounded-full border border-primary/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Full Profile */}
              <div className="space-y-6">
                {/* Summary */}
                {candidate.summary && (
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Career Summary</h3>
                    <p className="text-sm leading-relaxed text-foreground">{candidate.summary}</p>
                  </div>
                )}

                {/* Work Experience */}
                {candidate.workExperience && (
                  <div className="glass-card p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                      <Briefcase size={16} />
                      Work Experience
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{candidate.workExperience}</p>
                  </div>
                )}

                {/* Education */}
                {candidate.education && (
                  <div className="glass-card p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                      <GraduationCap size={16} />
                      Education
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{candidate.education}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
              {candidate.projects?.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    <Code size={14} />
                    Projects ({candidate.projects.length})
                  </h4>
                  <div className="space-y-1">
                    {candidate.projects.map((proj, i) => (
                      <p key={i} className="text-sm text-foreground line-clamp-1">{proj}</p>
                    ))}
                  </div>
                </div>
              )}
              {candidate.certifications?.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    <Award size={14} />
                    Certifications ({candidate.certifications.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.certifications.map((cert, i) => (
                      <span key={i} className="text-xs bg-secondary/20 px-2 py-1 rounded-full text-secondary font-medium">{cert}</span>
                    ))}
                  </div>
                </div>
              )}
              {candidate.achievements?.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    <Star size={14} />
                    Achievements ({candidate.achievements.length})
                  </h4>
                  <div className="space-y-1">
                    {candidate.achievements.slice(0, 3).map((ach, i) => (
                      <p key={i} className="text-xs text-foreground line-clamp-1">{ach}</p>
                    ))}
                  </div>
                </div>
              )}
              {candidate.languages?.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    <Globe size={14} />
                    Languages ({candidate.languages.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.languages.map((lang, i) => (
                      <span key={i} className="text-xs bg-accent/50 px-2 py-1 rounded-full text-foreground font-medium">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
              {candidate.interests?.length > 0 && (
                <div className="glass-card p-6 md:col-span-2 lg:col-span-1">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    <BookOpen size={14} />
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.interests.map((interest, i) => (
                      <span key={i} className="text-xs bg-muted/40 px-2 py-1 rounded-full text-muted-foreground">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {candidate.references && (
              <div className="glass-card p-6 mt-8">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                  References
                </h3>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{candidate.references}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetails;

