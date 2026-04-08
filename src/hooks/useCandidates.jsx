import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);

    try {
      // FIX #8: filter only docs that have createdAt so orderBy never silently drops candidates.
      // If you want ALL candidates regardless, remove orderBy and the where clause entirely
      // and sort client-side instead (shown below as the safer default).
      const candidatesQuery = query(collection(db, "candidates"));
      const querySnapshot = await getDocs(candidatesQuery);

      const candidatesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // FIX #8: sort client-side so no candidate is silently dropped due to missing createdAt
      candidatesData.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

      const mapped = candidatesData.map((c) => ({
        id: c.id,
        user_id: c.userId,
        name: c.fullName || "Unknown",
        email: c.email || "",
        role: c.roleTitle || "",
        location: c.location || "Not specified",
        experience: c.experience || 0,
        salary: c.salaryExpectation || 0,
        skills: c.skills || [],
        phone: c.phone || "",
        summary: c.summary || "",
        projects: c.projects || [],
        certifications: c.certifications || [],
        achievements: c.achievements || [],
        languages: c.languages || [],
        interests: c.interests || [],
        workExperience: c.workExperience || "",
        education: c.education || "",

        // FIX #4: references is stored as array — keep it as array, never coerce to string
        references: Array.isArray(c.references) ? c.references : [],

        resumeUrl: c.resumeUrl || "",

        avatar: (c.fullName || "U")
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      }));

      setCandidates(mapped);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return { candidates, loading, refetch: fetchCandidates };
};

export default useCandidates;