import { useMemo } from 'react';
import { Grid } from '@mui/material';
import type { Options } from 'highcharts';
import { ChartCard, useChartTheme } from '@/components/charts/ChartCard';
import { KpiCard } from '@/components/common/KpiCard';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageShell } from '@/components/layout/PageShell';
import {
  useGetDashboardAnalyticsQuery,
  useGetSlaAnalyticsQuery,
  useGetInventoryAnalyticsQuery,
  useGetOrderVolumeTrendQuery,
  useGetLensTypeDistributionQuery,
  useGetStorePerformanceQuery,
} from '@/services/analyticsApi';
import type { AnalyticsDataPoint } from '@/types/api';

function formatLensLabel(label: string): string {
  return label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBarChart(
  items: AnalyticsDataPoint[],
  chartTheme: { text: string; grid: string },
  yTitle: string,
  color: string,
): Options {
  return {
    chart: { type: 'bar' },
    xAxis: {
      categories: items.map((i) => formatLensLabel(i.label)),
      labels: { style: { color: chartTheme.text } },
    },
    yAxis: { title: { text: yTitle }, gridLineColor: chartTheme.grid, min: 0 },
    series: [{ type: 'bar', name: yTitle, data: items.map((i) => i.value), color }],
    legend: { enabled: false },
  };
}

export function AnalyticsPage() {
  const chartTheme = useChartTheme();
  const { data: metrics, isLoading: metricsLoading } = useGetDashboardAnalyticsQuery();
  const { data: sla, isLoading: slaLoading } = useGetSlaAnalyticsQuery();
  const { data: inv, isLoading: invLoading } = useGetInventoryAnalyticsQuery();
  const { data: volume, isLoading: volumeLoading } = useGetOrderVolumeTrendQuery({ weeks: 8 });
  const { data: lensTypes, isLoading: lensLoading } = useGetLensTypeDistributionQuery();
  const { data: stores, isLoading: storesLoading } = useGetStorePerformanceQuery();

  const volumeChart = useMemo<Options>(() => {
    const points = volume?.points ?? [];
    const formatWeek = (isoDate: string) => {
      const d = new Date(`${isoDate}T00:00:00`);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };
    return {
      chart: { type: 'column' },
      xAxis: {
        categories: points.map((p) => `${formatWeek(p.label)}`),
        labels: { style: { color: chartTheme.text }, rotation: -30 },
      },
      yAxis: { title: { text: 'Orders created' }, gridLineColor: chartTheme.grid, min: 0 },
      series: [{
        type: 'column',
        name: 'Weekly volume',
        data: points.map((p) => p.value),
        color: '#2563eb',
      }],
      tooltip: { pointFormat: '<b>{point.y}</b> orders' },
    };
  }, [volume, chartTheme]);

  const lensChart = useMemo<Options>(
    () => buildBarChart(lensTypes?.items ?? [], chartTheme, 'Active orders', '#2563eb'),
    [lensTypes, chartTheme],
  );

  const storeChart = useMemo<Options>(
    () => buildBarChart(stores?.items ?? [], chartTheme, 'Active orders', '#7c3aed'),
    [stores, chartTheme],
  );

  const kpisLoading = metricsLoading || slaLoading || invLoading;

  return (
    <PageShell
      title="Analytics"
      header={
        kpisLoading ? (
          <PageSkeleton />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard title="Avg Completion" value={`${sla?.average_completion_time_hours.toFixed(1) ?? 0}h`} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard title="Within SLA" value={sla?.orders_within_sla ?? 0} accent="#22c55e" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard title="Breached" value={metrics?.breached_orders ?? 0} accent="#ef4444" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard title="Low Stock SKUs" value={inv?.low_stock_items ?? 0} accent="#f59e0b" />
            </Grid>
          </Grid>
        )
      }
    >
      <Grid container spacing={2} sx={{ pb: 1 }}>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="Order Volume Trend"
            subtitle="Weekly orders created (last 8 weeks)"
            options={volumeChart}
            loading={volumeLoading}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="SLA Breach Overview"
            subtitle="Current active breach count"
            options={{
              chart: { type: 'pie' },
              series: [{
                type: 'pie',
                data: [
                  { name: 'Within SLA', y: sla?.orders_within_sla ?? 0, color: '#22c55e' },
                  { name: 'Breached', y: sla?.breached_orders ?? 0, color: '#ef4444' },
                ],
              }],
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="Lens Type Distribution"
            subtitle={`${lensTypes?.total ?? 0} active orders`}
            options={lensChart}
            loading={lensLoading}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 340 }}>
          <ChartCard
            title="Store Performance"
            subtitle={`${stores?.total ?? 0} active orders by store`}
            options={storeChart}
            loading={storesLoading}
          />
        </Grid>
      </Grid>
    </PageShell>
  );
}
