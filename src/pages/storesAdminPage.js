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
  const [ownerData, setOwnerData] = useState({});
  const token = localStorage.getItem('access_token');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);

  // Fetch stores (paginated)
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/medical_stores/?page=${page}&page_size=${pageSize}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStores(data);
          setTotalPages(1);
        } else {
          setStores(data.results || []);
          setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch stores');
        setLoading(false);
      });
  }, [token, page, pageSize]);

  // Fetch owner data for all stores
  useEffect(() => {
    async function fetchOwners() {
      const uniqueOwners = Array.from(new Set((stores || []).map(s => s.owner).filter(Boolean)));
      const newOwnerData = { ...ownerData };
      await Promise.all(uniqueOwners.map(async ownerId => {
        if (!newOwnerData[ownerId]) {
          try {
            const res = await fetch(`http://localhost:8000/users/users/${ownerId}/`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              newOwnerData[ownerId] = data;
            }
          } catch {}
        }
      }));
      setOwnerData(newOwnerData);
    }
    if (stores.length > 0) fetchOwners();
    // eslint-disable-next-line
  }, [stores, token]);

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
  // [SARA]: Submit add form and create store (no reload, update state)
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
        setStores([newStore, ...stores]);
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
  // [SARA]: Submit edit form and update store (no reload, update state)
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editStore || !editStore.id) return;
    try {
      const formData = new FormData();
      // Only append fields that are not null/undefined/empty string and not id
      Object.entries(editForm).forEach(([k, v]) => {
        if (
          k !== 'id' &&
          v !== undefined &&
          v !== null &&
          (typeof v !== 'string' || v.trim() !== '')
        ) {
          formData.append(k, v);
        }
      });
      // Only send new images if selected
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

  // [SARA]: Delete store by id (no reload, update state)
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
    <div className="relative min-h-screen">
      {/* [SARA] : Modern loading/error overlay with blurred, dimmed background and premium spinner */}
      {(loading || error) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/60 rounded-xl shadow-lg">
            {loading && (
              <>
                {/* [SARA] : Premium animated border spinner for loading */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold text-blue-700">Loading stores data...</span>
              </>
            )}
            {error && (
              <>
                {/* [SARA] : Error icon and message overlay */}
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                <span className="text-lg font-semibold text-red-700">{error}</span>
              </>
            )}
          </div>
        </div>
      )}
      {/* [SARA] : Main content is dimmed and non-interactive while loading or error */}
      <div className={`container mx-auto px-4 pb-24 ${loading || error ? 'opacity-50 pointer-events-none select-none' : 'opacity-100'}`}>
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white rounded-lg p-2 sm:p-4 md:p-6 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-full max-w-5xl flex flex-col items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-blue-700 drop-shadow">Stores</h1>
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-90 rounded-xl shadow px-2 sm:px-4 py-2 sm:py-3 border border-blue-200 w-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by store name or type..."
                  className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
                />
              </div>
              <button
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow transition-all text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowAddModal(true)}
              >
                + Add New Store
              </button>
            </div>
          </div>
          {/* Stores grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
            {filteredStores.map(store => (
              <div key={store.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow duration-200 relative">
                {store.store_banner && (
                  <div className="relative mb-2">
                    <img
                      src={typeof store.store_banner === 'string' ? store.store_banner : URL.createObjectURL(store.store_banner)}
                      alt="Banner"
                      className="w-full h-28 object-cover rounded-xl border-2 border-blue-200 shadow-md bg-white"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  {store.store_logo && (
                    <div className="relative">
                      <img
                        src={typeof store.store_logo === 'string' ? store.store_logo : URL.createObjectURL(store.store_logo)}
                        alt="Logo"
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-300 shadow-md bg-white"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xl text-blue-800 flex items-center gap-2">{store.store_name}</div>
                    <div className="text-gray-600 text-sm">Type: <span className="font-semibold text-blue-600">{store.store_type}</span></div>
                    {ownerData[store.owner] ? (
                      <div className="text-xs text-blue-500 font-semibold flex flex-col">
                        <span>Owner: {ownerData[store.owner].name} {ownerData[store.owner].last_name}</span>
                        <span className="text-gray-500">Email: {ownerData[store.owner].email}</span>
                        {/* <span className="text-gray-500">Phone: {ownerData[store.owner].phone_number}</span> */}
                      </div>
                    ) : (
                      <div className="text-xs text-blue-500 font-semibold">Owner: {store.owner}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2 justify-end">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all" onClick={() => setShowDetailsStore(store)}>Details</button>
                  <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all" onClick={() => handleEdit(store)}>Edit</button>
                  <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all" onClick={() => setDeleteStoreId(store.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          {/* Add store modal */}
          {showAddModal && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">Add New Store</h2>
                  </div>
                  <div className="flex flex-col gap-4 p-8 pt-6">
                    <input name="store_name" value={addForm.store_name || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Store Name" required />
                    <select name="store_type" value={addForm.store_type || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required>
                      <option value="">Select Store Type</option>
                      <option value="medical_devices">Medical Devices</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="both">Both</option>
                    </select>
                    <input name="owner" value={addForm.owner || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Owner ID" required />
                    <FileUpload label="License Image" accept="image/*" onFileChange={file => handleAddFile('license_image', file)} required />
                    {licenseImage && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="text-xs text-gray-500 mb-1">Preview:</span>
                        <img src={URL.createObjectURL(licenseImage)} alt="License Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                      </div>
                    )}
                    <input name="license_expiry_date" type="date" value={addForm.license_expiry_date || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="License Expiry Date" required />
                    <FileUpload label="Store Logo" accept="image/*" onFileChange={file => handleAddFile('store_logo', file)} />
                    {storeLogo && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="text-xs text-gray-500 mb-1">Preview:</span>
                        <img src={URL.createObjectURL(storeLogo)} alt="Logo Preview" className="w-20 h-20 object-cover rounded-full border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                      </div>
                    )}
                    <FileUpload label="Store Banner" accept="image/*" onFileChange={file => handleAddFile('store_banner', file)} />
                    {storeBanner && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="text-xs text-gray-500 mb-1">Preview:</span>
                        <img src={URL.createObjectURL(storeBanner)} alt="Banner Preview" className="w-full max-w-xs h-24 object-cover rounded-xl border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                      </div>
                    )}
                    <textarea name="description" value={addForm.description || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Description" />
                    <div className="flex gap-4">
                      <input name="latitude" type="number" step="any" value={addForm.latitude || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 w-1/2 focus:ring-2 focus:ring-blue-400" placeholder="Latitude" />
                      <input name="longitude" type="number" step="any" value={addForm.longitude || ''} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 w-1/2 focus:ring-2 focus:ring-blue-400" placeholder="Longitude" />
                    </div>
                    {addError && <div className="text-red-500 text-sm">{addError}</div>}
                    <div className="flex gap-4 mt-2 justify-end">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">Add</button>
                      <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none" onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                  </div>
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={() => setShowAddModal(false)} aria-label="Close">&times;</button>
                </form>
              </div>
            </>
          )}
          {/* Edit store modal */}
          {editStore && (
            <>
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z" /></svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">Edit Store</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 pt-6">
                    <div className="flex flex-col gap-3">
                      <label className="font-semibold text-gray-700">Store Name</label>
                      <input name="store_name" value={editForm.store_name || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Store Name" required />
                      <label className="font-semibold text-gray-700">Store Type</label>
                      <select name="store_type" value={editForm.store_type || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required>
                        <option value="">Select Store Type</option>
                        <option value="medical_devices">Medical Devices</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="both">Both</option>
                      </select>
                      <label className="font-semibold text-gray-700">Owner ID</label>
                      <input name="owner" value={editForm.owner || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Owner ID" required />
                      <label className="font-semibold text-gray-700">License Expiry Date</label>
                      <input name="license_expiry_date" type="date" value={editForm.license_expiry_date || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="License Expiry Date" required />
                      <label className="font-semibold text-gray-700">Description</label>
                      <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Description" />
                      <div className="flex gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="font-semibold text-gray-700">Latitude</label>
                          <input name="latitude" type="number" step="any" value={editForm.latitude || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Latitude" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="font-semibold text-gray-700">Longitude</label>
                          <input name="longitude" type="number" step="any" value={editForm.longitude || ''} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Longitude" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="font-semibold text-gray-700">License Image (leave blank to keep current)</label>
                      <FileUpload accept="image/*" onFileChange={file => handleEditFile('license_image', file)} />
                      {(licenseImage || editForm.license_image) && (
                        <div className="flex flex-col items-center mt-2">
                          <span className="text-xs text-gray-500 mb-1">Preview:</span>
                          <img src={licenseImage ? URL.createObjectURL(licenseImage) : (typeof editForm.license_image === 'string' ? editForm.license_image : URL.createObjectURL(editForm.license_image))} alt="License Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                        </div>
                      )}
                      <label className="font-semibold text-gray-700">Store Logo (leave blank to keep current)</label>
                      <FileUpload accept="image/*" onFileChange={file => handleEditFile('store_logo', file)} />
                      {(storeLogo || editForm.store_logo) && (
                        <div className="flex flex-col items-center mt-2">
                          <span className="text-xs text-gray-500 mb-1">Preview:</span>
                          <img src={storeLogo ? URL.createObjectURL(storeLogo) : (typeof editForm.store_logo === 'string' ? editForm.store_logo : URL.createObjectURL(editForm.store_logo))} alt="Logo Preview" className="w-20 h-20 object-cover rounded-full border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                        </div>
                      )}
                      <label className="font-semibold text-gray-700">Store Banner (leave blank to keep current)</label>
                      <FileUpload accept="image/*" onFileChange={file => handleEditFile('store_banner', file)} />
                      {(storeBanner || editForm.store_banner) && (
                        <div className="flex flex-col items-center mt-2">
                          <span className="text-xs text-gray-500 mb-1">Preview:</span>
                          <img src={storeBanner ? URL.createObjectURL(storeBanner) : (typeof editForm.store_banner === 'string' ? editForm.store_banner : URL.createObjectURL(editForm.store_banner))} alt="Banner Preview" className="w-full max-w-xs h-24 object-cover rounded-xl border-2 border-blue-200 shadow-md transition-transform duration-200 hover:scale-105" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6 justify-end px-8 pb-8">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg">Save</button>
                    <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none text-lg" onClick={() => setEditStore(null)}>Cancel</button>
                  </div>
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={() => setEditStore(null)} aria-label="Close">&times;</button>
                </form>
              </div>
            </>
          )}
          {/* Store details modal */}
          {showDetailsStore && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">Store Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 pt-6">
                    <div className="flex flex-col gap-3">
                      <div><b>Name:</b> {showDetailsStore.store_name}</div>
                      <div><b>Type:</b> {showDetailsStore.store_type}</div>
                      <div><b>Owner:</b> {ownerData[showDetailsStore.owner] ? (
                        <span>
                          {ownerData[showDetailsStore.owner].name} {ownerData[showDetailsStore.owner].last_name}<br/>
                          <span className="text-gray-500">Email: {ownerData[showDetailsStore.owner].email}</span><br/>
                          {/* <span className="text-gray-500">Phone: {ownerData[showDetailsStore.owner].phone_number || 'N/A'}</span> */}
                        </span>
                      ) : (
                        showDetailsStore.owner
                      )}</div>
                      <div><b>License Expiry:</b> {showDetailsStore.license_expiry_date}</div>
                      <div><b>Description:</b> {showDetailsStore.description || 'N/A'}</div>
                      <div><b>Latitude:</b> {showDetailsStore.latitude || 'N/A'}</div>
                      <div><b>Longitude:</b> {showDetailsStore.longitude || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {showDetailsStore.license_image && <div><b>License Image:</b><br /><img src={typeof showDetailsStore.license_image === 'string' ? showDetailsStore.license_image : URL.createObjectURL(showDetailsStore.license_image)} alt="License" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow-md mt-2" /></div>}
                      {showDetailsStore.store_logo && <div><b>Logo:</b><br /><img src={typeof showDetailsStore.store_logo === 'string' ? showDetailsStore.store_logo : URL.createObjectURL(showDetailsStore.store_logo)} alt="Logo" className="w-20 h-20 object-cover rounded-full border-2 border-blue-200 shadow-md mt-2" /></div>}
                      {showDetailsStore.store_banner && <div><b>Banner:</b><br /><img src={typeof showDetailsStore.store_banner === 'string' ? showDetailsStore.store_banner : URL.createObjectURL(showDetailsStore.store_banner)} alt="Banner" className="w-full max-w-xs h-24 object-cover rounded-xl border-2 border-blue-200 shadow-md mt-2" /></div>}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 justify-end px-8 pb-8">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none" onClick={() => setShowDetailsStore(null)}>Close</button>
                  </div>
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={() => setShowDetailsStore(null)} aria-label="Close">&times;</button>
                </div>
              </div>
            </>
          )}
          {/* Delete confirmation modal */}
          {deleteStoreId && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-red-200 relative animate-fadeIn">
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-red-500 to-red-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-red-200 mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-red-800 mb-0 tracking-wide">Confirm Delete</h2>
                  </div>
                  <div className="flex flex-col gap-4 p-8 pt-6">
                    <p className="text-gray-700">Are you sure you want to delete this store?</p>
                    <div className="flex gap-4 mt-2 justify-end">
                      <button onClick={async () => { await handleDelete(deleteStoreId); setDeleteStoreId(null); }} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400">Delete</button>
                      <button onClick={() => setDeleteStoreId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none">Cancel</button>
                    </div>
                  </div>
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={() => setDeleteStoreId(null)} aria-label="Close">&times;</button>
                </div>
              </div>
            </>
          )}
          {/* Pagination controls */}
          <div className="flex gap-2 items-center flex-wrap justify-center my-4 sm:my-8 w-full">
            <div className="flex gap-2 items-center flex-wrap justify-center mx-auto w-fit bg-white bg-opacity-90 rounded-xl shadow-lg px-4 sm:px-6 py-2 sm:py-3 border border-blue-200 z-40">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`px-3 py-1 rounded-lg border font-semibold transition ${num === page ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
                  onClick={() => setPage(num)}
                  disabled={num === page}
                >
                  {num}
                </button>
              ))}
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Loader and error overlays removed: now handled at the top level for consistency */}
    </div>
  );
}

export default StoresAdminPage;