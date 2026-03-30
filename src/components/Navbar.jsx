import { Link, useLocation } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, userRole, logout } = useAuth();

  const navItems = user
    ? [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: userRole === "company" ? "/dashboard/company" : "/dashboard/candidate" },
        { label: "About Us", path: "/about" },
      ]
    : [
        { label: "Homeee", path: "/" },
        { label: "For Candidates", path: "/for-candidates" },
        { label: "For Companies", path: "/for-companies" },
        { label: "About Us", path: "/about" },
      ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <span className="text-base font-bold glow-text">Prestige</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground bg-muted/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user ? (
          <button
           onClick={logout}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-all btn-haptic"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        ) : (
          <Link
            to="/for-candidates"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;