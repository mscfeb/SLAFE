import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { ApiResponse, TokenResponse } from '@/types/api';
import { API_BASE_URL } from '@/utils/constants';
import { logout, setCredentials } from '@/features/auth/authSlice';
import type { RootState } from '@/app/store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/api/v1/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const envelope = refreshResult.data as ApiResponse<TokenResponse>;
      if (envelope.success && envelope.data) {
        api.dispatch(
          setCredentials({
            accessToken: envelope.data.access_token,
            refreshToken: envelope.data.refresh_token,
          }),
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export function unwrapApi<T>(response: unknown): T {
  const envelope = response as ApiResponse<T>;
  return envelope.data;
}
