import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import NotificationDropdown from "../notifications/notification-dropdown";
import { Toaster } from "react-hot-toast";
import { Menu } from "lucide-react";

const ClientLayout = () => {
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
    <div className="flex min-h-screen bg-gray-50">
      {/* TOGGLE BUTTON - VISIBLE ONLY BELOW 1186px */}
      {!isLargeScreen && (
        <button
          className="fixed top-2 left-4 z-50 p-2 rounded-md bg-blue-700 text-white shadow-lg hover:bg-blue-800 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* SIDEBAR */}
      <div
        className={`w-64 fixed top-0 left-0 h-screen z-40 bg-blue-700 transition-all duration-300 ease-in-out ${
          isLargeScreen 
            ? "translate-x-0 shadow-xl" 
            : (sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full")
        }`}
      >
        <Sidebar
          role="client"
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
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
          <div className="flex items-center gap-4">
            <NotificationDropdown />
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#374151",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
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

export default ClientLayout;