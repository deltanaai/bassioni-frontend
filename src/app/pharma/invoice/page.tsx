// pages/dashboard/invoice.tsx
'use client';
import { useState, useRef } from 'react';
import { FiSearch, FiPrinter, } from 'react-icons/fi';

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  pharmacy: {
    name: string;
    type: string;
    address: string;
    discount: number;
  };
  medicines: Medicine[];
  paymentMethod: string;
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  notes?: string;
}

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    date: '15/10/2023',
    customer: {
      name: 'أحمد محمد',
      phone: '0123456789',
      address: '123 شارع النخيل، الرياض'
    },
    pharmacy: {
      name: 'صيدلية النور',
      type: 'صيدلية',
      address: '456 شارع الملك فهد، الرياض',
      discount: 10
    },
    medicines: [
      { id: 1, name: 'بانادول اكسترا', quantity: 5, unitPrice: 15, discount: 0, total: 75 },
      { id: 2, name: 'فيتامين سي', quantity: 3, unitPrice: 30, discount: 5, total: 85.5 },
      { id: 3, name: 'كريم هايدروكورتيزون', quantity: 2, unitPrice: 25, discount: 2, total: 49 }
    ],
    paymentMethod: 'نقدي',
    subtotal: 209.5,
    totalDiscount: 7.5,
    tax: 20.95,
    total: 222.95,
    notes: 'يجب استلام الدواء خلال أسبوع'
  },
  // يمكن إضافة المزيد من الفواتير هنا
];

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Filter invoices
  const filteredInvoices = sampleInvoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle print
  // const handlePrint = useReactToPrint({
  //   content: () => invoiceRef.current,
  //   pageStyle: `
  //     @page {
  //       size: A4;
  //       margin: 10mm;
  //     }
  //     @media print {
  //       body {
  //         direction: rtl;
  //       }
  //       .invoice-container {
  //         box-shadow: none;
  //         border: none;
  //       }
  //       .no-print {
  //         display: none;
  //       }
  //     }
  //   `
  // });

  return (
    <div className="p-4 space-y-6 bg-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">الفواتير</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة أو اسم العميل..."
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">رقم الفاتورة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">العميل</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الصيدلية</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الإجمالي</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">طباعة</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    لا توجد فواتير متطابقة مع بحثك
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className={`hover:bg-gray-700 ${selectedInvoice?.id === invoice.id ? 'bg-gray-700' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{invoice.customer.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {invoice.pharmacy.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-white">{invoice.total.toFixed(2)} ر.س</td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 p-1 flex items-center gap-1"
                        title="طباعة"
                      >
                        <FiPrinter /> طباعة
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print Template (hidden until printed) */}
      {selectedInvoice && (
        <div className="hidden">
          <div ref={invoiceRef} className="p-8 bg-white text-black invoice-container" dir="rtl">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">فاتورة صيدلية</h2>
                <p className="text-gray-600">نظام إدارة الفواتير</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold">{selectedInvoice.invoiceNumber}</p>
                <p className="text-gray-600">تاريخ الفاتورة: {selectedInvoice.date}</p>
              </div>
            </div>

            {/* Customer and Pharmacy Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">معلومات العميل</h3>
                <p className="text-gray-800">{selectedInvoice.customer.name}</p>
                <p className="text-gray-600">{selectedInvoice.customer.phone}</p>
                <p className="text-gray-600">{selectedInvoice.customer.address}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">معلومات الصيدلية</h3>
                <p className="text-gray-800">{selectedInvoice.pharmacy.name} ({selectedInvoice.pharmacy.type})</p>
                <p className="text-gray-600">خصم الصيدلية: {selectedInvoice.pharmacy.discount}%</p>
                <p className="text-gray-600">{selectedInvoice.pharmacy.address}</p>
              </div>
            </div>

            {/* Medicines Table */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-700 mb-3">الأدوية</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">#</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">اسم الدواء</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الكمية</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">سعر الوحدة</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الخصم %</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">المجموع</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedInvoice.medicines.map((medicine, index) => (
                      <tr key={medicine.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{medicine.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{medicine.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{medicine.unitPrice.toFixed(2)} ر.س</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{medicine.discount}%</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{medicine.total.toFixed(2)} ر.س</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">طريقة الدفع</h3>
                <p className="text-gray-800">{selectedInvoice.paymentMethod}</p>
                {selectedInvoice.notes && (
                  <>
                    <h3 className="font-bold text-gray-700 mt-3 mb-2">ملاحظات</h3>
                    <p className="text-gray-600">{selectedInvoice.notes}</p>
                  </>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">المجموع الفرعي:</span>
                  <span className="font-medium">{selectedInvoice.subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">إجمالي الخصومات:</span>
                  <span className="font-medium text-red-600">-{selectedInvoice.totalDiscount.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">الضريبة (10%):</span>
                  <span className="font-medium">{selectedInvoice.tax.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-bold">الإجمالي النهائي:</span>
                  <span className="font-bold text-lg text-blue-600">{selectedInvoice.total.toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-center text-gray-500 text-sm">
              <p>شكراً لتعاملكم معنا</p>
              <p>للاستفسارات: 0123456789 | info@pharmacy.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}