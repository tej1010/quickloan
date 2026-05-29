interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`customer-shimmer rounded-xl ${className}`} />;
}

export function HomeSkeleton() {
  return (
    <div className="p-5 space-y-5">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-44 w-full rounded-3xl" />
      <Skeleton className="h-32 w-full rounded-3xl" />
      <Skeleton className="h-28 w-full rounded-3xl" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function LoanListSkeleton() {
  return (
    <div className="p-5 space-y-4">
      <Skeleton className="h-36 w-full rounded-3xl" />
      <Skeleton className="h-36 w-full rounded-3xl" />
    </div>
  );
}
