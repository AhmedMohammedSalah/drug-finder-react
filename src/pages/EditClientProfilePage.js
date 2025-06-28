import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiEndpoints from "../services/api";
import { toast } from "react-toastify";
import Sidebar from "../components/shared/sidebar";

export default function EditClientProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    info_disease: "",
    image_profile: null,
    default_latitude: "",
    default_longitude: "",
    last_latitude: "",
    last_longitude: "",
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    apiEndpoints.client.getClientProfile().then((res) => {
      const data = res.data;
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
        info_disease: data.info_disease || "",
        image_profile: null,
        default_latitude: data.default_latitude ?? "",
        default_longitude: data.default_longitude ?? "",
        last_latitude: data.last_latitude ?? "",
        last_longitude: data.last_longitude ?? "",
      });
      setPreview(data.image_profile);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_profile" && files?.[0]) {
      setFormData({ ...formData, image_profile: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      const userPayload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) userPayload.password = formData.password;
      await apiEndpoints.users.updateUser(userPayload);

      const clientForm = new FormData();
      clientForm.append("info_disease", formData.info_disease);
      clientForm.append("default_latitude", formData.default_latitude);
      clientForm.append("default_longitude", formData.default_longitude);
      clientForm.append("last_latitude", formData.last_latitude);
      clientForm.append("last_longitude", formData.last_longitude);
      if (formData.image_profile) {
        clientForm.append("image_profile", formData.image_profile);
      }

      await apiEndpoints.client.updateClientProfile(clientForm);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to save changes.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <>
     <Sidebar />
    <div className="ml-64 px-2 py-3 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 p-10 transition-all hover:shadow-3xl">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Edit Profile</h2>

          {success && (
            <div className="p-4 mb-6 text-sm text-green-800 bg-green-100 rounded-lg border border-green-400">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile image */}
            <div className="flex flex-col items-center gap-3">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
                />
              )}
              <label className="cursor-pointer bg-white hover:bg-blue-100 text-blue-600 text-sm px-4 py-2 rounded shadow transition">
                Upload Profile Image
                <input
                  type="file"
                  name="image_profile"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "New Password", name: "password", type: "password" },
                { label: "Confirm Password", name: "confirmPassword", type: "password" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[name] && (
                    <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Info Disease */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Health Info</label>
              <textarea
                name="info_disease"
                value={formData.info_disease}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Describe any health conditions..."
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["default_latitude", "Default Latitude"],
                ["default_longitude", "Default Longitude"],
                ["last_latitude", "Last Latitude"],
                ["last_longitude", "Last Longitude"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
