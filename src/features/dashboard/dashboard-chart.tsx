'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const fmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.dataKey === 'income' ? 'Pemasukan' : 'Pengeluaran'}: {fmt.format(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function DashboardChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="incGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="income" stroke="#22C55E" fill="url(#incGrad)" strokeWidth={2.5} />
        <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="url(#expGrad)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
