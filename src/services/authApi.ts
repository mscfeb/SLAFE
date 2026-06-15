import { api } from './baseApi';
import { unwrapApi } from './api';
import type { ApiResponse, LoginRequest, TokenResponse, User } from '@/types/api';
import { setCredentials } from '@/features/auth/authSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<TokenResponse>) => unwrapApi(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          setCredentials({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }),
        );
      },
    }),
    getMe: builder.query<User, void>({
      query: () => '/api/v1/auth/me',
      transformResponse: (response: ApiResponse<User>) => unwrapApi(response),
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
