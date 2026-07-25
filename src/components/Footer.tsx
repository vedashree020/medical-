import { Heart, Github, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
      <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={14} className="text-accent-500" />
          <span>HIPAA-aware demo · For research & educational use only — not for clinical diagnosis</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            Built with <Heart size={12} className="text-brand-500 fill-brand-500" /> for hackathons
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Github size={13} /> MedhaDrishti AI v2.4.1
          </span>
        </div>
      </div>
    </footer>
  );
}
