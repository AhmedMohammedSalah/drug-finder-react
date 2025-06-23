import React from 'react';
import { Pencil } from 'lucide-react';

const FacultyCard = ({ pharmacist, editMode, setPharmacist }) => {
  const logo =
    pharmacist.pharmacist_faculty_logo && pharmacist.pharmacist_faculty_logo.startsWith('/media')
      ? `http://localhost:8000${pharmacist.pharmacist_faculty_logo}`
      : 'https://upload.wikimedia.org/wikipedia/commons/5/54/University.png';

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Faculty</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow flex items-center gap-4">
        <div className="relative">
          <img
            src={logo}
            alt="Faculty"
            className="w-16 h-16 rounded object-contain border"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow">
              <Pencil size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPharmacist((prev) => ({
                      ...prev,
                      pharmacist_faculty_logo: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          {editMode ? (
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Faculty of Pharmacy - Cairo University"
              value={pharmacist.pharmacist_faculty || ''}
              onChange={(e) =>
                setPharmacist((prev) => ({ ...prev, pharmacist_faculty: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-700 text-sm">{pharmacist.pharmacist_faculty || 'Faculty of Pharmacy - Cairo University'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
