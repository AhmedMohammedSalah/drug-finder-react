// [SARA]: Import dependencies
import React, { useEffect, useState } from 'react';
import FileUpload from '../components/shared/FileUpload';

function StoresAdminPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addError, setAddError] = useState(null);
  const [editStore, setEditStore] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteStoreId, setDeleteStoreId] = useState(null);
  const [search, setSearch] = useState('');
  const [showDetailsStore, setShowDetailsStore] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeBanner, setStoreBanner] = useState(null);
  const token = localStorage.getItem('access_token');

  // Fetch stores
  useEffect(() => {
    fetch('http://localhost:8000/medical_stores/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStores(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch stores');
        setLoading(false);
      });
  }, [token]);

  // Filter stores by search (name or type)
  const filteredStores = stores.filter(store =>
    (store.store_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (store.store_type || '').toLowerCase().includes(search.toLowerCase())
  );

  // Add store handlers
  const handleAddChange = e => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddFile = (name, file) => {
    if (name === 'license_image') setLicenseImage(file);
    if (name === 'store_logo') setStoreLogo(file);
    if (name === 'store_banner') setStoreBanner(file);
  };
  const handleAddSubmit = async e => {
    e.preventDefault();
    setAddError(null);
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([k, v]) => formData.append(k, v));
      if (licenseImage) formData.append('license_image', licenseImage);
      if (storeLogo) formData.append('store_logo', storeLogo);
      if (storeBanner) formData.append('store_banner', storeBanner);
      const res = await fetch('http://localhost:8000/medical_stores/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const newStore = await res.json();
        setStores([...stores, newStore]);
        setShowAddModal(false);
        setAddForm({});
        setLicenseImage(null);
        setStoreLogo(null);
        setStoreBanner(null);
      } else {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        setAddError(data.detail || data.error || JSON.stringify(data) || 'Failed to add store');
      }
    } catch { setAddError('Failed to add store'); }
  };

  // Edit store handlers
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEdit = store => {
    setEditStore(store);
    setEditForm({ ...store });
    setLicenseImage(null);
    setStoreLogo(null);
    setStoreBanner(null);
  };
  const handleEditFile = (name, file) => {
    if (name === 'license_image') setLicenseImage(file);
    if (name === 'store_logo') setStoreLogo(file);
    if (name === 'store_banner') setStoreBanner(file);
  };
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editStore || !editStore.id) return;
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      if (licenseImage) formData.append('license_image', licenseImage);
      if (storeLogo) formData.append('store_logo', storeLogo);
      if (storeBanner) formData.append('store_banner', storeBanner);
      const res = await fetch(`http://localhost:8000/medical_stores/${editStore.id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const updatedStore = await res.json();
        setStores(stores.map(s => (s.id === updatedStore.id ? updatedStore : s)));
        setEditStore(null);
      }
    } catch {}
  };

  // Delete store
  const handleDelete = async id => {
    try {
      await fetch(`http://localhost:8000/medical_stores/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStores(stores.filter(s => s.id !== id));
    } catch {}
  };

  // Render
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-6">
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Stores Page</h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by store name or type..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
          >
            Add New Store
          </button>
        </div>
      </div>
      {/* Stores grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredStores.map(store => (
          <div key={store.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg">{store.store_name}</div>
            <div className="text-gray-600">Type: {store.store_type}</div>
            <div className="text-sm text-blue-600">Owner: {store.owner}</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowDetailsStore(store)}>Details</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(store)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setDeleteStoreId(store.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {/* Add store modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Add New Store</h2>
            <input name="store_name" value={addForm.store_name || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Store Name" required />
            <select name="store_type" value={addForm.store_type || ''} onChange={handleAddChange} className="border p-2 rounded" required>
              <option value="">Select Store Type</option>
              <option value="medical_devices">Medical Devices</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="both">Both</option>
            </select>
            <input name="owner" value={addForm.owner || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Owner ID" required />
            <FileUpload label="License Image" accept="image/*" onFileChange={file => handleAddFile('license_image', file)} required />
            <input name="license_expiry_date" type="date" value={addForm.license_expiry_date || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="License Expiry Date" required />
            <FileUpload label="Store Logo" accept="image/*" onFileChange={file => handleAddFile('store_logo', file)} />
            <FileUpload label="Store Banner" accept="image/*" onFileChange={file => handleAddFile('store_banner', file)} />
            <textarea name="description" value={addForm.description || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Description" />
            <input name="latitude" type="number" step="any" value={addForm.latitude || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Latitude" />
            <input name="longitude" type="number" step="any" value={addForm.longitude || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Longitude" />
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Edit store modal */}
      {editStore && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Edit Store</h2>
            <input name="store_name" value={editForm.store_name || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Store Name" required />
            <select name="store_type" value={editForm.store_type || ''} onChange={handleEditChange} className="border p-2 rounded" required>
              <option value="">Select Store Type</option>
              <option value="medical_devices">Medical Devices</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="both">Both</option>
            </select>
            <input name="owner" value={editForm.owner || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Owner ID" required />
            <FileUpload label="License Image (leave blank to keep current)" accept="image/*" onFileChange={file => handleEditFile('license_image', file)} />
            <input name="license_expiry_date" type="date" value={editForm.license_expiry_date || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="License Expiry Date" required />
            <FileUpload label="Store Logo (leave blank to keep current)" accept="image/*" onFileChange={file => handleEditFile('store_logo', file)} />
            <FileUpload label="Store Banner (leave blank to keep current)" accept="image/*" onFileChange={file => handleEditFile('store_banner', file)} />
            <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Description" />
            <input name="latitude" type="number" step="any" value={editForm.latitude || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Latitude" />
            <input name="longitude" type="number" step="any" value={editForm.longitude || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Longitude" />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditStore(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Store details modal */}
      {showDetailsStore && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Store Details</h2>
            <div><b>Name:</b> {showDetailsStore.store_name}</div>
            <div><b>Type:</b> {showDetailsStore.store_type}</div>
            <div><b>Owner:</b> {showDetailsStore.owner}</div>
            <div><b>License Expiry:</b> {showDetailsStore.license_expiry_date}</div>
            <div><b>Description:</b> {showDetailsStore.description || 'N/A'}</div>
            <div><b>Latitude:</b> {showDetailsStore.latitude || 'N/A'}</div>
            <div><b>Longitude:</b> {showDetailsStore.longitude || 'N/A'}</div>
            {showDetailsStore.license_image && <div><b>License Image:</b><br /><img src={typeof showDetailsStore.license_image === 'string' ? showDetailsStore.license_image : URL.createObjectURL(showDetailsStore.license_image)} alt="License" className="max-w-xs max-h-40 mt-2" /></div>}
            {showDetailsStore.store_logo && <div><b>Logo:</b><br /><img src={typeof showDetailsStore.store_logo === 'string' ? showDetailsStore.store_logo : URL.createObjectURL(showDetailsStore.store_logo)} alt="Logo" className="max-w-xs max-h-32 mt-2" /></div>}
            {showDetailsStore.store_banner && <div><b>Banner:</b><br /><img src={typeof showDetailsStore.store_banner === 'string' ? showDetailsStore.store_banner : URL.createObjectURL(showDetailsStore.store_banner)} alt="Banner" className="max-w-xs max-h-32 mt-2" /></div>}
            <div className="flex gap-2 mt-2">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowDetailsStore(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteStoreId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this store?</p>
            <div className="flex gap-2 mt-2">
              <button onClick={async () => { await handleDelete(deleteStoreId); setDeleteStoreId(null); }} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={() => setDeleteStoreId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Loader and error overlays */}
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">Loading stores...</div></div>}
      {error && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">{error}</div></div>}
    </div>
  );
}

export default StoresAdminPage;