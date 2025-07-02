import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiEndpoints from "../services/api";
import { toast } from "react-toastify";
import Sidebar from "../components/shared/sidebar";
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
  const navigate = useNavigate();
  
  //[OKS]  Mapbox refs
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
      
      if (data.default_latitude && data.default_longitude) {
        initializeMap([data.default_longitude, data.default_latitude]);
      } else {
        initializeMap([-0.1276, 51.5074]); 
      }
    });
  }, []);

  const initializeMap = (center) => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 12
    });

    // Add marker if coordinates exist
    if (formData.default_latitude && formData.default_longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map.current);
    }

    // [OKS]  handle click event to update location
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

  // [OKS] get user location geo location
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
      <div className="ml-64 px-2 py-3 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-300 p-10 transition-all hover:shadow-3xl">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            Edit Profile
          </h2>

          {success && (
            <div className="p-4 mb-6 text-sm text-green-800 bg-green-100 rounded-lg border border-green-400">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
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


            {/*[OKS] add map  ui to get location */ }
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Default Location</h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm transition"
                >
                  {isLocating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Locating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Use My Current Location
                    </>
                  )}
                </button>
              </div>

              {locationError && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  {locationError}
                </div>
              )}

              <div 
                ref={mapContainer} 
                className="w-full h-64 rounded-lg border border-gray-300 overflow-hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["default_latitude", "Latitude"],
                  ["default_longitude", "Longitude"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>

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
    </>
  );
}