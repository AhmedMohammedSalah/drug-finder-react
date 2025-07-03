import React, { useEffect, useState } from "react";
import apiEndpoints from "../../services/api";

const ArchivePage = () => {
  const [storeId, setStoreId] = useState(null);
  const [deletedMedicines, setDeletedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const fetchStoreAndDeletedMedicines = async () => {
      try {
        setLoading(true);
        
        // Get pharmacist's store ID
        const pharmacistRes = await apiEndpoints.users.getPharmacistProfile();
        const store = pharmacistRes.data?.medical_stores_data;

        if (!store || !store.id) {
          setError("You don't have an assigned store.");
          return;
        }

        setStoreId(store.id);

        // Get deleted medicines for the store
        const deletedRes = await apiEndpoints.inventory.getDeletedMedicinesByStore(store.id);
        setDeletedMedicines(deletedRes.data.results);

      } catch (error) {
        setError("Failed to load archive. Please try again later.");
        console.error("Failed to load archive:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndDeletedMedicines();
  }, []);

  const handleAdjustClick = (medicine) => {
    setEditingMedicine(medicine);
    setQuantity(0); // Start from zero as requested
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  const handleConfirmAdjustment = async () => {
    try {
      const payload = {
        stock: quantity,
        is_deleted: quantity <= 0 // Only false when quantity > 0
      };

      await apiEndpoints.inventory.updateMedicine(editingMedicine.id, payload);

      // Update local state
      setDeletedMedicines(prevMedicines => {
        if (quantity > 0) {
          // Remove from deleted list if restored
          return prevMedicines.filter(m => m.id !== editingMedicine.id);
        } else {
          // Update stock but keep in archive
          return prevMedicines.map(m => 
            m.id === editingMedicine.id ? { ...m, stock: quantity } : m
          );
        }
      });

      showNotification(
        quantity > 0 
          ? 'Medicine restored and stock updated!' 
          : 'Stock updated (medicine remains archived)',
        'success'
      );
      setEditingMedicine(null);
    } catch (err) {
      showNotification('Failed to update medicine stock', 'error');
      console.error('Error updating medicine:', err);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">You don't have an assigned store.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Archived Medicines</h1>

      {deletedMedicines.length === 0 ? (
        <p className="text-gray-600">No deleted medicines found for your store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deletedMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img 
                  src={medicine.image || '/placeholder-medicine.jpg'} 
                  alt={medicine.name}
                  className="h-full w-full object-contain p-4"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                <p className="text-gray-600 mb-4">Current Stock: {medicine.stock}</p>
                
                {editingMedicine?.id === medicine.id ? (
                  <div className="mt-auto">
                    <div className="mb-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        New Stock Amount
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="0"
                        className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMedicine(null)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmAdjustment}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdjustClick(medicine)}
                    className="w-full mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                  >
                    Adjust Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ArchivePage;