import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export function FeaturePlaceholder({
  title,
  description,
  ctaLabel = 'Back to Dashboard',
  ctaHref = '/dashboard'
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            This route is wired and ready for the module implementation that will connect the UI to the backend service layer.
          </div>
          <Button asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Implementation notes</CardTitle>
          <CardDescription>What this page will eventually include</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Responsive mobile-first layout</li>
            <li>TanStack Query-powered data fetching</li>
            <li>Zod-validated forms and mutations</li>
            <li>Offline-ready state handling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
