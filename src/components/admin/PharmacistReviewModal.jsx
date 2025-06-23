import React, { useState } from 'react';
import { X } from 'lucide-react';

const PharmacistReviewModal = ({ pharmacist, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState(pharmacist.is_approved === true ? 'approve' :
                                                        pharmacist.is_approved === false ? 'reject' : 'pending');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (selectedStatus === 'pending') return;
    setLoading(true);
    await onConfirm(pharmacist.id, selectedStatus);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* License Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src={pharmacist.image_license}
              alt="License"
              className="w-full h-64 object-contain border rounded-md"
            />
          </div>

          {/* Info + Status Selection */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={pharmacist.image_profile || '/avatar.jpg'}
                alt="Pharmacist"
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{pharmacist.name}</h2>
                <p className="text-sm text-gray-500">{pharmacist.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Status</label>
              <div className="flex gap-4">
                {['pending', 'approve', 'reject'].map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className={`mt-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistReviewModal;
