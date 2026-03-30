import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Search, LogOut, Phone, Mail, MapPin, Briefcase } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import usePurchases from "@/hooks/usePurchases";

const CompanyDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const { purchasedCandidates } = usePurchases();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/for-companies");
      return;
    }

    if (user) {
      // Fetch user profile
      getDoc(doc(db, "users", user.id)).then((docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      });

      // Fetch company data
      getDoc(doc(db, "companies", user.id)).then((docSnap) => {
        if (docSnap.exists()) {
          setCompanyData(docSnap.data());
        }
      });
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
   

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {companyData?.company_name || "Company"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Your company dashboard
            </p>
          </div>

          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-all btn-haptic"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Company
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm text-foreground font-medium">
                  {companyData?.company_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Industry</p>
                <p className="text-sm text-foreground font-medium">
                  {companyData?.industry || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Account Email</p>
                <p className="text-sm text-foreground font-medium">
                  {profile?.email || "—"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Browse Candidates CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center"
          >
            <Search size={28} className="text-primary mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Browse Candidates
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Search and unlock elite talent
            </p>

            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
            >
              Start Browsing
            </Link>
          </motion.div>

          {/* Unlocked Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center"
          >
            <Users size={28} className="text-secondary mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Unlocked Profiles
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {purchasedCandidates.length}
            </p>
            <p className="text-[11px] text-muted-foreground">
              candidates unlocked
            </p>
          </motion.div>
        </div>

        {/* Purchased Candidates List */}
        {purchasedCandidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Unlocked Candidates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedCandidates.map((c) => (
                <div key={c.id} className="glass-card p-5 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {c.name}
                    </h3>

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Briefcase size={12} className="text-primary" />
                      {c.role}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin size={11} />
                      {c.location} · {c.experience} yrs
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(c.skills || []).map((s) => (
                      <span key={s} className="glow-tag text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/15 space-y-1.5">
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Phone size={12} className="text-muted-foreground" />
                      {c.phone || "Not provided"}
                    </p>

                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Mail size={12} className="text-muted-foreground" />
                      {c.email || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;