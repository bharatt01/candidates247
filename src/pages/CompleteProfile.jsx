import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Phone, Mail, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
  
const CompleteProfile = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

 useEffect(() => {
  if (!user?.uid) return;

  const fetchData = async () => {
    try {
      // 1️⃣ Get basic data from users collection
      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (userSnap.exists()) {
        const userData = userSnap.data();

        setFullName(userData.fullName || "");
        setEmail(userData.email || user.email || "");
        setPhone(userData.phone || "");
      }

      // 2️⃣ Get candidate profile data
      const candidateSnap = await getDoc(doc(db, "candidates", user.uid));

      if (candidateSnap.exists()) {
        const data = candidateSnap.data();

        // 🚨 If already completed → skip page
        if (data.profileCompleted) {
          navigate("/dashboard/candidate");
          return;
        }

        // Autofill remaining fields
        setLocation(data.location || "");
        setRole(data.roleTitle || "");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile data");
    }
  };

  fetchData();
}, [user]);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [education, setEducation] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectInput, setProjectInput] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certificationInput, setCertificationInput] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [references, setReferences] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addProject = () => {
    if (projectInput.trim()) {
      setProjects([...projects, projectInput.trim()]);
      setProjectInput("");
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user?.uid) {
    toast.error("Please sign in first");
    return;
  }

  try {
    setUploading(true);

    await updateDoc(doc(db, "candidates", user.uid), {
      fullName,
      roleTitle: role,
      location,
      experience: parseInt(experience) || 0,
      phone,
      email,
      summary,
      skills,
      projects,
      workExperience,
      education,
      certifications,
      achievements,
      languages,
      interests,
      references,

      // 🔥 MOST IMPORTANT LINE
      profileCompleted: true,

      updatedAt: new Date()
    });

    toast.success("Profile completed successfully!");

    // 🚀 FINAL REDIRECT
    navigate("/dashboard/candidate");

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setUploading(false);
  }
};
  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Build Your Profile</h1>
            <p className="text-sm text-muted-foreground">
              Create a standout candidate profile for top recruiters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Resume Headline / Title */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Resume Headline / Title </label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="e.g., Backend Developer" className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
            </div>

            {/* Career Objective / Summary */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Career Objective / Summary </label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of your career goals and experience..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all min-h-[80px] resize-none" />
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Full Name </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
              </div>
            </div>

            {/* Location and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Location </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Bengaluru" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Experience (years) </label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} required min={0} max={30} placeholder="5" className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
              </div>
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Phone </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Email </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Skills </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addSkill} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="glow-tag-cyan flex items-center gap-1.5">
                    {skill}
                    <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Projects </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={projectInput} onChange={(e) => setProjectInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProject())} placeholder="Add a project..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addProject} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {projects.map((project) => (
                  <span key={project} className="glow-tag-cyan flex items-center gap-1.5">
                    {project}
                    <button type="button" onClick={() => setProjects(projects.filter((p) => p !== project))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Work Experience / Experience </label>
              <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="Describe your work experience..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all min-h-[80px] resize-none" />
            </div>

            {/* Education */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Education </label>
              <textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Describe your education history..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all min-h-[80px] resize-none" />
            </div>

            {/* Certifications */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Certifications </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={certificationInput} onChange={(e) => setCertificationInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())} placeholder="Add a certification..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addCertification} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {certifications.map((cert) => (
                  <span key={cert} className="glow-tag-cyan flex items-center gap-1.5">
                    {cert}
                    <button type="button" onClick={() => setCertifications(certifications.filter((c) => c !== cert))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Achievements </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={achievementInput} onChange={(e) => setAchievementInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())} placeholder="Add an achievement..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addAchievement} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {achievements.map((achievement) => (
                  <span key={achievement} className="glow-tag-cyan flex items-center gap-1.5">
                    {achievement}
                    <button type="button" onClick={() => setAchievements(achievements.filter((a) => a !== achievement))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Languages </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())} placeholder="Add a language..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addLanguage} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((language) => (
                  <span key={language} className="glow-tag-cyan flex items-center gap-1.5">
                    {language}
                    <button type="button" onClick={() => setLanguages(languages.filter((l) => l !== language))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interests / Hobbies */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Interests / Hobbies </label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())} placeholder="Add an interest..." className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                <button type="button" onClick={addInterest} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest) => (
                  <span key={interest} className="glow-tag-cyan flex items-center gap-1.5">
                    {interest}
                    <button type="button" onClick={() => setInterests(interests.filter((i) => i !== interest))} className="hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* References (optional) */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> References (optional) </label>
              <textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="List your professional references..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all min-h-[80px] resize-none" />
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