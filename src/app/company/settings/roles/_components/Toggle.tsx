type ToggleProps = {
  value: string | number;
  register: any;
  name: string;
  defaultChecked?: boolean;
  disabled?: boolean;
};

export default function Toggle({
  value,
  register,
  name,
  defaultChecked,
  disabled,
}: ToggleProps) {
  return (
    <label
      className={`relative inline-flex items-center ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        value={value}
        {...register(name)}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="sr-only peer"
      />

      <div
        className={`relative h-6 w-11 rounded-full transition
        ${disabled ? "bg-gray-300" : "bg-gray-300 peer-checked:bg-indigo-600"}
        after:content-[''] after:absolute after:top-0.5 after:left-[2px]
        after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all
        peer-checked:after:translate-x-full`}
      />
    </label>
  );
}
