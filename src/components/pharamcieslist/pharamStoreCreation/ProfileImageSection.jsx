import React from 'react';
import { Pencil, Store } from 'lucide-react';

const ProfileImageSection = ({ logoImage, setLogoImage }) => {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="relative h-40">
      <div className="relative mx-auto lg:mx-0 w-40 h-40 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-400 flex-shrink-0">
        {logoImage ? (
          <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Store size={96} />
          </div>
        )}
      </div>
      <label className="absolute -bottom-4 -right-4 w-14 h-14 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center cursor-pointer z-20">
        <Pencil className="w-6 h-6 text-gray-600" />
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </label>
    </div>
  );
};

export default ProfileImageSection;
