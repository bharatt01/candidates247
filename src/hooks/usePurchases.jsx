import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
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

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const purchases = snapshot.docs.map((doc) => doc.data());

      // 🔥 Fetch candidate details
      const candidatesData = await Promise.all(
        purchases.map(async (p) => {
          const ref = doc(db, "candidates", p.candidateId);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            return {
              id: snap.id,
              ...snap.data(),
            };
          }
          return null;
        })
      );

      setPurchasedCandidates(candidatesData.filter(Boolean));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { purchasedCandidates, loading };
};

export default usePurchases;