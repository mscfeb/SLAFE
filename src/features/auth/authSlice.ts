import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/api';

const ACCESS_KEY = 'sla_ops_access_token';
const REFRESH_KEY = 'sla_ops_refresh_token';

function loadToken(key: string): string | null {
  return localStorage.getItem(key);
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: loadToken(ACCESS_KEY),
  refreshToken: loadToken(REFRESH_KEY),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(ACCESS_KEY, action.payload.accessToken);
      localStorage.setItem(REFRESH_KEY, action.payload.refreshToken);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.accessToken);
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role === 'ADMIN';
