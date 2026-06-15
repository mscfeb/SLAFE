import { useGetMeQuery } from '@/services/authApi';
import { selectIsAdmin, selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { useAppSelector } from '@/hooks/useAppStore';

export function useAuth() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { isLoading, isFetching } = useGetMeQuery(undefined, { skip: !isAuthenticated });

  return {
    isAuthenticated,
    user,
    isAdmin,
    isLoading: isAuthenticated && (isLoading || isFetching) && !user,
  };
}
