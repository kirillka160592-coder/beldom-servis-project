import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type AboutData = {
  heading: { eyebrow: string; title: string };
  paragraphs: string[];
  principles: { icon: string; title: string; text: string }[];
  stats: { value: string; unit: string; label: string }[];
  schedule: [string, string][];
  scheduleNote: string;
};

const AdminAbout = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contentApi
      .get('about')
      .then((res) => setData(res.about as AboutData))
      .catch(() => toast({ title: 'Не удалось загрузить раздел', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await contentApi.update('about', data);
      toast({ title: 'Раздел «О компании» обновлён' });
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

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[26px] uppercase tracking-tight">О компании</h1>
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
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Рубрика (eyebrow)</Label>
            <Input
              value={data.heading.eyebrow}
              onChange={(e) => setData({ ...data, heading: { ...data.heading, eyebrow: e.target.value } })}
              className="h-11 rounded-none border-border bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Заголовок</Label>
            <Input
              value={data.heading.title}
              onChange={(e) => setData({ ...data, heading: { ...data.heading, title: e.target.value } })}
              className="h-11 rounded-none border-border bg-background"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">Текст о компании</h2>
          {data.paragraphs.map((p, i) => (
            <Textarea
              key={i}
              rows={3}
              value={p}
              onChange={(e) => {
                const next = [...data.paragraphs];
                next[i] = e.target.value;
                setData({ ...data, paragraphs: next });
              }}
              className="rounded-none border-border bg-background"
            />
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">Принципы работы</h2>
          {data.principles.map((p, i) => (
            <div key={i} className="grid gap-3 border border-border p-4 sm:grid-cols-[140px_1fr]">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Иконка</Label>
                <Input
                  value={p.icon}
                  onChange={(e) => {
                    const next = [...data.principles];
                    next[i] = { ...next[i], icon: e.target.value };
                    setData({ ...data, principles: next });
                  }}
                  className="h-10 rounded-none border-border bg-background text-[13px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Заголовок</Label>
                <Input
                  value={p.title}
                  onChange={(e) => {
                    const next = [...data.principles];
                    next[i] = { ...next[i], title: e.target.value };
                    setData({ ...data, principles: next });
                  }}
                  className="h-10 rounded-none border-border bg-background text-[13px]"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Текст</Label>
                <Textarea
                  rows={2}
                  value={p.text}
                  onChange={(e) => {
                    const next = [...data.principles];
                    next[i] = { ...next[i], text: e.target.value };
                    setData({ ...data, principles: next });
                  }}
                  className="rounded-none border-border bg-background text-[13px]"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">Статистика</h2>
          {data.stats.map((s, i) => (
            <div key={i} className="grid gap-3 border border-border p-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Значение</Label>
                <Input
                  value={s.value}
                  onChange={(e) => {
                    const next = [...data.stats];
                    next[i] = { ...next[i], value: e.target.value };
                    setData({ ...data, stats: next });
                  }}
                  className="h-10 rounded-none border-border bg-background text-[13px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Единица</Label>
                <Input
                  value={s.unit}
                  onChange={(e) => {
                    const next = [...data.stats];
                    next[i] = { ...next[i], unit: e.target.value };
                    setData({ ...data, stats: next });
                  }}
                  className="h-10 rounded-none border-border bg-background text-[13px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Подпись</Label>
                <Input
                  value={s.label}
                  onChange={(e) => {
                    const next = [...data.stats];
                    next[i] = { ...next[i], label: e.target.value };
                    setData({ ...data, stats: next });
                  }}
                  className="h-10 rounded-none border-border bg-background text-[13px]"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">График приёма</h2>
          {data.schedule.map(([k, v], i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Input
                value={k}
                onChange={(e) => {
                  const next: [string, string][] = [...data.schedule];
                  next[i] = [e.target.value, next[i][1]];
                  setData({ ...data, schedule: next });
                }}
                className="h-10 rounded-none border-border bg-background text-[13px]"
              />
              <Input
                value={v}
                onChange={(e) => {
                  const next: [string, string][] = [...data.schedule];
                  next[i] = [next[i][0], e.target.value];
                  setData({ ...data, schedule: next });
                }}
                className="h-10 rounded-none border-border bg-background text-[13px]"
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Примечание</Label>
            <Textarea
              rows={2}
              value={data.scheduleNote}
              onChange={(e) => setData({ ...data, scheduleNote: e.target.value })}
              className="rounded-none border-border bg-background"
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminAbout;
