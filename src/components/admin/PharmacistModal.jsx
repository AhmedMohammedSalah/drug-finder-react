import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const PharmacistModal = ({ pharmacist, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState(
    pharmacist.license_status || "pending"
  );
  const [rejectMessage, setRejectMessage] = useState(
    pharmacist.reject_message || ""
  );
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const zoomContainerRef = useRef(null);

  useEffect(() => {
    setSelectedStatus(pharmacist.license_status || "pending");
    setRejectMessage(pharmacist.reject_message || "");
    setZoom(1); // reset zoom
  }, [pharmacist]);

  const handleZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => {
      const next = prev + delta;
      return Math.min(Math.max(1, next), 3); // between 1x and 3x
    });
  };

  const handleConfirm = async () => {
    const toastId = toast.loading("Saving...", {
      position: "top-right",
      style: { animation: "slide-in-right 0.3s ease-out" },
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const body = { license_status: selectedStatus };

      if (selectedStatus === "rejected") {
        body.reject_message = rejectMessage;
      }

      await axios.patch(
        `https://ahmedmsalah.pythonanywhere.com/users/pharmacists/${pharmacist.id}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Pharmacist updated successfully!", {
        id: toastId,
        duration: 4000,
      });

      onConfirm(pharmacist.id, selectedStatus, rejectMessage);
      onClose();
    } catch (error) {
      toast.error("Failed to update pharmacist.", {
        id: toastId,
        duration: 5000,
      });
      console.error("Failed to update pharmacist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    toast("Saving canceled", {
      icon: "❌",
      duration: 3000,
      position: "top-right",
    });
    onClose();
  };

  if (!pharmacist) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* License Image Zoomable */}
          <div
            ref={zoomContainerRef}
            onWheel={handleZoom}
            className="w-full md:w-1/2 border rounded-md overflow-auto max-h-[600px] bg-gray-100"
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.1s ease-out",
                width: "100%",
              }}
              className="flex justify-center items-center"
            >
              <img
                src={pharmacist.image_license}
                alt="License"
                className="object-contain w-full h-auto"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={pharmacist.image_profile || "/avatar.jpg"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {pharmacist.name}
                </h3>
                <p className="text-sm text-gray-600">{pharmacist.email}</p>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Reject Reason */}
            {selectedStatus === "rejected" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-red-700">
                  Reject Reason
                </label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
                  rows={4}
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  placeholder="Explain the problem with the license..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Confirm Button */}
        <div className="mt-6 sticky bottom-0 bg-white pt-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold text-sm ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacistModal;
