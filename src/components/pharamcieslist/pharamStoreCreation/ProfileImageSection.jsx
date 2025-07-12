import React from "react";
import { Pencil, Store } from "lucide-react";

const ProfileImageSection = ({ logoImage, setLogoImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoImage(file);
    }
  };

  const imageSrc =
    logoImage instanceof File
      ? URL.createObjectURL(logoImage)
      : logoImage?.startsWith("http")
      ? logoImage
      : logoImage
      ? `https://ahmedmsalah.pythonanywhere.com${logoImage}`
      : null;

  return (
    <div className="relative">
      <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-400 flex-shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Store className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
          </div>
        )}
      </div>

      {setLogoImage && (
        <label className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center cursor-pointer z-20 hover:bg-gray-50 transition">
          <Pencil className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

export default ProfileImageSection;
