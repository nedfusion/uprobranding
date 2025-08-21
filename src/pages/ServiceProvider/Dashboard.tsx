import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  DollarSign,
  Star,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

export function ServiceProviderDashboard() {
  const { user } = useAuth();

  // Mock data for demonstration
  const upcomingJobs = [
    {
      id: '1',
      service: 'Plumbing',
      customerName: 'Mrs. Johnson',
      date: '2024-01-23',
      time: '10:00 AM',
      location: 'Victoria Island, Lagos',
      price: 15000,
      status: 'confirmed'
    },
    {
      id: '2',
      service: 'Electrical Repair',
      customerName: 'Mr. Adebayo',
      date: '2024-01-24',
      time: '2:00 PM',
      location: 'Ikeja, Lagos',
      price: 12000,
      status: 'pending'
    },
    {
      id: '3',
      service: 'Carpentry',
      customerName: 'Ms. Okafor',
      date: '2024-01-25',
      time: '9:00 AM',
      location: 'Surulere, Lagos',
      price: 25000,
      status: 'confirmed'
    }
  ];

  const quickStats = [
    { label: 'Total Jobs', value: 142, icon: Calendar, change: '+12%' },
    { label: 'This Month Earnings', value: '₦185,000', icon: DollarSign, change: '+8%' },
    { label: 'Rating', value: '4.9', icon: Star, change: '+0.1' },
    { label: 'Active Jobs', value: 5, icon: Clock, change: '+2' }
  ];

  const recentReviews = [
    {
      id: '1',
      customerName: 'Sarah Ahmed',
      rating: 5,
      comment: 'Excellent plumbing work! Very professional and cleaned up after the job.',
      date: '2024-01-20'
    },
    {
      id: '2',
      customerName: 'David Okoro',
      rating: 5,
      comment: 'Fixed my electrical issues quickly. Highly recommend!',
      date: '2024-01-19'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
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
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your jobs and grow your business
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/service-provider/jobs"
          className="bg-forest-600 text-white p-4 rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Calendar className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">View Jobs</h3>
          <p className="text-forest-100 text-sm">Manage your bookings</p>
        </Link>

        <Link
          to="/service-provider/profile"
          className="bg-forest-500 text-white p-4 rounded-lg hover:bg-forest-600 transition-colors"
        >
          <User className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Update Profile</h3>
          <p className="text-forest-100 text-sm">Manage your skills</p>
        </Link>

        <Link
          to="/service-provider/earnings"
          className="bg-forest-400 text-white p-4 rounded-lg hover:bg-forest-500 transition-colors"
        >
          <DollarSign className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Earnings</h3>
          <p className="text-forest-100 text-sm">View your income</p>
        </Link>

        <Link
          to="/messages"
          className="bg-forest-300 text-white p-4 rounded-lg hover:bg-forest-400 transition-colors"
        >
          <MessageSquare className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Messages</h3>
          <p className="text-forest-100 text-sm">Chat with customers</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Jobs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Jobs</h2>
            <Link
              to="/service-provider/jobs"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y">
          {upcomingJobs.map(job => (
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{job.service}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {job.customerName}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.date).toLocaleDateString()} at {job.time}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">₦{job.price.toLocaleString()}</p>
                  <button className="text-forest-600 hover:text-forest-700 text-sm font-medium mt-1 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
          </div>

          <div className="divide-y">
            {recentReviews.map(review => (
              <div key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">This Month Performance</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Jobs Completed</span>
                <span className="font-semibold">12 jobs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold">4.9/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Earnings</span>
                <span className="font-semibold text-green-600">₦185,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold">2 hours avg</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center text-forest-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Performance is up 15% this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}