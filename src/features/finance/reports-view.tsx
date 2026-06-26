'use client';

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { budgets, money, transactions } from './sample-data';

const trend = [
  { month: 'Feb', income: 1040, expense: 720 },
  { month: 'Mar', income: 980, expense: 760 },
  { month: 'Apr', income: 1280, expense: 820 },
  { month: 'May', income: 1140, expense: 860 },
  { month: 'Jun', income: 1810, expense: 770 }
];

const pie = budgets.map((item) => ({ name: item.category, value: item.used }));
const colors = ['#22C55E', '#16A34A', '#10B981', '#F59E0B', '#EF4444', '#0F172A', '#38BDF8'];

export function ReportsView() {
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const csv = ['date,title,type,category,amount', ...transactions.map((item) => [item.date, item.title, item.type, item.category, item.amount].join(','))].join('\n');

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Income</p><p className="text-2xl font-semibold text-success">{money(income)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Expense</p><p className="text-2xl font-semibold text-danger">{money(expense)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Savings</p><p className="text-2xl font-semibold">{money(income - expense)}</p></CardContent></Card>
        <Card><CardContent className="flex h-full items-center gap-2 p-6"><Button type="button" onClick={() => window.print()}>Export PDF</Button><Button type="button" variant="secondary" onClick={() => navigator.clipboard.writeText(csv)}>Copy CSV</Button></CardContent></Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader><CardContent className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="income" stroke="#22C55E" fill="#22C55E33" /><Area dataKey="expense" stroke="#EF4444" fill="#EF444433" /></AreaChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader><CardContent className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip /><Pie data={pie} dataKey="value" nameKey="name" innerRadius={58} outerRadius={105}>{pie.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
      </section>
    </div>
  );
}

