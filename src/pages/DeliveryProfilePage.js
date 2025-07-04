import React, { useEffect, useState } from "react";
import axios from "axios";
import SharedLoadingComponent from "../components/shared/medicalLoading";
import { Pencil, Save, X } from "lucide-react";

const BASE_URL = "http://localhost:8000";

const DeliveryProfilePage = () => {
  const [profileData, setProfileData] = useState({
    user: null,
    delivery: null,
    loading: true,
    error: null,
    editMode: false,
  });
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [files, setFiles] = useState({
    image_profile: null,
    delivery_license: null,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const [userRes, deliveryRes] = await Promise.all([
          axios.get(`${BASE_URL}/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/users/me/delivery/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfileData((prev) => ({
          ...prev,
          user: userRes.data,
          delivery: deliveryRes.data,
          loading: false,
        }));

        setLocation({
          lat: deliveryRes.data.default_latitude || "",
          lng: deliveryRes.data.default_longitude || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setProfileData((prev) => ({
          ...prev,
          error: err.response?.data?.message || "Failed to fetch profile",
          loading: false,
        }));
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e, field) => {
    if (e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));

      // Create preview for UI
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          delivery: {
            ...prev.delivery,
            [field]: event.target.result,
          },
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      setProfileData((prev) => ({ ...prev, loading: true }));
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      // Append files if they exist
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      // Append location data if changed
      if (location.lat !== "" && location.lng !== "") {
        formData.append("default_latitude", location.lat);
        formData.append("default_longitude", location.lng);
      }

      const response = await axios.patch(
        `${BASE_URL}/users/deliveries/${profileData.delivery.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData((prev) => ({
        ...prev,
        delivery: response.data,
        editMode: false,
        loading: false,
      }));
      setFiles({ image_profile: null, delivery_license: null });
    } catch (error) {
      console.error("Update failed:", error);
      setProfileData((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Failed to update profile",
        loading: false,
      }));
    }
  };

  const getImageUrl = (field) => {
    if (files[field]) return profileData.delivery[field]; // This is the preview URL
    if (profileData.delivery[field]?.startsWith("/media")) {
      return `${BASE_URL}${profileData.delivery[field]}`;
    }
    return (
      profileData.delivery[field] ||
      `/default-${field === "image_profile" ? "profile" : "license"}.png`
    );
  };

  if (profileData.loading) {
    return <SharedLoadingComponent gif="/profileLoading.gif" />;
  }

  if (profileData.error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>{profileData.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-3xl mx-auto my-10 rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="relative mb-4">
            <img
              src={getImageUrl("image_profile")}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
            />
            {profileData.editMode && (
              <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-md border border-gray-300 hover:bg-gray-100 transition-colors">
                <Pencil size={18} className="text-blue-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image_profile")}
                />
              </label>
            )}
          </div>

          <button
            onClick={() =>
              setProfileData((prev) => ({ ...prev, editMode: !prev.editMode }))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow ${
              profileData.editMode
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } transition-colors`}
          >
            <Pencil size={16} />
            <span>
              {profileData.editMode ? "Cancel Editing" : "Edit Profile"}
            </span>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.user.name}
            </h2>
            <p className="text-gray-600">{profileData.user.email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Default Location
              </label>
              {profileData.editMode ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location.lat}
                      onChange={(e) =>
                        setLocation((prev) => ({
                          ...prev,
                          lat: e.target.value,
                        }))
                      }
                      placeholder="e.g. 40.7128"
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location.lng}
                      onChange={(e) =>
                        setLocation((prev) => ({
                          ...prev,
                          lng: e.target.value,
                        }))
                      }
                      placeholder="e.g. -74.0060"
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">
                  {profileData.delivery.default_latitude || "Not set"},{" "}
                  {profileData.delivery.default_longitude || "Not set"}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Delivery License
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src={getImageUrl("delivery_license")}
                  alt="Delivery License"
                  className="w-48 h-32 object-contain border rounded shadow"
                />
                {profileData.editMode && (
                  <label className="mt-2 flex items-center gap-2 bg-white p-2 rounded cursor-pointer border border-gray-300 shadow hover:bg-gray-100 transition-colors">
                    <Pencil size={16} className="text-blue-600" />
                    <span className="text-sm">Change License</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "delivery_license")}
                    />
                  </label>
                )}
              </div>
              <div className="mt-3">
                <span className="font-semibold">Status: </span>
                <span
                  className={`font-medium ${
                    profileData.delivery.license_status === "accepted"
                      ? "text-green-600"
                      : profileData.delivery.license_status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {profileData.delivery.license_status
                    ?.charAt(0)
                    .toUpperCase() +
                    profileData.delivery.license_status?.slice(1)}
                </span>
                {profileData.delivery.license_status === "rejected" &&
                  profileData.delivery.reject_message && (
                    <div className="mt-1 text-red-500 text-sm">
                      <p className="font-medium">Rejection Reason:</p>
                      <p>{profileData.delivery.reject_message}</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {profileData.editMode && (
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() =>
              setProfileData((prev) => ({ ...prev, editMode: false }))
            }
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium shadow transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={profileData.loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium shadow transition-colors disabled:opacity-70"
          >
            <Save size={16} />
            {profileData.loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryProfilePage;
