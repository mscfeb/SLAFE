import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AlertSeverity, OrderStatus } from '@/types/api';
import { ORDER_STATUS_LABELS } from './constants';

dayjs.extend(relativeTime);

export function formatDate(value: string): string {
  return dayjs(value).format('MMM D, YYYY h:mm A');
}

export function formatRelative(value: string): string {
  return dayjs(value).fromNow();
}

export function formatHours(hours: number): string {
  if (hours <= 0) return 'Breached';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

export function formatStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function severityColor(severity: AlertSeverity): 'default' | 'info' | 'warning' | 'error' {
  switch (severity) {
    case 'LOW':
      return 'info';
    case 'MEDIUM':
      return 'warning';
    case 'HIGH':
    case 'CRITICAL':
      return 'error';
    default:
      return 'default';
  }
}

export function riskColor(score: number): string {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f59e0b';
  if (score >= 25) return '#3b82f6';
  return '#22c55e';
}

export function statusColor(status: OrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (status === 'DELIVERED') return 'success';
  if (status === 'REWORK' || status === 'AWAITING_PROCUREMENT') return 'warning';
  if (status === 'SHIPPED') return 'info';
  return 'primary';
}
