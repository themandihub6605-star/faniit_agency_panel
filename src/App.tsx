import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, setHydrated } from '@/store/slices/authSlice';
import { authApi } from '@/services/authApi';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AgencyLayout } from '@/layouts/AgencyLayout';
import Login from '@/pages/Login';
import AgencyDashboard from '@/pages/AgencyDashboard';
import AgencyReferrals from '@/pages/AgencyReferrals';
import AgencyEarnings from '@/pages/AgencyEarnings';
import AgencyWallet from '@/pages/AgencyWallet';
import AgencyTransactions from '@/pages/AgencyTransactions';
import AgencyReports from '@/pages/AgencyReports';
import EditAgencyProfile from '@/pages/EditAgencyProfile';
import AgencySupport from '@/pages/AgencySupport';
import AgencyChangePassword from '@/pages/AgencyChangePassword';

function useAuthHydration() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (accessToken) {
        try {
          const user = await authApi.getMe();
          if (!cancelled) dispatch(setCredentials({ user, accessToken }));
        } catch {
          // token invalid/expired — interceptor already logs out on 401
        }
      }
      if (!cancelled) dispatch(setHydrated());
    }
    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AgencyLayout>{children}</AgencyLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  useAuthHydration();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/" element={<Shell><PageTransition><AgencyDashboard /></PageTransition></Shell>} />
        <Route path="/referrals" element={<Shell><PageTransition><AgencyReferrals /></PageTransition></Shell>} />
        <Route path="/earnings" element={<Shell><PageTransition><AgencyEarnings /></PageTransition></Shell>} />
        <Route path="/wallet" element={<Shell><PageTransition><AgencyWallet /></PageTransition></Shell>} />
        <Route path="/transactions" element={<Shell><PageTransition><AgencyTransactions /></PageTransition></Shell>} />
        <Route path="/reports" element={<Shell><PageTransition><AgencyReports /></PageTransition></Shell>} />
        <Route path="/edit" element={<Shell><PageTransition><EditAgencyProfile /></PageTransition></Shell>} />
        <Route path="/change-password" element={<Shell><PageTransition><AgencyChangePassword /></PageTransition></Shell>} />
        <Route path="/support" element={<Shell><PageTransition><AgencySupport /></PageTransition></Shell>} />
      </Routes>
    </AnimatePresence>
  );
}