import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import MockMRI from './MockMRI';

interface ComparisonSliderProps {
  seed?: number;
}

export default function ComparisonSlider({ seed = 9 }: ComparisonSliderProps) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/50">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Interactive Comparison</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Drag to compare original vs. segmented MRI</p>
        </div>
        <MoveHorizontal size={15} className="text-brand-500" />
      </div>
      <div
        ref={ref}
        className="relative aspect-square bg-slate-950 select-none cursor-ew-resize touch-none"
        onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
        onMouseMove={(e) => { if (dragging.current) update(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchStart={(e) => { dragging.current = true; update(e.touches[0].clientX); }}
        onTouchMove={(e) => { if (dragging.current) update(e.touches[0].clientX); }}
        onTouchEnd={() => { dragging.current = false; }}
      >
        <div className="absolute inset-0">
          <MockMRI variant="segmentation" seed={seed} className="h-full w-full" />
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div className="absolute inset-0" style={{ width: ref.current?.clientWidth ?? '100%' }}>
            <MockMRI variant="original" seed={seed} className="h-full w-full" />
          </div>
        </div>

        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white shadow-glass flex items-center justify-center">
            <MoveHorizontal size={16} className="text-brand-600" />
          </div>
        </motion.div>

        <span className="absolute top-3 left-3 chip bg-black/50 text-white backdrop-blur-sm">Original</span>
        <span className="absolute top-3 right-3 chip bg-accent-600/80 text-white backdrop-blur-sm">Segmentation</span>
      </div>
    </div>
  );
}
