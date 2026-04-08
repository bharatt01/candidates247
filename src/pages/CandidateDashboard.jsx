import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Briefcase, Edit3, Save, Plus, X, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// ─── Profile completion config ────────────────────────────────────────────────
// Each field has a weight (weights sum to 100).
const COMPLETION_FIELDS = [
  { key: "fullName",       label: "Full name",              weight: 10 },
  { key: "phone",          label: "Phone number",           weight: 8  },
  { key: "location",       label: "Location",               weight: 7  },
  { key: "roleTitle",      label: "Role / Title",           weight: 10 },
  { key: "experience",     label: "Years of experience",    weight: 7  },
  { key: "summary",        label: "Professional summary",   weight: 10 },
  { key: "skills",         label: "Skills (at least 3)",    weight: 10 },
  { key: "workExperience", label: "Work experience",        weight: 10 },
  { key: "education",      label: "Education",              weight: 8  },
  { key: "projects",       label: "Projects (at least 1)",  weight: 8  },
  { key: "certifications", label: "Certifications",         weight: 6  },
  { key: "languages",      label: "Languages",              weight: 3  },
  { key: "references",     label: "References",             weight: 3  },
];

const calcCompletion = (data) => {
  if (!data) return { percent: 0, completed: [], missing: [] };

  let earned = 0;
  const completed = [];
  const missing = [];

  COMPLETION_FIELDS.forEach(({ key, label, weight }) => {
    const val = data[key];
    let done = false;

    if (key === "skills") {
      done = Array.isArray(val) && val.length >= 3;
    } else if (key === "projects") {
      done = Array.isArray(val) && val.length >= 1;
    } else if (Array.isArray(val)) {
      done = val.length > 0;
    } else if (typeof val === "number") {
      done = val > 0;
    } else {
      done = !!val && String(val).trim() !== "";
    }

    if (done) {
      earned += weight;
      completed.push(label);
    } else {
      missing.push(label);
    }
  });

  return { percent: Math.min(earned, 100), completed, missing };
};

const getBarColor = (pct) => {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-400";
  return "bg-red-400";
};

const getMessage = (pct) => {
  if (pct === 100) return "🎉 Profile complete! You're fully visible to recruiters.";
  if (pct >= 80)  return "Almost there! A complete profile gets 3× more views.";
  if (pct >= 50)  return "Good start — fill in the remaining fields to get recruited faster.";
  return "Your profile needs more info to appear in recruiter searches.";
};
// ──────────────────────────────────────────────────────────────────────────────

const CandidateDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  // Editable fields
  const [roleTitle, setRoleTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
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
  const [fullName, setFullName] = useState("");
  const [editSnapshot, setEditSnapshot] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user || !user.uid) {
      navigate("/for-candidates");
      return;
    }

    const fetchData = async () => {
      try {
        const candidateRef = doc(db, "candidates", user.uid);
        const candidateSnap = await getDoc(candidateRef);

        let candidateFullName = "";
        let candidateRoleTitle = "";

        if (candidateSnap.exists()) {
          const data = candidateSnap.data();

          if (!data.profileCompleted) {
            navigate("/complete-profile");
            return;
          }

          setCandidateData(data);

          candidateFullName = data.fullName || data.name || "";
          candidateRoleTitle = data.roleTitle || data.role || data.title || "";

          setRoleTitle(candidateRoleTitle);
          setExperience(String(data.experience || ""));
          setLocation(data.location || "");
          setPhone(data.phone || "");
          setSkills(data.skills || []);
          setSummary(data.summary || "");
          setWorkExperience(data.workExperience || "");
          setEducation(data.education || "");
          setProjects(data.projects || []);
          setCertifications(data.certifications || []);
          setAchievements(data.achievements || []);
          setLanguages(data.languages || []);
          setInterests(data.interests || []);

          const rawRefs = data.references;
          setReferences(
            Array.isArray(rawRefs) ? rawRefs.join(", ") : rawRefs || ""
          );
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfile(userData);
          setFullName(userData.fullName || candidateFullName || "");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [user, loading, navigate]);

  // Derive completion from live candidateData — updates automatically after save
  const { percent, completed, missing } = calcCompletion(candidateData);
  const barColor = getBarColor(percent);
  const message = getMessage(percent);

  const handleStartEditing = () => {
    setEditSnapshot({
      fullName, roleTitle, experience, location, phone,
      skills: [...skills], summary, workExperience, education,
      projects: [...projects], certifications: [...certifications],
      achievements: [...achievements], languages: [...languages],
      interests: [...interests], references,
    });
    setEditing(true);
  };

  const handleCancel = () => {
    if (editSnapshot) {
      setFullName(editSnapshot.fullName);
      setRoleTitle(editSnapshot.roleTitle);
      setExperience(editSnapshot.experience);
      setLocation(editSnapshot.location);
      setPhone(editSnapshot.phone);
      setSkills(editSnapshot.skills);
      setSummary(editSnapshot.summary);
      setWorkExperience(editSnapshot.workExperience);
      setEducation(editSnapshot.education);
      setProjects(editSnapshot.projects);
      setCertifications(editSnapshot.certifications);
      setAchievements(editSnapshot.achievements);
      setLanguages(editSnapshot.languages);
      setInterests(editSnapshot.interests);
      setReferences(editSnapshot.references);
    }
    setEditing(false);
    setEditSnapshot(null);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addProject = () => {
    if (projectTitle.trim() && projectDesc.trim()) {
      setProjects([...projects, { title: projectTitle.trim(), description: projectDesc.trim() }]);
      setProjectTitle("");
      setProjectDesc("");
    }
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setCertifications([...certifications, certificationInput.trim()]);
      setCertificationInput("");
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput("");
    }
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setLanguages([...languages, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    return value?.split(",").map((item) => item.trim()).filter((item) => item !== "") || [];
  };

  const displayReferences = (refs) => {
    if (!refs || (Array.isArray(refs) && refs.length === 0)) return "No references listed.";
    if (Array.isArray(refs)) return refs.join(", ");
    return refs;
  };

  const handleSave = async () => {
    if (!user?.uid) {
      toast.error("Please log in to save profile");
      return;
    }
    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        role: "candidate",
        updatedAt: new Date(),
      });

      const years = Math.floor(Number(experience) || 0);
      const months = Math.round((Number(experience) % 1) * 12);
      const experienceDecimal = Number((years + months / 12).toFixed(2));

      await setDoc(
        doc(db, "candidates", user.uid),
        {
          fullName, roleTitle,
          experience: experienceDecimal,
          location, phone, skills, summary, workExperience, education, projects,
          certifications: Array.isArray(certifications) ? certifications : [],
          achievements: Array.isArray(achievements) ? achievements : [],
          languages: Array.isArray(languages) ? languages : [],
          interests: Array.isArray(interests) ? interests : [],
          references: toArray(references),
          profileCompleted: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Update local state — completion % recalculates automatically
      setCandidateData((prev) => ({
        ...prev,
        fullName, roleTitle, role: roleTitle,
        experience: experienceDecimal,
        location, phone, skills, summary, workExperience, education, projects,
        certifications, achievements, languages, interests,
        references: toArray(references),
      }));

      setProfile((prev) => (prev ? { ...prev, fullName, phone } : prev));

      toast.success("Profile updated! Changes are live on the marketplace.");
      setEditing(false);
      setEditSnapshot(null);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {fullName || candidateData?.fullName || profile?.fullName || "Candidate"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Your candidate dashboard — edit your resume anytime
            </p>
          </div>

          <div className="flex gap-2">
            {!editing ? (
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
              >
                <Edit3 size={14} />
                Edit Resume
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors btn-haptic"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors btn-haptic disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Profile Completion Banner ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {percent === 100 ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-yellow-400" />
              )}
              <span className="text-sm font-semibold text-foreground">
                Profile Completion
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">{percent}%</span>
              {percent < 100 && (
                <button
                  onClick={() => setShowChecklist((v) => !v)}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  {showChecklist ? "Hide details" : "What's missing?"}
                </button>
              )}
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="w-full h-2.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">{message}</p>

          {/* Expandable checklist */}
          {showChecklist && percent < 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5"
            >
              {COMPLETION_FIELDS.map(({ key, label }) => {
                const done = completed.includes(label);
                return (
                  <div key={key} className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground/50 shrink-0" />
                    )}
                    <span className={`text-xs ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* ── Profile + Professional Info ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Your Profile
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                {editing ? (
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm mt-1" />
                ) : (
                  <p className="text-sm text-foreground font-medium">{fullName || candidateData?.fullName || candidateData?.name || profile?.fullName || "—"}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground font-medium">{profile?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                {editing ? (
                  <div className="relative mt-1">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm" />
                  </div>
                ) : (
                  <p className="text-sm text-foreground font-medium">{candidateData?.phone || "Not set"}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin size={12} />
                {editing ? (
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your city" className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm" />
                ) : (
                  <p className="text-sm">{candidateData?.location || profile?.location || "Not set"}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-secondary" />
              Professional Info
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                {editing ? (
                  <input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="Frontend Developer" className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm mt-1" />
                ) : (
                  <p className="text-sm text-foreground font-medium">{candidateData?.roleTitle || candidateData?.role || candidateData?.title || roleTitle || "Not set"}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                {editing ? (
                  <input type="number" min={0} max={30} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years" className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm mt-1" />
                ) : (
                  <p className="text-sm text-foreground font-medium">{candidateData?.experience ?? 0} years</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Summary</p>
                {editing ? (
                  <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Career objective or summary" className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm mt-1 min-h-[70px]" />
                ) : (
                  <p className="text-sm text-foreground">{candidateData?.summary || "No summary provided."}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Skills</p>
                {editing ? (
                  <div className="mt-1">
                    <div className="flex gap-2 mb-2">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add skill..." className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary outline-none text-sm" />
                      <button type="button" onClick={addSkill} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20"><Plus size={14} /></button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="glow-tag-cyan flex items-center gap-1.5">
                          {s}
                          <button type="button" onClick={() => setSkills(skills.filter((sk) => sk !== s))} className="hover:text-foreground"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(candidateData?.skills || []).map((s) => (
                      <span key={s} className="glow-tag-cyan">{s}</span>
                    ))}
                    {(!candidateData?.skills || candidateData.skills.length === 0) && (
                      <span className="text-sm text-muted-foreground">No skills added</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Resume Details ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mt-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Resume Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Work Experience</p>
              {editing ? (
                <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="No work experience entered." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
              ) : (
                <p className="text-sm text-foreground">{candidateData?.workExperience || "No work experience entered."}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Education</p>
              {editing ? (
                <textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="No education history entered." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
              ) : (
                <p className="text-sm text-foreground">{candidateData?.education || "No education history entered."}</p>
              )}
            </div>

            {/* Projects */}
            <div>
              <p className="text-sm font-semibold text-foreground">Projects</p>
              {editing ? (
                <div className="space-y-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Project Title" className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm" />
                    <input value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Project Description" className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm" />
                    <button type="button" onClick={addProject} className="px-3 py-2 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center gap-1">
                      <Plus size={14} /> Add Project
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projects.map((proj, index) => (
                      <div key={index} className="flex justify-between items-start bg-muted/20 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium">{proj.title}</p>
                          <p className="text-xs text-muted-foreground">{proj.description}</p>
                        </div>
                        <button onClick={() => setProjects(projects.filter((_, i) => i !== index))}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mt-1">
                  {(candidateData?.projects || []).length > 0 ? (
                    candidateData.projects.map((proj, i) => (
                      <div key={i}>
                        <p className="text-sm font-medium">• {proj.title}</p>
                        <p className="text-xs text-muted-foreground ml-3">{proj.description}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No projects listed.</span>
                  )}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <p className="text-sm font-semibold text-foreground">Certifications</p>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input value={certificationInput} onChange={(e) => setCertificationInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())} placeholder="Add a certification..." className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary outline-none text-sm" />
                    <button type="button" onClick={addCertification} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20"><Plus size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {certifications.map((cert) => (
                      <span key={cert} className="glow-tag-cyan flex items-center gap-1.5">
                        {cert}
                        <button type="button" onClick={() => setCertifications(certifications.filter((c) => c !== cert))} className="hover:text-foreground"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidateData?.certifications || []).map((cert) => (
                    <span key={cert} className="glow-tag-cyan">{cert}</span>
                  ))}
                  {(!candidateData?.certifications || candidateData.certifications.length === 0) && (
                    <span className="text-sm text-muted-foreground">No certifications listed.</span>
                  )}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div>
              <p className="text-sm font-semibold text-foreground">Achievements</p>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input value={achievementInput} onChange={(e) => setAchievementInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())} placeholder="Add an achievement..." className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary outline-none text-sm" />
                    <button type="button" onClick={addAchievement} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20"><Plus size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {achievements.map((ach) => (
                      <span key={ach} className="glow-tag-cyan flex items-center gap-1.5">
                        {ach}
                        <button type="button" onClick={() => setAchievements(achievements.filter((a) => a !== ach))} className="hover:text-foreground"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidateData?.achievements || []).map((ach) => (
                    <span key={ach} className="glow-tag-cyan">{ach}</span>
                  ))}
                  {(!candidateData?.achievements || candidateData.achievements.length === 0) && (
                    <span className="text-sm text-muted-foreground">No achievements listed.</span>
                  )}
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <p className="text-sm font-semibold text-foreground">Languages</p>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())} placeholder="Add a language..." className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary outline-none text-sm" />
                    <button type="button" onClick={addLanguage} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20"><Plus size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((lang) => (
                      <span key={lang} className="glow-tag-cyan flex items-center gap-1.5">
                        {lang}
                        <button type="button" onClick={() => setLanguages(languages.filter((l) => l !== lang))} className="hover:text-foreground"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidateData?.languages || []).map((lang) => (
                    <span key={lang} className="glow-tag-cyan">{lang}</span>
                  ))}
                  {(!candidateData?.languages || candidateData.languages.length === 0) && (
                    <span className="text-sm text-muted-foreground">No languages listed.</span>
                  )}
                </div>
              )}
            </div>

            {/* Interests */}
            <div>
              <p className="text-sm font-semibold text-foreground">Interests / Hobbies</p>
              {editing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())} placeholder="Add an interest..." className="flex-1 px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary outline-none text-sm" />
                    <button type="button" onClick={addInterest} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20"><Plus size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((intst) => (
                      <span key={intst} className="glow-tag-cyan flex items-center gap-1.5">
                        {intst}
                        <button type="button" onClick={() => setInterests(interests.filter((i) => i !== intst))} className="hover:text-foreground"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidateData?.interests || []).map((intst) => (
                    <span key={intst} className="glow-tag-cyan">{intst}</span>
                  ))}
                  {(!candidateData?.interests || candidateData.interests.length === 0) && (
                    <span className="text-sm text-muted-foreground">No interests listed.</span>
                  )}
                </div>
              )}
            </div>

            {/* References */}
            <div>
              <p className="text-sm font-semibold text-foreground">References</p>
              {editing ? (
                <textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="No references listed." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
              ) : (
                <p className="text-sm text-foreground">{displayReferences(candidateData?.references)}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Status ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 mt-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Status</h2>
          <p className="text-sm text-muted-foreground text-center py-8">
            Your profile is live! Companies can now discover and unlock your contact details.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default CandidateDashboard;