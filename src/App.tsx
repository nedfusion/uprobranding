import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Components
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CustomerDashboard } from './pages/Customer/Dashboard';
import { HandymanDashboard } from './pages/Handyman/Dashboard';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { ServiceSearch } from './pages/ServiceSearch';
import { Messages } from './pages/Messages';
import { Wallet } from './pages/Wallet';
import { PWAInstallButton } from './components/PWAInstallButton';

// Layout wrapper component
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const showSidebar = user && (
    window.location.pathname.startsWith('/customer/') ||
    window.location.pathname.startsWith('/handyman/') ||
    window.location.pathname.startsWith('/admin/')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-0' : ''}`}>
          <div className={showSidebar ? 'p-4 sm:p-6 lg:p-8' : ''}>
            {children}
          </div>
        </main>
      </div>
      <PWAInstallButton />
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginForm />} />
      <Route path="/auth/register" element={<RegisterForm />} />
      <Route path="/search" element={<ServiceSearch />} />

      {/* Protected Routes */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute requiredUserType="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/search"
        element={
          <ProtectedRoute requiredUserType="customer">
            <ServiceSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute requiredUserType="customer">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
              <p className="text-gray-600">Your booking history and active appointments will appear here.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/reviews"
        element={
          <ProtectedRoute requiredUserType="customer">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Reviews</h2>
              <p className="text-gray-600">Reviews you've given to handymen will appear here.</p>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Handyman Routes */}
      <Route
        path="/handyman/dashboard"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <HandymanDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/handyman/jobs"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Jobs</h2>
              <p className="text-gray-600">Your job requests and active bookings will appear here.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/handyman/profile"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Management</h2>
              <p className="text-gray-600">Update your skills, experience, and portfolio here.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/handyman/portfolio"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <p className="text-gray-600">Showcase your best work to attract more customers.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/handyman/earnings"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/handyman/reviews"
        element={
          <ProtectedRoute requiredUserType="handyman">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
              <p className="text-gray-600">Reviews from your customers will appear here.</p>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600">Manage all platform users, verify handymen, and handle user issues.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
              <p className="text-gray-600">Monitor all bookings, handle disputes, and manage platform operations.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h2>
              <p className="text-gray-600">View detailed analytics, financial reports, and platform performance metrics.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Management</h2>
              <p className="text-gray-600">Handle payments, withdrawals, and financial reconciliation.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/disputes"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-600">Handle customer complaints and disputes between users.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requiredUserType="admin">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Settings</h2>
              <p className="text-gray-600">Configure platform settings, fees, and system parameters.</p>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Profile Route (accessible by all authenticated users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Settings</h2>
              <p className="text-gray-600">Update your personal information and account settings.</p>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Redirect based on user type */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Navigate to={`/${user.type}/dashboard`} replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Go back home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;