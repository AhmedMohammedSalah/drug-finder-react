import { Search, User, Menu, X } from "lucide-react"
import { useState } from "react"
import {Link} from "react-router-dom"       
import NotificationDropdown from "../notifications/notification-dropdown"
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">Drug Finder</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/pharmacies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Services
            </Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {/* action buttons  */}
            {/* if guest */}
            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </Link>
            <Link to="/register"className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
              Sign Up
            </Link>
            {/* if logined */}

            {/* Notification Dropdown */}
            <NotificationDropdown />
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
              Logout
            </button>
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Services
              </Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
              {/* guest actions */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2">
                  Login
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </div>
              {/* loginned action  */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2">
                  Profile
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
