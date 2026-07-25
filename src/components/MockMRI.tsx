import { motion } from 'framer-motion';

interface MockMRIProps {
  variant: 'original' | 'enhanced' | 'segmentation';
  seed?: number;
  scan?: boolean;
  className?: string;
}

// Deterministic pseudo-random based on seed
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function MockMRI({ variant, seed = 7, scan = false, className = '' }: MockMRIProps) {
  const rand = rng(seed + variant.length);
  const cx = 100 + (rand() - 0.5) * 18;
  const cy = 105 + (rand() - 0.5) * 14;
  const r = 16 + rand() * 10;

  const isSeg = variant === 'segmentation';
  const isEnh = variant === 'enhanced';

  const baseFill = isSeg ? '#0f172a' : isEnh ? '#1e293b' : '#374151';
  const tissueTone = isSeg ? '#0b1220' : isEnh ? '#cbd5e1' : '#9ca3af';

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`brain-${variant}-${seed}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={isSeg ? '#1e293b' : isEnh ? '#e2e8f0' : '#6b7280'} />
            <stop offset="70%" stopColor={baseFill} />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id={`tumor-${variant}-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isSeg ? '#10b981' : '#f43f5e'} stopOpacity="0.95" />
            <stop offset="60%" stopColor={isSeg ? '#059669' : '#be123c'} stopOpacity="0.6" />
            <stop offset="100%" stopColor={isSeg ? '#065f46' : '#881337'} stopOpacity="0" />
          </radialGradient>
          <filter id={`noise-${variant}-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope={isEnh ? 0.12 : 0.22} />
            </feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Background skull */}
        <rect width="200" height="200" fill="#020617" />
        <ellipse cx="100" cy="105" rx="78" ry="86" fill={`url(#brain-${variant}-${seed})`} />

        {/* Brain folds (gyri/sulci) */}
        <g stroke={tissueTone} strokeWidth="1.1" fill="none" opacity={isSeg ? 0.18 : isEnh ? 0.55 : 0.35}>
          <path d="M40,80 Q60,60 80,85 Q100,60 120,85 Q140,60 160,85" />
          <path d="M45,105 Q70,85 95,110 Q120,85 145,110 Q160,100 165,115" />
          <path d="M50,130 Q75,115 100,135 Q125,115 150,135" />
          <path d="M70,60 Q75,90 70,120 Q75,150 80,170" />
          <path d="M100,55 Q105,90 100,125 Q105,160 100,175" />
          <path d="M130,60 Q125,90 130,120 Q125,150 120,170" />
          <path d="M55,150 Q80,140 100,160 Q120,140 145,155" />
        </g>

        {/* Ventricles */}
        <g fill={isSeg ? '#0f172a' : isEnh ? '#1e293b' : '#1f2937'} opacity="0.7">
          <path d="M88,100 Q92,92 100,95 Q108,92 112,100 Q108,108 100,106 Q92,108 88,100 Z" />
          <ellipse cx="100" cy="100" rx="3" ry="6" />
        </g>

        {/* Tumor region */}
        {!isSeg && (
          <g>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85} fill={`url(#tumor-${variant}-${seed})`} opacity={isEnh ? 0.9 : 0.7} />
            <ellipse cx={cx} cy={cy} rx={r * 0.5} ry={r * 0.42} fill={isEnh ? '#fecdd3' : '#fda4af'} opacity="0.5" />
          </g>
        )}

        {/* Segmentation overlay */}
        {isSeg && (
          <g>
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={r}
              ry={r * 0.85}
              fill="#10b981"
              fillOpacity="0.55"
              stroke="#34d399"
              strokeWidth="1.2"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={r * 1.25}
              ry={r * 1.05}
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="0.8"
              strokeDasharray="3 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Noise texture */}
        <rect width="200" height="200" filter={`url(#noise-${variant}-${seed})`} opacity={isEnh ? 0.3 : 0.5} />

        {/* Scale marker */}
        <g fill={isSeg ? '#64748b' : '#94a3b8'} fontSize="6" fontFamily="monospace">
          <rect x="14" y="180" width="20" height="2" />
          <text x="14" y="178">2cm</text>
        </g>
      </svg>

      {scan && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-glow"
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="absolute top-2 left-2 chip bg-black/40 text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        {isSeg ? 'SEG' : isEnh ? 'ENH' : 'ORG'}
      </div>
    </div>
  );
}
