import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  TablePagination,
  Chip,
  Typography,
  Paper,
  TableContainer,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useGetOrdersDashboardQuery, useUpdateOrderStatusMutation } from '@/services/ordersApi';
import { StatusChip } from '@/components/common/StatusChip';
import { EmptyState } from '@/components/common/EmptyState';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageShell } from '@/components/layout/PageShell';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalSearch } from '@/components/layout/AppShell';
import { formatDate, formatHours, riskColor } from '@/utils/formatters';
import { LENS_TYPE_OPTIONS, ORDER_SOURCE_OPTIONS } from '@/utils/constants';
import { hideScrollbarSx, panelPaperSx } from '@/utils/scroll';
import type { LensType, OrderSource, OrderStatus } from '@/types/api';
import {
  ALLOWED_TRANSITIONS,
  StatusUpdateDialog,
} from '@/components/forms/StatusUpdateDialog';

export function OrdersPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { search } = useGlobalSearch();
  const debouncedSearch = useDebounce(search);
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [lensType, setLensType] = useState<LensType | ''>('');
  const [store, setStore] = useState('');
  const [source, setSource] = useState<OrderSource | ''>('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus | null>(null);

  const { data, isLoading, isFetching } = useGetOrdersDashboardQuery({
    page: page + 1,
    page_size: pageSize,
    ...(status ? { status } : {}),
    ...(lensType ? { lens_type: lensType } : {}),
    ...(store ? { store_location: store } : {}),
    ...(source ? { source } : {}),
  });

  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const filtered = useMemo(() => {
    if (!debouncedSearch) return data?.items ?? [];
    const q = debouncedSearch.toLowerCase();
    return (data?.items ?? []).filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q),
    );
  }, [data, debouncedSearch]);

  if (isLoading) return <PageSkeleton />;

  return (
    <PageShell
      title="Orders"
      fixedBody
      toolbar={
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField select label="Status" size="small" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')} sx={{ minWidth: 180 }}>
            <MenuItem value="">All</MenuItem>
            {Object.keys(ALLOWED_TRANSITIONS).map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Lens Type" size="small" value={lensType} onChange={(e) => setLensType(e.target.value as LensType | '')} sx={{ minWidth: 160 }}>
            <MenuItem value="">All</MenuItem>
            {LENS_TYPE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
          <TextField label="Store" size="small" value={store} onChange={(e) => setStore(e.target.value)} sx={{ minWidth: 160 }} />
          <TextField select label="Source" size="small" value={source} onChange={(e) => setSource(e.target.value as OrderSource | '')} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            {ORDER_SOURCE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
        </Stack>
      }
    >
      <Paper sx={panelPaperSx}>
        <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto', ...hideScrollbarSx }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Lens</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>SLA Left</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <EmptyState title="No orders found" description="Adjust filters or create a new order." />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id} hover sx={{ opacity: isFetching ? 0.7 : 1 }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{order.order_number}</Typography>
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.lens_type.replace('_', ' ')}</TableCell>
                    <TableCell>{order.store_location ?? '—'}</TableCell>
                    <TableCell><StatusChip status={order.status} /></TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={formatHours(order.remaining_hours)}
                        color={order.is_breached ? 'error' : order.is_high_risk ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={`${order.breach_risk_score}%`}
                        sx={{ bgcolor: riskColor(order.breach_risk_score), color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      {isAdmin && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditId(order.id);
                            setEditStatus(order.status);
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.total ?? 0}
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
      </Paper>

      {editId && editStatus && (
        <StatusUpdateDialog
          open
          currentStatus={editStatus}
          allowedStatuses={ALLOWED_TRANSITIONS[editStatus]}
          loading={updating}
          onClose={() => {
            setEditId(null);
            setEditStatus(null);
          }}
          onSubmit={async (values) => {
            await updateStatus({
              id: editId,
              body: {
                new_status: values.new_status as OrderStatus,
                reason: values.reason,
              },
            }).unwrap();
            enqueueSnackbar('Status updated', { variant: 'success' });
          }}
        />
      )}
    </PageShell>
  );
}
