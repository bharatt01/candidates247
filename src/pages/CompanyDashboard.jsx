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

  // Normalize purchased candidates to ensure correct fields
  const normalizedCandidates = purchasedCandidates.map((c) => ({
    id: c.id,
    candidateId: c.candidateId || c.id,
    name: c.fullName || c.name || "Candidate",
    role: c.roleTitle || c.role || "Role not set",
    location: c.location || "Unknown",
    experience: c.experience || 0,
    skills: Array.isArray(c.skills) ? c.skills : [],
    phone: c.phone || "N/A",
    email: c.email || "N/A",
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* 🔥 SIDEBAR */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-background/60 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-8">
          Candidates247
        </h2>

        <nav className="space-y-2">
          <Link className="block px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            Dashboard
          </Link>
          <Link
            to="/browse-candidates"
            className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm"
          >
            Browse Candidates
          </Link>
          <Link
            to="/subscription"
            className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm"
          >
            Subscription
          </Link>
        </nav>

        <div className="mt-auto text-xs text-muted-foreground">
          © 2026 Candidates247
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1 relative">
        <div className="mesh-gradient" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-8">
          {/* 🔥 HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {companyData?.company_name || "Company"} 👋
              </p>
            </div>

            <Link
              to="/browse-candidates"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:scale-[1.05] transition"
            >
              Browse Talent
            </Link>
          </div>

          {/* 🔥 STATS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-1">Unlocked</p>
              <h3 className="text-2xl font-bold">{normalizedCandidates.length}</h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <h3 className="text-2xl font-bold">{remainingQuota}</h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-1">Plan</p>
              <h3 className="text-lg font-semibold">
                {subscription?.plan || "Free"}
              </h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  hasActiveSubscription
                    ? "bg-green-500/20 text-green-600"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {hasActiveSubscription ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* 🔥 SUBSCRIPTION PROGRESS */}
          <div className="glass-card p-6 mb-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Usage Overview</h3>
              <Crown size={16} className="text-primary" />
            </div>

            {hasActiveSubscription && subscription ? (
              <>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{subscription.plan}</span>
                  <span>
                    {subscription.resumes_used}/{subscription.resume_limit}
                  </span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${
                        (subscription.resumes_used / subscription.resume_limit) * 100
                      }%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center mt-3">
                <p className="text-sm text-muted-foreground mb-3">
                  No active plan
                </p>
                <Link
                  to="/subscription"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                >
                  Upgrade Now
                </Link>
              </div>
            )}

            {/* 🔥 CANDIDATES */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold">Unlocked Candidates</h2>
                <span className="text-xs text-muted-foreground">
                  {normalizedCandidates.length} total
                </span>
              </div>

              {normalizedCandidates.length === 0 ? (
                <div className="glass-card p-10 text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    No candidates unlocked yet 🚀
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Start exploring talent and unlock profiles
                  </p>
                  <Link
                    to="/browse-candidates"
                    className="px-5 py-2 bg-primary text-white rounded-lg text-sm"
                  >
                    Browse Candidates
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...new Map(normalizedCandidates.map(c => [c.id, c])).values()].map((c) => (
                    <Link
                      key={c.id}
                      to={`/candidate/${c.candidateId}`}
                      className="glass-card p-5 hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                      {/* NAME */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {c.name}
                        </h3>
                        <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
                          Unlocked
                        </span>
                      </div>

                      {/* INFO */}
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Briefcase size={12} /> {c.role}
                      </p>

                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin size={12} /> {c.location} • {c.experience} yrs
                      </p>

                      {/* SKILLS */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {c.skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="glow-tag text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* CONTACT */}
                      <div className="mt-4 border-t border-border pt-3 text-xs space-y-1">
                        <p className="flex items-center gap-2">
                          <Phone size={12} /> {c.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail size={12} /> {c.email}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;