import { TrendingUp } from "lucide-react";

const roles = ["React Developer", "UX Designer", "Data Scientist", "DevOps Engineer", "Product Manager"];

const TrendingRoles = ({ onSelect }) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
        <TrendingUp size={13} />
        Trending:
      </span>
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/40 border border-border hover:border-primary/20 hover:text-foreground transition-all btn-haptic"
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default TrendingRoles;




