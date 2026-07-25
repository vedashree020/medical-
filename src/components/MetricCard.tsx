import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  tone?: 'brand' | 'accent' | 'amber' | 'violet';
  description?: string;
  delay?: number;
}

const tones = {
  brand: { bg: 'bg-brand-50 dark:bg-brand-600/15', text: 'text-brand-600 dark:text-brand-400', ring: 'ring-brand-200 dark:ring-brand-500/30' },
  accent: { bg: 'bg-accent-50 dark:bg-accent-600/15', text: 'text-accent-600 dark:text-accent-400', ring: 'ring-accent-200 dark:ring-accent-500/30' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-600/15', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-500/30' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-600/15', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-200 dark:ring-violet-500/30' },
};

export default function MetricCard({ label, value, suffix, icon: Icon, tone = 'brand', description, delay = 0 }: MetricCardProps) {
  const t = tones[tone];
  const display = typeof value === 'number' ? (suffix === '%' ? (value * 100).toFixed(2) : value.toFixed(4)) : value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${t.bg} blur-2xl opacity-60`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {display}
            {suffix && <span className="text-lg text-slate-400 dark:text-slate-500 ml-0.5">{suffix}</span>}
          </p>
          {description && <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{description}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text} ring-1 ${t.ring}`}>
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}
