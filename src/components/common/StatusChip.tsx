import { Chip } from '@mui/material';
import type { OrderStatus } from '@/types/api';
import { formatStatus, statusColor } from '@/utils/formatters';

export function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <Chip
      label={formatStatus(status)}
      color={statusColor(status)}
      size="small"
      variant="outlined"
    />
  );
}
