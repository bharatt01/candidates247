
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);

    try {
      const candidatesQuery = query(collection(db, "candidates"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(candidatesQuery);

      const candidatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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
        references: c.references || "",
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
