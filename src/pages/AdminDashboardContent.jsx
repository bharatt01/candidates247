import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const AdminDashboardContent = () => {
  const { user, loading } = useAuth();
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [approving, setApproving] = useState(false);

  // 🔥 Load all pending subscription requests
  const fetchPending = async () => {
    try {
        
      const subsCol = collection(db, "subscriptions");
      const subsSnap = await getDocs(subsCol);
 console.log(subsSnap.docs.map(d => d.data()));
      // Map docs to objects & filter pending
      const pending = subsSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((sub) => sub.status === "pending");

      setPendingSubscriptions(pending);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
    }
  };

useEffect(() => {
  console.log("USER:", user);
  console.log("LOADING:", loading);

  if (user) {
    fetchPending();
  }
}, [user]);

  // 🔥 Approve subscription
  const approveSubscription = async (sub) => {
    setApproving(true);
    try {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 3); // 3 months

      await updateDoc(doc(db, "subscriptions", sub.id), {
        status: "active",
        resume_limit: sub.resume_limit || 0, // safe fallback
        expiry_date: Timestamp.fromDate(expiry),
      });

      fetchPending(); // refresh list
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setApproving(false);
    }
  };

  // 🔥 Reject subscription
  const rejectSubscription = async (sub) => {
    try {
      await updateDoc(doc(db, "subscriptions", sub.id), {
        status: "rejected",
      });
      fetchPending(); // refresh list
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background relative">

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
                <p className="text-sm text-muted-foreground">
                  Company UID: {sub.id} {/* You can replace with email if you store it */}
                </p>
                <p className="text-sm text-muted-foreground">
                  Resumes Allowed: {sub.resume_limit || 0}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> Pending verification
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approveSubscription(sub)}
                    disabled={approving}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>

                  <button
                    onClick={() => rejectSubscription(sub)}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors btn-haptic flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardContent;