import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const useSubscription = () => {
  const { user } = useAuth();

  const [subscription, setSubscription] = useState(null);
  const [status, setStatus] = useState("none");
  const [remainingQuota, setRemainingQuota] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const subRef = doc(db, "subscriptions", user.uid);

    const unsubscribe = onSnapshot(
      subRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSubscription(data);

          // 🔥 Expiry check
          let currentStatus = data.status;

          if (
            data.expiry_date?.toDate &&
            data.expiry_date.toDate() < new Date()
          ) {
            currentStatus = "expired";
          }

          setStatus(currentStatus);

          // 🔥 Remaining quota (safe)
          const remaining = Math.max(
            (data.resume_limit || 0) - (data.resumes_used || 0),
            0
          );

          setRemainingQuota(remaining);
        } else {
          setSubscription(null);
          setStatus("none");
          setRemainingQuota(0);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Subscription snapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ✅ Request subscription (FIXED)
  const requestSubscription = async (plan) => {
    if (!user?.uid) return;

    // 🔥 CENTRALIZED PLAN CONFIG (matches your UI)
    const plans = {
      starter: { limit: 50, price: 599 },
      pro: { limit: 100, price: 699 },
    };

    const selected = plans[plan];

    // ❌ Prevent undefined error
    if (!selected) {
      throw new Error("Invalid plan selected");
    }

  await setDoc(doc(db, "subscriptions", user.uid), {
  plan,
  status: "pending",
  resume_limit: selected.limit,
  resumes_used: 0,
  amount_rupees: selected.price,

  company_user_id: user.uid,
  company_email: user.email || "",
  company_name: user.displayName || "Unknown Company",

  created_at: serverTimestamp(),
  updated_at: serverTimestamp(),
});
  };

  // ✅ Unlock candidate
  const unlockCandidate = async (candidateId) => {
    if (!user?.uid || !subscription) return;

    if (status !== "active") {
      alert("Subscription not active");
      return;
    }

    if (remainingQuota <= 0) {
      alert("No unlocks remaining");
      return;
    }

    try {
      // 1. Save purchase
      await addDoc(collection(db, "purchases"), {
        companyId: user.uid,
        candidateId,
        createdAt: serverTimestamp(),
      });

      // 2. Increment usage
      await updateDoc(doc(db, "subscriptions", user.uid), {
        resumes_used: increment(1),
      });
    } catch (error) {
      console.error("Unlock failed:", error);
    }
  };

  // ✅ Helper flags
  const hasActiveSubscription = status === "active";
  const isPending = status === "pending";
  const isExpired = status === "expired";

  const canUnlock =
    hasActiveSubscription &&
    remainingQuota > 0 &&
    (!subscription?.expiry_date?.toDate ||
      subscription.expiry_date.toDate() > new Date());

  return {
    subscription,
    status,
    remainingQuota,
    loading,

    // flags
    hasActiveSubscription,
    isPending,
    isExpired,
    canUnlock,

    // actions
    requestSubscription,
    unlockCandidate,
  };
};

export default useSubscription;