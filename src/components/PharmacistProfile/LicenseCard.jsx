import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiFileUpload } from '../../services/api';

const LicenseCard = ({ pharmacist, editMode, setPharmacist }) => {
  const [preview, setPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const licenseImg = preview
    ? preview
    : pharmacist.image_license?.startsWith('/media')
    ? `http://localhost:8000${pharmacist.image_license}`
    : pharmacist.image_license;

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      
      // Update frontend state immediately
      setPharmacist(prev => ({
        ...prev,
        image_license: file,
        license_status: 'pending'
      }));
      setPreview(URL.createObjectURL(file));

      // Prepare FormData
      const formData = new FormData();
      formData.append('image_license', file);
      formData.append('license_status', 'pending');

      // Add parser to headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      };

      // Make the API call
      const response = await apiFileUpload.patch(
        `users/pharmacists/${pharmacist.id}/`,
        formData,
        config
      );

      // Update state with server response
      setPharmacist(prev => ({
        ...prev,
        image_license: response.data.image_license,
        license_status: response.data.license_status
      }));

    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      
      // Show specific error message if available
      const errorMessage = error.response?.data?.image_license?.[0] || 
                         error.response?.data?.detail || 
                         'Failed to update license';
      alert(errorMessage);
      
      // Revert frontend state
      setPharmacist(prev => ({
        ...prev,
        license_status: status
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-[460px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Pharmacy License</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${statusDisplay.bg} ${statusDisplay.text}`}>
          {statusDisplay.icon}
          {statusDisplay.label}
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ minHeight: '200px' }}>
        {licenseImg ? (
          <div className="w-full h-full p-2">
            <img
              src={licenseImg}
              alt="License"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <p className="mb-2">No license uploaded yet</p>
            <p className="text-sm">Upload your official pharmacy license document</p>
          </div>
        )}
      </div>

      {editMode && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {licenseImg ? 'Update License' : 'Upload License'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUpdating}
            className={`block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {isUpdating && (
            <p className="text-sm text-gray-500 mt-2">Updating license status...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LicenseCard;