import React from 'react';
import Button from '../shared/btn';
import { Link } from 'react-router-dom';
function Nav (){
    return (
        <div className="flex flex-row items-center justify-between h-full">
            {/* Logo */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Drug Finder</h1>
            </div>
            {/* <h1 className="text-2xl font-bold mb-4 text-white">Pharmacist Dashboard</h1> */}
            <div className="flex-grow">
                <nav className="space-y-2">
                    <Link to="/pharmacy/drugs" className="text-blue-500 hover:underline">Products</Link>
                    <Link to="/pharmacy/orders" className="text-blue-500 hover:underline">Orders</Link>
                    {/* <a href="/pharmacist/medications" className="text-blue-500 hover:underline">Medications</a>
                    <a href="/pharmacist/patient-info" className="text-blue-500 hover:underline">Patient Info</a>
                    <a href="/pharmacist/reports" className="text-blue-500 hover:underline">Reports</a> */}
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                {/* <Link to="/pharmacy/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Profile
                </Link>
                <Link to="/pharmacy/logout" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
                    Logout
                </Link> */}

                <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                    {/* <User className="w-5 h-5" /> */}
                    <span className="font-medium">Profile</span>
                </button>
                {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
                    Logout
                </button> */}
                <Button
                    btnColor="blue"
                    btnShade="500"
                    textColor="white"
                    hoverShade="600"
                    focusShade="400"
                    path="/pharmacy/drugs/add"
                    text="logout"
                    // icon="plus"
                />
            </div>
        </div>
    );
}

export default Nav;