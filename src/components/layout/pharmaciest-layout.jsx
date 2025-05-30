import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../pharmacist/dashboardNav'
import Footer from '../pharmacist/dashboardFooter'
import Sidebar from '../shared/sidebar';

const pharmaciestlayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
        </div>
    )
}

export default pharmaciestlayout;
