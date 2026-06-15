import { useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import type { Options } from 'highcharts';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard, useChartTheme } from '@/components/charts/ChartCard';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageShell } from '@/components/layout/PageShell';
import {
  useGetDashboardAnalyticsQuery,
  useGetSlaAnalyticsQuery,
  useGetInventoryAnalyticsQuery,
  useGetOrderVolumeTrendQuery,
  useGetStatusDistributionQuery,
} from '@/services/analyticsApi';
import { useGetOrdersDashboardQuery } from '@/services/ordersApi';
import { useAuth } from '@/hooks/useAuth';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import type { OrderStatus } from '@/types/api';

export function DashboardPage() {
  const { isAdmin } = useAuth();
  const chartTheme = useChartTheme();

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useGetDashboardAnalyticsQuery(undefined, {
    skip: !isAdmin,
  });
  const { data: sla, isLoading: slaLoading } = useGetSlaAnalyticsQuery(undefined, { skip: !isAdmin });
  const { data: inv, isLoading: invLoading } = useGetInventoryAnalyticsQuery(undefined, { skip: !isAdmin });
  const { data: volume, isLoading: volumeLoading } = useGetOrderVolumeTrendQuery(
    { weeks: 8, active_only: true },
    { skip: !isAdmin },
  );
  const { data: statusDist, isLoading: statusLoading } = useGetStatusDistributionQuery(undefined, {
    skip: !isAdmin,
  });
  const { data: orders } = useGetOrdersDashboardQuery(
    { page: 1, page_size: 20 },
    { skip: isAdmin },
  );

  const statusChart = useMemo<Options>(() => {
    if (isAdmin) {
      const items = statusDist?.items ?? [];
      return {
        chart: { type: 'column' },
        xAxis: {
          categories: items.map((i) => ORDER_STATUS_LABELS[i.label as OrderStatus] ?? i.label.replace(/_/g, ' ')),
          labels: { style: { color: chartTheme.text } },
        },
        yAxis: { title: { text: 'Orders' }, gridLineColor: chartTheme.grid, min: 0 },
        series: [{ type: 'column', name: 'Orders', data: items.map((i) => i.value), color: '#2563eb' }],
        legend: { enabled: false },
      };
    }
    const counts: Partial<Record<OrderStatus, number>> = {};
    orders?.items.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    const data = Object.entries(counts).map(([status, count]) => ({
      name: ORDER_STATUS_LABELS[status as OrderStatus] ?? status,
      y: count,
    }));
    return {
      chart: { type: 'column' },
      xAxis: { type: 'category', labels: { style: { color: chartTheme.text } } },
      yAxis: { title: { text: 'Orders' }, gridLineColor: chartTheme.grid },
      series: [{ type: 'column', name: 'Orders', data, color: '#2563eb' }],
      legend: { enabled: false },
    };
  }, [isAdmin, statusDist, orders, chartTheme]);

  const slaChart = useMemo<Options>(() => {
    if (!sla) return { series: [] };
    return {
      chart: { type: 'pie' },
      plotOptions: { pie: { innerSize: '60%' } },
      series: [
        {
          type: 'pie',
          name: 'Orders',
          data: [
            { name: 'Within SLA', y: sla.orders_within_sla, color: '#22c55e' },
            { name: 'Breached', y: sla.breached_orders, color: '#ef4444' },
          ],
        },
      ],
    };
  }, [sla]);

  const inventoryChart = useMemo<Options>(() => {
    if (!inv) return { series: [] };
    const inStock = Math.max(
      inv.total_inventory_items - inv.low_stock_items - inv.out_of_stock_items,
      0,
    );
    return {
      chart: { type: 'pie' },
      series: [
        {
          type: 'pie',
          name: 'SKUs',
          data: [
            { name: 'Healthy Stock', y: inStock, color: '#22c55e' },
            { name: 'Low Stock', y: inv.low_stock_items, color: '#f59e0b' },
            { name: 'Out of Stock', y: inv.out_of_stock_items, color: '#ef4444' },
          ],
        },
      ],
    };
  }, [inv]);

  const trendChart = useMemo<Options>(() => {
    if (isAdmin) {
      const points = volume?.points ?? [];
      const formatWeek = (isoDate: string) => {
        const d = new Date(`${isoDate}T00:00:00`);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      };
      return {
        chart: { type: 'areaspline' },
        xAxis: {
          categories: points.map((p) => formatWeek(p.label)),
          labels: { style: { color: chartTheme.text } },
        },
        yAxis: { title: { text: 'Active orders created' }, gridLineColor: chartTheme.grid, min: 0 },
        series: [
          {
            type: 'areaspline',
            name: 'Orders',
            data: points.map((p) => p.value),
            color: '#7c3aed',
            fillOpacity: 0.15,
          },
        ],
      };
    }
    const byDay: Record<string, number> = {};
    orders?.items.forEach((o) => {
      const day = o.created_at.slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
    });
    const categories = Object.keys(byDay).sort();
    return {
      chart: { type: 'areaspline' },
      xAxis: { categories, labels: { style: { color: chartTheme.text } } },
      yAxis: { title: { text: 'Active orders created' }, gridLineColor: chartTheme.grid },
      series: [
        {
          type: 'areaspline',
          name: 'Orders',
          data: categories.map((c) => byDay[c]),
          color: '#7c3aed',
          fillOpacity: 0.15,
        },
      ],
    };
  }, [isAdmin, volume, orders, chartTheme]);

  const kpisLoading = isAdmin && (metricsLoading || slaLoading || invLoading);

  if (kpisLoading) return <PageSkeleton />;

  if (isAdmin && metricsError) {
    return (
      <Typography color="error">Unable to load analytics. Ensure you have admin access.</Typography>
    );
  }

  return (
    <PageShell
      title="Operations Dashboard"
      header={
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Total Orders" value={metrics?.total_orders ?? orders?.total ?? '—'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Active Orders" value={metrics?.active_orders ?? orders?.total ?? '—'} accent="#2563eb" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="Breached Orders" value={metrics?.breached_orders ?? '—'} accent="#ef4444" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard title="High Risk" value={metrics?.high_risk_orders ?? '—'} accent="#f59e0b" />
          </Grid>
        </Grid>
      }
    >
      <Grid container spacing={2} sx={{ pb: 1 }}>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="Orders by Status"
            subtitle="Active orders breakdown"
            options={statusChart}
            loading={isAdmin && statusLoading}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="Orders Trend"
            subtitle="Weekly active order volume"
            options={trendChart}
            loading={isAdmin && volumeLoading}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard title="SLA Compliance" subtitle="Within SLA vs breached" options={slaChart} loading={!sla && isAdmin} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard title="Inventory Health" subtitle="SKU stock distribution" options={inventoryChart} loading={!inv && isAdmin} />
        </Grid>
      </Grid>
    </PageShell>
  );
}
