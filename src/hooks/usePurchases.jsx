import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const usePurchases = () => {
  const { user } = useAuth();

  const [purchasedCandidates, setPurchasedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "purchases"),
      where("companyId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPurchasedCandidates(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Helper: check if already unlocked
  const isPurchased = (candidateId) => {
    return purchasedCandidates.some(
      (item) => item.candidateId === candidateId
    );
  };

  return {
    purchasedCandidates,
    loading,
    isPurchased,
  };
};

export default usePurchases;