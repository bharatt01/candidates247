import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Briefcase, Sparkles } from "lucide-react";
// ✅ Format Name / Company / Industry  
const formatText = (text) => {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

// ✅ Format Email
const formatEmail = (email) => {
  return email.trim().toLowerCase();
};

const ForCompanies = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all";

  // 🔹 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedEmail = formatEmail(email);
      const formattedCompany = formatText(companyName);
      const formattedIndustry = formatText(industry);

      await signUp(formattedEmail, password, {
        companyName: formattedCompany,
        industry: formattedIndustry,
        role: "company",
      });

      toast.success("Company account created successfully!");
      navigate("/dashboard/company");
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

      const cred = await signIn(formattedEmail, password);
      const uid = cred.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        toast.error("User record not found!");
        await auth.signOut();
        setSubmitting(false);
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== "company") {
        toast.error(
          "This email is registered as a candidate. Please login from candidate portal."
        );
        await auth.signOut();
        setSubmitting(false);
        return;
      }

      toast.success("Signed in successfully!");
      navigate("/dashboard/company");
    } catch (error) {
      let message = "Email not found";
      if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

 return (
<div className="min-h-screen bg-background relative overflow-x-hidden">
    <div className="mesh-gradient" />

 <div className="relative z-10 grid lg:grid-cols-2">

      {/* ================= LEFT SIDE (FORM) ================= */}
<div className="flex items-start justify-center px-6 py-6 lg:pt-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
    className="w-full max-w-xl relative z-10"
        >
         
         <div className="bg-gray-50 border border-gray-200 shadow-xl rounded-2xl p-8">
                    <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
           Thousands of Companies are Hiring from Us
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signup"
                ? "Create your company account and start hiring."
                : "Sign in to your company account."}
            </p>
          </div>

          {/* Toggle */}
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
  <span className="whitespace-nowrap">
    New Company Sign Up
  </span>
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
  <span className="whitespace-nowrap">
    Existing Company Login
  </span>
</button>
          </div>

          {/* ===== FORMS ===== */}
          {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4 mt-6">

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
                className="w-full py-3 rounded-lg font-semibold bg-primary text-white disabled:opacity-50"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>
          ) : (
         <form onSubmit={handleSignup} className="space-y-4 mt-6">
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(formatText(e.target.value))}
                placeholder="Company Name"
                className={inputClass}
              />

              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(formatText(e.target.value))}
                placeholder="Industry"
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
className="w-full py-3 rounded-xl font-medium bg-primary text-white hover:opacity-90 transition disabled:opacity-50"    >
                {submitting
                  ? "Creating account..."
                  : "Create Account"}
              </motion.button>
            </form>
          )}
          </div>
        </motion.div>
        
      </div>

      {/* ================= RIGHT SIDE (WHY JOIN) ================= */}
    {/* ================= RIGHT SIDE ================= */}
<div className="flex flex-col justify-start px-6 lg:px-12 py-6 lg:py-2">
  {/* 🔥 IMAGE */}


    {/* BACK GLOW */}
    <div className="absolute -inset-6 pointer-events-none bg-gradient-to-tr from-primary/30 via-purple-500/20 to-transparent blur-2xl opacity-40" />

    {/* RANDOM POLYGON */}
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
     <div className="relative w-full h-[180px] lg:h-[240px] overflow-hidden">
  <img
    src="/Images/forcompanies.jpg"
    alt="Hiring"
    className="w-full h-full object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/20 to-primary/10" />
  <div className="absolute inset-0 bg-black/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

  {/* Tags */}
  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white">
    ⚡ Smart Hiring
  </div>

  <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg text-xs shadow">
    🚀 1000+ Companies
  </div>
</div>
</div>

  {/* ================= UNIQUE TEXT ================= */}

  {/* ================= BETTER COMPANY TEXT ================= */}
<div className="mt-0 max-w-md">

  {/* HEADING */}
  <div className="mt-3 max-w-md">

  <div className="space-y-3">

    <div className="flex items-start gap-2">
      <span className="text-primary font-bold">✓</span>
      <p className="text-sm lg:text-base font-semibold text-foreground">
        10 Relevant & Right Resumes Are Better Than 1000s of Random Resumes
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-primary font-bold">✓</span>
      <p className="text-sm lg:text-base font-semibold text-foreground">
        Filter Candidates According to Skills & Experience
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-primary font-bold">✓</span>
      <p className="text-sm lg:text-base font-semibold text-foreground">
        Shortlist Candidates in Minutes, Not Days
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-primary font-bold">✓</span>
      <p className="text-sm lg:text-base font-semibold text-foreground">
        Hire Faster & Smarter
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-primary font-bold">✓</span>
      <p className="text-sm lg:text-base font-semibold text-foreground">
        Save More Time & Money
      </p>
    </div>

  </div>

  <div className="mt-5 pt-4 border-t border-border">
    <p className="text-base lg:text-lg font-bold uppercase tracking-wide text-primary">
      BUILT FOR COMPANIES THAT WANT RESULTS, NOT NOISE
    </p>
  </div>

</div>
</div>
</div>
    </div>
  </div>
  );
};

export default ForCompanies;