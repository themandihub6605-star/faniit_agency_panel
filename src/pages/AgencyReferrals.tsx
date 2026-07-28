import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Copy, Check, Users2 } from 'lucide-react';
import { agencyApi, type ApiReferral } from '@/services/agencyApi';
import { getApiErrorMessage } from '@/services/apiClient';

function formatRupees(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

export default function AgencyReferrals() {
  const [referrals, setReferrals] = useState<ApiReferral[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([agencyApi.getMyReferrals(), agencyApi.getMyDashboard()])
      .then(([refs, dash]) => {
        setReferrals(refs);
        setReferralCode(dash.stats.referralCode);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-8 pb-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">My Referrals</h1>
      <p className="mt-1 text-sm text-white/60">Everyone you've referred to Fanitt — creators and brands, on board.</p>

      {referralCode && (
        <button
          onClick={copyCode}
          className="mt-6 flex w-full max-w-md items-center justify-between rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-pink-500/10 p-4 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Your referral code</p>
            <p className="mt-1 text-lg font-bold tracking-wide text-white">{referralCode}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-bold text-white/70">
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
      )}

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-white/50">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading referrals...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && referrals.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-white/50">
          <Users2 size={28} />
          <p className="text-sm">No referrals yet — share your code with creators and brands to get started.</p>
        </div>
      )}

      {!loading && referrals.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800/60 text-xs uppercase text-white/40">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referrals.map((r) => (
                <tr key={r._id} className="bg-navy-800/30">
                  <td className="flex items-center gap-2.5 px-4 py-3 font-semibold text-white">
                    {r.avatarUrl ? (
                      <img src={r.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-300">
                        {r.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {r.name}
                  </td>
                  <td className="px-4 py-3 capitalize text-white/60">{r.type}</td>
                  <td className="px-4 py-3 text-white/60">
                    {new Date(r.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{r.totalEarnings !== null ? formatRupees(r.totalEarnings) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
