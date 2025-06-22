import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../admin/dashboardNav'
import Footer from '../admin/dashboardFooter'

const adminlayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-sky-900">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
        </div>
    )
}

export default adminlayout;
