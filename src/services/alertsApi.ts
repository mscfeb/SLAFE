import { api } from './baseApi';
import { unwrapApi } from './api';
import type { Alert, ApiResponse, PaginatedMeta } from '@/types/api';

interface AlertListData extends PaginatedMeta {
  items: Alert[];
}

export const alertsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAlerts: builder.query<AlertListData, { page?: number; page_size?: number } | void>({
      query: (params) => ({
        url: '/api/v1/alerts',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<AlertListData>) => unwrapApi(response),
      providesTags: [{ type: 'Alerts', id: 'LIST' }],
    }),
    getActiveAlerts: builder.query<AlertListData, { page?: number; page_size?: number } | void>({
      query: (params) => ({
        url: '/api/v1/alerts/active',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<AlertListData>) => unwrapApi(response),
      providesTags: [{ type: 'Alerts', id: 'ACTIVE' }],
    }),
    resolveAlert: builder.mutation<Alert, string>({
      query: (id) => ({
        url: `/api/v1/alerts/${id}/resolve`,
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<Alert>) => unwrapApi(response),
      invalidatesTags: [{ type: 'Alerts', id: 'LIST' }, { type: 'Alerts', id: 'ACTIVE' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            alertsApi.util.updateQueryData('getActiveAlerts', undefined, (draft) => {
              const item = draft.items.find((a) => a.id === id);
              if (item) item.resolved = true;
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useGetActiveAlertsQuery,
  useResolveAlertMutation,
} = alertsApi;
