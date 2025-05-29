import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../home/header'
import Footer from '../home/footer'

const defaultLayout = () => {
    return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default defaultLayout
