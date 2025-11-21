import React, { useState } from "react";
import ProductsBulkImport from "../ProductsBulkImport/ProductsBulkImport";

export default function ImportModalButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      >
        Import Products
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="overflow-y-auto fixed inset-0 bg-black/50 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <ProductsBulkImport onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
