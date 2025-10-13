"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSend, FiArrowRight } from "react-icons/fi";

export default function OrderDetails({ id }: { id: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { from: "company", text: "تم استلام طلبك وسيتم مراجعته قريباً ✅" },
    { from: "me", text: "تمام، شكراً لحضراتكم 🙏" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 mb-6"
      >
        <FiArrowRight className="text-lg" />
        رجوع
      </button>

      <h1 className="text-3xl font-bold mb-6">📄 تفاصيل الطلب #{id}</h1>

      {/* تفاصيل الطلب */}
      <div className="bg-gray-800 p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">معلومات الطلب</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">العميل:</span> محمد أحمد</p>
          <p><span className="font-semibold">الحالة:</span> <span className="text-yellow-400">قيد المعالجة</span></p>
          <p><span className="font-semibold">الإجمالي:</span> 450 جنيه</p>
          <p><span className="font-semibold">تاريخ الطلب:</span> 2025-09-09</p>
        </div>
      </div>

      {/* المنتجات */}
      <div className="bg-gray-800 p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">🛒 المنتجات</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left">المنتج</th>
              <th className="p-3 text-center">الكمية</th>
              <th className="p-3 text-right">السعر</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="p-3">بانادول</td>
              <td className="p-3 text-center">2</td>
              <td className="p-3 text-right">100 جنيه</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="p-3">فيتامين C</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-right">50 جنيه</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* الشات */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col h-[400px]">
        <h2 className="text-xl font-semibold mb-4">💬 الرسائل</h2>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-xs ${
                msg.from === "me"
                  ? "bg-blue-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="✍️ اكتب رسالة..."
            className="flex-1 p-3 rounded-xl bg-gray-700 text-white outline-none"
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-3 bg-green-600 rounded-xl hover:bg-green-700 flex items-center gap-2"
          >
            <FiSend />
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
