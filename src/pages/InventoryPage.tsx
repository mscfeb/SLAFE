import { useMemo, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  TablePagination,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useGetInventoryForecastQuery } from '@/services/analyticsApi';
import { useLazyCheckInventoryQuery } from '@/services/inventoryApi';
import { EmptyState } from '@/components/common/EmptyState';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageShell } from '@/components/layout/PageShell';
import { LENS_TYPE_OPTIONS } from '@/utils/constants';
import {
  tableScrollSx,
  inventoryRowSx,
  inventoryTableCellSx,
  inventoryTableHeadSx,
  panelPaperSx,
} from '@/utils/scrollbar';
import type { InventoryForecastItem, LensType } from '@/types/api';

const STATUS_CONFIG: Record<
  InventoryForecastItem['status'],
  { label: string; color: 'error' | 'success' | 'warning' | 'default' }
> = {
  understock: { label: 'Understock', color: 'error' },
  optimal: { label: 'Optimal', color: 'success' },
  overstock: { label: 'Overstock', color: 'warning' },
  no_demand: { label: 'No demand', color: 'default' },
};

const DEFAULT_PAGE_SIZE = 10;

export function InventoryPage() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [power, setPower] = useState('');
  const [lensType, setLensType] = useState<LensType | ''>('');

  const { data: forecast, isLoading: forecastLoading } = useGetInventoryForecastQuery({ months: 6 });

  const [check, { data: availability, isFetching: checking }] = useLazyCheckInventoryQuery();
  const [checkForm, setCheckForm] = useState({
    power: '-2.00',
    lens_type: 'SINGLE_VISION' as LensType,
    lens_index: '1.56',
    coating: 'ANTI_GLARE',
  });

  const filteredItems = useMemo(() => {
    const items = forecast?.items ?? [];
    return items.filter((item) => {
      if (power && !item.power.toLowerCase().includes(power.toLowerCase())) return false;
      if (lensType && item.lens_type !== lensType) return false;
      return true;
    });
  }, [forecast, power, lensType]);

  const paginatedItems = useMemo(() => {
    const start = page * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const understockCount = forecast?.items.filter((i) => i.status === 'understock').length ?? 0;
  const overstockCount = forecast?.items.filter((i) => i.status === 'overstock').length ?? 0;
  const noDemandCount = forecast?.items.filter((i) => i.status === 'no_demand').length ?? 0;

  function handleFilterChange<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(0);
  }

  if (forecastLoading && !forecast) return <PageSkeleton />;

  return (
    <PageShell
      title="Inventory"
      fixedBody
      header={
        <>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Availability Check</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                <TextField label="Power" size="small" value={checkForm.power} onChange={(e) => setCheckForm({ ...checkForm, power: e.target.value })} />
                <TextField select label="Lens Type" size="small" value={checkForm.lens_type} onChange={(e) => setCheckForm({ ...checkForm, lens_type: e.target.value as LensType })} sx={{ minWidth: 150 }}>
                  {LENS_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </TextField>
                <TextField label="Index" size="small" value={checkForm.lens_index} onChange={(e) => setCheckForm({ ...checkForm, lens_index: e.target.value })} />
                <TextField label="Coating" size="small" value={checkForm.coating} onChange={(e) => setCheckForm({ ...checkForm, coating: e.target.value })} />
                <Button variant="contained" size="small" disabled={checking} onClick={() => check(checkForm)}>Check</Button>
                {availability && (
                  <Chip
                    size="small"
                    label={availability.available ? `In stock (${availability.quantity})` : 'Out of stock'}
                    color={availability.available ? 'success' : 'error'}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <TextField
                label="Filter power"
                size="small"
                value={power}
                onChange={(e) => handleFilterChange(setPower, e.target.value)}
              />
              <TextField
                select
                label="Lens type"
                size="small"
                value={lensType}
                onChange={(e) => handleFilterChange(setLensType, e.target.value as LensType | '')}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">All</MenuItem>
                {LENS_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${understockCount} understock`} color="error" size="small" variant="outlined" />
              <Chip label={`${overstockCount} overstock`} color="warning" size="small" variant="outlined" />
              <Chip label={`${noDemandCount} no demand`} size="small" variant="outlined" />
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Recommended stock = 2 months of average demand from the last {forecast?.months ?? 6} months of orders.
          </Typography>
        </>
      }
    >
      <Paper sx={panelPaperSx}>
        {forecastLoading ? (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ flex: 1, py: 6 }}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading inventory...</Typography>
          </Stack>
        ) : (
          <>
            <TableContainer sx={tableScrollSx}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Power', 'Lens Type', 'Index', 'Coating', 'Current', '6M Demand', 'Recommended', 'Variance', 'Status'].map(
                      (label, i) => (
                        <TableCell
                          key={label}
                          align={i >= 4 && i <= 7 ? 'right' : 'left'}
                          sx={inventoryTableHeadSx}
                        >
                          {label}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} sx={inventoryTableCellSx}>
                        <EmptyState title="No inventory SKUs match filters" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((row) => {
                      const status = STATUS_CONFIG[row.status];
                      return (
                        <TableRow
                          key={`${row.power}-${row.lens_type}-${row.lens_index}-${row.coating}`}
                          hover
                          sx={inventoryRowSx(theme, row.status, row.current_stock)}
                        >
                          <TableCell sx={{ ...inventoryTableCellSx, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {row.power}
                          </TableCell>
                          <TableCell sx={{ ...inventoryTableCellSx, whiteSpace: 'nowrap' }}>
                            {row.lens_type.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell sx={inventoryTableCellSx}>{row.lens_index}</TableCell>
                          <TableCell sx={{ ...inventoryTableCellSx, whiteSpace: 'nowrap' }}>{row.coating}</TableCell>
                          <TableCell align="right" sx={inventoryTableCellSx}>
                            <Chip
                              size="small"
                              label={row.current_stock}
                              color={row.current_stock === 0 ? 'error' : 'default'}
                              variant={row.current_stock === 0 ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ ...inventoryTableCellSx, fontVariantNumeric: 'tabular-nums' }}>
                            {row.demand_6m}
                          </TableCell>
                          <TableCell align="right" sx={{ ...inventoryTableCellSx, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                            {row.recommended_stock}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              ...inventoryTableCellSx,
                              fontWeight: 700,
                              fontVariantNumeric: 'tabular-nums',
                              color: row.variance < 0
                                ? 'error.light'
                                : row.variance > 0
                                  ? 'warning.light'
                                  : 'text.primary',
                            }}
                          >
                            {row.variance > 0 ? `+${row.variance}` : row.variance}
                          </TableCell>
                          <TableCell sx={inventoryTableCellSx}>
                            <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredItems.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }}
            />
          </>
        )}
      </Paper>
    </PageShell>
  );
}
