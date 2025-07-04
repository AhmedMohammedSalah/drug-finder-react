import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiEndpoints from "../services/api";
import { toast } from "react-toastify";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Mapbox refs
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

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
      });
      setPreview(data.image_profile);
      setIsLoading(false);
      
      // Initialize map after component mounts
      setTimeout(() => {
        if (data.default_latitude && data.default_longitude) {
          initializeMap([data.default_longitude, data.default_latitude]);
        } else {
          initializeMap([-0.1276, 51.5074]); 
        }
      }, 100);
    });
  }, []);

  const initializeMap = (center) => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 12
    });

    if (formData.default_latitude && formData.default_longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map.current);
    }

    // Handle click event to update location
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      setFormData(prev => ({
        ...prev,
        default_latitude: lat.toString(),
        default_longitude: lng.toString()
      }));
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);
      }
    });
  };

  // Get user location geo location
  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prev => ({
          ...prev,
          default_latitude: latitude.toString(),
          default_longitude: longitude.toString()
        }));
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14
          });
          
          if (marker.current) {
            marker.current.setLngLat([longitude, latitude]);
          } else {
            marker.current = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        }
        
        setIsLocating(false);
        toast.success("Location updated successfully!");
      },
      (error) => {
        let errorMessage = "Error getting location: ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "The request to get user location timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        setLocationError(errorMessage);
        setIsLocating(false);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

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
      if (formData.image_profile) {
        clientForm.append("image_profile", formData.image_profile);
      }

      await apiEndpoints.client.updateClientProfile(clientForm);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/client/profile");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to save changes.");
    }
  };

  const handleCancel = () => {
    navigate("/client/profile");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white -m-6">
      {/* Main Content Container */}
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Edit Profile Card */}
          <div className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden transition-all hover:shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-6 sm:py-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
                Edit Profile
              </h1>
              <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">
                Update your personal information and preferences
              </p>
            </div>

            {/* Form Content */}
            <div className="p-4 xs:p-6 sm:p-8 lg:p-10">
              {success && (
                <div className="p-4 mb-6 text-sm sm:text-base text-green-800 bg-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Profile updated successfully!
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 border-4 border-blue-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-blue-200 transition-all duration-200 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Profile Image
                    <input
                      type="file"
                      name="image_profile"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { label: "Full Name", name: "name", type: "text", required: true },
                      { label: "Email Address", name: "email", type: "email", required: true },
                      { label: "New Password", name: "password", type: "password", required: false },
                      { label: "Confirm Password", name: "confirmPassword", type: "password", required: false },
                    ].map(({ label, name, type, required }) => (
                      <div key={name} className="space-y-2">
                        <label className="block font-medium text-gray-700 text-sm sm:text-base">
                          {label}
                          {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                            errors[name] ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                        {errors[name] && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors[name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Medical Information
                  </h3>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 text-sm sm:text-base">
                      Health Information
                    </label>
                    <textarea
                      name="info_disease"
                      value={formData.info_disease}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                      placeholder="Describe any health conditions, allergies, or medical information that might be relevant..."
                    />
                  </div>
                </div>

                {/* Location Settings */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:border-b-0 sm:pb-0">
                      Default Delivery Location
                    </h3>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                      className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 text-blue-700 disabled:text-gray-500 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 w-full sm:w-auto"
                    >
                      {isLocating ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Locating...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Use Current Location
                        </>
                      )}
                    </button>
                  </div>

                  {locationError && (
                    <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{locationError}</span>
                    </div>
                  )}

                  {/* Map Container */}
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Click on the map to set your default delivery location
                    </p>
                    <div 
                      ref={mapContainer} 
                      className="w-full h-48 sm:h-64 lg:h-72 rounded-xl border border-gray-300 overflow-hidden shadow-inner"
                    />
                  </div>

                  {/* Coordinate Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      ["default_latitude", "Latitude"],
                      ["default_longitude", "Longitude"],
                    ].map(([name, label]) => (
                      <div key={name} className="space-y-2">
                        <label className="block font-medium text-gray-700 text-sm sm:text-base">
                          {label}
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                          readOnly
                          placeholder={`${label} will be set automatically`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}