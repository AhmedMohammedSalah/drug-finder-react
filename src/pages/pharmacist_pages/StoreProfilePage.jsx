import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save } from 'lucide-react';

const BASE_URL = 'http://localhost:8000';

const PharmacistStoreProfilePage = () => {
  const token = localStorage.getItem('access_token');
  const [store, setStore] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [preview, setPreview] = useState({
    logo: null,
    banner: null,
    license: null,
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/medical_stores/my-store/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(res.data);
      } catch (err) {
        console.warn('No store yet or failed to load:', err);
        // Optionally initialize empty store
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setStore((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (let key in store) {
        formData.append(key, store[key]);
      }

      await axios.patch(`${BASE_URL}/stores/${store.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Store updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update store');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-md relative">

      {/* EDIT / SAVE BUTTON */}
      {editMode ? (
        <button
          onClick={handleSave}
          className="absolute top-6 right-6 bg-green-600 hover:bg-green-700 text-white p-2 rounded-md shadow"
        >
          <Save size={20} />
        </button>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow"
        >
          <Pencil size={20} />
        </button>
      )}

      {/* BANNER */}
      <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden mb-6 relative">
        <img
          src={preview.banner || `${BASE_URL}${store.store_banner || ''}`}
          alt="Store Banner"
          className="w-full h-full object-cover"
        />
        {editMode && (
          <input type="file" name="store_banner" accept="image/*" onChange={handleFileChange}
            className="absolute bottom-2 left-2 bg-white text-sm" />
        )}
      </div>

      {/* LOGO + NAME */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border shadow">
          <img
            src={preview.logo || `${BASE_URL}${store.store_logo || ''}`}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <label className="block font-semibold">Store Name</label>
          <input
            type="text"
            name="store_name"
            value={store.store_name}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={store.description || ''}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border px-3 py-2 rounded-md"
          rows={3}
        />
      </div>

      {/* ADDRESS */}
      <div className="mb-4">
        <label className="block font-semibold">Store Address</label>
        <input
          type="text"
          name="store_address"
          value={store.store_address || ''}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      {/* LICENSE IMAGE + DATE */}
      <div className="mb-4">
        <label className="block font-semibold">License Expiry Date</label>
        <input
          type="date"
          name="license_expiry_date"
          value={store.license_expiry_date}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">License Image</label>
        <img
          src={preview.license || `${BASE_URL}${store.license_image || ''}`}
          alt="License"
          className="w-full max-h-64 object-contain border rounded-md"
        />
        {editMode && (
          <input
            type="file"
            name="license_image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        )}
      </div>

    </div>
  );
};

export default PharmacistStoreProfilePage;
