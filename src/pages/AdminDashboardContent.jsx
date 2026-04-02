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
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [approving, setApproving] = useState(false);
  const [revenue, setRevenue] = useState(0);

  const [stats, setStats] = useState({
    companies: 0,
    candidates: 0,
    activeSubs: 0,
  });

  const [activeTab, setActiveTab] = useState("subscriptions");
  const [search, setSearch] = useState("");

  // 🔥 MAIN DATA FETCH
  const fetchAdminData = async () => {
    try {
      const subsSnap = await getDocs(collection(db, "subscriptions"));

      const allSubs = subsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const active = allSubs.filter((s) => s.status === "active");
      const pending = allSubs.filter((s) => s.status === "pending");

      // 💰 Revenue
      const totalRevenue = active.reduce(
        (sum, sub) => sum + (sub.amount_rupees || 0),
        0
      );

      setActiveSubscriptions(active);
      setPendingSubscriptions(pending);
      setRevenue(totalRevenue);

      // 👨‍💻 Candidates
      const candidateSnap = await getDocs(collection(db, "candidates"));
      const candidateData = candidateSnap.docs.map((doc) => doc.data());

      setCandidates(candidateData);

      setStats({
        companies: active.length,
        candidates: candidateData.length,
        activeSubs: active.length,
      });
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchAdminData();
    }
  }, [loading]);

  // 🔒 APPROVE (UNCHANGED LOGIC)
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

      fetchAdminData();
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setApproving(false);
    }
  };

  // 🔒 REJECT (UNCHANGED)
  const rejectSubscription = async (sub) => {
    try {
      await updateDoc(doc(db, "subscriptions", sub.id), {
        status: "rejected",
      });
      fetchAdminData();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted/30 border border-border outline-none text-sm"
          />
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <h2 className="text-xl font-bold">₹{revenue}</h2>
          </div>

          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Active Companies</p>
            <h2 className="text-xl font-bold">{stats.activeSubs}</h2>
          </div>

          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <h2 className="text-xl font-bold">{pendingSubscriptions.length}</h2>
          </div>

          <div className="glass-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Candidates</p>
            <h2 className="text-xl font-bold">{stats.candidates}</h2>
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

        {/* 🔥 PENDING */}
        {activeTab === "subscriptions" && (
          <div className="grid md:grid-cols-2 gap-6">
            {pendingSubscriptions.map((sub) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 space-y-3"
              >
                <h3 className="text-lg font-semibold">
                  {sub.company_name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {sub.company_email}
                </p>

                <p className="text-sm">Plan: {sub.plan}</p>

                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <Clock size={12} /> Pending
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approveSubscription(sub)}
                    disabled={approving}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectSubscription(sub)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 🔥 ACTIVE COMPANIES */}
        {activeTab === "companies" && (
          <div className="grid md:grid-cols-2 gap-5">
            {activeSubscriptions.map((sub) => {
              const remaining =
                (sub.resume_limit || 0) - (sub.resumes_used || 0);

              const expired =
                sub.expiry_date?.toDate() < new Date();

              return (
                <div key={sub.id} className="glass-card p-5 space-y-3">
                  <h3 className="text-lg font-semibold">
                    {sub.company_name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {sub.company_email}
                  </p>

                  <p className="text-sm">Plan: {sub.plan}</p>

                  {/* Progress */}
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          ((sub.resumes_used || 0) /
                            (sub.resume_limit || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>
                      {sub.resumes_used} / {sub.resume_limit}
                    </span>
                    <span className="text-blue-500">
                      Remaining: {remaining}
                    </span>
                  </div>

                  <p
                    className={`text-xs ${
                      expired ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {expired
                      ? "Expired"
                      : `Valid till: ${sub.expiry_date
                          ?.toDate()
                          .toLocaleDateString()}`}
                  </p>

                  {remaining <= 5 && remaining > 0 && (
                    <p className="text-xs text-yellow-500">
                      ⚠️ Low credits
                    </p>
                  )}

                  {remaining <= 0 && (
                    <p className="text-xs text-red-500 font-semibold">
                      🚫 Limit reached
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 🔥 CANDIDATES */}
        {activeTab === "candidates" && (
          <div className="grid md:grid-cols-2 gap-4">
            {candidates.map((c, i) => (
              <div key={i} className="glass-card p-5">
                <h3 className="font-semibold">{c.fullName}</h3>
                <p className="text-sm text-muted-foreground">{c.email}</p>
                <p className="text-xs text-muted-foreground">
                  {c.phone || "No phone"}
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