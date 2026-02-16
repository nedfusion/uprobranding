import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  LogIn
} from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.type) {
      case 'customer': return '/customer/dashboard';
      case 'service_provider': return '/service-provider/dashboard';
      case 'admin':
      case 'super_admin':
        return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/Logo-removebg-preview (1).png" 
              alt="UPRO" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* About Link */}
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </Link>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="text-gray-600 hover:text-forest-600 p-2 rounded-full hover:bg-forest-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                {/* Notifications */}
                <button className="text-gray-600 hover:text-forest-600 p-2 rounded-full hover:bg-forest-50 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-forest-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-forest-600 p-2 rounded-md transition-colors">
                    <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-forest-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      {user.type === 'customer' && (
                        <Link
                          to="/wallet"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Wallet
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-forest-500 text-white hover:bg-forest-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Join as Service Provider
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center px-3 py-2 border-b border-gray-200 mb-2">
                    <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-forest-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user.type === 'super_admin' ? 'Super Admin' : user.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link
                    to={getDashboardPath()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  {user.type === 'customer' && (
                    <Link
                      to="/wallet"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wallet
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/auth/login"
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-3 py-2 text-base font-medium bg-forest-500 text-white hover:bg-forest-600 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join as Service Provider
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}