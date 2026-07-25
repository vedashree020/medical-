import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  tone?: 'brand' | 'accent' | 'amber' | 'violet';
  rows: { label: string; value: string }[];
  delay?: number;
}

const tones = {
  brand: { bg: 'bg-brand-50 dark:bg-brand-600/15', text: 'text-brand-600 dark:text-brand-400', ring: 'ring-brand-200 dark:ring-brand-500/30', bar: 'from-brand-500 to-brand-700' },
  accent: { bg: 'bg-accent-50 dark:bg-accent-600/15', text: 'text-accent-600 dark:text-accent-400', ring: 'ring-accent-200 dark:ring-accent-500/30', bar: 'from-accent-500 to-accent-700' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-600/15', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-500/30', bar: 'from-amber-500 to-orange-600' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-600/15', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-200 dark:ring-violet-500/30', bar: 'from-violet-500 to-fuchsia-600' },
};

export default function InfoCard({ title, icon: Icon, tone = 'brand', rows, delay = 0 }: InfoCardProps) {
  const t = tones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div className={`h-1 bg-gradient-to-r ${t.bar}`} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text} ring-1 ${t.ring}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <dl className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100 font-mono text-xs">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}
