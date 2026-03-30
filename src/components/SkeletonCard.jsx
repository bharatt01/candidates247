const SkeletonCard = () => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-lg skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded skeleton-shimmer" />
          <div className="h-3 w-24 rounded skeleton-shimmer" />
          <div className="h-3 w-20 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
        <div className="h-6 w-14 rounded-full skeleton-shimmer" />
      </div>
      <div className="h-14 rounded-lg skeleton-shimmer" />
      <div className="h-10 rounded-lg skeleton-shimmer" />
    </div>
  );
};

export default SkeletonCard;




