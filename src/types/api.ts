export type UserRole = 'ADMIN' | 'USER';

export type OrderStatus =
  | 'ORDER_CREATED'
  | 'AWAITING_PROCUREMENT'
  | 'READY_FOR_PRODUCTION'
  | 'LENS_CUTTING'
  | 'COATING'
  | 'ASSEMBLY'
  | 'QC'
  | 'REWORK'
  | 'PACKING'
  | 'SHIPPED'
  | 'DELIVERED';

export type OrderSource = 'STORE' | 'WEBSITE' | 'MARKETPLACE' | 'MANUAL';

export type LensType = 'SINGLE_VISION' | 'BIFOCAL' | 'PROGRESSIVE';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ApiErrorItem {
  code: string;
  field?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiErrorItem[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  source: OrderSource;
  store_location: string | null;
  power_left: string;
  power_right: string;
  lens_type: LensType;
  lens_index: string;
  coating: string;
  frame: string;
  status: OrderStatus;
  inventory_available: boolean;
  sla_hours: number;
  deadline: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDashboardItem extends Order {
  remaining_hours: number;
  is_breached: boolean;
  is_high_risk: boolean;
  breach_risk_score: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  reason: string | null;
  changed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  power: string;
  lens_type: LensType;
  lens_index: string;
  coating: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryAvailability {
  available: boolean;
  quantity: number;
}

export interface Alert {
  id: string;
  order_id: string;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  created_at: string;
}

export interface DashboardAnalytics {
  total_orders: number;
  active_orders: number;
  breached_orders: number;
  high_risk_orders: number;
}

export interface SlaAnalytics {
  orders_within_sla: number;
  breached_orders: number;
  average_completion_time_hours: number;
}

export interface InventoryAnalytics {
  total_inventory_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface OrderVolumeTrend {
  weeks: number;
  active_only: boolean;
  granularity: string;
  points: AnalyticsDataPoint[];
}

export interface LensTypeDistribution {
  total: number;
  items: AnalyticsDataPoint[];
}

export interface OrderStatusDistribution {
  total: number;
  items: AnalyticsDataPoint[];
}

export interface StorePerformance {
  total: number;
  items: AnalyticsDataPoint[];
}

export interface InventoryForecastItem {
  power: string;
  lens_type: string;
  lens_index: string;
  coating: string;
  current_stock: number;
  demand_6m: number;
  avg_monthly_demand: number;
  recommended_stock: number;
  variance: number;
  status: 'understock' | 'optimal' | 'overstock' | 'no_demand';
}

export interface InventoryForecast {
  months: number;
  safety_months: number;
  items: InventoryForecastItem[];
}

export interface TatPrediction {
  order_id: string;
  order_number: string;
  current_status: OrderStatus;
  lens_type: LensType;
  sla_hours: number;
  remaining_hours: number;
  is_breached: boolean;
  predicted_completion_hours: number;
  breach_risk_score: number;
  recommended_severity: AlertSeverity;
  summary: string;
  model_used: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateOrderStatusRequest {
  new_status: OrderStatus;
  reason?: string;
}

export interface InventoryCheckParams {
  power: string;
  lens_type: LensType;
  lens_index: string;
  coating: string;
}

export interface OrdersQueryParams {
  page?: number;
  page_size?: number;
  status?: OrderStatus;
  lens_type?: LensType;
  store_location?: string;
  source?: OrderSource;
}
