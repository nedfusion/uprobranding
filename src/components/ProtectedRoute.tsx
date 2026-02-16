import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'customer' | 'service_provider' | 'admin';
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredUserType) {
    const hasAccess = requiredUserType === 'admin'
      ? (user.type === 'admin' || user.type === 'super_admin')
      : user.type === requiredUserType;

    if (!hasAccess) {
      const redirectPath = user.type === 'admin' || user.type === 'super_admin'
        ? '/admin/dashboard'
        : `/${user.type}/dashboard`;
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}