import React, { useEffect, useState } from "react";
import apiEndpoints from "../../services/api";
import MedicineCard from "./MedicineCard";
import { PlusCircle, PackageX } from "lucide-react";
import AddMedicineModal from "./AddMedicineModal";

const MedicineManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);

  // 👇 Used for editing
  const [editingMedicine, setEditingMedicine] = useState(null);

  useEffect(() => {
    const fetchMedicinesAndStore = async () => {
      try {
        setLoading(true);
        const pharmacistRes = await apiEndpoints.users.getPharmacistProfile();
        const storeId = pharmacistRes.data?.medical_stores_data?.id;
        setStoreId(storeId);

        const res = await apiEndpoints.inventory.getMedicines();
        setMedicines(res.data.results || []);
      } catch (error) {
        console.error("Failed to fetch medicines or store", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicinesAndStore();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-600">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2" />
        <span>Loading medicines...</span>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white border rounded-xl overflow-hidden">
      {/* Blue Header Section */}
      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Medicine Inventory</h2>
        <button
          onClick={() => {
            setEditingMedicine(null);
            setShowModal(true);
          }}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2 transition-colors duration-200"
        >
          <PlusCircle size={18} /> Add Medicine
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {medicines.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <PackageX className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">No medicines found.</p>
            <p className="text-sm text-gray-400 mb-4">
              Start by adding your first medicine.
            </p>
            <button
              onClick={() => {
                setEditingMedicine(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 transition-colors duration-200"
            >
              <PlusCircle size={18} /> Add Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onDeleted={() =>
                  setMedicines((prev) =>
                    prev.filter((m) => m.id !== medicine.id)
                  )
                }
                onEdit={(medicine) => {
                  setEditingMedicine(medicine);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Modal (add or edit) */}
        {showModal && (
          <AddMedicineModal
            storeId={storeId}
            initialData={editingMedicine} // 👈 Pass medicine to edit, or undefined
            onClose={() => setShowModal(false)}
            onSuccess={(savedMedicine) => {
              if (editingMedicine) {
                // UPDATE existing one
                setMedicines((prev) =>
                  prev.map((m) => (m.id === savedMedicine.id ? savedMedicine : m))
                );
              } else {
                // ADD new one
                setMedicines((prev) => [savedMedicine, ...prev]);
              }

              setShowModal(false);
              setEditingMedicine(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MedicineManager;
