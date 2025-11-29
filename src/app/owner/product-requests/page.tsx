"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Filters, ProductRequest } from "./types/product-request";
import FiltersSection from "./_components/FiltersSection";
import ProductRequestsTable from "./_components/ProductRequestsTable";
import ReviewModal from "./_components/ReviewModal";

const mockData: ProductRequest[] = [
  {
    id: 1,
    productName: "   بارستمول-parastamol  ",
    companyName: "شركة  الحياة",
    status: "pending",
    submittedBy: "أحمد محمد",
    date: "2023-10-15",
    details: {
      description: " خافض للسخونيه و الحراره",
      category: "دواء",
      price: "4500 ريال",
      proofDocument: "/documents/sample.pdf",
    },
  },
  {
    id: 2,
    productName: "   اوجمنتين-ogamntin",
    companyName: "  شركه evaa",
    status: "approved",
    submittedBy: "فاطمة عبدالله",
    date: "2023-10-10",
    details: {
      description: " دوا معالج لنزلات البرد ",
      category: "دواء",
      price: "3200 ريال",
      proofDocument: "/documents/sample.pdf",
    },
  },
];

export default function ProductRequestsPage() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProductRequest[]>(
    []
  );
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    company: "all",
    search: "",
  });

  const itemsPerPage = 8;

  useEffect(() => {
    setRequests(mockData);
    setFilteredRequests(mockData);
  }, []);

  useEffect(() => {
    let result = requests;

    if (filters.status !== "all") {
      result = result.filter((req) => req.status === filters.status);
    }

    if (filters.company !== "all") {
      result = result.filter((req) => req.companyName === filters.company);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (req) =>
          req.productName.toLowerCase().includes(searchTerm) ||
          req.companyName.toLowerCase().includes(searchTerm) ||
          req.submittedBy.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredRequests(result);
  }, [filters, requests]);

  const openReviewModal = (request: ProductRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id ? { ...req, status: "approved" } : req
      )
    );

    toast.success("تمت الموافقة على الطلب بنجاح");
    closeModal();
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id ? { ...req, status: "rejected" } : req
      )
    );

    toast.error("تم رفض الطلب بنجاح");
    closeModal();
  };

  const companies = Array.from(new Set(requests.map((req) => req.companyName)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">طلبات المنتجات</h1>
          <p className="text-gray-600 mt-2">
            إدارة وعرض جميع طلبات المنتجات المقدمة من الشركات
          </p>
        </div>

        <FiltersSection
          filters={filters}
          onFiltersChange={setFilters}
          companies={companies}
        />

        <ProductRequestsTable
          requests={filteredRequests}
          onReview={openReviewModal}
          currentPage={1}
          itemsPerPage={itemsPerPage} // علشان الـ Pagination
          onPageChange={() => {}} // علشان الـ props مش تبقى empty
          totalCount={filteredRequests.length} // علشان  بردوو Pagination
        />

        {isModalOpen && selectedRequest && (
          <ReviewModal
            request={selectedRequest}
            onClose={closeModal}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}
