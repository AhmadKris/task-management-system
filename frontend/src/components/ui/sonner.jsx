import { Toaster as Sonner } from 'sonner';
import { useTheme } from '@/features/theme/ThemeProvider';

export function Toaster(props) {
  const { resolved } = useTheme();
  return (
    <Sonner
      theme={resolved}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border border-border shadow-lg',
        },
      }}
      {...props}
    />
  );
}
