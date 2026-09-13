import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
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
import { uploadApi, type MediaItem } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminMedia = () => {
  const { login } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    uploadApi
      .list()
      .then(setItems)
      .catch(() => toast({ title: 'Не удалось загрузить библиотеку', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (login) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadApi.upload(file);
      }
      toast({ title: files.length > 1 ? 'Изображения загружены' : 'Изображение загружено' });
      load();
    } catch {
      toast({ title: 'Не удалось загрузить файл', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Ссылка скопирована' });
    } catch {
      toast({ title: 'Не удалось скопировать', description: url, variant: 'destructive' });
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await uploadApi.remove(deleteId);
      toast({ title: 'Изображение удалено из библиотеки' });
      load();
    } catch {
      toast({ title: 'Не удалось удалить', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = items.filter((i) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (i.filename || '').toLowerCase().includes(q) || (i.label || '').toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] uppercase tracking-tight">Медиабиблиотека</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Изображения для вставки в новости, услуги, документы и другие разделы сайта. Этот раздел виден только в админке.
          </p>
        </div>
        <label className="cut-btn inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 font-display text-[13px] uppercase tracking-[0.08em] text-primary-foreground transition-transform hover:-translate-y-0.5">
          <Icon name={uploading ? 'Loader2' : 'Upload'} size={16} className={uploading ? 'animate-spin' : ''} />
          {uploading ? 'Загружаем…' : 'Загрузить изображения'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6 max-w-sm">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени файла…"
          className="h-11 rounded-none border-border bg-background"
        />
      </div>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-card">
              <div className="aspect-square w-full overflow-hidden bg-background">
                <img
                  src={item.url}
                  alt={item.filename || ''}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-[12px] text-muted-foreground" title={item.filename || ''}>
                  {item.filename || 'без имени'}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="flex flex-1 items-center justify-center gap-1.5 border border-border py-2 text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon name="Copy" size={13} />
                    Ссылка
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-border transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="col-span-full bg-card p-8 text-center text-muted-foreground">
              {items.length ? 'Ничего не найдено' : 'В библиотеке пока нет изображений — загрузите первое'}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 max-w-2xl border border-accent/40 bg-accent/5 p-4 text-[13px] leading-relaxed text-muted-foreground">
        <p className="flex items-start gap-2">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-accent" />
          Загрузите изображение сюда один раз, скопируйте ссылку кнопкой «Ссылка» и вставьте её в
          нужное поле — например, в фото новости или документ раздела «Раскрытие информации».
        </p>
      </div>

      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить изображение из библиотеки?</AlertDialogTitle>
            <AlertDialogDescription>
              Ссылка перестанет отображаться здесь. Если она уже используется на сайте — картинка
              там может пропасть.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-none bg-destructive">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminMedia;