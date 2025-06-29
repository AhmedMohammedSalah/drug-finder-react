import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/sidebar';

import NotificationDropdown from "../notifications/notification-dropdown";
import { Toaster } from "react-hot-toast";
const PharmaciestLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* FIXED SIDEBAR ON THE LEFT */}
      <div className="w-64 fixed top-0 left-0 h-screen z-50">
        <Sidebar
          role="pharmacist"
          user={{
            name: "Dr. Ahmed",
            avatar: "https://i.pravatar.cc/100?img=25",
          }}
        />
      </div>

      {/* MAIN CONTENT NEXT TO SIDEBAR */}
      {/* MAIN CONTENT NEXT TO SIDEBAR */}
      <div className="flex-1 ml-64">
        {/* Notification dropdown in header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
          <div className="flex items-center gap-4">
            <NotificationDropdown />
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* Toast notifications */}
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
    </div>
  );
};

export default PharmaciestLayout;
