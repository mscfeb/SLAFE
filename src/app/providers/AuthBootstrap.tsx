import { useEffect } from 'react';
import { useGetMeQuery } from '@/services/authApi';
import { setUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data } = useGetMeQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  return null;
}
