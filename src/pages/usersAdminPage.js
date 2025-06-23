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

  // [SARA]: Get token from localStorage for authentication
  const token = localStorage.getItem('access_token') || localStorage.getItem('access_token');

  // [SARA]: Fetch users from backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/users/users/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, [token]);

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

  // [SARA]: Filter users by search query (name or email)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // [SARA]: Show loading or error states (move below modals for consistent UX)
  // if (loading) return <div className="p-8 text-center">Loading users...</div>;
  // if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // [SARA]: Render user cards and edit modal
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-6">
      {/* [SARA]: Header and actions row */}
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Users Page</h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          {/* [SARA]: Search bar */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {/* [SARA]: Add New User button aligned right */}
          <button
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={handleAddClick}
          >
            Add New User
          </button>
        </div>
      </div>
      {/* [SARA]: User cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
            <div className="text-sm text-blue-600">Role: {user.role}</div>
            <div className="flex gap-2 mt-2">
              {/* [SARA]: Edit button */}
              <IconButton
                btnColor="green"
                btnShade="500"
                textColor="white"
                hoverShade="600"
                focusShade="400"
                onClick={() => handleEdit(user)}
                icon={PencilIcon}
                name="Edit"
              />
              {/* [SARA]: Delete button */}
              <IconButton
                btnColor="red"
                btnShade="500"
                textColor="white"
                hoverShade="600"
                focusShade="400"
                onClick={() => handleDeleteClick(user.id)}
                icon={TrashIcon}
                name="Delete"
              />
            </div>
          </div>
        ))}
      </div>
      {/* [SARA]: Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2">Edit User</h2>
            <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-2 rounded" placeholder="Name" />
            <input name="email" value={editForm.email} onChange={handleEditChange} className="border p-2 rounded" placeholder="Email" />
            <select name="role" value={editForm.role} onChange={handleEditChange} className="border p-2 rounded">
              <option value="client">Client</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* [SARA]: Delete confirmation modal */}
      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex gap-2 mt-2">
              <button onClick={handleDeleteConfirm} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={handleDeleteCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* [SARA]: Add user modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2">Add New User</h2>
            <input name="name" value={addForm.name} onChange={handleAddChange} className="border p-2 rounded" placeholder="Name" required />
            <input name="email" value={addForm.email} onChange={handleAddChange} className="border p-2 rounded" placeholder="Email" type="email" required />
            <input name="password" value={addForm.password} onChange={handleAddChange} className="border p-2 rounded" placeholder="Password" type="password" required />
            <select name="role" value={addForm.role} onChange={handleAddChange} className="border p-2 rounded">
              <option value="client">Client</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">Loading users...</div></div>}
      {error && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">{error}</div></div>}
    </div>
  );
}

export default UsersAdminPage;