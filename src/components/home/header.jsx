import { Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationDropdown from "../notifications/notification-dropdown";
import { logout } from "../../features/authSlice.js";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());
    navigate("/");
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Always use array for cartItems to avoid undefined errors with backend cart
  const cart = useSelector((state) => state.cart.cart);
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;


  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="images/logo1.svg" width="40px" alt="" />
            <h1 className="text-2xl font-bold text-blue-600">Drug Finder</h1>
          </div>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pharmacies"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pharmacies
            </Link>
            <Link
              to="/#services"
              className="text-gray-700 hover:text-blue-600  font-medium transition-colors"
            >
              About
            </Link>
            {/* <Link
              to="/#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link> */}
          </nav>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center w-[400px] bg-white border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full outline-none text-base"
              />
            </div>


            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="relative flex items-center">
                  <div className="relative">
                    <ShoppingCart size={20} className="text-gray-700" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none shadow">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>

                <NotificationDropdown />
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/pharmacies"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pharmacies
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    to="/client/cart"
                    className="relative flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


