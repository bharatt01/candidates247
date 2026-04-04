import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Phone, Mail, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const CompleteProfile = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const addSkill = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };
  const addProject = () => { if (projectInput.trim()) { setProjects([...projects, projectInput.trim()]); setProjectInput(""); } };
  const addCertification = () => { if (certificationInput.trim()) { setCertifications([...certifications, certificationInput.trim()]); setCertificationInput(""); } };
  const addAchievement = () => { if (achievementInput.trim()) { setAchievements([...achievements, achievementInput.trim()]); setAchievementInput(""); } };
  const addLanguage = () => { if (languageInput.trim()) { setLanguages([...languages, languageInput.trim()]); setLanguageInput(""); } };
  const addInterest = () => { if (interestInput.trim()) { setInterests([...interests, interestInput.trim()]); setInterestInput(""); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return toast.error("Please sign in first");

    try {
      setUploading(true);
      const docRef = doc(db, "candidates", user.uid);
      await setDoc(docRef, {
        fullName, roleTitle: role, location, experience: parseInt(experience)||0, phone, email,
        summary, skills, projects, workExperience, education,
        certifications, achievements, languages, interests, references,
        profileCompleted: true, updatedAt: new Date(),
      }, { merge: true });
      toast.success("Profile completed successfully!");
      navigate("/dashboard/candidate");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally { setUploading(false); }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
      <div className="relative z-10 max-w-full sm:max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center sm:text-left">Build Your Profile</h1>
          <p className="text-sm text-muted-foreground mb-6 text-center sm:text-left">Create a standout candidate profile for top recruiters.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Responsive grid for inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Resume Title </label>
                <input type="text" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Backend Developer" required className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Experience (yrs) </label>
                <input type="number" value={experience} onChange={(e)=>setExperience(e.target.value)} min={0} max={30} placeholder="5" required className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Full Name </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="John Doe" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Location </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Bengaluru" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Phone </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+91 98765 43210" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Email </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Full width textareas */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> Career Objective / Summary </label>
              <textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Brief summary..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm min-h-[80px] resize-none transition-all" />
            </div>

            {/* Dynamic Lists: Skills, Projects, etc. */}
            {[["Skills", skills, skillInput, addSkill, setSkillInput],
              ["Projects", projects, projectInput, addProject, setProjectInput],
              ["Certifications", certifications, certificationInput, addCertification, setCertificationInput],
              ["Achievements", achievements, achievementInput, addAchievement, setAchievementInput],
              ["Languages", languages, languageInput, addLanguage, setLanguageInput],
              ["Interests / Hobbies", interests, interestInput, addInterest, setInterestInput]
            ].map(([label, arr, input, addFn, setInput]) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">{label}</label>
                <div className="flex gap-2 mb-2 flex-wrap sm:flex-nowrap">
                  <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&(e.preventDefault(), addFn())} placeholder={`Add a ${label.toLowerCase()}`} className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm transition-all" />
                  <button type="button" onClick={addFn} className="px-3 py-2.5 rounded-lg btn-haptic text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {arr.map((item)=>(
                    <span key={item} className="glow-tag-cyan flex items-center gap-1.5">
                      {item}
                      <button type="button" onClick={()=>arr===skills?setSkills(skills.filter(s=>s!==item))
                        :arr===projects?setProjects(projects.filter(p=>p!==item))
                        :arr===certifications?setCertifications(certifications.filter(c=>c!==item))
                        :arr===achievements?setAchievements(achievements.filter(a=>a!==item))
                        :arr===languages?setLanguages(languages.filter(l=>l!==item))
                        :setInterests(interests.filter(i=>i!==item))
                      } className="hover:text-foreground"><X size={12}/></button>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* References */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider"> References (optional) </label>
              <textarea value={references} onChange={(e)=>setReferences(e.target.value)} placeholder="List your references..." className="w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm min-h-[80px] resize-none transition-all" />
            </div>

            <motion.button whileTap={{ scale:0.97 }} type="submit" disabled={uploading} className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading?"Completing Profile...":"Complete Profile"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;