import { Box, Card, CardContent, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { hideScrollbarMdUpSx } from '@/utils/scroll';
import { resolveChartScroll } from './chartScroll';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  options: Highcharts.Options;
  loading?: boolean;
  height?: number;
  emptyMessage?: string;
}

export function ChartCard({ title, subtitle, options, loading, height = 300, emptyMessage }: ChartCardProps) {
  const scroll = useMemo(() => resolveChartScroll(options), [options]);

  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      ...options,
      chart: {
        ...options.chart,
        backgroundColor: 'transparent',
        height,
        ...(scroll.axis === 'x' ? { width: scroll.minSize } : {}),
      },
      credits: { enabled: false },
      title: { text: undefined },
    }),
    [options, height, scroll],
  );

  const isEmpty = useMemo(() => {
    const xAxis = Array.isArray(chartOptions.xAxis) ? chartOptions.xAxis[0] : chartOptions.xAxis;
    const categories = xAxis?.categories?.length ?? 0;
    return categories === 0;
  }, [chartOptions]);

  const scrollSx = useMemo((): SxProps<Theme> => {
    const chartArea = {
      width: '100%',
      minWidth: 0,
      height,
      minHeight: height,
      flexShrink: 0,
    };
    if (scroll.axis === 'x') {
      return [
        hideScrollbarMdUpSx,
        chartArea,
        { overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' },
      ] as SxProps<Theme>;
    }
    if (scroll.axis === 'y') {
      return [
        hideScrollbarMdUpSx,
        { width: '100%', minWidth: 0, maxHeight: height, flex: 1, minHeight: 0 },
        { overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' },
      ] as SxProps<Theme>;
    }
    return chartArea;
  }, [scroll.axis, height]);

  const innerSx = useMemo(() => {
    if (scroll.axis === 'x') return { minWidth: scroll.minSize, width: scroll.minSize, height, minHeight: height };
    if (scroll.axis === 'y') return { minHeight: scroll.minSize };
    return { width: '100%', height, minHeight: height };
  }, [scroll, height]);

  return (
    <Card sx={{ width: '100%', minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ flexShrink: 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0, mb: 0.5, display: 'block', wordBreak: 'break-word' }}
          >
            {subtitle}
          </Typography>
        )}
        {loading ? (
          <Typography sx={{ py: 10, textAlign: 'center' }} color="text.secondary">
            Loading chart...
          </Typography>
        ) : isEmpty && emptyMessage ? (
          <Typography sx={{ py: 10, textAlign: 'center' }} color="text.secondary">
            {emptyMessage}
          </Typography>
        ) : (
          <Box sx={scrollSx}>
            <Box sx={innerSx}>
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export function useChartTheme() {
  const theme = useTheme();
  return {
    text: theme.palette.text.secondary,
    grid: theme.palette.divider,
  };
}
