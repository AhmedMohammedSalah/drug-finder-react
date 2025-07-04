import React, { useEffect, useState } from "react";
import apiEndpoints from "../services/api";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaUserEdit,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa";
import SharedLoadingComponent from "../components/shared/medicalLoading";

const DEFAULT_IMAGE = "https://via.placeholder.com/150/cccccc/ffffff?text=No+Image";

export default function ClientProfilePage() {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    apiEndpoints.client
      .getClientProfile()
      .then((res) => setClientData(res.data))
      .catch(() => setClientData(null));
  }, []);

  if (!clientData)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <SharedLoadingComponent
          loadingText="Loading your profile..."
          gif="/profileLoading.gif"
        />
      </div>
    );

  const renderLocation = (lat, lon) => {
    if (lat != null && lon != null)
      return (
        <span className="inline-flex items-center gap-1 sm:gap-2 text-gray-700 font-medium text-sm sm:text-base">
          <FaMapMarkerAlt className="flex-shrink-0" />
          <span className="break-all">{lat.toFixed(6)}, {lon.toFixed(6)}</span>
        </span>
      );
    return <span className="text-gray-400 italic text-sm sm:text-base">Not set</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white -m-6">
      {/* Main Content Container */}
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden transition-all hover:shadow-2xl">
            {/* Card Content */}
            <div className="p-4 xs:p-6 sm:p-8 lg:p-10">
              {/* Profile Header */}
              <div className="flex flex-col items-center space-y-6 sm:space-y-8">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={clientData.image_profile || DEFAULT_IMAGE}
                    alt="Profile"
                    className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
                </div>

                {/* Profile Info */}
                <div className="text-center space-y-3 w-full max-w-lg">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words leading-tight">
                    {clientData.name}
                  </h1>
                  <div className="flex justify-center items-center gap-2 text-gray-600 text-sm sm:text-base">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <span className="break-all">{clientData.email}</span>
                  </div>
                </div>
              </div>

              {/* Disease Info Section */}
              <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">
                    Medical Information
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Disease Info:</span>{" "}
                    <span className="text-blue-700 font-medium">
                      {clientData.info_disease || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="mt-8 sm:mt-10 space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                  Profile Details
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Default Delivery Location */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      Default Delivery Location
                    </h4>
                    <div className="text-gray-700">
                      {renderLocation(clientData.default_latitude, clientData.default_longitude)}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      Account Role
                    </h4>
                    <div className="inline-flex items-center gap-2 text-blue-700 font-semibold capitalize text-sm sm:text-base">
                      <FaUserShield className="text-blue-500 flex-shrink-0" />
                      <span>{clientData.role || "client"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex justify-center sm:justify-end">
                <Link
                  to="/client/profile/edit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base font-medium w-full sm:w-auto justify-center"
                >
                  <FaUserEdit className="flex-shrink-0" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}