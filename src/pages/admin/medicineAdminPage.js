// [SARA]: Import dependencies
import React, { useEffect, useState } from "react";
import apiEndpoints from "../../services/api";
import Pagination from "../../components/shared/pagination";
import AdminLoader from "../../components/admin/adminLoader";

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
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);
  const [storeData, setStoreData] = useState({});
  const [allStores, setAllStores] = useState([]);

  // [SARA]: Fetch medicines from backend on mount or page change
  useEffect(() => {
    setLoading(true);
    const url = `https://ahmedmsalah.pythonanywhere.com/inventory/medicines/?page=${page}&page_size=${pageSize}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMedicines(data);
          setTotalPages(1);
        } else if (data && Array.isArray(data.results)) {
          setMedicines(data.results);
          setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        } else {
          setMedicines([]);
          setTotalPages(1);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch medicines");
        setLoading(false);
      });
  }, [page, pageSize]);

  // Fetch store data for all medicines
  useEffect(() => {
    async function fetchStores() {
      const uniqueStoreIds = Array.from(
        new Set((medicines || []).map((m) => m.store).filter(Boolean))
      );
      const newStoreData = { ...storeData };
      await Promise.all(
        uniqueStoreIds.map(async (storeId) => {
          if (!newStoreData[storeId]) {
            try {
              const res = await fetch(
                `https://ahmedmsalah.pythonanywhere.com/medical_stores/${storeId}/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "access_token"
                    )}`,
                  },
                }
              );
              if (res.ok) {
                const data = await res.json();
                newStoreData[storeId] = data;
              }
            } catch {}
          }
        })
      );
      setStoreData(newStoreData);
    }
    if (medicines.length > 0) fetchStores();
    // eslint-disable-next-line
  }, [medicines]);

  // Fetch all stores for dropdown
  useEffect(() => {
    async function fetchAllStores() {
      try {
        const res = await fetch(
          "https://ahmedmsalah.pythonanywhere.com/medical_stores/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setAllStores(Array.isArray(data) ? data : data.results || []);
        }
      } catch {}
    }
    fetchAllStores();
  }, []);

  // [SARA]: Filter medicines by search query (generic_name, brand_name, chemical_name)
  const filteredMedicines = medicines.filter(
    (med) =>
      (med.generic_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (med.brand_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (med.chemical_name || "").toLowerCase().includes(search.toLowerCase())
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
      const res = await fetch(
        "https://ahmedmsalah.pythonanywhere.com/inventory/medicines/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(addForm),
        }
      );
      if (res.ok) {
        const newMed = await res.json();
        setMedicines([newMed, ...medicines]);
        setShowAddModal(false);
        setAddForm({});
      } else {
        const data = await res.json();
        setAddError(data.detail || "Failed to add medicine");
      }
    } catch {
      setAddError("Failed to add medicine");
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
      const res = await fetch(
        `https://ahmedmsalah.pythonanywhere.com/inventory/medicines/${editMedicine.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      if (res.ok) {
        const updatedMed = await res.json();
        setMedicines(
          medicines.map((m) => (m.id === updatedMed.id ? updatedMed : m))
        );
        setEditMedicine(null);
      }
    } catch {}
  };

  // [SARA]: Delete medicine by id (no alert, only modal)
  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://ahmedmsalah.pythonanywhere.com/inventory/medicines/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setMedicines(medicines.filter((m) => m.id !== id));
    } catch {}
  };

  // [SARA] : Modern loading/error overlay with blurred, dimmed background and premium spinner
  return (
    <div className="relative min-h-screen">
      <AdminLoader
        loading={loading}
        error={error}
        loadingMessage="Loading medicine data..."
      />
      {/* [SARA] : Main content is dimmed and non-interactive while loading or error */}
      <div
        className={`container mx-auto px-4 pb-24 ${
          loading || error
            ? "opacity-50 pointer-events-none select-none"
            : "opacity-100"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white rounded-lg p-2 sm:p-4 md:p-6 ${
            loading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-5xl flex flex-col items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-blue-700 drop-shadow">
              Medicines
            </h1>
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-90 rounded-xl shadow px-2 sm:px-4 py-2 sm:py-3 border border-blue-200 w-full">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by generic, brand, or chemical name..."
                  className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
                />
              </div>
              <button
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow transition-all text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowAddModal(true)}
              >
                + Add New Medicine
              </button>
            </div>
          </div>
          {/* Medicines grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow duration-200 relative"
              >
                <div className="font-bold text-xl text-blue-800 flex items-center gap-2">
                  {med.generic_name}{" "}
                  <span className="text-gray-500 font-normal">
                    ({med.brand_name})
                  </span>
                </div>
                <div className="text-gray-600 text-sm">
                  Chemical:{" "}
                  <span className="font-semibold text-blue-600">
                    {med.chemical_name}
                  </span>
                </div>
                <div className="text-sm text-blue-600">
                  Stock: {med.stock} | Price: {med.price} EGP
                </div>
                <div className="text-xs text-blue-500 font-semibold flex flex-col">
                  {med.store && storeData[med.store] ? (
                    <span>
                      Store: {storeData[med.store].store_name}{" "}
                      <span className="text-gray-500">
                        ({storeData[med.store].store_type})
                      </span>
                    </span>
                  ) : med.store ? (
                    <span>Store ID: {med.store}</span>
                  ) : (
                    <span>No Store</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                    onClick={() => handleEdit(med)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                    onClick={() => setDeleteMedicineId(med.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          {/* Add medicine modal */}
          {showAddModal && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <form
                  onSubmit={handleAddSubmit}
                  className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn"
                >
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">
                      Add New Medicine
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 p-8 pt-6">
                    <input
                      name="generic_name"
                      value={addForm.generic_name || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Generic Name"
                      required
                    />
                    <input
                      name="brand_name"
                      value={addForm.brand_name || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Brand Name"
                      required
                    />
                    <input
                      name="chemical_name"
                      value={addForm.chemical_name || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Chemical Name"
                      required
                    />
                    <input
                      name="description"
                      value={addForm.description || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Description"
                    />
                    <input
                      name="atc_code"
                      value={addForm.atc_code || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="ATC Code"
                    />
                    <input
                      name="cas_number"
                      value={addForm.cas_number || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="CAS Number"
                    />
                    <input
                      name="stock"
                      value={addForm.stock || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Stock"
                      type="number"
                      required
                    />
                    <input
                      name="price"
                      value={addForm.price || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      required
                    />
                    {/* Store select for Add modal */}
                    <select
                      name="store"
                      value={addForm.store || ""}
                      onChange={handleAddChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Store</option>
                      {allStores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.store_name} ({store.store_type})
                        </option>
                      ))}
                    </select>
                    {addError && (
                      <div className="text-red-500 text-sm">{addError}</div>
                    )}
                    <div className="flex gap-4 mt-2 justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                        onClick={() => setShowAddModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                    onClick={() => setShowAddModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </form>
              </div>
            </>
          )}
          {/* Edit medicine modal */}
          {editMedicine && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <form
                  onSubmit={handleEditSubmit}
                  className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn"
                >
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">
                      Edit Medicine
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 p-8 pt-6">
                    <input
                      name="generic_name"
                      value={editForm.generic_name || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Generic Name"
                      required
                    />
                    <input
                      name="brand_name"
                      value={editForm.brand_name || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Brand Name"
                      required
                    />
                    <input
                      name="chemical_name"
                      value={editForm.chemical_name || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Chemical Name"
                      required
                    />
                    <input
                      name="description"
                      value={editForm.description || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Description"
                    />
                    <input
                      name="atc_code"
                      value={editForm.atc_code || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="ATC Code"
                    />
                    <input
                      name="cas_number"
                      value={editForm.cas_number || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="CAS Number"
                    />
                    <input
                      name="stock"
                      value={editForm.stock || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Stock"
                      type="number"
                      required
                    />
                    <input
                      name="price"
                      value={editForm.price || ""}
                      onChange={handleEditChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      required
                    />
                    {/* Store select for Edit modal (disabled) */}
                    {/* Store field removed from edit modal as requested */}
                    <div className="flex gap-4 mt-2 justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                        onClick={() => setEditMedicine(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                    onClick={() => setEditMedicine(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </form>
              </div>
            </>
          )}
          {/* Delete confirmation modal */}
          {deleteMedicineId && (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[300px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-red-200 relative animate-fadeIn">
                  <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-red-500 to-red-400 p-6">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-red-200 mb-2 shadow-lg">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-red-800 mb-0 tracking-wide">
                      Confirm Delete
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 p-8 pt-6">
                    <p className="text-gray-700">
                      Are you sure you want to delete this medicine?
                    </p>
                    <div className="flex gap-4 mt-2 justify-end">
                      <button
                        onClick={async () => {
                          await handleDelete(deleteMedicineId);
                          setDeleteMedicineId(null);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteMedicineId(null)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                    onClick={() => setDeleteMedicineId(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicineAdminPage;
