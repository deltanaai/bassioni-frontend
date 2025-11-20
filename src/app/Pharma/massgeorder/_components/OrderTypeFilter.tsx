"use client";

interface OrderTypeFilterProps {
  activeFilter: "all" | "default" | "offer";
  onFilterChange: (filter: "all" | "default" | "offer") => void;
  counts?: {
    all: number;
    default: number;
    offer: number;
  };
}

export default function OrderTypeFilter({
  activeFilter,
  onFilterChange,
  counts,
}: OrderTypeFilterProps) {
  const filters = [
    { label: "كل الطلبات", value: "all" as const, count: counts?.all },
    {
      label: "الطلبات العادية",
      value: "default" as const,
      count: counts?.default,
    },
    {
      label: "عروض الشركات",
      value: "offer" as const,
      count: counts?.offer,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
            activeFilter === filter.value
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              : "border border-gray-700 bg-gray-800 text-gray-300 hover:border-emerald-500/50 hover:text-white"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {filter.label}
            {filter.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeFilter === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            )}
          </span>
          {activeFilter !== filter.value && (
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 opacity-0 transition-opacity group-hover:opacity-10" />
          )}
        </button>
      ))}
    </div>
  );
}
