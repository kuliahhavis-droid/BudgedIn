'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { budgetStatus, budgets, money } from './sample-data';

export function BudgetsView() {
  const totalBudget = budgets.reduce((sum, item) => sum + item.allocated, 0);
  const totalUsed = budgets.reduce((sum, item) => sum + item.used, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Total Budget</p><p className="text-3xl font-semibold">{money(totalBudget)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Used</p><p className="text-3xl font-semibold text-warning">{money(totalUsed)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Remaining</p><p className="text-3xl font-semibold text-success">{money(totalBudget - totalUsed)}</p></CardContent></Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.3fr]">
        <Card>
          <CardHeader><CardTitle>Monthly Budget</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid grid-cols-2 gap-3"><Input type="number" defaultValue="6" /><Input type="number" defaultValue="2026" /></div>
              <Input type="number" defaultValue={totalBudget} />
              <Button type="button">Save budget</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={budgets}><CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="allocated" fill="#22C55E" radius={[6, 6, 0, 0]} /><Bar dataKey="used" fill="#F59E0B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Budget Categories</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {budgets.map((item) => {
            const percentage = (item.used / item.allocated) * 100;
            const status = budgetStatus(percentage);
            return (
              <div key={item.category} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between"><p className="font-medium">{item.category}</p><Badge variant={status.variant}>{status.label}</Badge></div>
                <Progress value={Math.min(percentage, 100)} />
                <p className="mt-2 text-sm text-slate-500">{money(item.used)} used of {money(item.allocated)} · {Math.round(percentage)}%</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

