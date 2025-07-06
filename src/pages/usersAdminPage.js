
// [SARA]: Import dependencies and icons
import React, { useEffect, useState } from "react";
import IconButton from "../components/shared/btn";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

function UsersAdminPage() {
  // [SARA]: State for users, loading, error, editing user, and edit form
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  // [SARA]: State for delete confirmation modal
  const [deleteUserId, setDeleteUserId] = useState(null);
  // [SARA]: State for add user modal and form
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [addError, setAddError] = useState(null);
  // [SARA]: State for search query
  const [search, setSearch] = useState("");
  // [SARA]: State for details modal
  const [detailsUserId, setDetailsUserId] = useState(null);
  // [SARA]: State for role filter
  const [roleFilter, setRoleFilter] = useState("");
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);

  // [SARA]: State for profile forms
  const [editProfileForm, setEditProfileForm] = useState({
    info_disease: "",
    image_profile: "",
    has_store: false,
  });
  const [addProfileForm, setAddProfileForm] = useState({
    info_disease: "",
    image_profile: "",
    has_store: false,
  });

  // [SARA]: Add to state for pharmacist images
  const [editPharmacistImages, setEditPharmacistImages] = useState({
    image_profile: null,
    image_license: null,
  });
  const [addPharmacistImages, setAddPharmacistImages] = useState({
    image_profile: null,
    image_license: null,
  });

  // [SARA]: Get token from localStorage for authentication
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("access_token");

  // [SARA]: Fetch users from backend on mount or page change
  useEffect(() => {
    setLoading(true);
    const url = `https://ahmedmsalah.pythonanywhere.com/users/users/?page=${page}&page_size=${pageSize}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.results || []);
        setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, [token, page, pageSize]);

  // On-demand fetch for profile in details modal
  const [detailsProfileLoading, setDetailsProfileLoading] = useState(false);
  useEffect(() => {
    let isMounted = true;
    async function fetchProfileOnDemand() {
      if (!detailsUserId) return;
      const user = users.find((u) => u.id === detailsUserId);
      if (!user) return;
      if (user.role === "pharmacist" && !user.pharmacist_profile) {
        setDetailsProfileLoading(true);
        try {
          const res = await fetch(
            `https://ahmedmsalah.pythonanywhere.com/users/pharmacists/${user.id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok && isMounted) {
            const profile = await res.json();
            setUsers((prev) =>
              prev.map((u) =>
                u.id === user.id ? { ...u, pharmacist_profile: profile } : u
              )
            );
          }
        } finally {
          if (isMounted) setDetailsProfileLoading(false);
        }
      } else if (user.role === "client" && !user.client_profile) {
        setDetailsProfileLoading(true);
        try {
          const res = await fetch(
            `https://ahmedmsalah.pythonanywhere.com/users/clients/${user.id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok && isMounted) {
            const profile = await res.json();
            setUsers((prev) =>
              prev.map((u) =>
                u.id === user.id ? { ...u, client_profile: profile } : u
              )
            );
          }
        } finally {
          if (isMounted) setDetailsProfileLoading(false);
        }
      }
    }
    fetchProfileOnDemand();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [detailsUserId, users]);

  // [SARA]: Delete user by id
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await fetch(`https://ahmedmsalah.pythonanywhere.com/users/users/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((u) => u.id !== id));
  };

  // [SARA]: Open edit modal and set form values
  const handleEdit = (user) => {
    // [SARA]: Debug log to check user object
    console.log("[SARA]: Editing user object:", user);
    // [SARA]: Fallback to _id if id is missing
    const userId = user.id || user._id;
    if (!userId) {
      alert("User object is missing an id. Cannot edit this user.");
      return;
    }
    setEditUser({ ...user, id: userId });
    setEditForm({ name: user.name, email: user.email, role: user.role });
    // When opening edit modal, populate profile fields
    if (user.role === "client" && user.client_profile) {
      setEditProfileForm({
        info_disease: user.client_profile.info_disease || "",
        image_profile: user.client_profile.image_profile || "",
        has_store: false,
      });
    } else if (user.role === "pharmacist" && user.pharmacist_profile) {
      setEditProfileForm({
        info_disease: "",
        image_profile: "",
        has_store: user.pharmacist_profile.has_store || false,
      });
    } else {
      setEditProfileForm({
        info_disease: "",
        image_profile: "",
        has_store: false,
      });
    }
    // [SARA]: Also reset editPharmacistImages
    if (user.role === "pharmacist" && user.pharmacist_profile) {
      setEditPharmacistImages({ image_profile: null, image_license: null });
    }
  };

  // [SARA]: Handle changes in edit form fields
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle changes in edit profile form
  const handleEditProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // [SARA]: Submit edit form and update user (no reload, update state)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser || !editUser.id) {
      alert("User ID is missing. Cannot update user.");
      return;
    }
    // Update user
    const res = await fetch(
      `https://ahmedmsalah.pythonanywhere.com/users/users/${editUser.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      }
    );
    let updatedUser = editUser;
    if (res.ok) {
      updatedUser = await res.json();
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }
    // Update profile
    if (editForm.role === "client") {
      // [SARA]: Use FormData if image_profile is a File
      let isFile = editProfileForm.image_profile instanceof File;
      if (isFile) {
        const formData = new FormData();
        formData.append("info_disease", editProfileForm.info_disease);
        formData.append("image_profile", editProfileForm.image_profile);
        await fetch(
          `https://ahmedmsalah.pythonanywhere.com/users/clients/${editUser.id}/`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
        await fetch(
          `https://ahmedmsalah.pythonanywhere.com/users/clients/${editUser.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              info_disease: editProfileForm.info_disease,
              image_profile: editProfileForm.image_profile,
            }),
          }
        );
      }
    } else if (editForm.role === "pharmacist") {
      // Always include image_profile and image_license if available
      let pharmacistProfile = editUser.pharmacist_profile || {};
      // If missing, fetch the latest profile from backend
      if (
        !pharmacistProfile.image_profile ||
        !pharmacistProfile.image_license
      ) {
        try {
          const res = await fetch(
            `https://ahmedmsalah.pythonanywhere.com/users/pharmacists/${editUser.id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            pharmacistProfile = await res.json();
          }
        } catch {}
      }
      const formData = new FormData();
      formData.append("has_store", editProfileForm.has_store);
      if (editPharmacistImages.image_profile)
        formData.append("image_profile", editPharmacistImages.image_profile);
      if (editPharmacistImages.image_license)
        formData.append("image_license", editPharmacistImages.image_license);
      await fetch(
        `https://ahmedmsalah.pythonanywhere.com/users/pharmacists/${editUser.id}/`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
    }
    setEditUser(null);
  };

  // [SARA]: Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
  };

  // [SARA]: Confirm delete user by id (no reload, update state)
  const handleDeleteConfirm = async () => {
    await fetch(
      `https://ahmedmsalah.pythonanywhere.com/users/users/${deleteUserId}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(users.filter((u) => u.id !== deleteUserId));
    setDeleteUserId(null);
  };

  // [SARA]: Cancel delete
  const handleDeleteCancel = () => {
    setDeleteUserId(null);
  };

  // [SARA]: Open add user modal
  const handleAddClick = () => {
    setAddForm({ name: "", email: "", role: "client", password: "" });
    setShowAddModal(true);
  };

  // [SARA]: Handle changes in add form fields
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // Handle changes in add profile form
  const handleAddProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // [SARA]: Submit add form and create user (no reload, update state)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    try {
      let newUser = null;
      if (addForm.role === "pharmacist") {
        // Pharmacist: send all fields and images in FormData
        const formData = new FormData();
        formData.append("name", addForm.name);
        formData.append("email", addForm.email);
        formData.append("password", addForm.password);
        formData.append("role", addForm.role);
        // Pharmacist-specific fields
        formData.append("has_store", addProfileForm.has_store);
        if (addPharmacistImages.image_profile instanceof File) {
          formData.append("image_profile", addPharmacistImages.image_profile);
        }
        if (addPharmacistImages.image_license instanceof File) {
          formData.append("image_license", addPharmacistImages.image_license);
        }
        const res = await fetch(
          "https://ahmedmsalah.pythonanywhere.com/users/users/",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
        if (res.ok) {
          newUser = await res.json();
          setUsers([...users, newUser]);
          // Optionally PATCH pharmacist profile for any extra fields (if needed)
        } else {
          let data;
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          console.error("User creation error:", data);
          setAddError(
            (data &&
              (data.detail ||
                data.error ||
                data.non_field_errors ||
                JSON.stringify(data))) ||
              "Failed to add user (check required fields and backend validation)"
          );
          return;
        }
      } else {
        // Client or admin: send JSON
        const res = await fetch(
          "https://ahmedmsalah.pythonanywhere.com/users/users/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addForm),
          }
        );
        if (res.ok) {
          newUser = await res.json();
          setUsers([...users, newUser]);
        } else {
          let data;
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          console.error("User creation error:", data);
          setAddError(
            (data &&
              (data.detail ||
                data.error ||
                data.non_field_errors ||
                JSON.stringify(data))) ||
              "Failed to add user (check required fields and backend validation)"
          );
          return;
        }
      }
      // Create or update profile for client
      if (addForm.role === "client" && newUser) {
        const formData = new FormData();
        formData.append("info_disease", addProfileForm.info_disease || "");
        if (addProfileForm.image_profile instanceof File) {
          formData.append("image_profile", addProfileForm.image_profile);
        }
        await fetch(
          `https://ahmedmsalah.pythonanywhere.com/users/clients/${newUser.id}/`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }
      // --- PHARMACIST FORM SUBMIT ---
      if (addForm.role === "pharmacist" && newUser) {
        const formData = new FormData();
        formData.append("has_store", addProfileForm.has_store);
        if (addPharmacistImages.image_profile instanceof File) {
          formData.append("image_profile", addPharmacistImages.image_profile);
        }
        if (addPharmacistImages.image_license instanceof File) {
          formData.append("image_license", addPharmacistImages.image_license);
        }
        await fetch(
          `https://ahmedmsalah.pythonanywhere.com/users/pharmacists/${newUser.id}/`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }
      setShowAddModal(false);
      setAddForm({ name: "", email: "", password: "", role: "client" });
      setAddProfileForm({
        info_disease: "",
        image_profile: "",
        has_store: false,
      });
      setAddPharmacistImages({ image_profile: null, image_license: null });
    } catch {
      setAddError("Failed to add user");
    }
  };

  // [SARA]: Filter users by search query (name or email) and role
  const filteredUsers = users.filter(
    (user) =>
      (roleFilter === "" || user.role === roleFilter) &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  // [SARA]: Show loading or error states (move below modals for consistent UX)
  // if (loading) return <div className="p-8 text-center">Loading users...</div>;
  // if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // [SARA]: Render user cards and edit modal
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white rounded-lg p-6">
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700 drop-shadow">
          Users
        </h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-90 rounded-xl shadow px-4 py-3 border border-blue-200">
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
              placeholder="Search by name or email..."
              className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="ml-4 border border-blue-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow transition-all text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleAddClick}
          >
            + Add New User
          </button>
        </div>
      </div>
      {/* User cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow duration-200 relative"
          >
            <div className="font-bold text-xl text-blue-800 flex items-center gap-2">
              {user.name}
            </div>
            <div className="text-gray-600 text-sm">{user.email}</div>
            <div className="text-sm text-blue-600">Role: {user.role}</div>
            <div className="flex gap-2 mt-2 justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                onClick={() => setDetailsUserId(user.id)}
              >
                Details
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                onClick={() => handleDeleteClick(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination controls */}
      <div className="flex gap-2 items-center flex-wrap justify-center my-8 w-full">
        <div className="flex gap-2 items-center flex-wrap justify-center mx-auto w-fit bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-3 border border-blue-200 z-40">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {/* Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded-lg border font-semibold transition ${
                num === page
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
              }`}
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
      {/* Details Modal */}
      {detailsUserId &&
        (() => {
          const detailsUser = users.find((u) => u.id === detailsUserId);
          return (
            <>
              <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
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
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">
                      User Details
                    </h2>
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    {console.log("[DEBUG detailsUser]:", detailsUser)}
                    {detailsUser ? (
                      <>
                        <div>
                          <b>Name:</b> {detailsUser.name}
                        </div>
                        <div>
                          <b>Email:</b> {detailsUser.email}
                        </div>
                        <div>
                          <b>Role:</b> {detailsUser.role}
                        </div>
                        {/* <div><b>Created:</b> {detailsUser.created_at ? new Date(detailsUser.created_at).toLocaleString() : 'N/A'}</div>
                      <div><b>Updated:</b> {detailsUser.updated_at ? new Date(detailsUser.updated_at).toLocaleString() : 'N/A'}</div> */}
                        {/* Pharmacist/Client extra data */}
                        {detailsUser.role === "pharmacist" &&
                        detailsUser.pharmacist_profile ? (
                          <>
                            <div className="text-blue-700 font-semibold mt-2">
                              Pharmacist Info
                            </div>
                            <div>
                              <b>Has Store:</b>{" "}
                              {detailsUser.pharmacist_profile.has_store
                                ? "Yes"
                                : "No"}
                            </div>
                            {/* <div><b>Created:</b> {detailsUser.pharmacist_profile.created_at ? new Date(detailsUser.pharmacist_profile.created_at).toLocaleString() : 'N/A'}</div>
                          <div><b>Updated:</b> {detailsUser.pharmacist_profile.updated_at ? new Date(detailsUser.pharmacist_profile.updated_at).toLocaleString() : 'N/A'}</div> */}
                          </>
                        ) : detailsUser.role === "pharmacist" ? (
                          <div className="text-gray-500">
                            Loading pharmacist profile...
                          </div>
                        ) : null}
                        {detailsUser.role === "client" &&
                        detailsUser.client_profile ? (
                          <>
                            <div className="text-blue-700 font-semibold mt-2">
                              Client Info
                            </div>
                            <div>
                              <b>Disease:</b>{" "}
                              {detailsUser.client_profile.info_disease || "N/A"}
                            </div>
                            <div>
                              <b>Profile Image:</b>{" "}
                              {detailsUser.client_profile.image_profile ? (
                                <img
                                  src={detailsUser.client_profile.image_profile}
                                  alt="Client Profile"
                                  className="w-24 h-24 rounded-full border mt-2 mb-2 object-cover"
                                />
                              ) : (
                                "No image"
                              )}
                            </div>
                            {/* <div><b>Insurance Provider:</b> {detailsUser.client_profile.insurance_provider || 'N/A'}</div>
                          <div><b>Emergency Contact:</b> {detailsUser.client_profile.emergency_contact || 'N/A'}</div> */}
                          </>
                        ) : detailsUser.role === "client" ? (
                          <div className="text-gray-500">
                            Loading client profile...
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="text-gray-500">
                        Loading user details...
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                    onClick={() => setDetailsUserId(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="flex gap-4 mt-2 justify-end px-8 pb-2">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                      onClick={() => setDetailsUserId(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      {/* Edit user modal */}
      {editUser && (
        <>
          <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn"
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
                  Edit User
                </h2>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-6">
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Name"
                  required
                />
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Email"
                  required
                />
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="client">Client</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                </select>
                {/* Extra fields for client */}
                {editForm.role === "client" && (
                  <>
                    <input
                      name="info_disease"
                      value={editProfileForm.info_disease}
                      onChange={handleEditProfileChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Disease"
                    />
                    <input
                      name="image_profile"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditProfileForm((prev) => ({
                          ...prev,
                          image_profile: e.target.files[0],
                        }))
                      }
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                  </>
                )}
                {/* Extra fields for pharmacist */}
                {editForm.role === "pharmacist" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="has_store"
                        checked={editProfileForm.has_store}
                        onChange={handleEditProfileChange}
                      />{" "}
                      Has Store
                    </label>
                    <label className="block mt-2">
                      Profile Image:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditPharmacistImages((prev) => ({
                            ...prev,
                            image_profile: e.target.files[0],
                          }))
                        }
                        className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </label>
                    <label className="block mt-2">
                      License Image:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditPharmacistImages((prev) => ({
                            ...prev,
                            image_license: e.target.files[0],
                          }))
                        }
                        className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </label>
                  </>
                )}
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
                    onClick={() => setEditUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                onClick={() => setEditUser(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </form>
          </div>
        </>
      )}
      {/* Delete confirmation modal */}
      {deleteUserId && (
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
                  Are you sure you want to delete this user?
                </p>
                <div className="flex gap-4 mt-2 justify-end">
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleDeleteCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                onClick={handleDeleteCancel}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        </>
      )}
      {/* Add user modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <form
              onSubmit={handleAddSubmit}
              className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn"
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
                  Add New User
                </h2>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-6">
                <input
                  name="name"
                  value={addForm.name}
                  onChange={handleAddChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Name"
                  required
                />
                <input
                  name="email"
                  value={addForm.email}
                  onChange={handleAddChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Email"
                  type="email"
                  required
                />
                <input
                  name="password"
                  value={addForm.password}
                  onChange={handleAddChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Password"
                  type="password"
                  required
                />
                <select
                  name="role"
                  value={addForm.role}
                  onChange={handleAddChange}
                  className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="client">Client</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                </select>
                {/* Extra fields for client */}
                {addForm.role === "client" && (
                  <>
                    <input
                      name="info_disease"
                      value={addProfileForm.info_disease}
                      onChange={handleAddProfileChange}
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Disease"
                    />
                    <input
                      name="image_profile"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setAddProfileForm((prev) => ({
                          ...prev,
                          image_profile: e.target.files[0],
                        }))
                      }
                      className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                    {addProfileForm.image_profile &&
                      typeof addProfileForm.image_profile === "object" && (
                        <div className="text-xs text-blue-700 mt-1">
                          Selected: {addProfileForm.image_profile.name}
                        </div>
                      )}
                  </>
                )}
                {/* Extra fields for pharmacist */}
                {addForm.role === "pharmacist" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="has_store"
                        checked={addProfileForm.has_store}
                        onChange={handleAddProfileChange}
                      />{" "}
                      Has Store
                    </label>
                    <label className="block mt-2">
                      Profile Image:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setAddPharmacistImages((prev) => ({
                            ...prev,
                            image_profile: e.target.files[0],
                          }))
                        }
                        className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                      {addPharmacistImages.image_profile &&
                        typeof addPharmacistImages.image_profile ===
                          "object" && (
                          <div className="text-xs text-blue-700 mt-1">
                            Selected: {addPharmacistImages.image_profile.name}
                          </div>
                        )}
                    </label>
                    <label className="block mt-2">
                      License Image:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setAddPharmacistImages((prev) => ({
                            ...prev,
                            image_license: e.target.files[0],
                          }))
                        }
                        className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                      {addPharmacistImages.image_license &&
                        typeof addPharmacistImages.image_license ===
                          "object" && (
                          <div className="text-xs text-blue-700 mt-1">
                            Selected: {addPharmacistImages.image_license.name}
                          </div>
                        )}
                    </label>
                  </>
                )}
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">
            Loading users...
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersAdminPage;
