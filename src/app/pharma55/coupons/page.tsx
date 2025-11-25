'use client';
import { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiClock, 
  FiPercent, 
  FiUser, 
  FiHash,
  FiCalendar 
} from 'react-icons/fi';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  validFrom: string;
  validTo: string;
  maxUses: number;
  usedCount: number;
  status: 'active' | 'upcoming' | 'expired';
}

const sampleCoupons: Coupon[] = [
  { 
    id: 1, 
    code: 'SUMMER20', 
    discount: 20, 
    validFrom: '2023-06-01', 
    validTo: '2023-06-30', 
    maxUses: 100,
    usedCount: 42,
    status: 'expired'
  },
  { 
    id: 2, 
    code: 'HEALTH15', 
    discount: 15, 
    validFrom: '2023-07-01', 
    validTo: '2023-07-31', 
    maxUses: 200,
    usedCount: 87,
    status: 'active'
  },
  { 
    id: 3, 
    code: 'BACKTOSCHOOL', 
    discount: 10, 
    validFrom: '2023-08-15', 
    validTo: '2023-09-15', 
    maxUses: 150,
    usedCount: 0,
    status: 'upcoming'
  },
];

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(10);
  const [validDays, setValidDays] = useState(30);
  const [maxUses, setMaxUses] = useState(100);

  // Generate a random coupon code
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponCode(result);
  };

  // Filter coupons
  const filteredCoupons = sampleCoupons.filter(coupon => {
    const matchesSearch = coupon.code.includes(searchTerm);
    const matchesFilter = filter === 'all' || coupon.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Handle coupon submission
  const handleSubmitCoupon = () => {
    if (!couponCode) {
      alert('الرجاء إدخال كود الكوبون');
      return;
    }

    // Calculate dates based on valid days
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setDate(validFrom.getDate() + validDays);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Determine status based on dates
    const status = 'active';

    // Here you would typically send the coupon to the backend
    console.log('Submitting coupon:', {
      code: couponCode,
      discount: couponDiscount,
      validFrom: formatDate(validFrom),
      validTo: formatDate(validTo),
      maxUses,
      usedCount: 0,
      status
    });

    // Reset and close modal
    setCouponCode('');
    setCouponDiscount(10);
    setValidDays(30);
    setMaxUses(100);
    setShowCouponModal(false);
    alert('تم إضافة الكوبون بنجاح');
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs">نشط</span>;
      case 'upcoming':
        return <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <FiClock size={12} /> قادم
        </span>;
      case 'expired':
        return <span className="bg-red-900 text-red-300 px-2 py-1 rounded-full text-xs">منتهي</span>;
      default:
        return null;
    }
  };

  // Calculate remaining uses
  const calculateRemainingUses = (coupon: Coupon) => {
    return coupon.maxUses - coupon.usedCount;
  };

  return (
    <div className="p-4 space-y-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">إدارة الكوبونات</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بكود الكوبون..."
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Coupon['status'] | 'all')}
            >
              <option value="all">جميع الكوبونات</option>
              <option value="active">نشطة</option>
              <option value="upcoming">قادمة</option>
              <option value="expired">منتهية</option>
            </select>
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Add Coupon Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCouponModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> إضافة كوبون جديد
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">#</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">كود الكوبون</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">قيمة الخصم</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">فترة الصلاحية</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">عدد المستخدمين</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  لا توجد كوبونات متطابقة مع بحثك
                </td>
              </tr>
            ) : (
              filteredCoupons.map((coupon, index) => {
                const validFromDate = new Date(coupon.validFrom);
                const validToDate = new Date(coupon.validTo);
                const remainingUses = calculateRemainingUses(coupon);
                
                return (
                  <tr key={coupon.id} className={`hover:bg-gray-750 ${
                    coupon.status === 'active' ? 'bg-emerald-900 bg-opacity-20' : 
                    coupon.status === 'upcoming' ? 'bg-blue-900 bg-opacity-20' : ''
                  }`}>
                    <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-mono font-medium text-white">
                      {coupon.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-400 flex items-center gap-1">
                      <FiPercent size={12} /> {coupon.discount}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {validFromDate.toLocaleDateString()} - {validToDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        ({Math.ceil((validToDate.getTime() - validFromDate.getTime()) / (1000 * 60 * 60 * 24))} يوم)
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <FiUser size={12} />
                        {coupon.usedCount} / {coupon.maxUses}
                      </div>
                      {remainingUses > 0 && (
                        <div className="text-xs text-green-400">
                          متبقي {remainingUses} استخدام
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{renderStatusBadge(coupon.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">إضافة كوبون جديد</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    كود الكوبون
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="مثال: SUMMER20"
                    />
                    <button
                      onClick={generateRandomCode}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
                    >
                      <FiHash size={14} /> توليد
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    نسبة الخصم (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={couponDiscount}
                      onChange={(e) => setCouponDiscount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    مدة الصلاحية (أيام)
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={validDays}
                      onChange={(e) => setValidDays(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    عدد العملاء المسموح لهم بالاستخدام
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={maxUses}
                      onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                
                {couponCode && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">ملخص الكوبون:</h3>
                    <p className="text-white font-mono">{couponCode}</p>
                    <p className="text-emerald-400">
                      خصم {couponDiscount}% لمدة {validDays} يوم
                    </p>
                    <p className="text-blue-400 text-sm">
                      صالح لـ {maxUses} عميل
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitCoupon}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                  disabled={!couponCode}
                >
                  إضافة الكوبون
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}