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
     <div className="flex items-center justify-center px-6 py-10 lg:py-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md glass-card p-6"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              For Companies
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signup"
                ? "Create your company account to discover elite talent."
                : "Sign in to your company account."}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-primary text-white"
                  : "bg-muted/40 text-muted-foreground border border-border"
              }`}
            >
              <UserPlus size={14} className="inline mr-1.5" /> Sign Up
            </button>

            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-primary text-white"
                  : "bg-muted/40 text-muted-foreground border border-border"
              }`}
            >
              <LogIn size={14} className="inline mr-1.5" /> Log In
            </button>
          </div>

          {/* ===== FORMS ===== */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
            <form onSubmit={handleSignup} className="space-y-4">
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
                className="w-full py-3 rounded-lg font-semibold bg-primary text-white disabled:opacity-50"
              >
                {submitting
                  ? "Creating account..."
                  : "Create Company Account"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>

      {/* ================= RIGHT SIDE (WHY JOIN) ================= */}
    {/* ================= RIGHT SIDE ================= */}
<div className="flex flex-col justify-start px-6 lg:px-12 py-6 lg:py-2">
  {/* 🔥 IMAGE */}


    {/* BACK GLOW */}
    <div className="absolute -inset-6 pointer-events-none bg-gradient-to-tr from-primary/30 via-purple-500/20 to-transparent blur-2xl opacity-40" />

    {/* RANDOM POLYGON */}
    <div
      className="relative w-full h-full overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      style={{
        clipPath: `
          polygon(
            3% 12%,
            18% 2%,
            42% 6%,
            68% 0%,
            92% 10%,
            100% 28%,
            96% 55%,
            100% 82%,
            78% 100%,
            52% 92%,
            28% 100%,
            8% 88%,
            0% 60%,
            6% 38%
          )
        `,
      }}
    >
      <div className="relative w-full h-[140px] lg:h-[160px] mb-6 rounded-xl overflow-hidden">

  <img
    src="/Images/forcompanies.jpg"
    alt="Hiring"
    className="w-full h-full object-cover"
  />

  {/* 🔥 COLOR BALANCE OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-primary/20" />

  {/* 🔥 DARK DEPTH OVERLAY */}
  <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>

    {/* BORDER */}
    <div
      className="absolute inset-0 border border-white/10 pointer-events-none"
      style={{
        clipPath: `
          polygon(
            3% 12%,
            18% 2%,
            42% 6%,
            68% 0%,
            92% 10%,
            100% 28%,
            96% 55%,
            100% 82%,
            78% 100%,
            52% 92%,
            28% 100%,
            8% 88%,
            0% 60%,
            6% 38%
          )
        `,
      }}
    />

    {/* TAGS */}
    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] sm:text-xs text-white">
      ⚡ Smart Hiring
    </div>

    <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-md text-[10px] sm:text-xs shadow">
      🚀 1000+ Companies
    </div>
  </div>

  {/* ================= UNIQUE TEXT ================= */}

  {/* ================= BETTER COMPANY TEXT ================= */}
<div className="mt-0 max-w-md">

  {/* HEADING */}
  <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1]">
    <span className="block text-foreground">Stop Wasting Time</span>
    <span className="block text-primary">on Hiring</span>
  </h2>

  {/* HARD-HITTING LINES */}
  <div className="mt-4 space-y-4">

    <p className="text-md lg:text-lg font-semibold text-foreground">
      100+ Relevant Candidates. Not 1000 Random Resumes.
    </p>

    <p className="text-md lg:text-lg font-semibold text-foreground">
      See Skills. Experience. Projects. All in One View.
    </p>

    <p className="text-md lg:text-lg font-semibold text-foreground">
      Shortlist in Minutes. Not Days.
    </p>

    <p className="text-md lg:text-lg font-semibold text-primary">
      Hire Faster. Spend Less.
    </p>

  </div>

  {/* FINAL TRUST LINE */}
  <div className="mt-6 text-lg font-bold text-foreground">
    Built for companies that want results — not noise.
  </div>

</div>

</div>
    </div>
  </div>
  );
};

export default ForCompanies;