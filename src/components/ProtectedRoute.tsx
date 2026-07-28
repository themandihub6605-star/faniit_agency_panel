import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, user, hasHydrated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!hasHydrated) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'agency') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0A0A0A] px-6 text-center">
        <h1 className="text-xl font-bold text-white">Not an agency account</h1>
        <p className="max-w-sm text-sm text-white/50">
          This account ({user.email}) isn't registered as an Agency. Register on the main Fanitt site first.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
