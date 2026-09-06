import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { UserPlus, LogIn } from "lucide-react";
import CurvedFlow from "../components/ResumeFlow";

// ✅ Format Name (Proper Case + remove extra spaces)
const formatName = (name) => {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// ✅ Format Email (lowercase)
const formatEmail = (email) => {
  return email.trim().toLowerCase();
};

const ForCandidates = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔹 SIGN UP
  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedName = formatName(fullName);
      const formattedEmail = formatEmail(email);

      await signUp(formattedEmail, password, {
        fullName: formattedName,
        phone,
        role: "candidate",
      });

      toast.success("Account created!");
      navigate("/complete-profile");
    } catch (error) {
      let message = "An error occurred";
      if (error.code === "auth/email-already-in-use") {
        message = "Email already in use";
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedEmail = formatEmail(email);

      // 1️⃣ Sign in
      const cred = await signIn(formattedEmail, password);
      const uid = cred.user.uid;

      // 2️⃣ Get user doc
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        toast.error("User record not found!");
        await auth.signOut();
        return;
      }

      const userData = userDoc.data();

      // 3️⃣ Role check
      if (userData.role !== "candidate") {
        toast.error(
          "This email is registered as a company. Please use company login."
        );
        await auth.signOut();
        return;
      }

      toast.success("Signed in successfully!");
      navigate("/dashboard/candidate");
    } catch (error) {
      console.log(error.code, error.message);
      let message = "Email not found";
      if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all";

  return (
    <>
      <div className="h-screen overflow-hidden bg-background relative">
        <div className="relative z-10 h-full grid lg:grid-cols-2">
          {/* LEFT SIDE — Form */}
          <div className="flex items-start justify-center px-6 py-6 lg:pt-10">
            <div className="mesh-gradient" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-xl relative z-10"
            >
<div className="bg-gray-50 border border-gray-200 shadow-xl rounded-2xl p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {mode === "signup"
                      ? "Hundreds of Candidates are Hired Every Day"
                      : "Welcome Back"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mode === "signup"
                      ? "Create your account and be Hired Faster"
                      : "Login to continue your journey"}
                  </p>
                </div>

                {/* Toggle — Reduced gap + Icons */}
                <div className="flex gap-2 p-1 rounded-xl mt-4 bg-muted/20">
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                      mode === "signup"
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    <UserPlus size={16} />
                    New Candidates Sign Up
                  </button>

                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                      mode === "login"
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    <LogIn size={16} />
                    Existing Candidate Login
                  </button>
                </div>

                {/* LOGIN */}
                {mode === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(formatEmail(e.target.value))}
                      placeholder="Email address"
                      className={inputClass}
                    />

                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={inputClass}
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
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
                  /* SIGNUP */
                  <form onSubmit={handleSignup} className="space-y-4 mt-6">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className={inputClass}
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
                      required
                      className={inputClass}
                    />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(formatEmail(e.target.value))}
                      placeholder="Email"
                      className={inputClass}
                    />

                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={inputClass}
                    />

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

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex flex-col justify-start px-6 lg:px-10 py-6 lg:pt-10">
            {/* IMAGE */}
            <div className="relative w-full h-[180px] lg:h-[220px] mb-5 overflow-hidden rounded-3xl border border-white/10 shadow-xl">
              <img
                src="/Images/forcompanies.jpg"
                alt="Career Growth"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/10 to-primary/10" />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white">
                🎯 Get Discovered
              </div>

              <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-xs shadow">
                🚀 Career Growth
              </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-md">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-sm lg:text-base font-medium text-foreground">
                    Stop Applying to 1000s of Companies. Let Companies Find You.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-sm lg:text-base font-medium text-foreground">
                    Build an ATS-Friendly Strong Resume and Get More Interview Calls.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-sm lg:text-base font-medium text-foreground">
                    Your Resume & Profile Show It All. Your Resume = Your Job.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-sm lg:text-base font-medium text-foreground">
                    Get Expert Career & Resume Advice Whenever Required.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-base lg:text-lg font-bold uppercase tracking-wide text-primary">
                  BUILT FOR CANDIDATES WHO WANT OPPORTUNITIES, NOT GUESSWORK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CurvedFlow />
    </>
  );
};

export default ForCandidates;