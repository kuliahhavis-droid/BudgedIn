'use client';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

export function ProfileView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardContent className="space-y-4 p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-white">AS</div>
          <div>
            <p className="text-xl font-semibold">Avery Student</p>
            <p className="text-sm text-slate-500">avery.student@university.edu</p>
          </div>
          <Badge variant="success">Supabase Auth connected</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input defaultValue="Avery Student" placeholder="Full name" />
            <Input defaultValue="avery.student@university.edu" placeholder="Email" type="email" />
            <Input placeholder="Avatar URL" />
            <div className="grid gap-3 md:grid-cols-2">
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm password" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button">Save profile</Button>
              <Button type="button" variant="secondary">Upload avatar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

