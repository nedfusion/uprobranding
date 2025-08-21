import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  MapPin,
  BarChart3
} from 'lucide-react';

export function AdminDashboard() {
  // Mock data for demonstration
  const stats = [
    { 
      label: 'Total Users', 
      value: '12,485', 
      change: '+8.2%', 
      changeType: 'increase',
      icon: Users 
    },
    { 
      label: 'Active Bookings', 
      value: '1,247', 
      change: '+15.3%', 
      changeType: 'increase',
      icon: Calendar 
    },
    { 
      label: 'Monthly Revenue', 
      value: '₦2.4M', 
      change: '+12.5%', 
      changeType: 'increase',
      icon: DollarSign 
    },
    { 
      label: 'Platform Rating', 
      value: '4.8', 
      change: '+0.2', 
      changeType: 'increase',
      icon: Star 
    }
  ];

  const recentBookings = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      serviceProvider: 'Ahmed Ibrahim',
      service: 'Plumbing',
      date: '2024-01-23',
      amount: 15000,
      status: 'completed'
    },
    {
      id: '2',
      customer: 'David Okoro',
      serviceProvider: 'John Okafor',
      service: 'Electrical',
      date: '2024-01-23',
      amount: 12000,
      status: 'in_progress'
    },
    {
      id: '3',
      customer: 'Mary Adebayo',
      serviceProvider: 'Samuel Adebayo',
      service: 'Carpentry',
      date: '2024-01-22',
      amount: 25000,
      status: 'pending'
    }
  ];

  const disputes = [
    {
      id: '1',
      booking: 'BK-001',
      customer: 'John Doe',
      serviceProvider: 'Ahmed Ali',
      issue: 'Payment dispute',
      status: 'open',
      date: '2024-01-22'
    },
    {
      id: '2',
      booking: 'BK-002',
      customer: 'Jane Smith',
      serviceProvider: 'David Ogun',
      issue: 'Quality complaint',
      status: 'investigating',
      date: '2024-01-21'
    }
  ];

  const topStates = [
    { state: 'Lagos', bookings: 4580, revenue: '₦1.2M' },
    { state: 'Abuja (FCT)', bookings: 2340, revenue: '₦650K' },
    { state: 'Rivers', bookings: 1890, revenue: '₦420K' },
    { state: 'Kano', bookings: 1650, revenue: '₦380K' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of platform activity and performance
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-forest-600 text-white p-4 rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Users className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Manage Users</h3>
          <p className="text-forest-100 text-sm">View and manage all users</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-forest-500 text-white p-4 rounded-lg hover:bg-forest-600 transition-colors"
        >
          <Calendar className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Bookings</h3>
          <p className="text-forest-100 text-sm">Monitor all bookings</p>
        </Link>

        <Link
          to="/admin/disputes"
          className="bg-forest-400 text-white p-4 rounded-lg hover:bg-forest-500 transition-colors"
        >
          <AlertCircle className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Disputes</h3>
          <p className="text-forest-100 text-sm">Handle disputes</p>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-forest-300 text-white p-4 rounded-lg hover:bg-forest-400 transition-colors"
        >
          <BarChart3 className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-forest-100 text-sm">View detailed reports</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isIncrease = stat.changeType === 'increase';
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
                <span className={`text-sm font-medium ${
                  isIncrease ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                to="/admin/bookings"
                className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>

          <div className="divide-y">
            {recentBookings.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{booking.service}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Customer: {booking.customer}</p>
                  <p>Service Provider: {booking.serviceProvider}</p>
                  <p>Amount: ₦{booking.amount.toLocaleString()}</p>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(booking.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Disputes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Active Disputes</h2>
              <Link
                to="/admin/disputes"
                className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>

          <div className="divide-y">
            {disputes.map(dispute => (
              <div key={dispute.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{dispute.issue}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                    {getStatusText(dispute.status)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Booking: {dispute.booking}</p>
                  <p>Customer: {dispute.customer}</p>
                  <p>Service Provider: {dispute.serviceProvider}</p>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(dispute.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing States */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Top Performing States</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStates.map((state, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-forest-600 mr-1" />
                  <h3 className="font-medium text-gray-900">{state.state}</h3>
                </div>
                <p className="text-2xl font-bold text-forest-600">{state.bookings}</p>
                <p className="text-sm text-gray-600">bookings</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{state.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Platform Health</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-forest-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">96.5%</span>
              </div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-forest-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">2.3 hrs</span>
              </div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">4.8/5</span>
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}