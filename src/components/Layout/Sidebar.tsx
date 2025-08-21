import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Star,
  Wallet,
  Settings,
  Users,
  BarChart3,
  Shield,
  Search,
  BookOpen,
  X
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.type) {
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
          { icon: Search, label: 'Find Services', path: '/customer/search' },
          { icon: Calendar, label: 'My Bookings', path: '/customer/bookings' },
          { icon: MessageSquare, label: 'Messages', path: '/messages' },
          { icon: Wallet, label: 'Wallet', path: '/wallet' },
          { icon: Star, label: 'Reviews', path: '/customer/reviews' },
          { icon: Settings, label: 'Settings', path: '/profile' }
        ];

      case 'service_provider':
        return [
          { icon: Home, label: 'Dashboard', path: '/service-provider/dashboard' },
          { icon: Calendar, label: 'My Jobs', path: '/service-provider/jobs' },
          { icon: User, label: 'Profile', path: '/service-provider/profile' },
          { icon: BookOpen, label: 'Portfolio', path: '/service-provider/portfolio' },
          { icon: MessageSquare, label: 'Messages', path: '/messages' },
          { icon: Wallet, label: 'Earnings', path: '/service-provider/earnings' },
          { icon: Star, label: 'Reviews', path: '/service-provider/reviews' },
          { icon: Settings, label: 'Settings', path: '/profile' }
        ];

      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
          { icon: Wallet, label: 'Payments', path: '/admin/payments' },
          { icon: Shield, label: 'Disputes', path: '/admin/disputes' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r h-full transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
                onClick={() => setIsMobileOpen(false)}
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900 capitalize">
            {user.type} Panel
          </h3>
          <p className="text-sm text-gray-500">{user.firstName} {user.lastName}</p>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-50 text-forest-700 border-r-2 border-forest-700'
                    : 'text-gray-700 hover:bg-forest-50 hover:text-forest-600'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-forest-700' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}