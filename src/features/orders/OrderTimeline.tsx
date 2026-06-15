import { Box, Stack, Typography, Chip } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import type { OrderStatus, OrderStatusHistory } from '@/types/api';
import { ORDER_STATUS_FLOW } from '@/utils/constants';
import { formatDate, formatStatus } from '@/utils/formatters';

interface OrderTimelineProps {
  entries: OrderStatusHistory[];
  currentStatus: OrderStatus;
}

export function OrderTimeline({ entries, currentStatus }: OrderTimelineProps) {
  const reworkCount = entries.filter((e) => e.new_status === 'REWORK').length;
  const visited = new Set(entries.map((e) => e.new_status));

  return (
    <Box>
      {reworkCount > 0 && (
        <Chip
          icon={<LoopIcon />}
          label={`${reworkCount} QC rework loop${reworkCount > 1 ? 's' : ''}`}
          color="warning"
          size="small"
          sx={{ mb: 2 }}
        />
      )}

      <Stack spacing={0}>
        {ORDER_STATUS_FLOW.filter(
          (s) => visited.has(s) || s === currentStatus || s === 'REWORK',
        ).map((step, index, arr) => {
          const entry = entries.find((e) => e.new_status === step);
          const isCurrent = step === currentStatus;
          const isRework = step === 'REWORK' && visited.has('REWORK');

          return (
            <Stack key={step} direction="row" spacing={2} sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: isCurrent ? 'primary.main' : entry || isRework ? 'success.main' : 'action.disabled',
                    border: 2,
                    borderColor: isCurrent ? 'primary.light' : 'transparent',
                  }}
                />
                {index < arr.length - 1 && (
                  <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 24 }} />
                )}
              </Box>
              <Box sx={{ flex: 1, pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={isCurrent ? 700 : 500}>
                    {formatStatus(step)}
                  </Typography>
                  {isCurrent && <Chip label="Current" size="small" color="primary" />}
                  {isRework && <Chip label="Loop" size="small" color="warning" variant="outlined" />}
                </Stack>
                {entry && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(entry.created_at)}
                    </Typography>
                    {entry.reason && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {entry.reason}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Full audit log: {entries.length} entries
      </Typography>
    </Box>
  );
}
