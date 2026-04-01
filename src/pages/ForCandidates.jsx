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
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
const [phone, setPhone] = useState("");
  

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
  <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
    <div className="mesh-gradient" />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md relative z-10"
    >
      {/* Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? "Start your journey with top companies"
              : "Login to continue your journey"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-muted/40 p-1 rounded-xl mb-6">
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signup"
                ? "bg-primary text-white shadow"
                : "text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "login"
                ? "bg-primary text-white shadow"
                : "text-muted-foreground"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Forms */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-medium bg-primary text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            {/* Role */}
            <div className="relative">
              <Briefcase
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Your role (e.g. Frontend Developer)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) setPhone(value);
                }}
                placeholder="Phone number"
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-medium bg-primary text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  </div>
);
};

export default ForCandidates;