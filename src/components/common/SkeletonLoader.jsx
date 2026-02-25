export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-24" />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="bg-gray-200 animate-pulse rounded-full w-12 h-12 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 animate-pulse rounded h-4 w-3/4" />
              <div className="bg-gray-200 animate-pulse rounded h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="bg-gray-200 animate-pulse rounded h-12 flex-1" />
            <div className="bg-gray-200 animate-pulse rounded h-12 flex-1" />
            <div className="bg-gray-200 animate-pulse rounded h-12 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};
