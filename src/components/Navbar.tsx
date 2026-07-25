import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UploadCloud,
  Cpu,
  BarChart3,
  Workflow,
  Download,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { PageId } from '@/types';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const items: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'landing', label: 'Overview', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload', icon: UploadCloud },
  { id: 'processing', label: 'Processing', icon: Cpu },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'pipeline', label: 'Pipeline', icon: Workflow },
  { id: 'downloads', label: 'Downloads', icon: Download },
];

export default function Navbar({ current, onNavigate, theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const navigate = (page: PageId) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 h-16">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="p-3 grid grid-cols-2 gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
