import { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}

export default function FormInput({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  required = false,
  minLength,
  placeholder,
}: FormInputProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="h-4 w-4" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        required={required}
        minLength={minLength}
        placeholder={placeholder}
      />
    </div>
  );
}
