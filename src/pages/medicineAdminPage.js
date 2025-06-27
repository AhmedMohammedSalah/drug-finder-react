// [SARA]: Import dependencies
import React, { useEffect, useState } from 'react';
import apiEndpoints from '../services/api';

function MedicineAdminPage() {
  // [SARA]: State for medicines, loading, error, modals, and form
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMedicine, setEditMedicine] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteMedicineId, setDeleteMedicineId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addError, setAddError] = useState(null);
  const [search, setSearch] = useState('');

  // [SARA]: Fetch medicines from backend on mount
  useEffect(() => {
    if (apiEndpoints.inventory && apiEndpoints.inventory.getMedicines) {
      apiEndpoints.inventory.getMedicines()
        .then(res => {
          // Ensure medicines is always an array
          if (Array.isArray(res.data)) {
            setMedicines(res.data);
          } else if (res.data && Array.isArray(res.data.results)) {
            setMedicines(res.data.results);
          } else {
            setMedicines([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch medicines');
          setLoading(false);
        });
    } else {
      // fallback to direct fetch
      fetch('http://localhost:8000/inventory/medicines/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          // Ensure medicines is always an array
          if (Array.isArray(data)) {
            setMedicines(data);
          } else if (data && Array.isArray(data.results)) {
            setMedicines(data.results);
          } else {
            setMedicines([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch medicines');
          setLoading(false);
        });
    }
  }, []);

  // [SARA]: Filter medicines by search query (generic_name, brand_name, chemical_name)
  const filteredMedicines = medicines.filter(med =>
    (med.generic_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (med.brand_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (med.chemical_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // [SARA]: Handle add form field changes
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // [SARA]: Submit add form and create medicine
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    try {
      const res = await fetch('http://localhost:8000/inventory/medicines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(addForm)
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setAddError(data.detail || 'Failed to add medicine');
      }
    } catch {
      setAddError('Failed to add medicine');
    }
  };

  // [SARA]: Open edit modal and set form values
  const handleEdit = (medicine) => {
    setEditMedicine(medicine);
    setEditForm({ ...medicine });
  };

  // [SARA]: Handle edit form field changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // [SARA]: Submit edit form and update medicine
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editMedicine || !editMedicine.id) return;
    try {
      const res = await fetch(`http://localhost:8000/inventory/medicines/${editMedicine.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {}
  };

  // [SARA]: Delete medicine by id (no alert, only modal)
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/inventory/medicines/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setMedicines(medicines.filter(m => m.id !== id));
    } catch {}
  };

  // [SARA]: Render
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-6">
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Medicines Page</h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by generic, brand, or chemical name..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
          >
            Add New Medicine
          </button>
        </div>
      </div>
      {/* [SARA]: Medicines grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredMedicines.map(med => (
          <div key={med.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg">{med.generic_name} ({med.brand_name})</div>
            <div className="text-gray-600">{med.chemical_name}</div>
            <div className="text-sm text-blue-600">Stock: {med.stock} | Price: {med.price} EGP</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(med)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setDeleteMedicineId(med.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {/* [SARA]: Add medicine modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2">Add New Medicine</h2>
            <input name="generic_name" value={addForm.generic_name || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Generic Name" required />
            <input name="brand_name" value={addForm.brand_name || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Brand Name" required />
            <input name="chemical_name" value={addForm.chemical_name || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Chemical Name" required />
            <input name="description" value={addForm.description || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Description" />
            <input name="atc_code" value={addForm.atc_code || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="ATC Code" />
            <input name="cas_number" value={addForm.cas_number || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="CAS Number" />
            <input name="stock" value={addForm.stock || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Stock" type="number" required />
            <input name="price" value={addForm.price || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Price" type="number" step="0.01" required />
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* [SARA]: Edit medicine modal */}
      {editMedicine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2">Edit Medicine</h2>
            <input name="generic_name" value={editForm.generic_name || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Generic Name" required />
            <input name="brand_name" value={editForm.brand_name || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Brand Name" required />
            <input name="chemical_name" value={editForm.chemical_name || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Chemical Name" required />
            <input name="description" value={editForm.description || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Description" />
            <input name="atc_code" value={editForm.atc_code || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="ATC Code" />
            <input name="cas_number" value={editForm.cas_number || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="CAS Number" />
            <input name="stock" value={editForm.stock || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Stock" type="number" required />
            <input name="price" value={editForm.price || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Price" type="number" step="0.01" required />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditMedicine(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* [SARA]: Delete confirmation modal */}
      {deleteMedicineId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this medicine?</p>
            <div className="flex gap-2 mt-2">
              <button onClick={async () => { await handleDelete(deleteMedicineId); setDeleteMedicineId(null); }} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={() => setDeleteMedicineId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">Loading medicines...</div></div>}
      {error && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">{error}</div></div>}
    </div>
  );
}

export default MedicineAdminPage;