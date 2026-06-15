export type AiUiType = 'message' | 'table' | 'chart' | 'cards';

export interface AiTableColumn {
  key: string;
  label: string;
}

export interface AiTablePagination {
  page: number;
  page_size: number;
  total: number;
}

export interface AiTablePayload {
  title: string;
  columns: AiTableColumn[];
  rows: Record<string, unknown>[];
  pagination?: AiTablePagination;
}

export interface AiChartDataPoint {
  name: string;
  y: number;
}

export interface AiChartPayload {
  chart_type: 'bar' | 'line' | 'pie' | string;
  title: string;
  data: AiChartDataPoint[];
  x_axis_title?: string;
  y_axis_title?: string;
}

export interface AiCardMetric {
  label: string;
  value: string;
}

export interface AiCardItem {
  title: string;
  subtitle?: string;
  metrics?: AiCardMetric[];
  description?: string;
}

export interface AiCardsPayload {
  title: string;
  cards: AiCardItem[];
}

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  message: string;
  ui_type: AiUiType;
  payload: AiTablePayload | AiChartPayload | AiCardsPayload | Record<string, never>;
}
