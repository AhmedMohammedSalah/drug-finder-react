import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/sidebar';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1186);

  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1186;
      setIsLargeScreen(largeScreen);
      // Auto-close sidebar when resizing to large screen if it was open
      if (largeScreen && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* TOGGLE BUTTON - VISIBLE ONLY BELOW 1186px */}
      {!isLargeScreen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* SIDEBAR */}
      <div
        className={`w-64 fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out ${
          isLargeScreen 
            ? "translate-x-0 shadow-xl" 
            : (sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full")
        }`}
      >
        <Sidebar
          role="admin"
          user={{
            name: "Dr. Ahmed",
            avatar: "https://i.pravatar.cc/100?img=25",
          }}
          onNavigate={() => !isLargeScreen && setSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className={`flex-1 transition-all duration-300 ${
        isLargeScreen ? "ml-64" : ""
      }`}>
        <div className="p-4 sm:p-6 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* OVERLAY - ONLY ON SMALL SCREENS */}
      {!isLargeScreen && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;