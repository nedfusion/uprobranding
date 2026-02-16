import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  monthlyRevenue: number;
  platformRating: number;
}

interface Booking {
  id: string;
  customer_name: string;
  provider_name: string;
  service_category: string;
  created_at: string;
  amount: number;
  status: string;
}

interface Dispute {
  id: string;
  booking_id: string;
  customer_name: string;
  provider_name: string;
  issue_description: string;
  status: string;
  created_at: string;
}

interface StateStats {
  state: string;
  bookings: number;
  revenue: number;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    platformRating: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [topStates, setTopStates] = useState<StateStats[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch active bookings
      const { count: activeBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted', 'in_progress']);

      // Fetch monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth.toISOString());

      const monthlyRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      // Fetch platform rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating');

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

      // Fetch recent bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          service_category,
          status,
          amount,
          created_at,
          customer:customer_id(full_name),
          provider:provider_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      const formattedBookings = bookingsData?.map(b => ({
        id: b.id,
        customer_name: b.customer?.full_name || 'Unknown',
        provider_name: b.provider?.full_name || 'Unknown',
        service_category: b.service_category,
        created_at: b.created_at,
        amount: b.amount,
        status: b.status
      })) || [];

      // Fetch active disputes
      const { data: disputesData } = await supabase
        .from('disputes')
        .select(`
          id,
          booking_id,
          issue_description,
          status,
          created_at,
          customer:customer_id(full_name),
          provider:provider_id(full_name)
        `)
        .in('status', ['open', 'investigating'])
        .order('created_at', { ascending: false })
        .limit(2);

      const formattedDisputes = disputesData?.map(d => ({
        id: d.id,
        booking_id: d.booking_id,
        customer_name: d.customer?.full_name || 'Unknown',
        provider_name: d.provider?.full_name || 'Unknown',
        issue_description: d.issue_description,
        status: d.status,
        created_at: d.created_at
      })) || [];

      // Fetch top performing states
      const { data: stateData } = await supabase
        .from('bookings')
        .select('state, amount')
        .eq('status', 'completed');

      const stateStats: { [key: string]: { bookings: number; revenue: number } } = {};
      stateData?.forEach(booking => {
        if (booking.state) {
          if (!stateStats[booking.state]) {
            stateStats[booking.state] = { bookings: 0, revenue: 0 };
          }
          stateStats[booking.state].bookings += 1;
          stateStats[booking.state].revenue += booking.amount || 0;
        }
      });

      const topStatesList = Object.entries(stateStats)
        .map(([state, data]) => ({
          state,
          bookings: data.bookings,
          revenue: data.revenue
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 4);

      setStats({
        totalUsers: totalUsers || 0,
        activeBookings: activeBookings || 0,
        monthlyRevenue,
        platformRating: avgRating
      });
      setRecentBookings(formattedBookings);
      setDisputes(formattedDisputes);
      setTopStates(topStatesList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const statsDisplay = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users
    },
    {
      label: 'Active Bookings',
      value: stats.activeBookings.toLocaleString(),
      icon: Calendar
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign
    },
    {
      label: 'Platform Rating',
      value: stats.platformRating > 0 ? stats.platformRating.toFixed(1) : 'N/A',
      icon: Star
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
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
            {recentBookings.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <p className="text-sm text-gray-400 mt-1">Bookings will appear here once customers start using the platform</p>
              </div>
            ) : (
              recentBookings.map(booking => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{booking.service_category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Customer: {booking.customer_name}</p>
                    <p>Service Provider: {booking.provider_name}</p>
                    <p>Amount: ₦{booking.amount.toLocaleString()}</p>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
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
            {disputes.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500">No active disputes</p>
                <p className="text-sm text-gray-400 mt-1">All clear! Disputes will be shown here when they arise</p>
              </div>
            ) : (
              disputes.map(dispute => (
                <div key={dispute.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{dispute.issue_description}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {getStatusText(dispute.status)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Booking: {dispute.booking_id}</p>
                    <p>Customer: {dispute.customer_name}</p>
                    <p>Service Provider: {dispute.provider_name}</p>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Performing States */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Top Performing States</h2>
        </div>

        <div className="p-6">
          {topStates.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No state data yet</p>
              <p className="text-sm text-gray-400 mt-1">State performance data will appear once bookings are made</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topStates.map((state, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-forest-600 mr-1" />
                    <h3 className="font-medium text-gray-900">{state.state}</h3>
                  </div>
                  <p className="text-2xl font-bold text-forest-600">{state.bookings}</p>
                  <p className="text-sm text-gray-600">bookings</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(state.revenue)}</p>
                </div>
              ))}
            </div>
          )}
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
                <span className="text-lg font-semibold text-gray-900">
                  {stats.platformRating > 0 ? stats.platformRating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Platform Rating</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-forest-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">{stats.activeBookings}</span>
              </div>
              <p className="text-sm text-gray-600">Active Bookings</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-forest-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">{stats.totalUsers}</span>
              </div>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}