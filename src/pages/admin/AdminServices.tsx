import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type ServiceItem = { icon: string; title: string; text: string };
type ServiceGroup = { id: string; label: string; lead: string; items: ServiceItem[] };
type ServicesData = {
  heading: { eyebrow: string; title: string; description: string };
  groups: ServiceGroup[];
};

const AdminServices = () => {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      <div className="mt-8 max-w-3xl space-y-8">
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
            <div className="grid gap-3 sm:grid-cols-2">
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

            <div className="space-y-3">
              {g.items.map((item, ii) => (
                <div key={ii} className="grid gap-3 border-t border-border/60 pt-3 sm:grid-cols-[110px_1fr_1.4fr]">
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
              ))}
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
