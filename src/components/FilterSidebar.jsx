import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";

const allSkills = [
  "React", "TypeScript", "Node.js", "Python", "Figma", "Docker",
  "AWS", "MongoDB", "Java", "Flutter", "Kubernetes", "SQL",
];

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const toggleSkill = (skill) => {
    const selected = filters.selectedSkills.includes(skill)
      ? filters.selectedSkills.filter((s) => s == skill)
      : [...filters.selectedSkills, skill];
    onFiltersChange({ ...filters, selectedSkills: selected });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 z-50 bg-card border-l border-border p-6 flex flex-col gap-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" />
                Filters
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors btn-haptic">
                <X size={18} />
              </button>
            </div>

            {/* Salary */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                Salary Range (₹ LPA)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-8">{(filters.minSalary / 100000).toFixed(0)}L</span>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={100000}
                  value={filters.maxSalary}
                  onChange={(e) => onFiltersChange({ ...filters, maxSalary: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs text-muted-foreground w-8">{(filters.maxSalary / 100000).toFixed(0)}L</span>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                Experience (Years)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{filters.minExperience}</span>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={filters.maxExperience}
                  onChange={(e) => onFiltersChange({ ...filters, maxExperience: Number(e.target.value) })}
                  className="flex-1 accent-secondary"
                />
                <span className="text-xs text-muted-foreground w-4">{filters.maxExperience}</span>
              </div>
            </div>

            {/* Tech Stacks */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => {
                  const active = filters.selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`btn-haptic px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        active ? "glow-tag" : "text-muted-foreground bg-muted/40 border border-border hover:border-primary/20"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() =>
                onFiltersChange({
                  minSalary: 0,
                  maxSalary: 5000000,
                  minExperience: 0,
                  maxExperience: 15,
                  selectedSkills: [],
                })
              }
              className="mt-auto py-2.5 rounded-lg text-sm font-medium btn-haptic text-muted-foreground bg-muted/40 border border-border hover:text-foreground hover:border-primary/20 transition-all"
            >
              Reset All Filters
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;




