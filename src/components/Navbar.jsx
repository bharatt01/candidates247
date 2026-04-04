import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, userRole, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = user
    ? [
        { label: "Home", path: "/" },
        {
          label: "Dashboard",
          path:
            userRole === "company"
              ? "/dashboard/company"
              : "/dashboard/candidate",
        },
        { label: "About Us", path: "/about" },
        { label: "Browse Candidates", path: "/browse-candidates" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Browse Candidates", path: "/browse-candidates" },
        { label: "About Us", path: "/about" },
        { label: "For Candidates", path: "/for-candidates" },
        { label: "For Companies", path: "/for-companies" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/Images/logo.png"
            alt="Candidates247 Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* DESKTOP LOGOUT */}
          {user && (
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 border border-border hover:text-foreground transition"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-muted/40 border border-border"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 🔥 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-6 py-4 space-y-3">

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* MOBILE LOGOUT */}
          {user && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;