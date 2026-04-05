  import { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { User, MapPin, Briefcase, LogOut, Edit3, Save, Plus, X, Phone } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";
  import { useAuth } from "@/contexts/AuthContext";
  import { db } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

  const CandidateDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [candidateData, setCandidateData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

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

        // set states...
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
        setReferences(data.references || "");
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

    const addSkill = () => {
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    };

  const addProject = () => {
  if (projectTitle.trim() && projectDesc.trim()) {
    setProjects([
      ...projects,
      {
        title: projectTitle.trim(),
        description: projectDesc.trim(),
      },
    ]);
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
          updatedAt: new Date()
        });

        await updateDoc(doc(db, "candidates", user.uid), {
          fullName,
          roleTitle,
          experience: parseInt(experience) || 0,
          location,
          phone,
          skills,
          summary,
          workExperience,
          education,
          projects,
          certifications,
          achievements,
          languages,
          interests,
          references,
          updatedAt: new Date()

        }
      );

        // ✅ update UI instantly
        setCandidateData({
          ...candidateData,
          fullName,
          roleTitle,
          role: roleTitle,
          experience: parseInt(experience) || 0,
          location,
          phone,
          skills,
          summary,
          workExperience,
          education,
          projects,
          certifications,
          achievements,
          languages,
          interests,
          references,
        });
        setProfile((prev) => (prev ? { ...prev, fullName } : prev));
        toast.success("Profile updated! Changes are live on the marketplace.");
        setEditing(false);
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
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
                >
                  <Edit3 size={14} />
                  Edit Resume
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors btn-haptic disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}

            
            </div>
          </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
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
                    <p className="text-sm text-foreground font-medium">{(candidateData)?.phone || "Not set"}</p>
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

            {/* Skills & Experience */}
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
                        <button type="button" onClick={addSkill} className="px-3 py-2 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20">
                          <Plus size={14} />
                        </button>
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mt-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Resume Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Work Experience</p>
                {editing ? (
                  <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="No work experience entered." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
                ) : (
                  <p className="text-sm text-foreground">{candidateData?.workExperience || "No work experience entered."}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Education</p>
                {editing ? (
                  <textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="No education history entered." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
                ) : (
                  <p className="text-sm text-foreground">{candidateData?.education || "No education history entered."}</p>
                )}
              </div>
             <div>
  <p className="text-xs text-muted-foreground">Projects</p>

  {editing ? (
    <div className="space-y-3 mt-2">

      {/* INPUTS */}
      <div className="flex flex-col gap-2">
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Project Title"
          className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm"
        />

        <input
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          placeholder="Project Description"
          className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm"
        />

        <button
          type="button"
          onClick={addProject}
          className="px-3 py-2 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center gap-1"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {projects.map((proj, index) => (
          <div
            key={index}
            className="flex justify-between items-start bg-muted/20 p-2 rounded"
          >
            <div>
              <p className="text-sm font-medium">{proj.title}</p>
              <p className="text-xs text-muted-foreground">
                {proj.description}
              </p>
            </div>

            <button
              onClick={() =>
                setProjects(projects.filter((_, i) => i !== index))
              }
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      {(candidateData?.projects || []).map((proj, i) => (
        <div key={i}>
          <p className="text-sm font-medium">• {proj.title}</p>
          <p className="text-xs text-muted-foreground ml-3">
            {proj.description}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
              <div>
                <p className="text-xs text-muted-foreground">Certifications</p>
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
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateData?.certifications || []).map((cert) => (
                      <span key={cert} className="glow-tag-cyan">{cert}</span>
                    ))}
                    {(!candidateData?.certifications || candidateData.certifications.length === 0) && (
                      <span className="text-sm text-muted-foreground">No certifications listed.</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Achievements</p>
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
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateData?.achievements || []).map((ach) => (
                      <span key={ach} className="glow-tag-cyan">{ach}</span>
                    ))}
                    {(!candidateData?.achievements || candidateData.achievements.length === 0) && (
                      <span className="text-sm text-muted-foreground">No achievements listed.</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Languages</p>
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
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateData?.languages || []).map((lang) => (
                      <span key={lang} className="glow-tag-cyan">{lang}</span>
                    ))}
                    {(!candidateData?.languages || candidateData.languages.length === 0) && (
                      <span className="text-sm text-muted-foreground">No languages listed.</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interests / Hobbies</p>
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
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateData?.interests || []).map((intst) => (
                      <span key={intst} className="glow-tag-cyan">{intst}</span>
                    ))}
                    {(!candidateData?.interests || candidateData.interests.length === 0) && (
                      <span className="text-sm text-muted-foreground">No interests listed.</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">References</p>
                {editing ? (
                  <textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="No references listed." className="w-full px-3 py-2 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary outline-none text-sm min-h-[70px]" />
                ) : (
                  <p className="text-sm text-foreground">{candidateData?.references || "No references listed."}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 mt-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Status</h2>
            <p className="text-sm text-muted-foreground text-center py-8">
              Your profile is live! Companies can now discover and unlock your contact details.
            </p>
          </motion.div>

          {/* Rest of JSX remains exactly same */}
        </div>
      </div>
    );
  };

  export default CandidateDashboard;