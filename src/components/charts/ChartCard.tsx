import { Box, Card, CardContent, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { hideScrollbarSx } from '@/utils/scroll';
import { resolveChartScroll } from './chartScroll';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  options: Highcharts.Options;
  loading?: boolean;
  height?: number;
}

export function ChartCard({ title, subtitle, options, loading, height = 300 }: ChartCardProps) {
  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      ...options,
      chart: {
        ...options.chart,
        backgroundColor: 'transparent',
        height,
      },
      credits: { enabled: false },
      title: { text: undefined },
    }),
    [options, height],
  );

  const scroll = useMemo(() => resolveChartScroll(chartOptions), [chartOptions]);

  const scrollSx = useMemo((): SxProps<Theme> => {
    const base = { width: '100%', flex: 1, minHeight: 0 };
    if (scroll.axis === 'x') {
      return [hideScrollbarSx, base, { overflowX: 'auto', overflowY: 'hidden' }] as SxProps<Theme>;
    }
    if (scroll.axis === 'y') {
      return [hideScrollbarSx, base, { overflowY: 'auto', overflowX: 'hidden', maxHeight: height }] as SxProps<Theme>;
    }
    return base;
  }, [scroll.axis, height]);

  const innerSx = useMemo(() => {
    if (scroll.axis === 'x') return { minWidth: scroll.minSize, width: scroll.minSize };
    if (scroll.axis === 'y') return { minHeight: scroll.minSize };
    return undefined;
  }, [scroll]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ flexShrink: 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, mb: 0.5 }}>
            {subtitle}
          </Typography>
        )}
        {loading ? (
          <Typography sx={{ py: 10, textAlign: 'center' }} color="text.secondary">
            Loading chart...
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
