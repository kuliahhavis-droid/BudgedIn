'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const COLORS = ['#22C55E', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export function IncomeExpenseBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(val) => `Rp${val / 1000}k`} />
        <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {[{ fill: '#22C55E' }, { fill: '#ef4444' }].map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(val: number) => formatCurrency(val)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendsLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(val) => `Rp${val / 1000}k`} />
        <Tooltip formatter={(val: number) => formatCurrency(val)} />
        <Legend />
        <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#22C55E" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
