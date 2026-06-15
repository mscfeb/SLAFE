import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { OrderStatus } from '@/types/api';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

const schema = z.object({
  new_status: z.string().min(1),
  reason: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

interface StatusUpdateDialogProps {
  open: boolean;
  currentStatus: OrderStatus;
  allowedStatuses: OrderStatus[];
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  loading?: boolean;
}

export function StatusUpdateDialog({
  open,
  currentStatus,
  allowedStatuses,
  onClose,
  onSubmit,
  loading,
}: StatusUpdateDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_status: '', reason: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          handleClose();
        })}
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Current Status"
              value={ORDER_STATUS_LABELS[currentStatus]}
              disabled
              fullWidth
            />
            <TextField
              select
              label="New Status"
              fullWidth
              defaultValue=""
              {...register('new_status')}
              error={Boolean(errors.new_status)}
              helperText={errors.new_status?.message}
            >
              {allowedStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Reason / Delay Note"
              multiline
              rows={3}
              fullWidth
              placeholder="Optional operational note..."
              {...register('reason')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Update Status
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Allowed transitions mirror backend order_service.py
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  ORDER_CREATED: ['AWAITING_PROCUREMENT'],
  AWAITING_PROCUREMENT: ['READY_FOR_PRODUCTION'],
  READY_FOR_PRODUCTION: ['LENS_CUTTING'],
  LENS_CUTTING: ['COATING'],
  COATING: ['ASSEMBLY'],
  ASSEMBLY: ['QC'],
  QC: ['PACKING', 'REWORK'],
  REWORK: ['LENS_CUTTING'],
  PACKING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
};
