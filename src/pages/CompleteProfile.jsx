import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Phone, Mail, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const MAX_SKILL_WORDS = 10;

const CompleteProfile = () => {
  const [skills, setSkills] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [expYears, setExpYears] = useState("");
  const [expMonths, setExpMonths] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [education, setEducation] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certificationInput, setCertificationInput] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [references, setReferences] = useState("");

  const formatText = (text) => {
    return text
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatEmail = (email) => {
    return email.trim().toLowerCase();
  };

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(userData.fullName || "");
          setEmail(userData.email || user.email || "");
          setPhone(userData.phone || "");
        }

        const candidateSnap = await getDoc(doc(db, "candidates", user.uid));
        if (candidateSnap.exists()) {
          const data = candidateSnap.data();
          if (data.profileCompleted) {
            navigate("/dashboard/candidate");
            return;
          }
          setLocation(data.location || "");
          setRole(data.roleTitle || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      }
    };

    fetchData();
  }, [user, navigate]);

  // ── Skill add with 10-word limit ──────────────────────────────────────────
  const addSkill = () => {
    const value = formatText(skillInput);
    if (!value) return;

    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount > MAX_SKILL_WORDS) {
      toast.error(`Skill can't exceed ${MAX_SKILL_WORDS} words`);
      return;
    }

    if (!skills.includes(value)) {
      setSkills([...skills, value]);
      setSkillInput("");
    }
  };

  const addProject = () => {
    if (projectTitle.trim() && projectDesc.trim()) {
      setProjects([
        ...projects,
        { title: projectTitle.trim(), description: projectDesc.trim() },
      ]);
      setProjectTitle("");
      setProjectDesc("");
    }
  };

  const addCertification = () => { if (certificationInput.trim()) { setCertifications([...certifications, certificationInput.trim()]); setCertificationInput(""); } };
  const addAchievement = () => { if (achievementInput.trim()) { setAchievements([...achievements, achievementInput.trim()]); setAchievementInput(""); } };
  const addLanguage = () => { if (languageInput.trim()) { setLanguages([...languages, languageInput.trim()]); setLanguageInput(""); } };
  const addInterest = () => { if (interestInput.trim()) { setInterests([...interests, interestInput.trim()]); setInterestInput(""); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return toast.error("Please sign in first");

    if (!fullName.trim()) return toast.error("Full name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!phone.trim() || phone.length !== 10) return toast.error("Valid phone number required");
    if (!summary.trim()) return toast.error("Career objective is required");
    if (!skills.length) return toast.error("Add at least one skill");
    if (!languages.length) return toast.error("Add at least one language");

    try {
      setUploading(true);

      const years = Math.max(0, parseInt(expYears) || 0);
      let months = Math.max(0, parseInt(expMonths) || 0);
      months = Math.min(months, 11);
      const experienceDecimal = Number((years + months / 12).toFixed(2));

      await setDoc(
        doc(db, "candidates", user.uid),
        {
          profileCompleted: true,
          fullName: formatText(fullName),
          roleTitle: role.trim(),
          location: formatText(location),
          phone: phone,
          email: formatEmail(email),
          summary: summary.trim(),
          skills,
          projects: projects,
          experience: experienceDecimal,
          workExperience: formatText(workExperience),
          education: formatText(education),
          certifications: certifications.map(formatText),
          achievements: achievements.map(formatText),
          languages: languages.map(formatText),
          interests: interests.map(formatText),
          references: references
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean),
        },
        { merge: true }
      );

      toast.success("Profile completed successfully!");
      navigate("/dashboard/candidate");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Live word count for skill input
  const skillWordCount = skillInput.trim() ? skillInput.trim().split(/\s+/).length : 0;
  const skillWordLimitReached = skillWordCount > MAX_SKILL_WORDS;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
      <div className="relative z-10 max-w-full sm:max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center sm:text-left">Create Your Resume</h1>
          <p className="text-sm text-muted-foreground mb-6 text-center sm:text-left">Create a standout candidate profile for top recruiters.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Resume Title</label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend Developer" required className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Experience (yrs)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">Years</label>
                    <input
                      type="number"
                      value={expYears}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") { setExpYears(""); } else { setExpYears(parseInt(value)); }
                      }}
                      min={0}
                      placeholder="1"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">Months</label>
                    <input
                      type="number"
                      value={expMonths}
                      onChange={(e) => {
                        let value = parseInt(e.target.value) || 0;
                        if (value > 11) value = 11;
                        setExpMonths(value);
                      }}
                      min={0}
                      max={11}
                      placeholder="6"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={location} onChange={(e) => setLocation(formatText(e.target.value))} placeholder="Bengaluru" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) setPhone(value);
                    }}
                    placeholder="9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(formatEmail(e.target.value))} placeholder="you@email.com" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Career Objective / Summary</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm min-h-[80px] resize-none transition-all" />
            </div>

            {/* Projects */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Projects</label>
              <div className="flex flex-col gap-2 mb-3">
                <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Project Title" className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm" />
                <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Project Description" className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm min-h-[70px]" />
                <button type="button" onClick={addProject} className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm w-fit">
                  Add Project
                </button>
              </div>
              <div className="space-y-2">
                {projects.map((proj, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold">• {proj.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{proj.description}</p>
                      </div>
                      <button type="button" onClick={() => setProjects(projects.filter((_, i) => i !== index))}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Skills (with word limit) ─────────────────────────────── */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Skills</label>
              <div className="flex gap-2 mb-1">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, Node.js"
                  className={`flex-1 px-3 py-2 rounded-lg bg-muted/30 border text-sm outline-none transition-colors ${
                    skillWordLimitReached ? "border-red-400 focus:border-red-400" : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={skillWordLimitReached}
                  className="px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
              {/* Word count hint — only shows when user starts typing */}
              {skillInput.trim() && (
                <p className={`text-xs mb-2 ${skillWordLimitReached ? "text-red-400" : "text-muted-foreground"}`}>
                  {skillWordCount}/{MAX_SKILL_WORDS} words{skillWordLimitReached ? " — too long" : ""}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {skills.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs border border-green-500/20 flex items-center gap-1.5">
                    {item}
                    <button type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}><X size={11} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* ── Other dynamic lists (unchanged) ─────────────────────── */}
            {[
              ["Certifications", certifications, certificationInput, addCertification, setCertificationInput],
              ["Achievements", achievements, achievementInput, addAchievement, setAchievementInput],
              ["Languages", languages, languageInput, addLanguage, setLanguageInput],
              ["Interests / Hobbies", interests, interestInput, addInterest, setInterestInput],
            ].map(([title, list, input, addFn, setInput], index) => (
              <div key={index}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">{title}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFn();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm outline-none focus:border-primary"
                  />
                  <button type="button" onClick={addFn} className="px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {list.map((item, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs border border-green-500/20 flex items-center gap-1.5">
                      {item}
                      <button type="button" onClick={() => setInput !== setCertificationInput
                        ? (title === "Achievements" ? setAchievements(achievements.filter((_, idx) => idx !== i))
                          : title === "Languages" ? setLanguages(languages.filter((_, idx) => idx !== i))
                          : setInterests(interests.filter((_, idx) => idx !== i)))
                        : setCertifications(certifications.filter((_, idx) => idx !== i))
                      }><X size={11} /></button>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">References (optional)</label>
              <textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="List your references..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm min-h-[80px] resize-none transition-all" />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Completing Profile..." : "Complete Profile"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;