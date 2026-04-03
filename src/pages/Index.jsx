import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import CandidateCard from "@/components/CandidateCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import HeroSection from "../components/ui/HeroSection";
import TalentVelocityMatrix from "@/components/TalentVelocityMatrix";
import NetworkPulse from "../components/ui/NetworkPulse";

const Index = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ selectedSkills: [] });

  // 🚀 FETCH DATA
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));

        let data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ SORT LATEST FIRST
        data.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        const formatted = data.map((c) => ({
          id: c.id,
          name: c.fullName || "Candidate",
          role: c.roleTitle,
          skills: c.skills || [],
          experience: c.experience || 0,
          salary: c.salaryExpectation || 0,
          location: c.location || "",
        }));

        setCandidates(formatted);
      } catch (err) {
        console.error(err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchCandidates();
  }, [user, authLoading]);

  // 🔍 FILTER LOGIC
  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (search.trim()) {
      const s = search.toLowerCase();

      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(s) ||
          c.role?.toLowerCase().includes(s) ||
          c.skills?.some((skill) => skill.toLowerCase().includes(s)) ||
          c.location?.toLowerCase().includes(s)
      );
    }

    if (filters.selectedSkills.length > 0) {
      result = result.filter((c) =>
        filters.selectedSkills.every((skill) =>
          c.skills.includes(skill)
        )
      );
    }

    return result;
  }, [candidates, search, filters]);

  // ✂️ ONLY 9
  const visibleCandidates = useMemo(() => {
    return filteredCandidates.slice(0, 9);
  }, [filteredCandidates]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    if (search) {
      document
        .getElementById("browse")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [search]);

  return (
    <>
      <HeroSection />

      <div className="min-h-screen bg-background relative">
        <div className="mesh-gradient" />

        {/* HERO */}
        <section className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Hire <span className="glow-text">Elite Talent</span>,<br />
                Verified & Ready
              </h1>

              <p className="text-muted-foreground mb-6">
                Access a curated pool of pre-verified professionals.
              </p>

              {/* 🔍 SEARCH */}
              <SearchBar value={search} onChange={setSearch} />

              <div className="flex gap-6 my-6">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <div>
                    <p className="font-semibold">{candidates.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Live Candidates
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <div>
                    <p className="font-semibold">React</p>
                    <p className="text-xs text-muted-foreground">
                      Top skill
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("browse")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white"
              >
                Browse Candidates
                <ArrowRight size={15} />
              </button>
            </motion.div>

            <div className="hidden md:block">
              {visibleCandidates[0] && (
                <CandidateCard
                  candidate={visibleCandidates[0]}
                  onClick={() =>
                    navigate(`/candidate/${visibleCandidates[0].id}`)
                  }
                />
              )}
            </div>
          </div>
        </section>

        {/* BROWSE */}
        <section
          id="browse"
          className="max-w-[1400px] mx-auto px-6 pb-24"
        >
          <AnimatePresence mode="wait">
            {candidatesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleCandidates.map((candidate, i) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      index={i}
                      onClick={() =>
                        navigate(`/candidate/${candidate.id}`)
                      }
                    />
                  ))}
                </motion.div>

                {/* 🔥 VIEW ALL */}
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() =>
                      navigate(`/browsecandidate?search=${search}`)
                    }
                    className="px-6 py-3 rounded-lg bg-primary text-white"
                  >
                    View All Candidates
                  </button>
                </div>
              </>
            )}
          </AnimatePresence>
        </section>

        <FilterSidebar
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      <TalentVelocityMatrix />
      <NetworkPulse />
    </>
  );
};

export default Index;