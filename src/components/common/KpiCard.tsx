import { Card, CardContent, Typography } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
}

export function KpiCard({ title, value, subtitle, accent }: KpiCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ mt: 1, color: accent ?? 'text.primary', fontWeight: 700 }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
