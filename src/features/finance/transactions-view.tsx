'use client';

import { useMemo, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { money, transactions } from './sample-data';

const categories = ['All', 'Food', 'Transportation', 'Rent', 'Education', 'Entertainment', 'Shopping', 'Internet', 'Scholarship', 'Freelance', 'Family Support'];

export function TransactionsView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = useMemo(
    () =>
      transactions.filter((item) => {
        const matchesSearch = [item.title, item.description, item.category].join(' ').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || item.category === category;
        const matchesType = type === 'all' || item.type === type;
        return matchesSearch && matchesCategory && matchesType;
      }),
    [category, search, type]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input placeholder="Title" defaultValue="Campus bookstore" />
            <Input placeholder="Description" defaultValue="Lab supplies" />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Amount" defaultValue="32.50" />
              <select className="h-11 rounded-2xl border border-input bg-white px-3 text-sm">
                <option>expense</option>
                <option>income</option>
              </select>
            </div>
            <select className="h-11 rounded-2xl border border-input bg-white px-3 text-sm">
              {categories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
            </select>
            <Input type="date" defaultValue="2026-06-03" />
            <Button type="button">Save transaction</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Income and Expenses</CardTitle>
            <div className="flex gap-2">
              {(['all', 'income', 'expense'] as const).map((item) => (
                <Button key={item} size="sm" variant={type === item ? 'primary' : 'ghost'} onClick={() => setType(item)}>
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <Input placeholder="Search transactions" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-2xl border border-input bg-white px-3 text-sm">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {filtered.map((item) => (
              <div key={item.id} className="grid gap-2 border-b border-slate-100 bg-white p-4 last:border-b-0 md:grid-cols-[1fr_140px_120px] md:items-center">
                <div>
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description} · {item.date}</p>
                </div>
                <Badge variant={item.type === 'income' ? 'success' : 'neutral'}>{item.category}</Badge>
                <p className={`font-semibold md:text-right ${item.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {item.type === 'income' ? '+' : '-'}{money(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

