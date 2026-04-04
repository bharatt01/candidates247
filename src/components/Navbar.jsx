import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    if (!loading) {
      setNavItems(
        user
          ? [
              { label: "Home", path: "/" },
              {
                label: "Dashboard",
                path: userRole === "company" ? "/dashboard/company" : "/dashboard/candidate",
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
            ]
      );
    }
  }, [user, userRole, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 relative flex items-center">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="/Images/logo.png"
              alt="Candidates247 Logo"
              className="h-12 w-auto object-contain scale-[2.7] origin-left -translate-x-10"
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="flex-1 flex items-center justify-center gap-4 hidden md:flex">
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

        {/* RIGHT SIDE */}
        <div className="flex-shrink-0 flex items-center">
          {/* DESKTOP LOGOUT */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-muted/40 border border-border"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
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
              onClick={async () => {
                await logout();
                setMenuOpen(false);
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all"
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