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

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const DOC_ICON: Record<string, string> = {
  'application/pdf': 'FileText',
  'application/msword': 'FileType2',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileType2',
  'application/vnd.ms-excel': 'FileSpreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'FileSpreadsheet',
};

const DOC_LABEL: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
};

const isImage = (contentType: string | null) => !!contentType && IMAGE_TYPES.includes(contentType);

const ACCEPT =
  'image/png,image/jpeg,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const AdminMedia = () => {
  const { login } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'images' | 'docs'>('all');
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
      let rejected = 0;
      for (const file of Array.from(files)) {
        const supported = ACCEPT.split(',').includes(file.type);
        if (!supported) {
          rejected += 1;
          continue;
        }
        await uploadApi.upload(file);
      }
      if (rejected) {
        toast({
          title: 'Часть файлов не загружена',
          description: 'Поддерживаются изображения, PDF, Word и Excel',
          variant: 'destructive',
        });
      } else {
        toast({ title: files.length > 1 ? 'Файлы загружены' : 'Файл загружен' });
      }
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
      toast({ title: 'Файл удалён из библиотеки' });
      load();
    } catch {
      toast({ title: 'Не удалось удалить', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = items.filter((i) => {
    if (filter === 'images' && !isImage(i.contentType)) return false;
    if (filter === 'docs' && isImage(i.contentType)) return false;
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
            Изображения и документы (PDF, Word, Excel) для вставки в новости, услуги, раскрытие
            информации и другие разделы сайта. Этот раздел виден только в админке.
          </p>
        </div>
        <label className="cut-btn inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 font-display text-[13px] uppercase tracking-[0.08em] text-primary-foreground transition-transform hover:-translate-y-0.5">
          <Icon name={uploading ? 'Loader2' : 'Upload'} size={16} className={uploading ? 'animate-spin' : ''} />
          {uploading ? 'Загружаем…' : 'Загрузить файлы'}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="max-w-sm flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени файла…"
            className="h-11 rounded-none border-border bg-background"
          />
        </div>
        <div className="flex gap-px bg-border">
          {[
            { key: 'all' as const, label: 'Все' },
            { key: 'images' as const, label: 'Изображения' },
            { key: 'docs' as const, label: 'Документы' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2.5 font-display text-[12px] uppercase tracking-[0.08em] transition-colors ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-card">
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-background">
                {isImage(item.contentType) ? (
                  <img
                    src={item.url}
                    alt={item.filename || ''}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Icon name={DOC_ICON[item.contentType || ''] || 'File'} fallback="File" size={40} />
                    <span className="font-display text-[11px] uppercase tracking-[0.1em]">
                      {DOC_LABEL[item.contentType || ''] || 'Файл'}
                    </span>
                  </div>
                )}
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
              {items.length ? 'Ничего не найдено' : 'В библиотеке пока нет файлов — загрузите первый'}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 max-w-2xl border border-accent/40 bg-accent/5 p-4 text-[13px] leading-relaxed text-muted-foreground">
        <p className="flex items-start gap-2">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-accent" />
          Загрузите файл сюда один раз, скопируйте ссылку кнопкой «Ссылка» и вставьте её в нужное
          поле — например, в фото новости или в документ раздела «Раскрытие информации».
        </p>
      </div>

      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить файл из библиотеки?</AlertDialogTitle>
            <AlertDialogDescription>
              Ссылка перестанет отображаться здесь. Если она уже используется на сайте — файл там
              может перестать открываться.
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
