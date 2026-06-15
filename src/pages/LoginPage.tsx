import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLoginMutation } from '@/services/authApi';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';

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
    <AuthLayout>
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
            autoComplete="email"
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <PasswordField
            label="Password"
            fullWidth
            autoComplete="current-password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Create one
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}
