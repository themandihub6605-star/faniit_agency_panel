import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { agencyApi, type AgencyDashboardData } from '@/services/agencyApi';
import { getApiErrorMessage } from '@/services/apiClient';

function formatRupees(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

const PIE_COLORS: Record<string, string> = { Session: '#22D3EE', Campaign: '#A78BFA', Other: '#F97316' };

export default function AgencyEarnings() {
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

  const pieData =
    data?.earningsBreakdown
      .map((row) => ({
        name: row._id === 'Session' ? 'Creator Earnings' : row._id === 'Campaign' ? 'Brand Earnings' : 'Other',
        value: row.total,
        color: PIE_COLORS[row._id || 'Other'] || PIE_COLORS.Other,
      }))
      .filter((row) => row.value > 0) || [];

  return (
    <div className="pt-8 pb-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Earnings</h1>
      <p className="mt-1 text-sm text-white/60">Your commission from referred creators and brands.</p>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-white/50">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading earnings...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {!loading && data && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Wallet size={17} /></span>
              <p className="mt-4 text-2xl font-bold text-white">{formatRupees(data.stats.totalCommissionEarned)}</p>
              <p className="text-xs text-white/50">Total Earnings (all time)</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300"><Calendar size={17} /></span>
              <p className="mt-4 text-2xl font-bold text-white">{formatRupees(data.stats.thisMonthCommission)}</p>
              <p className="text-xs text-white/50">This Month</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300"><TrendingUp size={17} /></span>
              <p className="mt-4 text-2xl font-bold text-white">{data.stats.totalReferrals}</p>
              <p className="text-xs text-white/50">Referrals Generating Earnings</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-navy-800/60 p-6">
            <h2 className="text-lg font-bold text-white">Earnings Breakup</h2>
            {pieData.length === 0 ? (
              <p className="mt-4 text-sm text-white/50">No commission earnings yet.</p>
            ) : (
              <div className="mt-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatRupees(v)} contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
