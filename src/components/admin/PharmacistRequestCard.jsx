import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react'; // optional Lucide icons

const PharmacistRequestCard = ({ pharmacist, onClick }) => {
  const {
    name,
    image_profile,
    image_license,
    is_approved,
    created_at,
    email,
    phone_number
  } = pharmacist;

  // Format request date
  const requestDate = new Date(created_at).toLocaleDateString();

  // Determine status with label, color, and icon
  const status =
  pharmacist.license_status === 'approved'
    ? {
        label: 'Approved',
        color: 'bg-green-100 text-green-700',
        icon: <CheckCircle size={16} className="text-green-700" />,
      }
    : pharmacist.license_status === 'rejected'
    ? {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={16} className="text-red-700" />,
      }
    : {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock size={16} className="text-yellow-800" />,
      };


  return (
    <div
      onClick={() => onClick(pharmacist)}
      className="cursor-pointer flex flex-col md:flex-row bg-white shadow hover:shadow-lg transition-all duration-300 p-4 rounded-lg w-full"
    >
      {/* LEFT: Profile info */}
      <div className="flex-1 flex items-start space-x-4">
        <img
          src={image_profile || '/avatar.jpg'}
          alt="Pharmacist"
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {name || 'Unknown Pharmacist'}
          </h3>
          <p className="text-sm text-gray-600">{email}</p>
          {phone_number && (
            <p className="text-sm text-gray-600">{phone_number}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Requested
          </p>
        </div>
      </div>

      {/* MIDDLE: License */}
      <div className="flex-1 flex items-center justify-center my-4 md:my-0">
        {image_license && (
          <a href={image_license} target="_blank" rel="noopener noreferrer">
            <img
              src={image_license}
              alt="License"
              className="max-w-full h-24 object-contain border rounded-md hover:border-blue-500 transition-colors"
            />
          </a>
        )}
      </div>

      {/* RIGHT: Status Badge */}
      <div className="flex flex-col items-end justify-between space-y-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>
    </div>
  );
};

export default PharmacistRequestCard;
