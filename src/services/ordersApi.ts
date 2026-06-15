import { api } from './baseApi';
import { unwrapApi } from './api';
import type {
  ApiResponse,
  Order,
  OrderDashboardItem,
  OrderStatusHistory,
  OrdersQueryParams,
  PaginatedMeta,
  UpdateOrderStatusRequest,
} from '@/types/api';

interface OrderListData extends PaginatedMeta {
  items: Order[];
}

interface OrderDashboardData extends PaginatedMeta {
  items: OrderDashboardItem[];
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersDashboard: builder.query<OrderDashboardData, OrdersQueryParams | void>({
      query: (params) => ({
        url: '/api/v1/orders/dashboard',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<OrderDashboardData>) => unwrapApi(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'OrderDashboard' as const, id })),
              { type: 'OrderDashboard', id: 'LIST' },
            ]
          : [{ type: 'OrderDashboard', id: 'LIST' }],
    }),
    getOrders: builder.query<OrderListData, OrdersQueryParams | void>({
      query: (params) => ({
        url: '/api/v1/orders',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<OrderListData>) => unwrapApi(response),
      providesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/api/v1/orders/${id}`,
      transformResponse: (response: ApiResponse<Order>) => unwrapApi(response),
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    getOrderTimeline: builder.query<OrderStatusHistory[], string>({
      query: (id) => `/api/v1/orders/${id}/timeline`,
      transformResponse: (response: ApiResponse<OrderStatusHistory[]>) => unwrapApi(response),
      providesTags: (_r, _e, id) => [{ type: 'Timeline', id }],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; body: UpdateOrderStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/orders/${id}/status`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: ApiResponse<Order>) => unwrapApi(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Order', id },
        { type: 'Timeline', id },
        { type: 'OrderDashboard', id: 'LIST' },
        { type: 'Orders', id: 'LIST' },
        { type: 'Analytics' },
        { type: 'Alerts' },
        { type: 'AI' },
      ],
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          ordersApi.util.updateQueryData('getOrder', id, (draft) => {
            draft.status = body.new_status;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetOrdersDashboardQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetOrderTimelineQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
