    // pages/dashboard/products.tsx
    'use client';
    import { useState } from 'react';
    import { FiSearch, FiPlus, FiFilter, FiClock } from 'react-icons/fi';

    interface Brand {
    id: number;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    }

    interface Product {
    id: number;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    }

    const sampleBrands: Brand[] = [
    { id: 1, name: 'جلاكسو سميث كلاين', status: 'approved' },
    { id: 2, name: 'نوفارتس', status: 'approved' },
    { id: 3, name: 'فايزر', status: 'pending' },
    { id: 4, name: 'سانوفي', status: 'rejected' },
    ];

    const sampleProducts: Product[] = [
    { id: 1, category: 'مسكنات', status: 'approved' },
    { id: 2, category: 'فيتامينات', status: 'approved' },
    { id: 3, category: 'مضادات حيوية', status: 'pending' },
    { id: 4, category: 'أدوية سكري', status: 'rejected' },
    ];

    export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState<'brands' | 'products'>('brands');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState<'brand' | 'product'>('brand');
    const [requestName, setRequestName] = useState('');
    const [requestCategory, setRequestCategory] = useState('');

    // Filter data
    const filteredBrands = sampleBrands.filter(brand => {
        const matchesSearch = brand.name.includes(searchTerm);
        const matchesFilter = filter === 'all' || brand.status === filter;
        return matchesSearch && matchesFilter;
    });

    const filteredProducts = sampleProducts.filter(product => {
        const matchesSearch = product.category.includes(searchTerm);
        const matchesFilter = filter === 'all' || product.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Handle request submission
    const handleSubmitRequest = () => {
        // Here you would typically send the request to the backend
        console.log(`Submitting ${requestType} request:`, {
        name: requestName,
        category: requestCategory
        });
        
        // Reset and close modal
        setRequestName('');
        setRequestCategory('');
        setShowRequestModal(false);
        alert('تم إرسال الطلب للإدارة للموافقة عليه');
    };

    // Render status badge
    const renderStatusBadge = (status: string) => {
        switch (status) {
        case 'approved':
            return <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs">موافق عليه</span>;
        case 'pending':
            return <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FiClock size={12} /> قيد الانتظار
            </span>;
        case 'rejected':
            return <span className="bg-red-900 text-red-300 px-2 py-1 rounded-full text-xs">مرفوض</span>;
        default:
            return null;
        }
    };

    return (
        <div className="p-4 space-y-6 bg-gray-900 text-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-white">
            {activeTab === 'brands' ? 'البراندات' : 'الاصناف'}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[250px]">
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
                <input
                type="text"
                placeholder={`ابحث ${activeTab === 'brands' ? 'بالبراند أو الفئة' : 'بالمنتج أو الفئة'}...`}
                className="w-full pr-10 pl-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="relative">
                <select
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Brand['status'] | 'all')}
                >
                <option value="all">جميع الحالات</option>
                <option value="approved">موافق عليه</option>
                <option value="pending">قيد الانتظار</option>
                <option value="rejected">مرفوض</option>
                </select>
                <FiFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
            <button
            className={`px-4 py-2 font-medium ${activeTab === 'brands' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('brands')}
            >
            البراندات
            </button>
            <button
            className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('products')}
            >
            الاصناف
            </button>
        </div>

        {/* Add Request Button */}
        {/* <div className="flex justify-end">
            <button
            onClick={() => {
                setRequestType(activeTab === 'brands' ? 'brand' : 'product');
                setShowRequestModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
            <FiPlus /> طلب {activeTab === 'brands' ? 'براند جديد' : 'صنف جديد'}
            </button>
        </div> */}

        {/* Brands Table */}
        {activeTab === 'brands' && (
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">#</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">اسم البراند</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الحالة</th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredBrands.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        لا توجد براندات متطابقة مع بحثك
                    </td>
                    </tr>
                ) : (
                    filteredBrands.map((brand, index) => (
                    <tr key={brand.id} className="hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-white">{brand.name}</td>
                        <td className="px-4 py-3 text-sm">{renderStatusBadge(brand.status)}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        )}

        {/* Products Table */}
        {activeTab === 'products' && (
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">#</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الفئة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">الحالة</th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredProducts.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        لا توجد منتجات متطابقة مع بحثك
                    </td>
                    </tr>
                ) : (
                    filteredProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{product.category}</td>
                        <td className="px-4 py-3 text-sm">{renderStatusBadge(product.status)}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        )}

        {/* Request Modal */}
        {/* {showRequestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
                <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                    طلب {requestType === 'brand' ? 'براند جديد' : 'صنف جديد'}
                </h2>
                
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        اسم {requestType === 'brand' ? 'البراند' : 'صنف'}
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={requestName}
                        onChange={(e) => setRequestName(e.target.value)}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">الفئة</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={requestCategory}
                        onChange={(e) => setRequestCategory(e.target.value)}
                    />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                    >
                    إلغاء
                    </button>
                    <button
                    onClick={handleSubmitRequest}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                    >
                    إرسال الطلب
                    </button>
                </div>
                </div>
            </div>
            </div>
        )} */}
        </div>
    );
    }