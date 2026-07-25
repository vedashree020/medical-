import { BrainCircuit } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { box: 'h-8 w-8', icon: 18, text: 'text-base' },
  md: { box: 'h-10 w-10', icon: 22, text: 'text-lg' },
  lg: { box: 'h-12 w-12', icon: 26, text: 'text-xl' },
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative ${s.box} rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center shadow-glow`}>
        <BrainCircuit size={s.icon} className="text-white" />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-white dark:ring-slate-900" />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className={`font-bold ${s.text} text-slate-900 dark:text-white tracking-tight`}>
            MedhaDrishti<span className="text-brand-600 dark:text-brand-400"> AI</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Neuro Imaging Suite
          </p>
        </div>
      )}
    </div>
  );
}
