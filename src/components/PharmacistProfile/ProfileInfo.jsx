import React from 'react';

const ProfileInfo = ({ user, pharmacist, editMode, setPharmacist }) => {
  const defaultBio = "As a licensed pharmacist, I'm committed to providing excellent pharmaceutical care and medication management to my patients.";

  return (
    <div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600 text-sm mt-1">Role: {user.role}</p>
      </div>

      {/* BIO */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Professional Bio</h3>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          {editMode ? (
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder={defaultBio}
              value={pharmacist.pharmacist_bio || ''}
              onChange={(e) =>
                setPharmacist((prev) => ({ ...prev, pharmacist_bio: e.target.value }))
              }
              rows={5}
            />
          ) : (
            <p className="text-gray-700 text-sm">
              {pharmacist.pharmacist_bio || defaultBio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;