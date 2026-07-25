import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MetricsHistoryPoint } from '@/types';

interface ChartsProps {
  data: MetricsHistoryPoint[];
  dark: boolean;
}

const grid = (dark: boolean) => (dark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)');
const axis = (dark: boolean) => (dark ? '#64748b' : '#94a3b8');

function TooltipBox({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-glass text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Epoch {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}</span>
          <span className="font-mono font-semibold ml-auto">{p.value.toFixed(4)}{unit}</span>
        </p>
      ))}
    </div>
  );
}

export function LossChart({ data, dark }: ChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="valLossGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid(dark)} />
        <XAxis dataKey="epoch" stroke={axis(dark)} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke={axis(dark)} fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<TooltipBox />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="loss" name="Train Loss" stroke="#2563eb" strokeWidth={2} fill="url(#lossGrad)" />
        <Area type="monotone" dataKey="valLoss" name="Val Loss" stroke="#f43f5e" strokeWidth={2} fill="url(#valLossGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MetricsChart({ data, dark }: ChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid(dark)} />
        <XAxis dataKey="epoch" stroke={axis(dark)} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis domain={[0.5, 1]} stroke={axis(dark)} fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<TooltipBox />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="dice" name="Dice" stroke="#10b981" strokeWidth={2.4} dot={false} />
        <Line type="monotone" dataKey="iou" name="IoU" stroke="#2563eb" strokeWidth={2.4} dot={false} />
        <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#f59e0b" strokeWidth={2.4} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
