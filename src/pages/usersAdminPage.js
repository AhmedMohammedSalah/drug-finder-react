// [SARA]: Import dependencies and icons
import React, { useEffect, useState } from 'react';
import IconButton from '../components/shared/btn';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

function UsersAdminPage() {
  // [SARA]: State for users, loading, error, editing user, and edit form
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  // [SARA]: State for delete confirmation modal
  const [deleteUserId, setDeleteUserId] = useState(null);
  // [SARA]: State for add user modal and form
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [addError, setAddError] = useState(null);
  // [SARA]: State for search query
  const [search, setSearch] = useState('');
  // [SARA]: State for details modal
  const [detailsUser, setDetailsUser] = useState(null);
  // [SARA]: State for role filter
  const [roleFilter, setRoleFilter] = useState('');
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);

  // [SARA]: Get token from localStorage for authentication
  const token = localStorage.getItem('access_token') || localStorage.getItem('access_token');

  // [SARA]: Fetch users from backend on mount or page change
  useEffect(() => {
    setLoading(true);
    const url = `http://localhost:8000/users/users/?page=${page}&page_size=${pageSize}`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : data.results || []);
        setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, [token, page, pageSize]);

  // Fetch extra profile data for users (client/pharmacist)
  useEffect(() => {
    async function fetchProfiles() {
      const updatedUsers = await Promise.all(users.map(async user => {
        if (user.role === 'pharmacist') {
          try {
            const res = await fetch(`http://localhost:8000/users/pharmacists/${user.id}/`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const profile = await res.json();
              console.log('[SARA]: Fetching pharmacist profile for pharmacist:', { ...user, pharmacist_profile: profile });

              return { ...user, pharmacist_profile: profile };
            }
          } catch {}
        } else if (user.role === 'client') {
          try {
            const res = await fetch(`http://localhost:8000/users/clients/${user.id}/`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const profile = await res.json();
              console.log('[SARA]: Fetching client profile for client:', { ...user, client_profile: profile });
              return { ...user, client_profile: profile };
            }
          } catch {}
        }
        return user;
      }));
      setUsers(updatedUsers);
    }
    if (users.length > 0) fetchProfiles();
    // eslint-disable-next-line
  }, [users.length]);

  // [SARA]: Delete user by id
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`http://localhost:8000/users/users/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setUsers(users.filter(u => u.id !== id));
  };

  // [SARA]: Open edit modal and set form values
  const handleEdit = (user) => {
    // [SARA]: Debug log to check user object
    console.log('[SARA]: Editing user object:', user);
    // [SARA]: Fallback to _id if id is missing
    const userId = user.id || user._id;
    if (!userId) {
      alert('User object is missing an id. Cannot edit this user.');
      return;
    }
    setEditUser({ ...user, id: userId });
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  // [SARA]: Handle changes in edit form fields
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // [SARA]: Submit edit form and update user (no reload, update state)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser || !editUser.id) {
      alert('User ID is missing. Cannot update user.');
      return;
    }
    const res = await fetch(`http://localhost:8000/users/users/${editUser.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setEditUser(null);
    }
  };

  // [SARA]: Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
  };

  // [SARA]: Confirm delete user by id (no reload, update state)
  const handleDeleteConfirm = async () => {
    await fetch(`http://localhost:8000/users/users/${deleteUserId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setUsers(users.filter(u => u.id !== deleteUserId));
    setDeleteUserId(null);
  };

  // [SARA]: Cancel delete
  const handleDeleteCancel = () => {
    setDeleteUserId(null);
  };

  // [SARA]: Open add user modal
  const handleAddClick = () => {
    setAddForm({ name: '', email: '', role: 'client', password: '' });
    setShowAddModal(true);
  };

  // [SARA]: Handle changes in add form fields
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // [SARA]: Submit add form and create user (no reload, update state)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    try {
      const res = await fetch('http://localhost:8000/users/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addForm)
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers([...users, newUser]);
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: '', role: 'client' });
      } else {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        // [SARA]: Show full error message for debugging
        setAddError(
          (data && (data.detail || data.error || JSON.stringify(data))) ||
          'Failed to add user (check required fields and backend validation)'
        );
      }
    } catch {
      setAddError('Failed to add user');
    }
  };

  // [SARA]: Filter users by search query (name or email) and role
  const filteredUsers = users.filter(user =>
    (roleFilter === '' || user.role === roleFilter) &&
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
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700 drop-shadow">Users</h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-90 rounded-xl shadow px-4 py-3 border border-blue-200">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
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
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow duration-200 relative">
            <div className="font-bold text-xl text-blue-800 flex items-center gap-2">{user.name}</div>
            <div className="text-gray-600 text-sm">{user.email}</div>
            <div className="text-sm text-blue-600">Role: {user.role}</div>
            <div className="flex gap-2 mt-2 justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
                onClick={() => setDetailsUser(user)}
              >
                Details
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all" onClick={() => handleEdit(user)}>Edit</button>
              <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all" onClick={() => handleDeleteClick(user.id)}>Delete</button>
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
      {/* Details Modal */}
      {detailsUser && (
        <>
          <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
              <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </span>
                <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">User Details</h2>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {console.log('[DEBUG detailsUser]:', detailsUser)}
                <div><b>Name:</b> {detailsUser.name}</div>
                <div><b>Email:</b> {detailsUser.email}</div>
                <div><b>Role:</b> {detailsUser.role}</div>
                <div><b>Created:</b> {detailsUser.created_at ? new Date(detailsUser.created_at).toLocaleString() : 'N/A'}</div>
                <div><b>Updated:</b> {detailsUser.updated_at ? new Date(detailsUser.updated_at).toLocaleString() : 'N/A'}</div> 
                {/* Pharmacist/Client extra data */}
                {detailsUser.role === 'pharmacist' && detailsUser.pharmacist_profile && (
                  <>
                    <div className="text-blue-700 font-semibold mt-2">Pharmacist Info</div>
                    <div><b>Has Store:</b> {detailsUser.pharmacist_profile.has_store? "Yes" : 'No'}</div>
                    {/* <div><b>Store Name:</b> {detailsUser.pharmacist_profile.store_name || 'N/A'}</div> */}
                    {/* <div><b>Degree:</b> {detailsUser.pharmacist_profile.degree || 'N/A'}</div>
                    <div><b>Graduation:</b> {detailsUser.pharmacist_profile.graduation_year || 'N/A'}</div>
                    <div><b>Workplace:</b> {detailsUser.pharmacist_profile.workplace || 'N/A'}</div> */}
                  </>
                )}
                {detailsUser.role === 'client' && detailsUser.client_profile && (
                  <>
                    <div className="text-blue-700 font-semibold mt-2">Client Info</div>
                    <div><b>Disease:</b> {detailsUser.client_profile.info_disease || 'N/A'}</div>
                    <div><b>Insurance Provider:</b> {detailsUser.client_profile.insurance_provider || 'N/A'}</div>
                    <div><b>Emergency Contact:</b> {detailsUser.client_profile.emergency_contact || 'N/A'}</div>
                  </>
                )}
              </div>
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150"
                onClick={() => setDetailsUser(null)}
                aria-label="Close"
              >&times;</button>
              <div className="flex gap-4 mt-2 justify-end px-8 pb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none"
                  onClick={() => setDetailsUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Edit user modal */}
      {editUser && (
        <>
          <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
              <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z" /></svg>
                </span>
                <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">Edit User</h2>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-6">
                <input name="name" value={editForm.name} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Name" required />
                <input name="email" value={editForm.email} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Email" required />
                <select name="role" value={editForm.role} onChange={handleEditChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400">
                  <option value="client">Client</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-4 mt-2 justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">Save</button>
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none" onClick={() => setEditUser(null)}>Cancel</button>
                </div>
              </div>
              <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={() => setEditUser(null)} aria-label="Close">&times;</button>
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
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </span>
                <h2 className="text-2xl font-extrabold text-red-800 mb-0 tracking-wide">Confirm Delete</h2>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-6">
                <p className="text-gray-700">Are you sure you want to delete this user?</p>
                <div className="flex gap-4 mt-2 justify-end">
                  <button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400">Delete</button>
                  <button onClick={handleDeleteCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow transition-all focus:outline-none">Cancel</button>
                </div>
              </div>
              <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-all duration-150" onClick={handleDeleteCancel} aria-label="Close">&times;</button>
            </div>
          </div>
        </>
      )}
      {/* Add user modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-40 bg-white bg-opacity-70 backdrop-blur-sm transition-all duration-300" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn">
              <div className="flex flex-col items-center justify-center rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-200 mb-2 shadow-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </span>
                <h2 className="text-2xl font-extrabold text-blue-800 mb-0 tracking-wide">Add New User</h2>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-6">
                <input name="name" value={addForm.name} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Name" required />
                <input name="email" value={addForm.email} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Email" type="email" required />
                <input name="password" value={addForm.password} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Password" type="password" required />
                <select name="role" value={addForm.role} onChange={handleAddChange} className="border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400">
                  <option value="client">Client</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                </select>
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
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">Loading users...</div></div>}
      {error && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">{error}</div></div>}
    </div>
  );
}

export default UsersAdminPage;