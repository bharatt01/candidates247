import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const usePurchases = () => {
  const { user } = useAuth();
  const [purchasedIds, setPurchasedIds] = useState(new Set());
  const [purchasedCandidates, setPurchasedCandidates] = useState([]);

  const fetchPurchases = async () => {
    if (!user) return;

    try {
      const purchasesQuery = query(
        collection(db, "purchases"),
        where("companyUserId", "==", user.id)
      );
      const querySnapshot = await getDocs(purchasesQuery);

      const candidateIds = querySnapshot.docs.map(doc => doc.data().candidateId);
      setPurchasedIds(new Set(candidateIds));

      if (candidateIds.length === 0) {
        setPurchasedCandidates([]);
        return;
      }

      // Fetch full candidate data
      const candidatesPromises = candidateIds.map(id => getDoc(doc(db, "candidates", id)));
      const candidatesSnapshots = await Promise.all(candidatesPromises);

      const mapped = candidatesSnapshots
        .filter(snapshot => snapshot.exists())
        .map(snapshot => {
          const data = snapshot.data();
          return {
            id: snapshot.id,
            user_id: data.userId,
            name: data.fullName || "Unknown",
            email: data.email || "",
            role: data.roleTitle || "",
            location: data.location || "Not specified",
            experience: data.experience || 0,
            skills: data.skills || [],
            phone: data.phone || "",
            avatar: (data.fullName || "U")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          };
        });

      setPurchasedCandidates(mapped);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const purchaseCandidates = async (candidateIds) => {
    if (!user) return false;

    try {
      const purchasePromises = candidateIds.map(async (candidateId) => {
        const purchaseId = `${user.id}_${candidateId}`;
        await setDoc(doc(db, "purchases", purchaseId), {
          companyUserId: user.id,
          candidateId,
          purchasedAt: new Date()
        });
      });

      await Promise.all(purchasePromises);
      await fetchPurchases();
      return true;
    } catch (error) {
      console.error("Error purchasing candidates:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  return { purchasedIds, purchasedCandidates, purchaseCandidates, refetch: fetchPurchases };
};

export default usePurchases;
