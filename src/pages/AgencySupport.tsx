import { Mail, MessageCircle, LifeBuoy } from 'lucide-react';

export default function AgencySupport() {
  return (
    <div className="pt-8 pb-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Support</h1>
      <p className="mt-1 text-sm text-white/60">Need help with your agency account? Reach out.</p>

      <div className="mt-6 max-w-lg space-y-4">
        <a
          href="mailto:support@fanitt.com"
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-800/60 p-5 transition-colors hover:border-orange-400/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
            <Mail size={20} />
          </span>
          <div>
            <p className="font-bold text-white">Email Support</p>
            <p className="text-sm text-white/50">support@fanitt.com</p>
          </div>
        </a>

        <a
          href="https://wa.me/910000000000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-800/60 p-5 transition-colors hover:border-orange-400/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <MessageCircle size={20} />
          </span>
          <div>
            <p className="font-bold text-white">WhatsApp Support</p>
            <p className="text-sm text-white/50">Chat with the Fanitt team directly</p>
          </div>
        </a>

        <div className="rounded-2xl border border-white/10 bg-navy-800/40 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
            <LifeBuoy size={20} />
          </span>
          <p className="mt-3 text-sm text-white/60">
            For account-specific issues (referral tracking, commission questions, verification status), include your
            agency name and referral code when you reach out — it helps us find your account faster.
          </p>
        </div>
      </div>
    </div>
  );
}
