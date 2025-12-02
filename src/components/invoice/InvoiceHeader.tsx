"use client";

interface Props {
  partyType: "supplier" | "customer";
  onPartySelect: (id: number) => void;
  partyId: number | "";
  date: string;
  refNumber: string;
  notes: string;
  onDateChange: (date: string) => void;
  onRefNumberChange: (refNumber: string) => void;
  onNotesChange: (notes: string) => void;
}

export default function InvoiceHeader({
  partyType,
  onPartySelect,
  partyId,
  date,
  refNumber,
  notes,
  onDateChange,
  onRefNumberChange,
  onNotesChange,
  theme,
}: Props & { theme?: "light" | "dark" }) {
  const inputClass = `w-full rounded border px-2 py-1 ${
    theme === "dark"
      ? "bg-gray-800 text-gray-100 border-gray-600"
      : "bg-white text-gray-900 border-gray-300"
  }`;
  return (
    <div className="grid grid-cols-4 gap-4 ">
      <div>
        <label className="block mb-1 text-sm font-medium">
          {partyType === "supplier" ? "المورد" : "العميل"}
        </label>
        <select
          value={partyId}
          onChange={(e) => onPartySelect(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">اختر</option>
          <option value="1">محمد علي</option>
          <option value="2">احمد اسامه</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">التاريخ</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          الرقم المرجعي (اختياري)
        </label>
        <input
          type="text"
          value={refNumber}
          onChange={(e) => onRefNumberChange(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          ملاحظات (اختياري)
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
    </div>
  );
}
