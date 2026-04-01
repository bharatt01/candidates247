import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowRight, Users, Zap } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import CandidateCard from "@/components/CandidateCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import ShoppingCart from "@/components/ShoppingCart";
import TrendingRoles from "@/components/TrendingRoles";
import SkeletonCard from "@/components/SkeletonCard";
import usePurchases from "../hooks/usePurchases";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/ui/HeroSection";
import TalentVelocityMatrix from "@/components/TalentVelocityMatrix";
import NetworkPulse from "../components/ui/NetworkPulse";

const Index = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

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

    if (!authLoading) {
      fetchCandidates();
    }
  }, [user, authLoading]);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ selectedSkills: [] });

  const filtered = useMemo(() => {
    return candidates;
  }, [candidates]);

  const purchasedIds = new Set();
  const handleUnlock = () => {};
  const cart = [];
  const handleRemove = () => {};
  const handleCheckout = () => {};
  const jiggle = false;

  return (
    <>
      <HeroSection />

      <div className="min-h-screen bg-background relative">
        <div className="mesh-gradient" />

        <section className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                Hire <span className="glow-text">Elite Talent</span>,<br />
                Verified & Ready
              </h1>

              <p className="text-muted-foreground text-sm md:text-base max-w-md mb-6 leading-relaxed">
                Access a curated pool of pre-verified professionals.
              </p>

              <div className="flex gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {candidates.length}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Live Candidates
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      React
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Top skill this week
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#browse"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
              >
                Browse Candidates
                <ArrowRight size={15} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden md:block"
            >
              {candidates.length > 0 && (
                <CandidateCard
                  candidate={candidates[0]}
                  index={0}
                  isUnlocked={false}
                  onUnlock={() => {}}
                  onClick={() => candidates[0] && navigate(`/candidate/${candidates[0].id}`)}
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* BROWSE SECTION - BALANCED FOR LARGE CARDS & TIGHT GAPS */}
        <section id="browse" className="relative z-10 max-w-[1400px] mx-auto px-6 pb-24">
          <AnimatePresence mode="wait">
            {candidatesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                /* Using gap-3 for tight spacing and 3 columns for balanced scaling */
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {filtered.map((candidate, i) => (
                  <div key={candidate.id} className="w-full flex justify-center">
                    <CandidateCard
                      candidate={candidate}
                      index={i}
                      isUnlocked={false}
                      onUnlock={() => {}}
                      onClick={() => navigate(`/candidate/${candidate.id}`)}
                      /* IMPORTANT: Ensure CandidateCard.jsx does NOT have 
                         max-w-sm or a fixed width like w-[300px]. 
                         It should be w-full.
                      */
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <FilterSidebar
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <ShoppingCart
          items={cart}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          jiggle={jiggle}
        />
      </div>

      <TalentVelocityMatrix />
      <NetworkPulse />
    </>
  );
};

export default Index;