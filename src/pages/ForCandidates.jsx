import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";


// ✅ Format Name (Proper Case + remove extra spaces)
const formatName = (name) => {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
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
                onChange={(e) => setFullName(formatName(e.target.value))}
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
  );
};

export default ForCandidates;