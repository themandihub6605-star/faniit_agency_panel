import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Receipt } from 'lucide-react';
import { walletApi, type WalletTransaction } from '@/services/walletApi';
import { getApiErrorMessage } from '@/services/apiClient';

function formatRupees(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

const TYPE_LABELS: Record<string, string> = {
  referral_commission: 'Referral Commission',
  agency_commission: 'Agency Commission',
  session_payment: 'Session Payment',
  campaign_payout: 'Campaign Payout',
  donation: 'Donation',
  refund: 'Refund',
};

export default function AgencyTransactions() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    walletApi
      .getMy()
      .then((d) => setTransactions(d.recentTransactions))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-8 pb-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Transactions</h1>
      <p className="mt-1 text-sm text-white/60">Your full wallet transaction history.</p>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-white/50">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading transactions...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-white/50">
          <Receipt size={28} />
          <p className="text-sm">No transactions yet.</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800/60 text-xs uppercase text-white/40">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t) => (
                <tr key={t._id} className="bg-navy-800/30">
                  <td className="px-4 py-3 font-semibold text-white">{TYPE_LABELS[t.type] || t.type}</td>
                  <td className="px-4 py-3 capitalize text-white/60">{t.status}</td>
                  <td className="px-4 py-3 text-white/60">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">+{formatRupees(t.netAmount || t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
