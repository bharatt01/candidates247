import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const AdminDashboardContent = () => {
  const { user, loading } = useAuth();

  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [approving, setApproving] = useState(false);

  // 🔥 NEW STATES
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    companies: 0,
    candidates: 0,
    activeSubs: 0,
  });

  const [activeTab, setActiveTab] = useState("subscriptions");
  const [search, setSearch] = useState("");

  // 🔒 EXISTING LOGIC (UNCHANGED)
  const fetchPending = async () => {
    try {
      const subsCol = collection(db, "subscriptions");
      const subsSnap = await getDocs(subsCol);

      const pending = subsSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((sub) => sub.status === "pending");

      setPendingSubscriptions(pending);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
    }
  };

  // 🔥 NEW DATA FETCH
  const fetchAdminData = async () => {
    try {
      const companySnap = await getDocs(collection(db, "companies"));
      const companyData = companySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const candidateSnap = await getDocs(collection(db, "candidates"));
      const candidateData = candidateSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const subsSnap = await getDocs(collection(db, "subscriptions"));
      const activeSubs = subsSnap.docs.filter(
        (d) => d.data().status === "active"
      ).length;

      setCompanies(companyData);
      setCandidates(candidateData);

      setStats({
        companies: companyData.length,
        candidates: candidateData.length,
        activeSubs,
      });
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPending();     // 🔒 KEEP
      fetchAdminData();   // ✅ NEW
    }
  }, [user]);

  // 🔍 FILTERS
  const filteredCompanies = companies.filter((c) =>
    (c.companyName || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredCandidates = candidates.filter((c) =>
    (c.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🔒 EXISTING LOGIC (UNCHANGED)
  const approveSubscription = async (sub) => {
    setApproving(true);
    try {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 3);

      await updateDoc(doc(db, "subscriptions", sub.id), {
        status: "active",
        resume_limit: sub.resume_limit || 0,
        expiry_date: Timestamp.fromDate(expiry),
      });

      fetchPending();
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setApproving(false);
    }
  };

  const rejectSubscription = async (sub) => {
    try {
      await updateDoc(doc(db, "subscriptions", sub.id), {
        status: "rejected",
      });
      fetchPending();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <input
            type="text"
            placeholder="Search companies or candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted/30 border border-border outline-none focus:border-primary text-sm"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Companies</p>
            <h2 className="text-2xl font-bold">{stats.companies}</h2>
          </div>

          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Candidates</p>
            <h2 className="text-2xl font-bold">{stats.candidates}</h2>
          </div>

          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Active Subs</p>
            <h2 className="text-2xl font-bold">{stats.activeSubs}</h2>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl w-fit">
          {["subscriptions", "companies", "candidates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= SUBSCRIPTIONS ================= */}
        {activeTab === "subscriptions" && (
          <>
            {pendingSubscriptions.length === 0 ? (
              <p>No pending subscriptions.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pendingSubscriptions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 space-y-3"
                  >
                    <h3 className="text-lg font-semibold">{sub.plan}</h3>

                    <p className="text-xs text-muted-foreground">
                      ID: {sub.id}
                    </p>

                    <p className="text-sm">
                      Resumes: {sub.resume_limit || 0}
                    </p>

                    <p className="text-xs text-yellow-500 flex items-center gap-1">
                      <Clock size={12} /> Pending
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => approveSubscription(sub)}
                        disabled={approving}
                        className="flex-1 py-2 rounded-lg bg-green-600 text-white flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>

                      <button
                        onClick={() => rejectSubscription(sub)}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ================= COMPANIES ================= */}
        {activeTab === "companies" && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCompanies.map((c) => (
              <div key={c.id} className="glass-card p-5 space-y-2">
                <h3 className="font-semibold text-lg">
                  {c.companyName || "No Name"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {c.email || "No Email"}
                </p>

                <p className="text-xs">
                  Subscription:{" "}
                  <span className="text-green-500">
                    {c.subscriptionStatus || "None"}
                  </span>
                </p>

                <p className="text-xs text-muted-foreground">
                  ID: {c.id}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= CANDIDATES ================= */}
        {activeTab === "candidates" && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCandidates.map((c) => (
              <div key={c.id} className="glass-card p-5 space-y-2">
                <h3 className="font-semibold">{c.fullName}</h3>

                <p className="text-sm text-muted-foreground">
                  {c.email}
                </p>

                <p className="text-xs text-muted-foreground">
                  Phone: {c.phone || "N/A"}
                </p>

                <p className="text-xs text-muted-foreground">
                  ID: {c.id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardContent;