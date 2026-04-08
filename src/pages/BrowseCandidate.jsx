import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, MapPin, Briefcase, IndianRupee, Cpu, RotateCcw, Search } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import CandidateCard from "@/components/CandidateCard";
import SearchBar from "@/components/SearchBar";
import SkeletonCard from "@/components/SkeletonCard";

const skillsList = ["React", "Node", "MongoDB", "Python", "Java"];

const BrowseCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 100]);
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "candidates"));
        let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Sort latest first client-side (avoids dropping candidates missing createdAt)
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        const formatted = data.map((c) => ({
          id: c.id,
          name: c.fullName || "Candidate",
          role: c.roleTitle || "",
          skills: c.skills || [],
          experience: c.experience || 0,
          salary: c.salaryExpectation || 0,
          location: c.location || "",
        }));

        setCandidates(formatted);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // --- Filtering + Sorting ---
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

    if (selectedSkills.length > 0) {
      result = result.filter((c) =>
        selectedSkills.every((skill) => c.skills.includes(skill))
      );
    }

    if (minExp) result = result.filter((c) => c.experience >= Number(minExp));
    if (maxExp) result = result.filter((c) => c.experience <= Number(maxExp));
    if (location)
      result = result.filter((c) =>
        c.location.toLowerCase().includes(location.toLowerCase())
      );
    if (role)
      result = result.filter((c) =>
        c.role.toLowerCase().includes(role.toLowerCase())
      );

    result = result.filter(
      (c) => c.salary >= salaryRange[0] && c.salary <= salaryRange[1]
    );

    if (sortBy === "exp") result.sort((a, b) => b.experience - a.experience);
    else if (sortBy === "salary") result.sort((a, b) => b.salary - a.salary);

    return result;
  }, [candidates, search, selectedSkills, minExp, maxExp, location, salaryRange, role, sortBy]);

  const locationSuggestions = useMemo(() => {
    const unique = [...new Set(candidates.map((c) => c.location))];
    return unique.filter(
      (loc) => loc && loc.toLowerCase().includes(location.toLowerCase())
    );
  }, [location, candidates]);

  const clearFilters = () => {
    setSelectedSkills([]);
    setMinExp("");
    setMaxExp("");
    setLocation("");
    setRole("");
    setSalaryRange([0, 100]);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background px-4 md:px-8 py-10">

      {/* 1. Header Section */}
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Browse <span className="text-primary">Candidates</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Connecting elite healthcare professionals with premier institutions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-card p-1.5 rounded-2xl border shadow-sm h-fit">
            {["latest", "exp", "salary"].map((type) => (
              <button
                key={type}
                onClick={() => setSortBy(type)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  sortBy === type
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-3xl border rounded-2xl bg-white dark:bg-card shadow-sm">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      {/* 2. Main Layout Grid */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8 items-start">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] space-y-8">

            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
              <h2 className="font-bold flex gap-2 items-center text-slate-900 dark:text-slate-100">
                <SlidersHorizontal size={19} className="text-primary" /> Filters
              </h2>
              <button
                onClick={clearFilters}
                className="text-[11px] font-black uppercase tracking-widest text-primary hover:opacity-70 flex items-center gap-1.5 transition-opacity"
              >
                <RotateCcw size={14} /> Clear
              </button>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <label className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Briefcase size={14} /> Experience (Years)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Min"
                  type="number"
                  value={minExp}
                  onChange={(e) => setMinExp(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <input
                  placeholder="Max"
                  type="number"
                  value={maxExp}
                  onChange={(e) => setMaxExp(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cpu size={14} /> Specialization
              </label>
              <input
                placeholder="Search Role..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin size={14} /> Location
              </label>
              <input
                placeholder="Preferred City..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {locationSuggestions.slice(0, 3).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="text-[13px] px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-xl transition-all font-bold text-slate-500"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            
            {/* Skills */}
            <div className="space-y-4">
              <label className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200">Core Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => {
                  const isActive = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() =>
                        setSelectedSkills((prev) =>
                          isActive ? prev.filter((s) => s !== skill) : [...prev, skill]
                        )
                      }
                      className={`px-4  py-2 rounded-2xl text-[13px] font-medium transition-all border ${
                        isActive
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                          : "bg-white border-slate-300 text-slate-600 hover:border-primary/30 hover:text-slate-600"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8 px-2">
            {/* <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Search size={16} />
              {!loading && (
                <p className="text-sm">
                  Found{" "}
                  <span className="text-slate-900 dark:text-white font-bold">
                    {filteredCandidates.length}
                  </span>{" "}
                  verified profile{filteredCandidates.length !== 1 ? "s" : ""}
                </p>
              )}
            </div> */}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No candidates match these filters</h3>
              <p className="text-slate-400 mt-2 max-w-xs">
                Try adjusting your experience or skill requirements to see more results.
              </p>
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate, i) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  index={i}
                  onClick={() => navigate(`/candidate/${candidate.id}`)}
                />
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseCandidate;