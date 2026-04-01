import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SUPERADMIN_EMAIL = "superadmin@example.com";
const SUPERADMIN_PASSWORD = "YourSecurePassword123";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
      localStorage.setItem("isSuperAdmin", "true"); // simple auth flag
      navigate("/superadmin/dashboard");
    } else {
      setError("Invalid email or password");
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