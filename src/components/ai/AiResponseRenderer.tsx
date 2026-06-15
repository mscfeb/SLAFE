import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import type { Options } from 'highcharts';
import { ChartCard, useChartTheme } from '@/components/charts/ChartCard';
import { hideScrollbarSx } from '@/utils/scroll';
import type {
  AiCardsPayload,
  AiChartPayload,
  AiChatResponse,
  AiTablePayload,
} from '@/types/ai';

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function AiTableView({ payload }: { payload: AiTablePayload }) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        {payload.title}
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ overflowX: 'auto', maxWidth: '100%', ...hideScrollbarSx }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {payload.columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payload.rows.map((row, idx) => (
              <TableRow key={idx} hover>
                {payload.columns.map((col) => (
                  <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                    {formatCell(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {payload.pagination && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Showing {payload.rows.length} of {payload.pagination.total} records
        </Typography>
      )}
    </Box>
  );
}

function AiChartView({ payload }: { payload: AiChartPayload }) {
  const theme = useChartTheme();
  const categories = payload.data.map((d) => d.name);
  const isPie = payload.chart_type === 'pie';
  const options: Options = {
    chart: { type: isPie ? 'pie' : 'column' },
    xAxis: isPie ? undefined : {
      categories,
      title: { text: payload.x_axis_title },
      labels: { style: { color: theme.text } },
    },
    yAxis: isPie ? undefined : {
      min: 0,
      title: { text: payload.y_axis_title ?? 'Count' },
      gridLineColor: theme.grid,
      labels: { style: { color: theme.text } },
    },
    legend: { enabled: false },
    series: isPie
      ? [{
          type: 'pie',
          name: payload.title,
          data: payload.data.map((d) => ({ name: d.name, y: d.y })),
        }]
      : [{
          type: 'column',
          name: payload.y_axis_title ?? 'Count',
          data: payload.data.map((d) => d.y),
          colorByPoint: true,
        }],
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <ChartCard title={payload.title} options={options} height={260} />
    </Box>
  );
}

function AiCardsView({ payload }: { payload: AiCardsPayload }) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        {payload.title}
      </Typography>
      <Grid container spacing={1.5}>
        {payload.cards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card variant="outlined">
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {card.title}
                </Typography>
                {card.subtitle && (
                  <Chip label={card.subtitle} size="small" sx={{ mt: 0.5, mb: 1 }} />
                )}
                {card.metrics && card.metrics.length > 0 && (
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    {card.metrics.map((m) => (
                      <Box key={m.label}>
                        <Typography variant="caption" color="text.secondary">
                          {m.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {m.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
                {card.description && (
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function AiResponseRenderer({ response }: { response: AiChatResponse }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {response.message}
      </Typography>
      {response.ui_type === 'table' && (
        <AiTableView payload={response.payload as AiTablePayload} />
      )}
      {response.ui_type === 'chart' && (
        <AiChartView payload={response.payload as AiChartPayload} />
      )}
      {response.ui_type === 'cards' && (
        <AiCardsView payload={response.payload as AiCardsPayload} />
      )}
    </Box>
  );
}
