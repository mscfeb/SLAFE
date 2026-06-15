import type { OrderStatus } from '@/types/api';

export const LOW_STOCK_THRESHOLD = 10;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_CREATED: 'Order Created',
  AWAITING_PROCUREMENT: 'Awaiting Procurement',
  READY_FOR_PRODUCTION: 'Ready for Production',
  LENS_CUTTING: 'Lens Cutting',
  COATING: 'Coating',
  ASSEMBLY: 'Assembly',
  QC: 'Quality Check',
  REWORK: 'Rework',
  PACKING: 'Packing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'ORDER_CREATED',
  'AWAITING_PROCUREMENT',
  'READY_FOR_PRODUCTION',
  'LENS_CUTTING',
  'COATING',
  'ASSEMBLY',
  'QC',
  'REWORK',
  'PACKING',
  'SHIPPED',
  'DELIVERED',
];

export const LENS_TYPE_OPTIONS = [
  { value: 'SINGLE_VISION', label: 'Single Vision' },
  { value: 'BIFOCAL', label: 'Bifocal' },
  { value: 'PROGRESSIVE', label: 'Progressive' },
] as const;

export const ORDER_SOURCE_OPTIONS = [
  { value: 'STORE', label: 'Store' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'MARKETPLACE', label: 'Marketplace' },
  { value: 'MANUAL', label: 'Manual' },
] as const;

export const NAV_ITEMS: Array<{
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}> = [
  { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { label: 'Orders', path: '/orders', icon: 'Orders' },
  { label: 'Inventory', path: '/inventory', icon: 'Inventory' },
  { label: 'Alerts', path: '/alerts', icon: 'Alerts' },
  { label: 'Analytics', path: '/analytics', icon: 'Analytics', adminOnly: true },
  { label: 'AI Assistant', path: '/ai', icon: 'AI', adminOnly: true },
];
