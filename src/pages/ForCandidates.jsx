import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
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
   <div className="flex items-center justify-center px-6 py-6">
      <div className="mesh-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
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
          <div className="flex bg-muted/40 p-1 rounded-xl mt-4">
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

          {/* LOGIN */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
            <form onSubmit={handleSignup} className="space-y-4">
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
  {/* your existing motion div (form) stays SAME */}

   {/* ================= RIGHT SIDE ================= */}
<div className="flex flex-col justify-start px-6 lg:px-10 py-2 lg:py-1 relative">

  {/* 🔥 IMAGE (POLYGON) */}
  <div className="relative w-full h-[140px] lg:h-[150px] mb-2">

    <div
      className="relative w-full h-full overflow-hidden"
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
      <img
        src="/Images/forcompanies.jpg"
        alt="Hiring"
        className="w-full h-full object-cover"
      />

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-primary/20" />
      <div className="absolute inset-0 bg-black/30" />
    </div>

    {/* border */}
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

    {/* tags */}
    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white">
      ⚡ Smart Hiring
    </div>

    <div className="absolute bottom-2 right-2 bg-primary text-white px-2 py-1 rounded text-[10px] shadow">
      🚀 1000+
    </div>
  </div>

  {/* 🔥 TEXT (THIS WAS NEVER REMOVED) */}
  <div className="max-w-md -mt-1">

    <h2 className="text-3xl lg:text-5xl font-bold leading-[1.05]">
      <span className="block text-foreground">STOP APPLYING.</span>
      <span className="block text-primary">START GETTING SELECTED.</span>
    </h2>

    <div className="mt-3 space-y-2">

      <p className="text-base lg:text-lg font-semibold text-foreground">
      NO MORE 100 JOB APPLICATIONS

      </p>

      <p className="text-base lg:text-lg font-semibold text-foreground">
        NO MORE GETTING IGNORED
      </p>

      <p className="text-base lg:text-lg font-semibold text-foreground">
        
NO MORE RESUME BLACK HOLE
      </p>

      <p className="text-base lg:text-lg font-semibold text-primary">
   YOUR PROFILE = YOUR BRAND
      </p>

    </div>

    <div className="mt-3 text-base lg:text-lg font-bold text-foreground">
    THIS IS NOT A JOB PORTAL.
THIS IS WHERE YOU GET DISCOVERED.
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