import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  X,
  Earth
} from "lucide-react";
import apiEndpoints from "../../../src/services/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";

const Sidebar = ({ role = "client", onNavigate, isMobile }) => {
  const [user, setUser] = useState({
    name: "Loading...",
    avatar: "/avatar.jpg",
  });
  const dispatch = useDispatch();
  const [hasStore, setHasStore] = useState(true);
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
const cart = useSelector((state) => state.cart.cart);
const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiEndpoints.users.getCurrentUser();
        let avatar = res.data.image_profile || "/avatar.jpg";
        console.log(res);
        setUser({
          name: res.data.name || "Unknown",
          avatar,
        });

        if (res.data.role === "pharmacist") {
          const pharmacistRes = await apiEndpoints.users.getPharmacistProfile();
          setHasStore(pharmacistRes.data.has_store);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = {
    admin: [
      { label: "Requests", icon: FileQuestion, to: "/admin", end: true },
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Medicines", icon: ClipboardList, to: "/admin/medicines" },
      { label: "Stores", icon: WarehouseIcon, to: "/admin/stores" },
      { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
    ],
    pharmacist: hasStore
      ? [
          { label: "Store", icon: Store, to: "/pharmacy/store" },
          { label: "Archive", icon: Package, to: "/pharmacy/archive" },
          { label: "Profile", icon: User, to: "/pharmacy/profile" },
          { label: "Orders", icon: ShoppingBag, to: "/pharmacy/orders" },
        ]
      : [
          { label: "Store", icon: Store, to: "/pharmacy/store" },
          { label: "Profile", icon: User, to: "/pharmacy/profile" },
        ],
    client: [
      { label: 'Search', icon: Earth, to: '/client/MedicineSearchPage', end: true },
      { label: 'Pharmacies', icon: StoreIcon, to: '/client/pharmacies' },
      { label: 'Cart', icon: ShoppingCart, to: '/client/cart' },
      { label: 'Order', icon: ShoppingBag, to: '/client/order' },
      { label: 'Profile', icon: CircleUser, to: '/client/profile' },
    ],
  };

  const items = menuItems[role] || [];

return (
  <div className="fixed top-0 left-0 h-full w-64 bg-blue-700 text-white flex flex-col z-20">
    {/* CLOSE BUTTON (MOBILE ONLY) */}
    {isMobile && (
      <div className="flex justify-end p-4">
        <button
          onClick={() => onNavigate && onNavigate()}
          className="text-white hover:text-blue-200"
        >
          <X size={24} />
        </button>
      </div>
    )}

    {/* LOGO */}
    <div className="flex items-center gap-3 p-5 border-b border-blue-500">
      <img src="/l.png" alt="Logo" className="w-14 h-14 object-contain" />
      <h1 className="text-3xl font-semibold">Drug Finder</h1>
    </div>

    {/* USER PROFILE */}
    <div className="border-b border-blue-600 p-4 flex items-center gap-4 relative group">
      <div className="relative">
        {role === "admin" ? (
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full border-2 border-yellow-400 shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck
              size={24}
              className="text-yellow-500 animate-pulse"
              title="Admin"
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 rounded-full bg-blue-800 opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        )}
        {role === "admin" && (
          <div className="absolute -bottom-1 -right-1 bg-blue-700 text-yellow-400 rounded-full p-1 shadow-sm">
            <ShieldCheck size={16} title="Admin" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate text-lg transition-all group-hover:text-blue-100">
          {user.name}
        </p>
        <div className="flex items-center gap-1">
          <p className="text-xs font-medium text-blue-100 bg-blue-800/50 px-2 py-0.5 rounded-full capitalize">
            {role}
          </p>
          {role !== "admin" && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>

    {/* MENU ITEMS */}
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
       {/* <NavLink
    to="/"
    end
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-2 rounded-md transition-all ${
        isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-800"
      }`
    }
  >
    <Home size={20} className="text-white" />
    <span>Home</span>
  </NavLink> */}
              {items.map(({ label, icon: Icon, to, end }, index) => {
          const isCart = label === "Cart";

          return (
            <NavLink
              key={index}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-md transition-all ${
                  isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-800"
                }`
              }
            >
              {/* Icon with badge */}
              <div className="relative">
                <Icon size={20} className="text-white" />
                {isCart && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none shadow">
                    {cartItemCount}
                  </span>
                )}
              </div>

              <span>{label}</span>
            </NavLink>
          );
        })}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-md hover:bg-blue-800 transition-all mt-4"
        >
          <LogOut size={20} className="text-white" />
          <span>Logout</span>
        </button>
    </nav>
  </div>
);

};

export default Sidebar;