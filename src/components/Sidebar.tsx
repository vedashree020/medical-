import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UploadCloud,
  Cpu,
  BarChart3,
  Workflow,
  Download,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import { PageId } from '@/types';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  health: 'healthy' | 'degraded' | 'down' | 'loading';
}

const items: { id: PageId; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'landing', label: 'Overview', icon: LayoutDashboard, desc: 'Home & features' },
  { id: 'upload', label: 'Upload Scan', icon: UploadCloud, desc: 'Drop MRI files' },
  { id: 'processing', label: 'Processing', icon: Cpu, desc: 'AI pipeline' },
  { id: 'results', label: 'Results', icon: BarChart3, desc: 'Analysis dashboard' },
  { id: 'pipeline', label: 'Pipeline', icon: Workflow, desc: 'Workflow diagram' },
  { id: 'downloads', label: 'Downloads', icon: Download, desc: 'Export reports' },
];

const healthMap = {
  healthy: { color: 'bg-accent-500', label: 'Online', text: 'text-accent-600 dark:text-accent-400' },
  degraded: { color: 'bg-amber-500', label: 'Degraded', text: 'text-amber-600 dark:text-amber-400' },
  down: { color: 'bg-red-500', label: 'Offline', text: 'text-red-600 dark:text-red-400' },
  loading: { color: 'bg-slate-400', label: 'Checking', text: 'text-slate-500' },
};

export default function Sidebar({ current, onNavigate, theme, onToggleTheme, health }: SidebarProps) {
  const h = healthMap[health];
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Workstation
        </p>
        {items.map((item) => {
          const active = current === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'text-brand-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-brand-50 dark:bg-brand-600/15 ring-1 ring-brand-200 dark:ring-brand-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-brand-600 text-white shadow-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>
                <Icon size={16} />
              </span>
              <span className="relative z-10 flex-1 text-left">
                <span className="block">{item.label}</span>
                <span className="block text-[11px] font-normal text-slate-400 dark:text-slate-500">{item.desc}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {health === 'healthy' && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75 animate-ping" />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${h.color}`} />
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">API Service</span>
            <Activity size={13} className={`ml-auto ${h.text}`} />
          </div>
          <p className={`mt-1 text-[11px] font-medium ${h.text}`}>{h.label} · /health</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">Appearance</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </aside>
  );
}
