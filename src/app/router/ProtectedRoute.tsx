import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageSkeleton } from '@/components/common/PageSkeleton';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <PageSkeleton />;
  }

  return <Outlet />;
}
