// Sidebar.jsx

import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Users,
  LogOut,
  ClipboardList,
  Package,
  Store,
  User,
  StoreIcon,
  ShoppingCart,
  CircleUser,
  WarehouseIcon,
  FileQuestion,
  Power,
  ShieldCheck,
} from 'lucide-react';
import apiEndpoints from '../../../src/services/api';
import { useSelector } from 'react-redux';

const Sidebar = ({ role = 'client' }) => {
  const [user, setUser] = useState({ name: 'Loading...', avatar: '/avatar.jpg' });

  // [SENU] TRACK WHETHER THE PHARMACIST HAS A STORE
  const [hasStore, setHasStore] = useState(true); // Default true to show full menu
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiEndpoints.users.getCurrentUser();
        let avatar = res.data.image_profile || '/avatar.jpg';

        setUser({
          name: res.data.name || 'Unknown',
          avatar,
        });

        // [SENU] IF ROLE IS PHARMACIST, FETCH WHETHER THEY HAVE A STORE
        if (res.data.role === 'pharmacist') {
          const pharmacistRes = await apiEndpoints.users.getPharmacistProfile();
          setHasStore(pharmacistRes.data.has_store); // This field must exist in backend response
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // === ROLE-BASED MENU ITEMS ===
  const menuItems = {
    admin: [
      { label: 'Requests', icon: FileQuestion, to: '/admin', end: true }, // ✅ Points to /admin
      { label: 'Users', icon: Users, to: '/admin/users' },
      { label: 'Medicines', icon: ClipboardList, to: '/admin/medicines' },
      { label: 'Stores', icon: WarehouseIcon, to: '/admin/stores' },
      { label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
    ],

    // [SENU] CONDITIONALLY SHOW PHARMACIST MENU BASED ON STORE AVAILABILITY
    pharmacist: hasStore
      ? [
          { label: 'Home', icon: Home, to: '/pharmacy/home' },
          { label: 'Store', icon: Store, to: '/pharmacy/store' },
          { label: 'Profile', icon: User, to: '/pharmacy/profile' },
          { label: 'Inventory', icon: Package, to: '/pharmacy/drugs' },
          { label: 'Orders', icon: ShoppingBag, to: '/pharmacy/orders' },
        ]
      : [
          { label: 'Store', icon: Store, to: '/pharmacy/store' },
          { label: 'Profile', icon: User, to: '/pharmacy/profile' },
        ],

    client: [
      { label: 'Search', icon: Home, to: '/client', end: true },
      { label: 'Pharmacies', icon: StoreIcon, to: '/client/pharmacies' },
      { label: 'Cart', icon: ShoppingCart, to: '/client/cart' },
      { label: 'Order', icon: ShoppingBag, to: '/client/order' },
      { label: 'Profile', icon: CircleUser, to: '/MyProfile' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div className="h-screen w-64 bg-blue-700 text-white flex flex-col shadow-lg fixed left-0 top-0">
      {/* LOGO */}
      <div className="flex items-center gap-3 p-5 border-b border-blue-500">
        <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
        <h1 className="text-xl font-semibold">Drug Finder</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map(({ label, icon: Icon, to, end }, index) => (
          <NavLink
            key={index}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-md transition-all ${
                isActive ? 'bg-blue-900 font-semibold' : 'hover:bg-blue-800'
              }`
            }
          >
            <Icon size={20} className="text-white" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* LOGOUT button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-md hover:bg-blue-800 transition-all mt-4"
        >
          <LogOut size={20} className="text-white" />
          <span>Logout</span>
        </button>
      </nav>

      {/* USER PROFILE */}
      <div className="border-t border-blue-500 p-4 flex items-center gap-3 relative">
        <div className="relative">
          {role === 'admin' ? (
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full border-2 border-yellow-400">
              <ShieldCheck size={20} className="text-yellow-500" title="Admin" />
            </div>
          ) : (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          )}

          {role === 'admin' && (
            <ShieldCheck
              size={16}
              className="absolute -bottom-1 -right-1 bg-blue-700 text-yellow-400 rounded-full p-0.5"
              title="Admin"
            />
          )}
        </div>
        <div className="text-sm">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-blue-200 capitalize">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
