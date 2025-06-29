import { Package, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../features/cartSlice';

const MedicinePopup = ({ medicines, show, onClose, onFocusPharmacy }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (medicine) => {
    dispatch(addToCart(medicine));
    onClose();
  };

  const handleViewPharmacy = (pharmacyId) => {
    onFocusPharmacy(pharmacyId);
    onClose();
  };

  if (!show || medicines.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Available Medicines ({medicines.length} found)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {medicines.map((medicine) => (
              <div key={medicine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <img 
                    className="h-48 w-full md:w-48 object-contain mb-4 md:mb-0 md:mr-4"
                    src={medicine.image || 'https://placehold.co/300x200?text=No+Image'}
                    alt={medicine.generic_name || medicine.brand_name || 'Medicine'}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{medicine.generic_name}</h3>
                    <p className="text-gray-600">Brand: {medicine.brand_name}</p>
                    <p className="text-gray-600">Available at: {medicine.store_name}</p>
                    <p className="text-gray-600">Price: ${medicine.price}</p>
                    <p className="text-gray-600">Stock: {medicine.stock}</p>
                    {medicine.description && (
                      <p className="text-gray-600 mt-2 text-sm">{medicine.description}</p>
                    )}
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleAddToCart(medicine)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleViewPharmacy(medicine.pharmacy_id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        View Pharmacy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePopup;