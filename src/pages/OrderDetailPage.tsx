import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  useGetOrderQuery,
  useGetOrderTimelineQuery,
  useUpdateOrderStatusMutation,
} from '@/services/ordersApi';
import { useLazyCheckInventoryQuery } from '@/services/inventoryApi';
import { useGetOrderPredictionQuery } from '@/services/aiApi';
import { StatusChip } from '@/components/common/StatusChip';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageShell } from '@/components/layout/PageShell';
import { formatDate, formatHours, riskColor } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import {
  ALLOWED_TRANSITIONS,
  StatusUpdateDialog,
} from '@/components/forms/StatusUpdateDialog';
import type { OrderStatus } from '@/types/api';
import { OrderTimeline } from '@/features/orders/OrderTimeline';

export function OrderDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [statusOpen, setStatusOpen] = useState(false);

  const { data: order, isLoading } = useGetOrderQuery(id, { skip: !id });
  const { data: timeline } = useGetOrderTimelineQuery(id, { skip: !id });
  const { data: prediction } = useGetOrderPredictionQuery(id, { skip: !id || !isAdmin });
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();
  const [checkLeft, { data: leftInv }] = useLazyCheckInventoryQuery();
  const [checkRight, { data: rightInv }] = useLazyCheckInventoryQuery();

  if (isLoading || !order) return <PageSkeleton />;

  const loadInventory = () => {
    const params = {
      lens_type: order.lens_type,
      lens_index: order.lens_index,
      coating: order.coating,
    };
    checkLeft({ ...params, power: order.power_left });
    checkRight({ ...params, power: order.power_right });
  };

  return (
    <PageShell
      title={order.order_number}
      subtitle={order.customer_name}
      toolbar={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/orders')}>
            Back
          </Button>
          {isAdmin && ALLOWED_TRANSITIONS[order.status].length > 0 && (
            <Button variant="contained" onClick={() => setStatusOpen(true)}>
              Update Status
            </Button>
          )}
        </Stack>
      }
    >
      <Grid container spacing={2} sx={{ pb: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Information</Typography>
              <Stack spacing={1}>
                <Row label="Status"><StatusChip status={order.status} /></Row>
                <Row label="Source">{order.source}</Row>
                <Row label="Store">{order.store_location ?? '—'}</Row>
                <Row label="Lens">{order.lens_type} · {order.lens_index} · {order.coating}</Row>
                <Row label="Power">L {order.power_left} / R {order.power_right}</Row>
                <Row label="Frame">{order.frame}</Row>
                <Row label="Created">{formatDate(order.created_at)}</Row>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Inventory</Typography>
                <Button size="small" onClick={loadInventory}>Check Stock</Button>
              </Stack>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Row label="At Creation">{order.inventory_available ? 'In stock' : 'Procurement needed'}</Row>
                {leftInv && (
                  <Row label={`Left (${order.power_left})`}>
                    {leftInv.available ? `${leftInv.quantity} available` : 'Out of stock'}
                  </Row>
                )}
                {rightInv && (
                  <Row label={`Right (${order.power_right})`}>
                    {rightInv.available ? `${rightInv.quantity} available` : 'Out of stock'}
                  </Row>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>SLA</Typography>
              <Stack spacing={1}>
                <Row label="SLA Target">{order.sla_hours}h</Row>
                <Row label="Deadline">{formatDate(order.deadline)}</Row>
                <Row label="Remaining">{formatHours(Math.max((new Date(order.deadline).getTime() - Date.now()) / 3600000, 0))}</Row>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>AI Prediction</Typography>
                {prediction ? (
                  <Stack spacing={1}>
                    <Row label="Risk Score">
                      <Chip size="small" label={`${prediction.breach_risk_score}%`} sx={{ bgcolor: riskColor(prediction.breach_risk_score), color: '#fff' }} />
                    </Row>
                    <Row label="Predicted">{formatHours(prediction.predicted_completion_hours)} to complete</Row>
                    <Row label="Model">{prediction.model_used}</Row>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {prediction.summary}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">Loading prediction...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Timeline</Typography>
              <OrderTimeline entries={timeline ?? []} currentStatus={order.status} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <StatusUpdateDialog
        open={statusOpen}
        currentStatus={order.status}
        allowedStatuses={ALLOWED_TRANSITIONS[order.status]}
        loading={updating}
        onClose={() => setStatusOpen(false)}
        onSubmit={async (values) => {
          await updateStatus({
            id,
            body: { new_status: values.new_status as OrderStatus, reason: values.reason },
          }).unwrap();
          enqueueSnackbar('Status updated', { variant: 'success' });
        }}
      />
    </PageShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Box>{children}</Box>
    </Stack>
  );
}
