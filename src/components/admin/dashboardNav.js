import React from 'react';
import IconButton from '../shared/btn';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <div className="flex flex-row items-center justify-between h-16 p-2">
            {/* Logo */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Drug Finder</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex gap-6">
                <Link to="/admin" className="text-white hover:bg-white hover:text-sky-900 px-4 py-2 rounded-md transition">Users</Link>
                <Link to="/admin/medicines" className="text-white hover:bg-white hover:text-sky-900 px-4 py-2 rounded-md transition">Medicines</Link>
                <Link to="/admin/stores" className="text-white hover:bg-white hover:text-sky-900 px-4 py-2 rounded-md transition">Stores</Link>
                <Link to="/admin/orders" className="text-white hover:bg-white hover:text-sky-900 px-4 py-2 rounded-md transition">Orders</Link>
                <Link to="/admin/requests" className="text-white hover:bg-white hover:text-sky-900 px-4 py-2 rounded-md transition">Requests</Link>
            </nav>

            {/* Profile & Logout */}
            <div className="flex items-center gap-4">
                <button className="text-white hover:underline font-medium">
                    Profile
                </button>
                <IconButton
                    btnColor="white"
                    btnShade="500"
                    textColor="emerald"
                    hoverShade="600"
                    focusShade="400"
                    path="/"
                    text="Logout"
                />
            </div>
        </div>
    );
}

export default Nav;
