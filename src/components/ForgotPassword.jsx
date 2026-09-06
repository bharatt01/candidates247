import { useState } from "react";
import { motion } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      let message = "Something went wrong";

      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-8"
      >
        {!sent ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email and we’ll send you a reset link.
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 focus:ring-1 focus:ring-primary outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Back to Login
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We’ve sent a password reset link to{" "}
              <span className="font-semibold">{email}</span>
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
            >
              Go to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;