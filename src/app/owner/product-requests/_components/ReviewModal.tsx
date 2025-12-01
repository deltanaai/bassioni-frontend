import { useState } from "react";
import { ProductRequest } from "../types/product-request";
import { X, FileText, Download, CheckCircle, XCircle } from "lucide-react";

interface ReviewModalProps {
  request: ProductRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export default function ReviewModal({
  request,
  onClose,
  onApprove,
  onReject,
}: ReviewModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    onReject(rejectionReason);
    setRejectionReason("");
  };

  const handleDownload = () => {
    // محاكاة تحميل الملف
    const link = document.createElement("a");
    link.href = request.details.proofDocument;
    link.download = `مستند_إثبات_${request.productName}.pdf`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden transform animate-in slide-in-from-bottom-8 duration-300">
        {/* الهيدر */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              مراجعة طلب المنتج
            </h2>
            <p className="text-gray-500 mt-1">
              مراجعة تفاصيل المنتج واتخاذ القرار المناسب
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/*  العمود الأول-*/}
            <div className="space-y-6">
              <Section title="المعلومات الأساسية">
                <InfoCard
                  icon="📦"
                  label="اسم المنتج"
                  value={request.productName}
                />
                <InfoCard
                  icon="🏢"
                  label="الشركة"
                  value={request.companyName}
                />
                <InfoCard
                  icon="👤"
                  label="مقدم الطلب"
                  value={request.submittedBy}
                />
                <InfoCard
                  icon="📅"
                  label="تاريخ التقديم"
                  value={request.date}
                />
              </Section>

              <Section title="التصنيف والسعر">
                <InfoCard
                  icon="📁"
                  label="الفئة"
                  value={request.details.category}
                />
                <InfoCard
                  icon="💰"
                  label="سعر الجمهور"
                  value={request.details.price}
                  valueClassName="text-green-600 font-semibold"
                />
              </Section>
            </div>

            {/* العمود الثاني    */}
            <div className="space-y-6">
              <Section title="وصف المنتج">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {request.details.description}
                  </p>
                </div>
              </Section>

              <Section title="مستند الإثبات">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <FileText className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          مستند الإثبات.pdf
                        </p>
                        <p className="text-sm text-gray-500">
                          تم الرفع في {request.date}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              </Section>

              {/* سبب الرفض */}
              <Section title="سبب الرفض (اختياري)">
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="أدخل سبب الرفض هنا في حال رفض الطلب..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  هذا الحقل اختياري ويستخدم فقط في حال رفض الطلب
                </p>
              </Section>
            </div>
          </div>
        </div>

        {/*  الزراير   */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              إلغاء المراجعة
            </button>

            <div className="flex space-x-3 gap-4 space-x-reverse">
              <button
                onClick={handleReject}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700  transition-all duration-200 font-medium"
              >
                <XCircle className="w-5 h-5" />
                <span>رفض الطلب</span>
              </button>

              <button
                onClick={onApprove}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-lg shadow-green-200"
              >
                <CheckCircle className="w-5 h-5" />
                <span>موافقة على الطلب</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-r-4 border-blue-500 pr-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-center space-x-3 space-x-reverse">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}
