import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/sidebar';

const PharmaciestLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* FIXED SIDEBAR ON THE LEFT */}
      <div className="w-64 fixed top-0 left-0 h-screen z-50">
      <Sidebar
        role="pharmacist"
        user={{ name: 'Dr. Ahmed', avatar: 'https://i.pravatar.cc/100?img=25' }}
        />
      </div>

      {/* MAIN CONTENT NEXT TO SIDEBAR */}
      <div className="flex-1 ml-64 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PharmaciestLayout;
