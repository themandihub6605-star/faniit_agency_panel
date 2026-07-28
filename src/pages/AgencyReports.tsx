import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { agencyApi, type AgencyDashboardData } from '@/services/agencyApi';
import { getApiErrorMessage } from '@/services/apiClient';

function formatRupees(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

/** A real, if simple, summary report — "This Month" vs "All Time" using the
 * same figures already tracked on the agency's own record. No fabricated
 * daily/weekly charts here since there's no historical time-series data
 * being recorded yet to honestly build one from. */
export default function AgencyReports() {
  const [data, setData] = useState<AgencyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    agencyApi
      .getMyDashboard()
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-8 pb-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Reports</h1>
      <p className="mt-1 text-sm text-white/60">A summary of your referral performance.</p>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-white/50">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading report...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {!loading && data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/40">This Month</h2>
            <p className="mt-3 text-3xl font-bold text-white">{formatRupees(data.stats.thisMonthCommission)}</p>
            <p className="mt-1 text-sm text-white/50">Commission earned so far this month</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/40">All Time</h2>
            <p className="mt-3 text-3xl font-bold text-white">{formatRupees(data.stats.totalCommissionEarned)}</p>
            <p className="mt-1 text-sm text-white/50">Total commission earned since joining</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/40">Creators Referred</h2>
            <p className="mt-3 text-3xl font-bold text-white">{data.stats.referredCreatorCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/40">Brands Onboarded</h2>
            <p className="mt-3 text-3xl font-bold text-white">{data.stats.referredBrandCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}
