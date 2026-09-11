import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { FullPageSpinner } from '@/components/FullPageSpinner';

export function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function RedirectIfAuthed({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'authenticated') {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }
  return children;
}
