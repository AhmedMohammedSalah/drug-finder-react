import React, { useState } from 'react';

const LicenseCard = ({ pharmacist, editMode, setPharmacist }) => {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // for displaying the new image

  const licenseImg = preview
    ? preview
    : pharmacist.image_license?.startsWith('/media')
    ? `http://localhost:8000${pharmacist.image_license}`
    : pharmacist.image_license;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPharmacist((prev) => ({
        ...prev,
        image_license: file, // 👈 store actual file
      }));
      setPreview(URL.createObjectURL(file)); // just for preview
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">License Status</h3>

      {!pharmacist.is_approved ? (
        <span className="text-sm bg-yellow-400 text-gray-800 font-medium px-3 py-1 rounded-full">
          Pending Approval
        </span>
      ) : (
        <span className="text-sm bg-green-500 text-white font-medium px-3 py-1 rounded-full">
          Approved
        </span>
      )}

      <div>
        {licenseImg ? (
          <img
            src={licenseImg}
            alt="License"
            className="w-full h-64 object-contain rounded-lg border border-gray-300 shadow-sm"
          />
        ) : (
          <p className="text-sm text-gray-500 italic">No license uploaded yet.</p>
        )}

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
