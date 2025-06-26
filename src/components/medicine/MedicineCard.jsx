import React from "react";
import { Pencil, Trash } from "lucide-react";
import apiEndpoints from "../../services/api";

const MedicineCard = ({ medicine, onDeleted, onEdit }) => {
  const handleDelete = async () => {
    const confirm = window.confirm(`Delete medicine "${medicine.brand_name}"?`);
    if (!confirm) return;

    try {
      await apiEndpoints.inventory.deleteMedicine(medicine.id);
      onDeleted();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete medicine.");
    }
  };

  return (
    <div className="relative w-64 bg-white border border-gray-200 rounded-xl pt-10 pb-4 px-4 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Action buttons - positioned in card header area */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(medicine)}
          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-blue-500 hover:text-blue-600 transition-all duration-200 border border-gray-200 hover:border-blue-200"
          aria-label="Edit medicine"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-red-500 hover:text-red-600 transition-all duration-200 border border-gray-200 hover:border-red-200"
          aria-label="Delete medicine"
          title="Delete"
        >
          <Trash size={16} />
        </button>
      </div>

      {/* Medicine image - pushed down by card padding */}
      <div className="w-full h-40 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={medicine.image || "/placeholder.png"}
          alt={medicine.brand_name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </div>

      {/* Medicine details */}
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{medicine.brand_name}</h3>
        <p className="text-sm text-gray-500 truncate">{medicine.generic_name}</p>

        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            medicine.stock > 10
              ? "bg-green-100 text-green-800"
              : medicine.stock > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {medicine.stock} in stock
          </span>
          <span className="text-base font-semibold text-blue-600">
            ${parseFloat(medicine.price).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
