export function SettingsPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-700" />
        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-800" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card Skeleton 1 */}
        <div className="h-80 animate-pulse rounded-2xl border border-gray-700 bg-gray-800" />
        {/* Card Skeleton 2 */}
        <div className="h-80 animate-pulse rounded-2xl border border-gray-700 bg-gray-800" />
      </div>

      {/* Roles Card Skeleton */}
      <div className="h-64 animate-pulse rounded-2xl border border-gray-700 bg-gray-800" />
    </div>
  );
}
