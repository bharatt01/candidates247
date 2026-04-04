import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, userRole, logout } = useAuth();

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
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-3 items-center">

        {/* LEFT: Logo */}
       <div className="flex items-center">
  <Link to="/" className="flex items-center">
    <img
      src="/Images/logo.png"
      alt="Candidates247 Logo"
      className="h-12 w-auto object-contain scale-[2.7] origin-left -translate-x-16"
    />
  </Link>
</div>

        {/* CENTER: Nav Items */}
        <nav className="hidden md:flex items-center justify-center gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
             className={`px-3 py-1.5 rounded-md text-m font-medium whitespace-nowrap transition-colors ${
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

        {/* RIGHT: Sign Out (or empty space) */}
        <div className="flex justify-end">
          {user && (
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;