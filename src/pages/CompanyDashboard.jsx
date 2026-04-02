import React, { useEffect, useState } from "react";
import { Users, Search, Phone, Mail, MapPin, Briefcase, Crown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import usePurchases from "../hooks/usePurchases";
import useSubscription from "../hooks/useSubscription";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CompanyDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);

  const { purchasedCandidates } = usePurchases();
  const {
    subscription,
    hasActiveSubscription,
    remainingQuota,
    loading: subLoading,
  } = useSubscription();

  // Fetch company data
  useEffect(() => {
    if (!loading && !user) {
      navigate("/for-companies");
      return;
    }

    if (user?.uid) {
      const fetchCompanyData = async () => {
        try {
          const docRef = doc(db, "companies", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCompanyData(docSnap.data());
          } else {
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
          console.error("Firestore error:", err);
        }
      };

      fetchCompanyData();
    }
  }, [user, loading, navigate]);

  if (loading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {companyData?.company_name || "Company Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your hiring and unlock top candidates
            </p>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* SUBSCRIPTION */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="text-primary" size={18} />
              <h2 className="text-sm font-semibold text-foreground">
                Subscription
              </h2>
            </div>

            {hasActiveSubscription && subscription ? (
              <>
                <p className="text-lg font-semibold text-foreground">
                  {subscription.plan}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹{subscription.amount_rupees}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Usage</span>
                    <span>
                      {subscription.resumes_used}/{subscription.resume_limit}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          (subscription.resumes_used /
                            subscription.resume_limit) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {remainingQuota} unlocks remaining
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No active subscription
                </p>
                <Link
                  to="/subscription"
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg"
                >
                  Upgrade Plan
                </Link>
              </div>
            )}
          </div>

          {/* BROWSE */}
          <div className="glass-card p-6 text-center">
            <Search size={26} className="text-primary mb-3 mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">
              Browse Candidates
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Explore talent pool instantly
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg"
            >
              Start Browsing
            </Link>
          </div>

          {/* STATS */}
          <div className="glass-card p-6 text-center">
            <Users size={26} className="text-secondary mb-3 mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">
              Unlocked Profiles
            </h3>
            <p className="text-3xl font-bold text-foreground mt-1">
              {purchasedCandidates.length}
            </p>
            <p className="text-xs text-muted-foreground">
              candidates unlocked
            </p>
          </div>
        </div>

        {/* CANDIDATES */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Unlocked Candidates
          </h2>

          {purchasedCandidates.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You haven't unlocked any candidates yet
              </p>
              <Link
                to="/"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Browse Candidates
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
             {[...new Map(purchasedCandidates.map(c => [c.id, c])).values()].map((c) => (
                <Link
                  key={c.id}
                  to={`/candidate/${c.id}`}
                  className="glass-card p-5 flex flex-col justify-between hover:scale-[1.02] transition-all"
                >
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {c.name || "Candidate"}
                    </h3>

                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p className="flex items-center gap-2">
                        <Briefcase size={12} /> {c.role || "Not specified"}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={12} /> {c.location || "Unknown"} ·{" "}
                        {c.experience || 0} yrs
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(c.skills || []).map((s, i) => (
                        <span key={i} className="glow-tag text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    <p className="flex items-center gap-2 text-sm">
                      <Phone size={12} /> {c.phone || "Not provided"}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail size={12} /> {c.email || "Not provided"}
                    </p>

                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full mt-2 inline-block">
                      Unlocked
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;