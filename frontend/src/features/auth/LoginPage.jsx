import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './authSchema';
import { useAuth } from './AuthProvider';
import { apiErrorMessage, apiFieldErrors } from '@/lib/apiClient';
import { AuthLayout } from './AuthLayout';
import { Field } from '@/components/Field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    setFormError(null);
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      const fields = apiFieldErrors(err);
      if (fields) {
        Object.entries(fields).forEach(([k, msgs]) => setError(k, { message: msgs[0] }));
      } else {
        setFormError(apiErrorMessage(err, 'Gagal login'));
      }
    }
  }

  return (
    <AuthLayout title="Masuk" subtitle="Kelola tugas kamu di satu tempat.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
}
