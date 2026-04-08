import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import CandidateCard from "@/components/CandidateCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import TalentVelocityMatrix from "@/components/TalentVelocityMatrix";
import NetworkPulse from "../components/ui/NetworkPulse";
import HeroSection from "@/components/ui/HeroSection";
import HiringFlow from "../components/HiringFlow";
import ResumeFlow from "../components/ResumeFlow";

const Index = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ selectedSkills: [] });

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));

        let data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          // ✅ ONLY SHOW COMPLETE PROFILES
          .filter((c) => c.profileCompleted === true);

        // ✅ SAFE SORT by creation date
        data.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        // ✅ FORMAT CANDIDATE OBJECT
        const formatted = data.map((c) => ({
          id: c.id,
          name: c.fullName || "Candidate",
          role: c.roleTitle || "Not specified",
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

    // SEARCH
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.role.toLowerCase().includes(s) ||
          c.skills.some((skill) => skill.toLowerCase().includes(s)) ||
          c.location.toLowerCase().includes(s)
      );
    }

    // SKILL FILTER
    if (filters.selectedSkills.length > 0) {
      result = result.filter((c) =>
        filters.selectedSkills.every((skill) =>
          c.skills.includes(skill)
        )
      );
    }

    return result;
  }, [candidates, search, filters]);

  // 🌟 FEATURED = top 3 or fewer if not enough candidates
  const featuredCandidates = useMemo(() => {
    return filteredCandidates.slice(0, 3);
  }, [filteredCandidates]);

  // 📂 BROWSE = first 9 candidates
  const browseCandidates = useMemo(() => {
    return filteredCandidates.slice(0, 9);
  }, [filteredCandidates]);

  return (
    <>
      <HeroSection />

      <div className="bg-background">
        {/* 🔥 HERO */}
        <section className="px-6 pt-24 pb-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Hire <span className="text-primary">Top Talent</span>
              <br /> Faster Than Ever
            </h1>

            <p className="mt-4 text-muted-foreground text-lg">
              Discover verified candidates, filter by skills, experience and hire smarter.
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <button
              onClick={() =>
                document.getElementById("browse")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white shadow-md hover:scale-105 transition"
            >
              Explore Candidates <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* 💎 STATS
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white shadow-sm text-center">
              <Users className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{candidates.length}+</p>
              <p className="text-sm text-muted-foreground">Candidates</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-sm text-center">
              <Zap className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">React</p>
              <p className="text-sm text-muted-foreground">Top Skill</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-sm text-center hidden md:block">
              <p className="text-2xl font-bold">Fast</p>
              <p className="text-sm text-muted-foreground">Hiring</p>
            </div>
          </div>
        </section> */}

        {/* 🌟 FEATURED */}
        {featuredCandidates.length > 0 && (
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-8">
                 Featured Candidates
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {featuredCandidates.map((candidate, i) => (
                  <div
                    key={candidate.id}
                    className="relative p-[1px] rounded-2xl bg-gradient-to-br from-primary/40 to-transparent"
                  >
                    <div className="bg-white rounded-2xl">
                      <CandidateCard
                        candidate={candidate}
                        index={i}
                        onClick={() =>
                          navigate(`/candidate/${candidate.id}`)
                        }
                      />
                    </div>

                    <span className="absolute top-3 right-3 text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 📂 BROWSE */}
        <section id="browse" className="px-6 py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Browse & Filter Candidates </h2>
              <button
                onClick={() => setFiltersOpen(true)}
                className="text-sm px-4 py-2 border rounded-lg hover:bg-muted transition"
              >
                Filters
              </button>
            </div>

            {candidatesLoading ? (
              <div className="grid md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : browseCandidates.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {browseCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() =>
                      navigate(`/candidate/${candidate.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-6">
                No candidates found.
              </p>
            )}

            {/* 🔥 VIEW ALL */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() =>
                  navigate(`/browse-candidates?search=${search}`)
                }
                className="px-6 py-3 rounded-xl bg-primary text-white hover:scale-105 transition"
              >
                View All Candidates
              </button>
            </div>
          </div>
        </section>

        {/* SIDEBAR */}
        <FilterSidebar
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <HiringFlow />
        <TalentVelocityMatrix />
        <NetworkPulse />
      </div>
    </>
  );
};

export default Index;