import { api } from './baseApi';
import { unwrapApi } from './api';
import type {
  ApiResponse,
  DashboardAnalytics,
  InventoryAnalytics,
  LensTypeDistribution,
  OrderStatusDistribution,
  OrderVolumeTrend,
  SlaAnalytics,
  StorePerformance,
  InventoryForecast,
} from '@/types/api';

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalytics, void>({
      query: () => '/api/v1/analytics/dashboard',
      transformResponse: (response: ApiResponse<DashboardAnalytics>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'DASHBOARD' }],
    }),
    getSlaAnalytics: builder.query<SlaAnalytics, void>({
      query: () => '/api/v1/analytics/sla',
      transformResponse: (response: ApiResponse<SlaAnalytics>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'SLA' }],
    }),
    getInventoryAnalytics: builder.query<InventoryAnalytics, void>({
      query: () => '/api/v1/analytics/inventory',
      transformResponse: (response: ApiResponse<InventoryAnalytics>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'INVENTORY' }],
    }),
    getOrderVolumeTrend: builder.query<OrderVolumeTrend, { weeks?: number; active_only?: boolean } | void>({
      query: (params) => ({
        url: '/api/v1/analytics/trends/volume',
        params: { weeks: params?.weeks ?? 8, active_only: params?.active_only ?? false },
      }),
      transformResponse: (response: ApiResponse<OrderVolumeTrend>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'VOLUME_TREND' }],
    }),
    getLensTypeDistribution: builder.query<LensTypeDistribution, void>({
      query: () => '/api/v1/analytics/trends/lens-types',
      transformResponse: (response: ApiResponse<LensTypeDistribution>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'LENS_TYPES' }],
    }),
    getStatusDistribution: builder.query<OrderStatusDistribution, void>({
      query: () => '/api/v1/analytics/trends/status',
      transformResponse: (response: ApiResponse<OrderStatusDistribution>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'STATUS' }],
    }),
    getStorePerformance: builder.query<StorePerformance, void>({
      query: () => '/api/v1/analytics/trends/stores',
      transformResponse: (response: ApiResponse<StorePerformance>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'STORES' }],
    }),
    getInventoryForecast: builder.query<InventoryForecast, { months?: number } | void>({
      query: (params) => ({
        url: '/api/v1/analytics/inventory/forecast',
        params: { months: params?.months ?? 6 },
      }),
      transformResponse: (response: ApiResponse<InventoryForecast>) => unwrapApi(response),
      providesTags: [{ type: 'Analytics', id: 'INVENTORY_FORECAST' }],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetSlaAnalyticsQuery,
  useGetInventoryAnalyticsQuery,
  useGetOrderVolumeTrendQuery,
  useGetLensTypeDistributionQuery,
  useGetStatusDistributionQuery,
  useGetStorePerformanceQuery,
  useGetInventoryForecastQuery,
} = analyticsApi;
