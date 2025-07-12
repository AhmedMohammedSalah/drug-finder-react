import React from "react";
import { Pencil } from "lucide-react";

const defaultBanner =
  "https://images.pexels.com/photos/3683051/pexels-photo-3683051.jpeg?cs=srgb&dl=pexels-shvetsa-3683051.jpg&fm=jpg";

const ProfileBanner = ({ pharmacist, editMode, setPharmacist }) => {
  const banner = pharmacist.pharmacist_banner
    ? `https://ahmedmsalah.pythonanywhere.com${pharmacist.pharmacist_banner}`
    : defaultBanner;

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPharmacist((prev) => ({
        ...prev,
        pharmacist_banner: URL.createObjectURL(file),
      }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPharmacist((prev) => ({
        ...prev,
        image_profile: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="relative">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      />
      {editMode && (
        <label className="absolute top-2 left-2 bg-white bg-opacity-80 p-1 rounded-full cursor-pointer shadow">
          <Pencil size={18} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </label>
      )}
      <div className="absolute left-6 -bottom-12">
        <img
          src={
            pharmacist.image_profile.startsWith("/media")
              ? `https://ahmedmsalah.pythonanywhere.com${pharmacist.image_profile}`
              : pharmacist.image_profile
          }
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
        />
        {editMode && (
          <label className="absolute -top-2 -right-2 bg-white p-1 rounded-full cursor-pointer shadow">
            <Pencil size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;
