import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Crown,
  Zap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import usePurchases from "../hooks/usePurchases";
import useSubscription from "../hooks/useSubscription";
import { db } from "@/firebase"; // Fixed import
import { doc, getDoc, setDoc } from "firebase/firestore";

const CompanyDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);

  const { purchasedCandidates, refreshPurchases } = usePurchases();
  const {
    subscription,
    hasActiveSubscription,
    remainingQuota,
    loading: subLoading,
    refreshSubscription,
  } = useSubscription();

  // Fetch company data from Firestore
  useEffect(() => {
    if (!loading && !user) {
      navigate("/for-companies");
      return;
    }

    if (user) {
      
    const fetchCompanyData = async () => {
        if (!user?.uid) {
          console.warn("No user uid - skipping company data fetch");
          return;
        }
        try {
          const docRef = doc(db, "companies", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCompanyData(docSnap.data());
          } else {
            // Create placeholder for new users to prevent permission-denied
            const placeholder = {
              userId: user.uid,
              company_name: "",
              industry: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(docRef, placeholder);
            setCompanyData(placeholder);
          }
        } catch (err) {
          console.error("Firestore read/create error:", err);
        }
      };
      fetchCompanyData();
    }
  }, [user, loading, navigate]);

  if (loading || subLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {companyData?.company_name || "Company"}
            </h1>
            <p className="text-sm text-muted-foreground">Your company dashboard</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-all btn-haptic"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscription card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crown size={16} className="text-primary" /> Subscription
            </h2>

            {hasActiveSubscription && subscription ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="text-sm text-foreground font-medium">
                    {subscription.plan_name} — ₹{subscription.amount_rupees}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Resumes Used</p>
                  <p className="text-sm text-foreground font-medium">
                    {subscription.resumes_used} / {subscription.resume_limit}
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${
                        (subscription.resumes_used / subscription.resume_limit) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {remainingQuota} resumes remaining
                </p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground mb-3">No active subscription</p>
                <Link
                  to="/subscription"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic inline-flex items-center gap-1.5"
                >
                  <Zap size={14} /> Subscribe Now
                </Link>
              </div>
            )}
          </motion.div>

          {/* Browse candidates card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center"
          >
            <Search size={28} className="text-primary mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Browse Candidates</h3>
            <p className="text-xs text-muted-foreground mb-4">Search and unlock elite talent</p>
            <Link
              to="/candidates"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
            >
              Start Browsing
            </Link>
          </motion.div>

          {/* Unlocked profiles card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center"
          >
            <Users size={28} className="text-secondary mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Unlocked Profiles</h3>
            <p className="text-2xl font-bold text-foreground">{purchasedCandidates.length}</p>
            <p className="text-[11px] text-muted-foreground">candidates unlocked</p>
          </motion.div>
        </div>

        {/* Unlocked candidates list */}
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
              {purchasedCandidates.map((c) => {
                const canUnlock = hasActiveSubscription && remainingQuota > 0;

                return (
                  <div key={c.id} className="glass-card p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Briefcase size={12} className="text-primary" /> {c.role}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin size={11} /> {c.location} · {c.experience} yrs
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(c.skills || []).map((s) => (
                        <span className="glow-tag text-[11px]" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/15 space-y-1.5">
                      {canUnlock ? (
                        <button
                          onClick={async () => {
                            await refreshPurchases(c.id); // unlock logic in hook
                            await refreshSubscription();
                          }}
                          className="py-2 px-3 w-full bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                        >
                          Unlock Profile ({remainingQuota} left)
                        </button>
                      ) : (
                        <p className="text-muted-foreground flex items-center gap-2">
                          {hasActiveSubscription ? "No unlocks remaining" : "Subscribe to view"}
                        </p>
                      )}

                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Phone size={12} className="text-muted-foreground" />{" "}
                        {c.phone || "Not provided"}
                      </p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Mail size={12} className="text-muted-foreground" />{" "}
                        {c.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;