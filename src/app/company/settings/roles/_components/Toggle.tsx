type ToggleProps = {
  value: string | number;
  register: any;
  name: string;
  defaultChecked?: boolean;
};

export default function Toggle({
  value,
  register,
  name,
  defaultChecked,
}: ToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value={value}
        {...register(name)}
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />

      <div
        className="relative w-11 h-6 bg-gray-300 rounded-full
        peer-checked:bg-indigo-600
        after:content-[''] after:absolute after:top-0.5 after:left-[2px]
        after:bg-white after:rounded-full after:h-5 after:w-5
        after:transition-all
        peer-checked:after:translate-x-full"
      />
    </label>
  );
}
