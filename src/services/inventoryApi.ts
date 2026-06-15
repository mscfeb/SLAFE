import { api } from './baseApi';
import { unwrapApi } from './api';
import type {
  ApiResponse,
  InventoryAvailability,
  InventoryCheckParams,
  InventoryItem,
  LensType,
  PaginatedMeta,
} from '@/types/api';

interface InventoryListData extends PaginatedMeta {
  items: InventoryItem[];
}

export const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<
      InventoryListData,
      { page?: number; page_size?: number; power?: string; lens_type?: LensType; lens_index?: string; coating?: string } | void
    >({
      query: (params) => ({
        url: '/api/v1/inventory',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<InventoryListData>) => unwrapApi(response),
      providesTags: [{ type: 'Inventory', id: 'LIST' }],
    }),
    checkInventory: builder.query<InventoryAvailability, InventoryCheckParams>({
      query: (params) => ({
        url: '/api/v1/inventory/check',
        params,
      }),
      transformResponse: (response: ApiResponse<InventoryAvailability>) => unwrapApi(response),
    }),
  }),
});

export const { useGetInventoryQuery, useLazyCheckInventoryQuery } = inventoryApi;
