import type { Options } from 'highcharts';

export type ChartScrollAxis = 'x' | 'y' | 'none';

const CATEGORY_THRESHOLD = 5;
const PX_PER_CATEGORY_X = 56;
const PX_PER_CATEGORY_Y = 36;

export function resolveChartScroll(options: Options): {
  axis: ChartScrollAxis;
  minSize: number;
} {
  const series0 = options.series?.[0] as { type?: string } | undefined;
  const chartType = options.chart?.type ?? series0?.type ?? 'column';
  const xAxis = Array.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis;
  const categories = xAxis?.categories?.length ?? 0;

  if (categories <= CATEGORY_THRESHOLD) {
    return { axis: 'none', minSize: 0 };
  }

  if (chartType === 'bar') {
    return { axis: 'y', minSize: categories * PX_PER_CATEGORY_Y };
  }

  if (chartType === 'column' || chartType === 'line' || chartType === 'areaspline' || chartType === 'area') {
    return { axis: 'x', minSize: categories * PX_PER_CATEGORY_X };
  }

  return { axis: 'none', minSize: 0 };
}
