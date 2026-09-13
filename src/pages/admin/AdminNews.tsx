import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { newsApi, uploadApi, type NewsItemApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import MediaPicker from '@/components/admin/MediaPicker';

const CATEGORIES = ['Работы', 'Отключения', 'Объявления', 'Отчёты'];

type FormState = {
  id?: number;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  bodyText: string;
  addresses: string;
  images: string[];
};

const emptyForm: FormState = {
  category: 'Объявления',
  date: new Date().toISOString().slice(0, 10),
  title: '',
  excerpt: '',
  bodyText: '',
  addresses: '',
  images: [],
};

const AdminNews = () => {
  const [items, setItems] = useState<NewsItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = () => {
    setLoading(true);
    newsApi
      .list()
      .then(setItems)
      .catch(() => toast({ title: 'Не удалось загрузить новости', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditorOpen(true);
  };

  const openEdit = (n: NewsItemApi) => {
    setForm({
      id: n.id,
      category: n.category,
      date: n.date,
      title: n.title,
      excerpt: n.excerpt,
      bodyText: n.body.join('\n\n'),
      addresses: n.addresses || '',
      images: n.images || [],
    });
    setEditorOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file);
      setForm((p) => ({ ...p, images: [...p.images, url] }));
    } catch {
      toast({ title: 'Не удалось загрузить фото', variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url: string) => {
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) }));
  };

  const save = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast({ title: 'Заполните заголовок и краткое описание', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      category: form.category,
      date: form.date,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body: form.bodyText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
      addresses: form.addresses.trim() || null,
      images: form.images,
    };
    try {
      if (form.id) {
        await newsApi.update({ id: form.id, ...payload });
      } else {
        await newsApi.create(payload);
      }
      toast({ title: form.id ? 'Новость обновлена' : 'Новость опубликована' });
      setEditorOpen(false);
      load();
    } catch {
      toast({ title: 'Не удалось сохранить новость', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await newsApi.remove(deleteId);
      toast({ title: 'Новость удалена' });
      load();
    } catch {
      toast({ title: 'Не удалось удалить новость', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[26px] uppercase tracking-tight">Новости</h1>
        <button
          type="button"
          onClick={openCreate}
          className="cut-btn inline-flex items-center gap-2 bg-primary px-6 py-3 font-display text-[13px] uppercase tracking-[0.08em] text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Icon name="Plus" size={16} />
          Добавить новость
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Загрузка…</p>
      ) : (
        <div className="mt-8 grid gap-px bg-border">
          {items.map((n) => (
            <div key={n.id} className="flex items-center gap-4 bg-card p-5">
              {n.images?.[0] ? (
                <img src={n.images[0]} alt="" className="h-16 w-20 shrink-0 object-cover" />
              ) : (
                <div className="flex h-16 w-20 shrink-0 items-center justify-center bg-background text-muted-foreground">
                  <Icon name="Image" size={20} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.1em] text-accent">
                  <span>{n.category}</span>
                  <span className="h-px w-4 bg-border" />
                  <span className="text-muted-foreground">{n.date}</span>
                </div>
                <h3 className="mt-1 truncate font-display text-[16px] uppercase tracking-tight">
                  {n.title}
                </h3>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(n)}
                  className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon name="Pencil" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(n.id)}
                  className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={15} />
                </button>
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="bg-card p-8 text-center text-muted-foreground">
              Пока нет ни одной новости
            </div>
          )}
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-[22px] uppercase tracking-tight">
              {form.id ? 'Редактировать новость' : 'Новая новость'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  Категория
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="h-11 rounded-none border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border bg-card">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  Дата
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="h-11 rounded-none border-border bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Заголовок
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="h-11 rounded-none border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Краткое описание (для карточки)
              </Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                className="rounded-none border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Полный текст (разделяйте абзацы пустой строкой)
              </Label>
              <Textarea
                id="body"
                rows={6}
                value={form.bodyText}
                onChange={(e) => setForm((p) => ({ ...p, bodyText: e.target.value }))}
                className="rounded-none border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addresses" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Адреса (необязательно)
              </Label>
              <Input
                id="addresses"
                value={form.addresses}
                onChange={(e) => setForm((p) => ({ ...p, addresses: e.target.value }))}
                placeholder="Ленина, 62 · 64 · 68"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Фотографии
              </Label>
              <div className="flex flex-wrap gap-3">
                {form.images.map((url) => (
                  <div key={url} className="group relative h-24 w-32">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Icon name="X" size={13} />
                    </button>
                  </div>
                ))}
                <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <Icon name={uploading ? 'Loader2' : 'Upload'} size={20} className={uploading ? 'animate-spin' : ''} />
                  <span className="text-[11px] uppercase tracking-[0.08em]">Загрузить</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex h-24 w-32 flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon name="Images" size={20} />
                  <span className="text-[11px] uppercase tracking-[0.08em]">Из библиотеки</span>
                </button>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Первое фото — обложка карточки. Все фото вместе — слайды галереи в новости.
              </p>
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="cut-btn w-full bg-primary px-8 py-4 font-display text-[15px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-none bg-destructive">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        imagesOnly
        onSelect={(item) => setForm((p) => ({ ...p, images: [...p.images, item.url] }))}
      />
    </AdminLayout>
  );
};

export default AdminNews;