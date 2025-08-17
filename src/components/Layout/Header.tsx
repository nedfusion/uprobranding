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
  Wrench
} from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.type) {
      case 'customer': return '/customer/dashboard';
      case 'handyman': return '/handyman/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-forest-500" />
            <img 
              src="/Logo-removebg-preview (1).png" 
              alt="HandyNaija" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
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
                  to="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-forest-500 text-white hover:bg-forest-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Join as Handyman
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}