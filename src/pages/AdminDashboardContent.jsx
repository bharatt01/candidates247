import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

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

  // 🔥 FETCH DATA
  const fetchAdminData = async () => {
    try {
      // SUBSCRIPTIONS
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

      // 👨‍💻 CANDIDATES (FIXED ID)
      const candidateSnap = await getDocs(collection(db, "candidates"));
      const candidateData = candidateSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    if (!loading) fetchAdminData();
  }, [loading]);

  // ✅ APPROVE
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

  // ❌ REJECT
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

  // ❌ DELETE CANDIDATE
  const deleteCandidate = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "candidates", id));
      fetchAdminData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // 🚫 BLOCK / UNBLOCK
  const toggleBlockCandidate = async (candidate) => {
    try {
      await updateDoc(doc(db, "candidates", candidate.id), {
        blocked: !candidate.blocked,
      });
      fetchAdminData();
    } catch (err) {
      console.error("Block failed:", err);
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
            className="w-full md:w-72 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-purple-600 p-5 rounded-xl text-center">
            <p>Revenue</p>
            <h2 className="text-2xl font-bold">₹{revenue}</h2>
          </div>
          <div className="bg-green-500 p-5 rounded-xl text-center">
            <p>Active Companies</p>
            <h2 className="text-2xl font-bold">{stats.activeSubs}</h2>
          </div>
          <div className="bg-yellow-500 p-5 rounded-xl text-center">
            <p>Pending</p>
            <h2>{pendingSubscriptions.length}</h2>
          </div>
          <div className="bg-red-500 p-5 rounded-xl text-center">
            <p>Candidates</p>
            <h2>{stats.candidates}</h2>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b border-gray-600">
          {["subscriptions", "companies", "candidates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-purple-500"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <div className="grid md:grid-cols-2 gap-6">
            {pendingSubscriptions.map((sub) => (
              <motion.div key={sub.id} className="bg-gray-800 p-6 rounded-xl">

                {/* ✅ FIXED COMPANY NAME */}
                <h3 className="text-lg font-semibold">
                  {sub.company_name ||
                    sub.companyName ||
                    sub.name ||
                    "Unknown Company"}
                </h3>

                <p className="text-sm text-gray-400">{sub.company_email}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approveSubscription(sub)}
                    className="flex-1 bg-green-600 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectSubscription(sub)}
                    className="flex-1 bg-red-600 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* COMPANIES */}
        {activeTab === "companies" && (
          <div className="grid md:grid-cols-2 gap-6">
            {activeSubscriptions.map((sub) => (
              <div key={sub.id} className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold">
                  {sub.company_name ||
                    sub.companyName ||
                    sub.name ||
                    "Unknown Company"}
                </h3>
                <p className="text-sm text-gray-400">{sub.company_email}</p>
              </div>
            ))}
          </div>
        )}

        {/* CANDIDATES */}
        {activeTab === "candidates" && (
          <div className="grid md:grid-cols-2 gap-4">
            {candidates.map((c) => (
              <div key={c.id} className="bg-gray-800 p-5 rounded-xl">

                <h3>{c.fullName}</h3>
                <p className="text-sm text-gray-400">{c.email}</p>
                <p className="text-xs text-gray-500">
                  {c.phone || "No phone"}
                </p>

                {/* STATUS */}
                <p
                  className={`text-xs mt-2 ${
                    c.blocked ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {c.blocked ? "Blocked" : "Active"}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleBlockCandidate(c)}
                    className={`flex-1 py-1 text-xs rounded ${
                      c.blocked
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {c.blocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => deleteCandidate(c.id)}
                    className="flex-1 py-1 text-xs bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardContent;