import { CheckCircle2 } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">TugasKu</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
