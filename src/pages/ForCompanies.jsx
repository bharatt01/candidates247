import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const ForCompanies = () => {
  const { user, userRole, signUp, signIn } = useAuth(); // ✅ FIXED
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ FIXED REDIRECT (use userRole)
  useEffect(() => {
    if (userRole === "company") {
      navigate("/dashboard/company");
    }
  }, [userRole, navigate]);

  // ✅ SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const cred = await signUp(email, password, {
        fullName: companyName,
        role: "company"
      });

      const uid = cred.user.uid;

      // ✅ VERY IMPORTANT (fix permission issue)
      await cred.user.getIdToken();

      // ✅ Save company profile
      await setDoc(doc(db, "companies", uid), {
        userId: uid,
        companyName,
        industry,
        role: "company",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success("Company account created successfully!");
      navigate("/dashboard/company");

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard/company");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

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

          {/* LOGIN */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            /* SIGNUP */
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              </div>

              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Building2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className={`${inputClass} pl-9`}
                    />
                  </div>

                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry"
                    className={inputClass}
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg font-semibold bg-primary text-white disabled:opacity-50"
              >
                {submitting ? "Creating account..." : "Create Company Account"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForCompanies;