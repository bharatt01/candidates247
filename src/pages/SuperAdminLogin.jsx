import { useState } from "react";
import { useNavigate } from "react-router-dom";
 import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const SUPERADMIN_EMAIL = "superadmin@example.com";
// const SUPERADMIN_PASSWORD = "YourSecurePassword123";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(), // 🔥 FIX
      password
    );

    if (res.user.email === SUPERADMIN_EMAIL) {
      localStorage.setItem("isSuperAdmin", "true");
      navigate("/superadmin/dashboard");
    } else {
      setError("Not authorized as superadmin");
    }

  } catch (err) {
    console.error(err); // 🔥 VERY IMPORTANT
    setError(err.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Superadmin Login</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;