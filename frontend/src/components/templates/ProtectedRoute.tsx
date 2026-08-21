import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated } from '../../app/authSlice';
import { PageLayout } from './PageLayout';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PageLayout>{children}</PageLayout>;
}
