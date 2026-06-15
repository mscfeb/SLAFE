import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function PageSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={48} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ flex: 1 }}>
            <CardContent>
              <Skeleton height={24} width="60%" />
              <Skeleton height={40} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Skeleton variant="rounded" height={320} />
    </Stack>
  );
}
