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
import { useLoginMutation, useRegisterMutation } from '@/services/authApi';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [registerUser, { isLoading: registering, error: registerError }] = useRegisterMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const isLoading = registering || loggingIn;

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Create account
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Register to access the eyewear operations dashboard
      </Typography>

      {registerError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Registration failed. This email may already be in use.
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await registerUser({
              name: values.name,
              email: values.email,
              password: values.password,
            }).unwrap();
            await login({ email: values.email, password: values.password }).unwrap();
            enqueueSnackbar('Account created successfully!', { variant: 'success' });
            navigate('/dashboard');
          } catch {
            enqueueSnackbar('Registration failed', { variant: 'error' });
          }
        })}
      >
        <Stack spacing={2}>
          <TextField
            label="Full name"
            fullWidth
            autoComplete="name"
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
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
            autoComplete="new-password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <PasswordField
            label="Confirm password"
            fullWidth
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
          />
          <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}
