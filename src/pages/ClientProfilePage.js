import React, { useEffect, useState } from "react";
import apiEndpoints from "../services/api";
import { Link } from "react-router-dom";
import Sidebar from "../components/shared/sidebar";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaUserEdit,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa";
import LoadingOverlay from "../components/shared/LoadingOverlay";

const DEFAULT_IMAGE = "https://via.placeholder.com/150/cccccc/ffffff?text=No+Image";

export default function ClientProfilePage() {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    apiEndpoints.client
      .getClientProfile()
      .then((res) => setClientData(res.data))
      .catch(() => setClientData(null));
  }, []);

  if (!clientData) return <LoadingOverlay />;

  const renderBoolean = (val) =>
    val ? (
      <span className="text-green-600 inline-flex items-center gap-1 font-semibold">
        <FaCheckCircle className="text-lg" /> Verified
      </span>
    ) : (
      <span className="text-red-500 inline-flex items-center gap-1 font-semibold">
        <FaTimesCircle className="text-lg" /> Not Verified
      </span>
    );

  const renderLocation = (lat, lon) => {
    if (lat != null && lon != null)
      return (
        <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
          <FaMapMarkerAlt />
          {lat.toFixed(6)}, {lon.toFixed(6)}
        </span>
      );
    return <span className="text-gray-400 italic">Not set</span>;
  };

  return (
    <>
      <Sidebar />
      <div className="ml-64 px-6 py-10 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-300 p-10 transition-all hover:shadow-3xl">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Image */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src={clientData.image_profile || DEFAULT_IMAGE}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform hover:scale-105"
              />
            </div>

            {/* Name and Email */}
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-4xl font-extrabold text-blue-800">
                {clientData.name}
              </h2>
              <p className="text-gray-600 flex justify-center md:justify-start items-center gap-2">
                <FaEnvelope className="text-blue-500" /> {clientData.email}
              </p>
            </div>
          </div>

          {/* Disease Info above locations */}
          <div className="mt-8 mb-6 text-gray-700 text-center md:text-left">
            <p>
              Disease Info:{" "}
              <span className="font-medium">{clientData.info_disease || "N/A"}</span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 mb-6" />

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-[17px] leading-7">
           
            <div>
              <span className="font-semibold">Default Delivery Location:</span>{" "}
              {renderLocation(clientData.default_latitude, clientData.default_longitude)}
            </div>
            <div className="col-span-1 md:col-span-2">
              <span className="font-semibold">Role:</span>{" "}
              <span className="inline-flex items-center gap-2 text-blue-700 font-semibold capitalize">
                <FaUserShield className="text-blue-500" />
                {clientData.role || "client"}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-10 text-end">
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaUserEdit /> Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
