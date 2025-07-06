import { Search, User, Menu, X, Globe } from "lucide-react";
import { useState, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationDropdown from "../notifications/notification-dropdown";
import { logout } from "../../features/authSlice.js";
import { LanguageContext } from "./translation/LanguageContext.jsx";

// Custom hook to safely use language context
const useSafeLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    // Return fallback values when context is not available
    return {
      t: (key) => {
        const fallbacks = {
          'header.logo': 'Drug Finder',
          'header.nav.home': 'Home',
          'header.nav.pharmacies': 'Pharmacies',
          'header.nav.about': 'About',
          'header.nav.contact': 'Contact',
          'header.auth.login': 'Login',
          'header.auth.signUp': 'Sign Up',
          'header.auth.profile': 'Profile',
          'header.auth.logout': 'Logout',
          'header.auth.cart': 'Cart'
        };
        return fallbacks[key] || key;
      },
      isRTL: false,
      toggleLanguage: () => {},
      currentLanguage: null
    };
  }
  
  return context;
};

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t, isRTL, toggleLanguage, currentLanguage } = useSafeLanguage();
  
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
    <header className="bg-white shadow-sm border-b border-gray-100" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="images/logo1.svg" width="40px" alt="" />
            <h1 className="text-2xl font-bold text-blue-600">{t('header.logo')}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t('header.nav.home')}
            </Link>
            {/* <Link
              to="/pharmacies"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pharmacies
            </Link> */}
            <Link
              to="/#services"
              className="text-gray-700 hover:text-blue-600  font-medium transition-colors"
            >
              {t('header.nav.about')}
            </Link>
          </nav>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle - Only show if we're in the home page context */}
            {currentLanguage && (
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {currentLanguage === 'ar' ? 'EN' : 'عربي'}
                </span>
              </button>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t('header.auth.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('header.auth.signUp')}
                </Link>
              </>
            ) : (
              <>
                <Link to="/client/cart" className="relative flex items-center">
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
                  to="/client/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t('header.auth.profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('header.auth.logout')}
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
              {/* Language Toggle for Mobile - Only show if we're in the home page context */}
              {currentLanguage && (
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">
                    {currentLanguage === 'ar' ? 'English' : 'العربية'}
                  </span>
                </button>
              )}

              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.nav.home')}
              </Link>
              <Link
                to="/pharmacies"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.nav.pharmacies')}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.nav.about')}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.nav.contact')}
              </Link>

              {user ? (
                <>
                  <Link
                    to="/client/cart"
                    className="relative flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    {t('header.auth.cart')}
                    {cartItemCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/client/profile"
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.auth.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {t('header.auth.logout')}
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.auth.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.auth.signUp')}
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


