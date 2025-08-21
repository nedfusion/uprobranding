import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  Calendar,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export function CustomerDashboard() {
  const { user } = useAuth();

  // Mock data for demonstration
  const recentBookings = [
    {
      id: '1',
      service: 'Plumbing',
      serviceProviderName: 'Ahmed Ibrahim',
      date: '2024-01-20',
      status: 'completed',
      rating: 5
    },
    {
      id: '2',
      service: 'Electrical Work',
      serviceProviderName: 'John Okafor',
      date: '2024-01-22',
      status: 'in_progress',
      rating: null
    },
    {
      id: '3',
      service: 'Carpentry',
      serviceProviderName: 'Samuel Adebayo',
      date: '2024-01-25',
      status: 'pending',
      rating: null
    }
  ];

  const quickStats = [
    { label: 'Total Bookings', value: 12, icon: Calendar },
    { label: 'Completed Jobs', value: 8, icon: CheckCircle },
    { label: 'Average Rating Given', value: '4.8', icon: Star },
    { label: 'Money Spent', value: '₦45,000', icon: MapPin }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your bookings and find new services
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/customer/search"
          className="bg-forest-600 text-white p-6 rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Search className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Find Services</h3>
          <p className="text-forest-100">Browse service providers in your area</p>
        </Link>

        <Link
          to="/customer/bookings"
          className="bg-forest-500 text-white p-6 rounded-lg hover:bg-forest-600 transition-colors"
        >
          <Calendar className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
          <p className="text-forest-100">View and manage your appointments</p>
        </Link>

        <Link
          to="/messages"
          className="bg-forest-400 text-white p-6 rounded-lg hover:bg-forest-500 transition-colors"
        >
          <Plus className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Messages</h3>
          <p className="text-forest-100">Chat with your service providers</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/customer/bookings"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y">
          {recentBookings.map(booking => (
            <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{booking.service}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    with {booking.serviceProviderName}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {booking.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{booking.rating}</span>
                    </div>
                  )}
                  
                  <button className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Popular Services</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'HVAC', 'Cleaning', 'Tiling', 'Generator Repair'].map(service => (
              <Link
                key={service}
                to={`/customer/search?category=${service.toLowerCase()}`}
                className="p-4 border rounded-lg hover:border-forest-300 hover:bg-forest-50 transition-colors text-center"
              >
                <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Search className="h-5 w-5 text-forest-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{service}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}