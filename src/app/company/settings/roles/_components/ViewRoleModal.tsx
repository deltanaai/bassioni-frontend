import { getPermissionLabel } from "@/app/utils/permissions";

interface ViewRoleModalProps {
  role: CompanyRole;
  onClose: () => void;
}

export default function ViewRoleModal({ role, onClose }: ViewRoleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4  transition-opacity duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">تفاصيل الدور</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Role Name */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="mt-1 p-1.5 bg-blue-100 rounded-md">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="mr-2">
              <p className="text-sm font-medium text-gray-500">اسم الدور</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {role.name}
              </p>
            </div>
          </div>

          {/* Guard Name */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="mt-1 p-1.5 bg-green-100 rounded-md">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="mr-2">
              <p className="text-sm font-medium text-gray-500">نظام الحماية</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {role.guard_name}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <div className="p-1.5 bg-purple-100 rounded-md">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-sm mr-2 font-medium text-gray-500">
                الصلاحيات
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
              {role.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {role.permissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center space-x-2 space-x-reverse bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm mr-2 font-medium text-gray-700">
                        {getPermissionLabel(p.name)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>لا توجد صلاحيات مخصصة لهذا الدور</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
