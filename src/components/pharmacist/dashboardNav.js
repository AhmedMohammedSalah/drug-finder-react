import React from 'react';
import { Link } from 'react-router-dom';
function Nav (){
    return (
        <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4 text-white">Pharmacist Dashboard</h1>
        <nav className="space-y-2">
            <Link to="/pharmacy/drugs" className="text-blue-500 hover:underline">Products</Link>
            <Link to="/pharmacy/orders" className="text-blue-500 hover:underline">Orders</Link>
            {/* <a href="/pharmacist/medications" className="text-blue-500 hover:underline">Medications</a>
            <a href="/pharmacist/patient-info" className="text-blue-500 hover:underline">Patient Info</a>
            <a href="/pharmacist/reports" className="text-blue-500 hover:underline">Reports</a> */}
        </nav>
        </div>
    );
}

export default Nav;