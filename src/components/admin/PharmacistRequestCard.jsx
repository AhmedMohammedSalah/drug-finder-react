import React from 'react';

const PharmacistRequestCard = ({ pharmacist, onAction }) => {
  const {
    id,
    name,
    image_profile,
    image_license,
    is_approved,
    created_at,
    email,
    phone_number
  } = pharmacist;

  // Format date
  const requestDate = new Date(created_at).toLocaleDateString();

  // Determine status
  const status = is_approved === true
    ? { label: 'Approved', color: 'bg-green-100 text-green-700', icon: '✓' }
    : is_approved === false
    ? { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: '✗' }
    : { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '!' };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow hover:shadow-lg transition-all duration-300 p-4 rounded-lg w-full">
      {/* LEFT: Profile info */}
      <div className="flex-1 flex items-start space-x-4">
        <img
          src={image_profile || '/avatar.jpg'}
          alt="Pharmacist"
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name || 'Unknown Pharmacist'}</h3>
          <p className="text-sm text-gray-600">{email}</p>
          {phone_number && <p className="text-sm text-gray-600">{phone_number}</p>}
          <p className="text-xs text-gray-500 mt-1">Requested on: {requestDate}</p>
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

      {/* RIGHT: Status and actions */}
      <div className="flex flex-col items-end justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
          >
            {status.label}
          </div>
        </div>
        
        {is_approved === null && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAction(id, 'approve')}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Approve
            </button>
            <button
              onClick={() => onAction(id, 'reject')}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistRequestCard;