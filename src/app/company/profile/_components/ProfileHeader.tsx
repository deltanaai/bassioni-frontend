import { User, Shield, Edit, KeyRound } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  role: string;
  isActive: boolean;
  onEditClick: () => void;
  onPasswordClick: () => void;
}

export default function ProfileHeader({
  name,
  role,
  isActive,
  onEditClick,
  onPasswordClick,
}: ProfileHeaderProps) {
  return (
    <>
      {/* Gradient Background */}
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
            <User className="h-16 w-16 text-white" />
          </div>
          <div className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
            {isActive ? (
              <div className="h-3 w-3 rounded-full bg-white"></div>
            ) : (
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  <Shield className="h-3 w-3" />
                  {role}
                </span>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    نشط
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onEditClick}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <Edit className="h-4 w-4" />
                تعديل البيانات
              </button>
              <button
                onClick={onPasswordClick}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <KeyRound className="h-4 w-4" />
                تغيير كلمة المرور
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
