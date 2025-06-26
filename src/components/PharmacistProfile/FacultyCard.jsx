import React from 'react';
import { Pencil } from 'lucide-react';
import { GraduationCap } from 'lucide-react';

const FacultyCard = ({ pharmacist, editMode, setPharmacist }) => {
  const defaultFaculty = "Please enter your pharmacy faculty/university";
  
  const logo =
    pharmacist.pharmacist_faculty_logo && pharmacist.pharmacist_faculty_logo.startsWith('/media')
      ? `http://localhost:8000${pharmacist.pharmacist_faculty_logo}`
      : null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Education</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow flex items-center gap-4">
        <div className="relative">
          {logo ? (
            <img
              src={logo}
              alt="Faculty"
              className="w-16 h-16 rounded object-contain border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
          )}
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
              placeholder={defaultFaculty}
              value={pharmacist.pharmacist_faculty || ''}
              onChange={(e) =>
                setPharmacist((prev) => ({ ...prev, pharmacist_faculty: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-700 text-sm">
              {pharmacist.pharmacist_faculty || defaultFaculty}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;