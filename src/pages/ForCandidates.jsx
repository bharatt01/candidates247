import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Plus, X, LogIn, UserPlus, Phone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, auth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const ForCandidates = () => {
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

const handleSignup = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    await signUp(email, password, {
      fullName,
      role: "candidate",
      phone
    });

    const currentUser = auth.currentUser;

    // Save ONLY basic info
    await setDoc(doc(db, "candidates", currentUser.uid), {
      fullName,
      email,
      phone,
      role: "candidate",
      profileCompleted: false,
      createdAt: new Date()
    });

    toast.success("Account created!");

    // 🔥 REDIRECT TO COMPLETE PROFILE PAGE
    navigate("/complete-profile");

  } catch (error) {
    toast.error(error.message);
  } finally {
    setSubmitting(false);
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard/candidate");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Removed auto-redirect for new users - goes to /profile after signup
  if (user) {
    if (location.pathname === "/for-candidates") {
      navigate("/profile");
    }
    return null;
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all";

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
    

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              For Candidates
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signup"
                ? "Quick onboarding — get discovered by top companies."
                : "Sign in to your candidate account."}
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all btn-haptic ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground border border-border"
              }`}
            >
              <UserPlus size={14} className="inline mr-1.5" /> Sign Up
            </button>

            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all btn-haptic ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground border border-border"
              }`}
            >
              <LogIn size={14} className="inline mr-1.5" /> Log In
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic disabled:opacity-50"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
            
              {/* Full signup form remains exactly same */}
                <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Full Name</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Password</label>
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Quick Onboarding</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Role</label>
                    <div className="relative">
                      <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" required value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="Frontend Dev" className={`${inputClass} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Experience</label>
                    <input type="number" min={0} max={30} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={`${inputClass} pl-9`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Skills</label>
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
                      <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="hover:text-foreground"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={submitting} className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic disabled:opacity-50">
                {submitting ? "Creating account..." : "Create Account & Join"}
              </motion.button>
              {/* (No logic removed, no UI removed) */}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForCandidates;