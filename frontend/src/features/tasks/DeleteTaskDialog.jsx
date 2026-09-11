import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DeleteTaskDialog({ task, onOpenChange, onConfirm, pending }) {
  return (
    <AlertDialog open={Boolean(task)} onOpenChange={(o) => !o && onOpenChange(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus tugas?</AlertDialogTitle>
          <AlertDialogDescription>
            Tugas &ldquo;{task?.title}&rdquo; akan dihapus permanen. Tindakan ini tidak bisa
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              onConfirm(task);
            }}
          >
            {pending ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
