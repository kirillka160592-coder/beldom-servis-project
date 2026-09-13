import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { contentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type ServiceItem = { icon: string; title: string; text: string };
type ServiceGroup = { id: string; label: string; lead: string; items: ServiceItem[] };
type ServicesData = {
  heading: { eyebrow: string; title: string; description: string };
  groups: ServiceGroup[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '') || `group-${Date.now()}`;

const AdminServices = () => {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removeGroupIndex, setRemoveGroupIndex] = useState<number | null>(null);

  useEffect(() => {
    contentApi
      .get('services')
      .then((res) => setData(res.services as ServicesData))
      .catch(() => toast({ title: 'Не удалось загрузить раздел', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await contentApi.update('services', data);
      toast({ title: 'Раздел «Услуги» обновлён' });
    } catch {
      toast({ title: 'Не удалось сохранить', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Загрузка…</p>
      </AdminLayout>
    );
  }

  const updateGroup = (gi: number, patch: Partial<ServiceGroup>) => {
    const next = [...data.groups];
    next[gi] = { ...next[gi], ...patch };
    setData({ ...data, groups: next });
  };

  const updateItem = (gi: number, ii: number, patch: Partial<ServiceItem>) => {
    const next = [...data.groups];
    const items = [...next[gi].items];
    items[ii] = { ...items[ii], ...patch };
    next[gi] = { ...next[gi], items };
    setData({ ...data, groups: next });
  };

  const addGroup = () => {
    const label = 'Новая категория';
    const newGroup: ServiceGroup = {
      id: slugify(label + '-' + Date.now()),
      label,
      lead: 'Краткое описание категории услуг.',
      items: [],
    };
    setData({ ...data, groups: [...data.groups, newGroup] });
  };

  const confirmRemoveGroup = () => {
    if (removeGroupIndex == null) return;
    setData({ ...data, groups: data.groups.filter((_, i) => i !== removeGroupIndex) });
    setRemoveGroupIndex(null);
  };

  const addItem = (gi: number) => {
    const next = [...data.groups];
    next[gi] = {
      ...next[gi],
      items: [...next[gi].items, { icon: 'Wrench', title: 'Новая услуга', text: 'Описание услуги.' }],
    };
    setData({ ...data, groups: next });
  };

  const removeItem = (gi: number, ii: number) => {
    const next = [...data.groups];
    next[gi] = { ...next[gi], items: next[gi].items.filter((_, i) => i !== ii) };
    setData({ ...data, groups: next });
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[26px] uppercase tracking-tight">Услуги</h1>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="cut-btn inline-flex items-center gap-2 bg-primary px-6 py-3 font-display text-[13px] uppercase tracking-[0.08em] text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name="Save" size={16} />
          {saving ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </div>

      <div className="mt-6 max-w-3xl border border-accent/40 bg-accent/5 p-4 text-[13px] leading-relaxed text-muted-foreground">
        <p className="flex items-start gap-2">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-accent" />
          Название иконки берётся из библиотеки Lucide (например, Wrench, Home, Zap). Если название
          указано неверно, на сайте покажется иконка по умолчанию.
        </p>
      </div>

      <div className="mt-6 max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">Заголовок раздела</h2>
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Заголовок</Label>
            <Input
              value={data.heading.title}
              onChange={(e) => setData({ ...data, heading: { ...data.heading, title: e.target.value } })}
              className="h-11 rounded-none border-border bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Описание</Label>
            <Textarea
              rows={2}
              value={data.heading.description}
              onChange={(e) => setData({ ...data, heading: { ...data.heading, description: e.target.value } })}
              className="rounded-none border-border bg-background"
            />
          </div>
        </section>

        {data.groups.map((g, gi) => (
          <section key={g.id} className="space-y-4 border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Название вкладки</Label>
                  <Input
                    value={g.label}
                    onChange={(e) => updateGroup(gi, { label: e.target.value })}
                    className="h-10 rounded-none border-border bg-background text-[13px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Подзаголовок вкладки</Label>
                  <Input
                    value={g.lead}
                    onChange={(e) => updateGroup(gi, { lead: e.target.value })}
                    className="h-10 rounded-none border-border bg-background text-[13px]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemoveGroupIndex(gi)}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-border transition-colors hover:border-destructive hover:text-destructive"
                title="Удалить категорию"
              >
                <Icon name="Trash2" size={15} />
              </button>
            </div>

            <div className="space-y-3">
              {g.items.map((item, ii) => (
                <div key={ii} className="flex items-end gap-2 border-t border-border/60 pt-3">
                  <div className="grid flex-1 gap-3 sm:grid-cols-[110px_1fr_1.4fr]">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Иконка</Label>
                      <Input
                        value={item.icon}
                        onChange={(e) => updateItem(gi, ii, { icon: e.target.value })}
                        className="h-9 rounded-none border-border bg-background text-[12px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Заголовок</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(gi, ii, { title: e.target.value })}
                        className="h-9 rounded-none border-border bg-background text-[12px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Текст</Label>
                      <Input
                        value={item.text}
                        onChange={(e) => updateItem(gi, ii, { text: e.target.value })}
                        className="h-9 rounded-none border-border bg-background text-[12px]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(gi, ii)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-border transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem(gi)}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-accent transition-colors hover:text-foreground"
              >
                <Icon name="Plus" size={14} />
                Добавить услугу
              </button>
            </div>
          </section>
        ))}

        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center gap-2 border border-dashed border-border px-5 py-3 font-display text-[13px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Icon name="Plus" size={16} />
          Добавить категорию услуг
        </button>
      </div>

      <AlertDialog open={removeGroupIndex != null} onOpenChange={(o) => !o && setRemoveGroupIndex(null)}>
        <AlertDialogContent className="rounded-none border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию услуг?</AlertDialogTitle>
            <AlertDialogDescription>
              Вкладка и все услуги в ней будут удалены со страницы «Услуги» после сохранения.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveGroup} className="rounded-none bg-destructive">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminServices;
