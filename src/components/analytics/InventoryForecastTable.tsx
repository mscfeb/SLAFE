import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { InventoryForecastItem } from '@/types/api';
import { hideScrollbarSx } from '@/utils/scroll';

const STATUS_CONFIG: Record<
  InventoryForecastItem['status'],
  { label: string; color: 'error' | 'success' | 'warning' | 'default' }
> = {
  understock: { label: 'Understock', color: 'error' },
  optimal: { label: 'Optimal', color: 'success' },
  overstock: { label: 'Overstock', color: 'warning' },
  no_demand: { label: 'No demand', color: 'default' },
};

interface InventoryForecastTableProps {
  items: InventoryForecastItem[];
  months: number;
}

export function InventoryForecastTable({ items, months }: InventoryForecastTableProps) {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        No inventory SKUs to forecast.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Recommended stock = 2 months of average demand from the last {months} months of orders.
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto', ...hideScrollbarSx }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Power</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lens</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Current</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">6M Demand</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Recommended</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Variance</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => {
              const status = STATUS_CONFIG[row.status];
              return (
                <TableRow key={`${row.power}-${row.lens_type}-${row.lens_index}-${row.coating}`} hover>
                  <TableCell>{row.power}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.lens_type.replace(/_/g, ' ')} · {row.lens_index}
                  </TableCell>
                  <TableCell align="right">{row.current_stock}</TableCell>
                  <TableCell align="right">{row.demand_6m}</TableCell>
                  <TableCell align="right">{row.recommended_stock}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.variance < 0 ? 'error.main' : row.variance > 0 ? 'warning.main' : 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {row.variance > 0 ? `+${row.variance}` : row.variance}
                  </TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
