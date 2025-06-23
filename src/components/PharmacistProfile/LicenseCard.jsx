import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const LicenseCard = ({ pharmacist, editMode, setPharmacist }) => {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // For showing uploaded image before saving

  const licenseImg = preview
    ? preview
    : pharmacist.image_license?.startsWith('/media')
    ? `http://localhost:8000${pharmacist.image_license}`
    : pharmacist.image_license;

  // === DYNAMIC LICENSE STATUS ===
  const status = pharmacist.license_status;

  let statusDisplay = {
    label: 'Pending Approval',
    icon: <Clock size={16} className="text-yellow-700" />,
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  };

  if (status === 'approved') {
    statusDisplay = {
      label: 'Approved',
      icon: <CheckCircle size={16} className="text-green-700" />,
      bg: 'bg-green-100',
      text: 'text-green-700',
    };
  } else if (status === 'rejected') {
    statusDisplay = {
      label: 'Rejected',
      icon: <XCircle size={16} className="text-red-700" />,
      bg: 'bg-red-100',
      text: 'text-red-700',
    };
  }

  // === HANDLE FILE CHANGE ===
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPharmacist((prev) => ({
        ...prev,
        image_license: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">License Status</h3>

      {/* STATUS TAG */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${statusDisplay.bg} ${statusDisplay.text}`}>
        {statusDisplay.icon}
        {statusDisplay.label}
      </div>

      {/* LICENSE IMAGE */}
      <div>
        {licenseImg ? (
          <img
            src={licenseImg}
            alt="License"
            className="w-full h-64 object-contain rounded-lg border border-gray-300 shadow-sm mt-2"
          />
        ) : (
          <p className="text-sm text-gray-500 italic">No license uploaded yet.</p>
        )}

        {/* UPLOAD FILE INPUT */}
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default LicenseCard;
