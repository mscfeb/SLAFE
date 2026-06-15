import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  TablePagination,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  useGetActiveAlertsQuery,
  useGetAlertsQuery,
  useResolveAlertMutation,
} from '@/services/alertsApi';
import { useGetAtRiskPredictionsQuery } from '@/services/aiApi';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { PageShell } from '@/components/layout/PageShell';
import { formatDate, severityColor } from '@/utils/formatters';
import { panelPaperSx, tableScrollSx } from '@/utils/scroll';
import { useAuth } from '@/hooks/useAuth';

export function AlertsPage() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const { isAdmin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: active, isLoading: la } = useGetActiveAlertsQuery({ page: page + 1, page_size: 20 });
  const { data: all, isLoading: lall } = useGetAlertsQuery({ page: page + 1, page_size: 20 }, { skip: tab !== 1 });
  const { data: atRisk } = useGetAtRiskPredictionsQuery(undefined, { skip: !isAdmin });
  const [resolve, { isLoading: resolving }] = useResolveAlertMutation();

  const rows = tab === 0 ? active?.items : all?.items;
  const total = tab === 0 ? active?.total : all?.total;

  if (la || (tab === 1 && lall)) return <PageSkeleton />;

  return (
    <PageShell
      title="Alerts"
      fixedBody
      header={
        <>
          {isAdmin && atRisk && atRisk.total > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>High Risk Orders</Typography>
              <Stack spacing={1}>
                {atRisk.items.slice(0, 5).map((p) => (
                  <Stack key={p.order_id} direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{p.order_number}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.summary}</Typography>
                    </Box>
                    <Button size="small" onClick={() => navigate(`/orders/${p.order_id}`)}>View</Button>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(0); }}>
            <Tab label={`Active (${active?.total ?? 0})`} />
            <Tab label="All Alerts" />
          </Tabs>
        </>
      }
    >
      <Paper sx={panelPaperSx}>
        <TableContainer sx={tableScrollSx}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Severity</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                {isAdmin && <TableCell align="right">Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {!rows?.length ? (
                <TableRow><TableCell colSpan={6}><EmptyState title="No alerts" /></TableCell></TableRow>
              ) : (
                rows.map((alert) => (
                  <TableRow key={alert.id} hover>
                    <TableCell>
                      <Chip size="small" label={alert.severity} color={severityColor(alert.severity)} />
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => navigate(`/orders/${alert.order_id}`)}>
                        View order
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(alert.created_at)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={alert.resolved ? 'Resolved' : 'Active'} color={alert.resolved ? 'default' : 'warning'} />
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        {!alert.resolved && (
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={resolving}
                            onClick={async () => {
                              await resolve(alert.id).unwrap();
                              enqueueSnackbar('Alert resolved', { variant: 'success' });
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total ?? 0}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={20}
          rowsPerPageOptions={[20]}
          onRowsPerPageChange={() => undefined}
          sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }}
        />
      </Paper>
    </PageShell>
  );
}
