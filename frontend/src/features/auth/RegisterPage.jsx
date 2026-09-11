import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './authSchema';
import { useAuth } from './AuthProvider';
import { apiErrorMessage, apiFieldErrors } from '@/lib/apiClient';
import { AuthLayout } from './AuthLayout';
import { Field } from '@/components/Field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values) {
    setFormError(null);
    try {
      await registerUser(values);
      navigate('/', { replace: true });
    } catch (err) {
      const fields = apiFieldErrors(err);
      if (fields) {
        Object.entries(fields).forEach(([k, msgs]) => setError(k, { message: msgs[0] }));
      } else {
        setFormError(apiErrorMessage(err, 'Gagal mendaftar'));
      }
    }
  }

  return (
    <AuthLayout title="Buat akun" subtitle="Gratis, cukup butuh email.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}
        <Field label="Nama" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="Minimal 8 karakter, kombinasi huruf dan angka."
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
