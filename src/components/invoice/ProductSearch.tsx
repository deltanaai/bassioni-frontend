"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { indexCompanyProducts } from "@/lib/actions/company/companyProducts.action";
import { ProductRow } from "./InvoiceTable";
import { indexPhamacyProducts } from "@/lib/actions/pharma/pharmaProducts.action";
import { th } from "zod/v4/locales";

interface Props {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}

export default function ProductSearch({
  setRows,
  theme,
  source,
}: Props & { theme?: "light" | "dark" } & { source?: "company" | "pharma" }) {
  const companyQuery = useQuery({
    queryKey: ["companyProducts"],
    queryFn: () => indexCompanyProducts(),
    enabled: source === "company",
  });

  const pharmaQuery = useQuery({
    queryKey: ["pharmacyProducts"],
    queryFn: () => indexPhamacyProducts({ page: 1, perPage: 100 }),
    enabled: source === "pharma",
  });

  const productsResponse =
    source === "company" ? companyQuery.data : pharmaQuery.data;
  const productsLoading =
    source === "company" ? companyQuery.isLoading : pharmaQuery.isLoading;

  const allProducts: ProductViewT[] = productsResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "barcode" | "gtin" | "qr">(
    "name"
  );

  const filteredProducts = allProducts.filter((p) => {
    if (!searchTerm) return false;
    const term = searchTerm.toLowerCase();
    switch (searchBy) {
      case "name":
        return p.name.toLowerCase().includes(term);
      case "barcode":
        return (p.bar_code?.toLowerCase() ?? "").includes(term);
      case "gtin":
        return (p.gtin?.toLowerCase() ?? "").includes(term);
      case "qr":
        return (p.qr_code?.toLowerCase() ?? "").includes(term);
      default:
        return false;
    }
  });

  const handleAddProduct = (product: ProductViewT) => {
    setRows((prev) => {
      const existing = prev.find((r) => r.id === product.id);
      if (existing) {
        return prev.map((r) =>
          r.id === product.id ? { ...r, qty: r.qty + 1 } : r
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          bar_code: product.bar_code,
          unitPrice: product.price,
          qty: 1,
          freeQty: 0,
          discount: 0,
        },
      ];
    });
    setSearchTerm("");
  };

  if (productsLoading) return <p>جاري تحميل المنتجات...</p>;

  return (
    <div>
      {/* اختيار طريقة البحث */}
      <div className="mb-3 flex gap-2">
        <select
          value={searchBy}
          onChange={(e) =>
            setSearchBy(e.target.value as "name" | "barcode" | "gtin" | "qr")
          }
          className={`border rounded px-2 py-1 ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100 border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="name">اسم المنتج</option>
          <option value="barcode">Barcode</option>
          <option value="gtin">GTIN</option>
          <option value="qr">QR</option>
        </select>

        <input
          type="text"
          placeholder="ابحث عن المنتج"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredProducts[0]) {
              handleAddProduct(filteredProducts[0]);
            }
          }}
          className={`border rounded px-2 py-1 flex-1 ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100 border-gray-600 "
              : "bg-white text-gray-900 border-gray-300"
          }`}
        />
      </div>

      {/* قائمة المنتجات المقترحة */}
      {searchTerm && filteredProducts.length > 0 && (
        <ul className="border rounded max-h-48 overflow-y-auto mb-4">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className={`p-2  cursor-pointer${
                theme === "dark" ? " hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => handleAddProduct(p)}
            >
              {p.name} - {p.bar_code} - {p.price} ج.م
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
