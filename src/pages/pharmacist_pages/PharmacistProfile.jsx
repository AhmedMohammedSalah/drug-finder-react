import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileBanner from '../../components/PharmacistProfile/ProfileBanner';
import ProfileInfo from '../../components/PharmacistProfile/ProfileInfo';
import FacultyCard from '../../components/PharmacistProfile/FacultyCard';
import LicenseCard from '../../components/PharmacistProfile/LicenseCard';
import { Pencil } from 'lucide-react';

const BASE_URL = 'http://localhost:8000';

const PharmacistProfilePage = () => {
  const [user, setUser] = useState(null);
  const [pharmacist, setPharmacist] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return setError('No access token');

        const userRes = await axios.get(`${BASE_URL}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pharmacistRes = await axios.get(`${BASE_URL}/users/me/pharmacist/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        setPharmacist(pharmacistRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile');
      }
    };

    fetchData();
  }, []);

  // === HANDLE PATCH UPDATE ===
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();

      formData.append('pharmacist_bio', pharmacist.pharmacist_bio || '');
      formData.append('pharmacist_faculty', pharmacist.pharmacist_faculty || '');

      if (pharmacist.image_profile instanceof File) {
        formData.append('image_profile', pharmacist.image_profile);
      }
      if (pharmacist.image_license instanceof File) {
        formData.append('image_license', pharmacist.image_license);
      }
      if (pharmacist.pharmacist_banner instanceof File) {
        formData.append('pharmacist_banner', pharmacist.pharmacist_banner);
      }
      if (pharmacist.pharmacist_faculty_logo instanceof File) {
        formData.append('pharmacist_faculty_logo', pharmacist.pharmacist_faculty_logo);
      }

      const response = await axios.patch(
        `${BASE_URL}/users/pharmacists/${pharmacist.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPharmacist(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update pharmacist:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!user || !pharmacist) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white max-w-6xl mx-auto mt-10 rounded-xl shadow-lg border border-gray-200 relative">
      
      {/* EDIT BUTTON (FLOATING BOTTOM RIGHT) */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Edit Profile"
      >
        <Pencil size={20} />
      </button>

      {/* BANNER + PROFILE IMAGE */}
      <ProfileBanner
        pharmacist={pharmacist}
        editMode={editMode}
        setPharmacist={setPharmacist}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pt-6 pb-10">
        
        {/* LEFT SECTION */}
        <div className="md:col-span-2 space-y-6">
          <ProfileInfo
            user={user}
            pharmacist={pharmacist}
            editMode={editMode}
            setPharmacist={setPharmacist}
          />

          <FacultyCard
            pharmacist={pharmacist}
            editMode={editMode}
            setPharmacist={setPharmacist}
          />
        </div>

        {/* RIGHT SECTION */}
        <LicenseCard
          pharmacist={pharmacist}
          editMode={editMode}
          setPharmacist={setPharmacist}
        />
      </div>

      {/* SAVE CHANGES BUTTON */}
      {editMode && (
        <div className="flex justify-end px-6 pb-8">
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
