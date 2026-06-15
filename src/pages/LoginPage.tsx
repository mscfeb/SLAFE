import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLoginMutation } from '@/services/authApi';
import { hideScrollbarSx } from '@/utils/scroll';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        ...hideScrollbarSx,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            SLA Ops
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to the eyewear operations dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid email or password
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(async (values) => {
              try {
                await login(values).unwrap();
                enqueueSnackbar('Welcome back!', { variant: 'success' });
                navigate('/dashboard');
              } catch {
                enqueueSnackbar('Login failed', { variant: 'error' });
              }
            })}
          >
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <Button type="submit" variant="contained" size="large" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
