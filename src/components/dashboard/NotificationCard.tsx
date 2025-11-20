interface NotificationCardProps {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  priority: "high" | "medium" | "low";
  unread: boolean;
  onView?: () => void;
  onDelete?: () => void;
}

export default function NotificationCard({
  title,
  message,
  time,
  icon,
  priority,
  unread,
  onView,
  onDelete,
}: NotificationCardProps) {
  const priorityStyles = {
    high: "bg-gradient-to-br from-red-500 to-orange-600",
    medium: "bg-gradient-to-br from-yellow-500 to-amber-600",
    low: "bg-gradient-to-br from-emerald-500 to-teal-600",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-lg ${
        unread
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-gray-900/40 backdrop-blur-xl"
          : "border-gray-800/50 bg-gray-900/20 backdrop-blur-xl hover:border-gray-700/50"
      }`}
    >
      {/* Unread Indicator */}
      {unread && (
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-600" />
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${priorityStyles[priority]} text-2xl shadow-lg`}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold ${
                unread ? "text-white" : "text-gray-300"
              }`}
            >
              {title}
            </h4>
            {unread && (
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              </div>
            )}
          </div>

          <p
            className={`mt-1 text-sm ${
              unread ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {message}
          </p>

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{time}</span>
            <div className="flex items-center gap-2">
              {onView && (
                <button
                  onClick={onView}
                  className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  عرض
                </button>
              )}
              {onDelete && !unread && (
                <button
                  onClick={onDelete}
                  className="text-xs text-gray-500 transition-colors hover:text-gray-400"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
