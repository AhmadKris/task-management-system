import { Label } from '@/components/ui/label';

// pembungkus tipis: label + kontrol + pesan error di bawahnya
export function Field({ label, htmlFor, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
