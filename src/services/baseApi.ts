import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Orders', 'Order', 'OrderDashboard', 'Timeline', 'Inventory', 'Alerts', 'Analytics', 'AI'],
  endpoints: () => ({}),
});
