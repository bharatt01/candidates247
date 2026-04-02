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
 <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
  <div className="max-w-7xl mx-auto space-y-8">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-72 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-5 rounded-xl shadow-lg flex flex-col items-center">
        <p className="text-sm opacity-80">Revenue</p>
        <h2 className="text-2xl font-bold mt-1">₹{revenue}</h2>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-teal-500 p-5 rounded-xl shadow-lg flex flex-col items-center">
        <p className="text-sm opacity-80">Active Companies</p>
        <h2 className="text-2xl font-bold mt-1">{stats.activeSubs}</h2>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-5 rounded-xl shadow-lg flex flex-col items-center">
        <p className="text-sm opacity-80">Pending Requests</p>
        <h2 className="text-2xl font-bold mt-1">{pendingSubscriptions.length}</h2>
      </div>
      <div className="bg-gradient-to-br from-pink-500 to-red-500 p-5 rounded-xl shadow-lg flex flex-col items-center">
        <p className="text-sm opacity-80">Candidates</p>
        <h2 className="text-2xl font-bold mt-1">{stats.candidates}</h2>
      </div>
    </div>

    {/* TABS */}
    <div className="flex gap-4 border-b border-gray-600 text-sm">
      {["subscriptions", "companies", "candidates"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 px-4 capitalize transition ${
            activeTab === tab
              ? "border-b-2 border-purple-500 text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* PENDING SUBSCRIPTIONS */}
    {activeTab === "subscriptions" && (
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {pendingSubscriptions.map((sub) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{sub.company_name}</h3>
                <p className="text-gray-400 text-sm mt-1">{sub.company_email}</p>
              </div>
              <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                Pending
              </span>
            </div>

            <div className="mt-4 space-y-1 text-gray-300 text-sm">
              <p>Plan: <span className="font-medium">{sub.plan}</span></p>
              <p>Amount: ₹{sub.amount_rupees}</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => approveSubscription(sub)}
                disabled={approving}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => rejectSubscription(sub)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}

    {/* ACTIVE COMPANIES */}
    {activeTab === "companies" && (
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {activeSubscriptions.map((sub) => {
          const remaining = (sub.resume_limit || 0) - (sub.resumes_used || 0);
          const expired = sub.expiry_date?.toDate() < new Date();
          const usagePercent = ((sub.resumes_used || 0) / (sub.resume_limit || 1)) * 100;

          return (
            <div
              key={sub.id}
              className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{sub.company_name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{sub.company_email}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    expired ? "bg-red-600 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {expired ? "Expired" : "Active"}
                </span>
              </div>

              <p className="text-gray-300 text-sm mt-3">Plan: <span className="font-medium">{sub.plan}</span></p>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${usagePercent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{sub.resumes_used} used</span>
                  <span>{remaining} remaining</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>Valid till: {sub.expiry_date?.toDate().toLocaleDateString()}</span>
                {remaining <= 0 ? <span className="text-red-500 font-medium">Limit reached</span> :
                  remaining <= 5 ? <span className="text-yellow-400">Low credits</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* CANDIDATES */}
    {activeTab === "candidates" && (
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {candidates.map((c, i) => (
          <div key={i} className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="font-medium text-white">{c.fullName}</h3>
            <p className="text-gray-400 text-sm mt-1">{c.email}</p>
            <p className="text-gray-500 text-xs mt-1">{c.phone || "No phone"}</p>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
};

export default AdminDashboardContent;