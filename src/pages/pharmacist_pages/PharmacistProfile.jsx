import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileInfo from "../../components/PharmacistProfile/ProfileInfo";
import FacultyCard from "../../components/PharmacistProfile/FacultyCard";
import LicenseCard from "../../components/PharmacistProfile/LicenseCard";
import EmailCard from "../../components/PharmacistProfile/EmailCard";
import { Pencil } from "lucide-react";
import SharedLoadingComponent from "../../components/shared/medicalLoading";

const BASE_URL = "http://localhost:8000";

const PharmacistProfilePage = () => {
  const [user, setUser] = useState(null);
  const [pharmacist, setPharmacist] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return setError("No access token");

        const userRes = await axios.get(`${BASE_URL}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pharmacistRes = await axios.get(
          `${BASE_URL}/users/me/pharmacist/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data);
        setPharmacist(pharmacistRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile");
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      // Set default bio if empty
      const bio =
        pharmacist.pharmacist_bio ||
        "As a licensed pharmacist, I'm committed to providing excellent pharmaceutical care and medication management to my patients.";
      formData.append("pharmacist_bio", bio);

      formData.append(
        "pharmacist_faculty",
        pharmacist.pharmacist_faculty || "Faculty of Pharmacy"
      );

      if (pharmacist.image_profile instanceof File) {
        formData.append("image_profile", pharmacist.image_profile);
      }
      if (pharmacist.image_license instanceof File) {
        formData.append("image_license", pharmacist.image_license);
      }
      if (pharmacist.pharmacist_faculty_logo instanceof File) {
        formData.append(
          "pharmacist_faculty_logo",
          pharmacist.pharmacist_faculty_logo
        );
      }

      const response = await axios.patch(
        `${BASE_URL}/users/pharmacists/${pharmacist.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPharmacist(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update pharmacist:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!user || !pharmacist)
    return <SharedLoadingComponent gif="/profileLoading.gif" />;

  return (
    <div className="bg-white max-w-6xl mx-auto mt-10 rounded-xl shadow-lg border border-gray-200 p-6 relative">
      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (split into two sub-columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PROFILE IMAGE COLUMN */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  pharmacist.image_profile?.startsWith("/media")
                    ? `http://localhost:8000${pharmacist.image_profile}`
                    : pharmacist.image_profile || "/default-profile.png"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow border border-gray-300">
                  <Pencil size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPharmacist((prev) => ({
                          ...prev,
                          image_profile: URL.createObjectURL(file),
                        }));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* EDIT BUTTON AT BOTTOM LEFT */}
            <button
              onClick={() => setEditMode(!editMode)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center gap-2"
              title="Edit Profile"
            >
              <Pencil size={16} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* INFO COLUMN */}
          <div className="md:col-span-2 space-y-6">
            <ProfileInfo
              user={user}
              pharmacist={pharmacist}
              editMode={editMode}
              setPharmacist={setPharmacist}
            />

            <EmailCard email={user.email} />

            <FacultyCard
              pharmacist={pharmacist}
              editMode={editMode}
              setPharmacist={setPharmacist}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (LICENSE) */}
        <div className="lg:col-span-1">
          <LicenseCard
            pharmacist={pharmacist}
            editMode={editMode}
            setPharmacist={setPharmacist}
          />
        </div>
      </div>

      {/* SAVE CHANGES BUTTON */}
      {editMode && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PharmacistProfilePage;
