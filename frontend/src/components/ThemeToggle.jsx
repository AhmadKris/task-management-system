import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/features/theme/ThemeProvider';

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Ganti tema">
      {resolved === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
