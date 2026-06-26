'use client';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { money, savingsGoals } from './sample-data';

export function GoalsView() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.3fr]">
      <Card>
        <CardHeader><CardTitle>Create Savings Goal</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input placeholder="Goal name" defaultValue="Certification exam" />
            <Input placeholder="Description" defaultValue="Exam fee and prep materials" />
            <div className="grid grid-cols-2 gap-3"><Input type="number" defaultValue="350" /><Input type="number" defaultValue="40" /></div>
            <Input type="date" defaultValue="2026-10-30" />
            <select className="h-11 rounded-2xl border border-input bg-white px-3 text-sm"><option>graduation-cap</option><option>laptop</option><option>shield</option></select>
            <Button type="button">Create goal</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {savingsGoals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <Card key={goal.id}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-lg font-semibold">{goal.name}</p><p className="text-sm text-slate-500">{goal.description}</p></div>
                  <Badge variant={progress >= 100 ? 'success' : 'neutral'}>{progress >= 100 ? 'Completed' : 'Active'}</Badge>
                </div>
                <Progress value={Math.min(progress, 100)} />
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                  <span>{money(goal.current)} of {money(goal.target)}</span>
                  <span>Target {goal.targetDate}</span>
                </div>
                <div className="flex gap-2"><Input type="number" placeholder="Contribution" className="max-w-48" /><Button type="button" size="sm">Add contribution</Button></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

