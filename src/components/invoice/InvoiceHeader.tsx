"use client";

interface Props {
  partyType: "supplier" | "customer";
  onPartySelect: (id: number) => void;
}

export default function InvoiceHeader({ partyType, onPartySelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="block mb-1 text-sm font-medium">
          {partyType === "supplier" ? "المورد" : "العميل"}
        </label>
        <select
          onChange={(e) => onPartySelect(Number(e.target.value))}
          className="w-full rounded border p-2"
        >
          <option value="">اختر</option>
          <option value="1"> محمد علي</option>
          <option value="2">احمد اسامه </option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">التاريخ</label>
        <input type="date" className="w-full rounded border p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          الرقم المرجعي (اختياري)
        </label>
        <input type="text" className="w-full rounded border p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          ملاحظات (اختياري)
        </label>
        <input type="text" className="w-full rounded border p-2" />
      </div>
    </div>
  );
}
