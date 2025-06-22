import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Users,
  LogOut,
  ClipboardList,
  Package,
  UserCircle,
  Store,
  User,
} from 'lucide-react';

const Sidebar = ({ role = 'client', user = { name: 'John Doe', avatar: '/avatar.jpg' } }) => {
  // === ROLE-BASED MENU ITEMS ===
  const menuItems = {
    admin: [
      { label: 'Dashboard', icon: Home, to: '/admin/dashboard' },
      { label: 'Orders', icon: ClipboardList, to: '/admin/orders' },
      { label: 'Users', icon: Users, to: '/admin/users' },
      { label: 'Logout', icon: LogOut, to: '/logout' },
    ],
    pharmacist: [
      { label: 'Home', icon: Home, to: '/pharmacy/home' },
      { label: 'Store', icon: Store, to: '/pharmacy/store' },
      { label: 'Profile', icon: User, to: '/pharmacy/profile' },
      { label: 'Inventory', icon: Package, to: '/pharmacy/drugs' },
      { label: 'Orders', icon: ShoppingBag, to: '/pharmacy/orders' },
      { label: 'Logout', icon: LogOut, to: '/logout' },
    ],
    client: [
      { label: 'Home', icon: Home, to: '/' },
      { label: 'My Orders', icon: ShoppingBag, to: '/orders' },
      { label: 'Profile', icon: UserCircle, to: '/profile' },
      { label: 'Logout', icon: LogOut, to: '/logout' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div className="h-screen w-64 bg-blue-700 text-white flex flex-col shadow-lg fixed left-0 top-0">
      {/* LOGO AND TITLE */}
      <div className="flex items-center gap-3 p-5 border-b border-blue-500">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-14 h-14 object-contain"
        />
        <h1 className="text-xl font-semibold">Drug Finder</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map(({ label, icon: Icon, to }, index) => (
          <NavLink
            key={index}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-md transition-all 
              ${isActive ? 'bg-blue-900 font-semibold' : 'hover:bg-blue-800'}`
            }
          >
            <Icon size={20} className="text-white" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* USER PROFILE AT BOTTOM */}
      <div className="border-t border-blue-500 p-4 flex items-center gap-3">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />
        <div className="text-sm">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-blue-200">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
