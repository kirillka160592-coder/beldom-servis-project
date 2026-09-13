import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type Doc = { title: string; url: string };
type Section = { id: string; title: string; text: string; docs: Doc[] };
type DisclosureData = {
  heading: { eyebrow: string; title: string; description: string };
  gisLink: string;
  sections: Section[];
};

const AdminDisclosure = () => {
  const [data, setData] = useState<DisclosureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contentApi
      .get('disclosure')
      .then((res) => setData(res.disclosure as DisclosureData))
      .catch(() => toast({ title: 'Не удалось загрузить раздел', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await contentApi.update('disclosure', data);
      toast({ title: 'Раздел «Раскрытие информации» обновлён' });
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

  const updateSection = (si: number, patch: Partial<Section>) => {
    const next = [...data.sections];
    next[si] = { ...next[si], ...patch };
    setData({ ...data, sections: next });
  };

  const updateDoc = (si: number, di: number, patch: Partial<Doc>) => {
    const next = [...data.sections];
    const docs = [...next[si].docs];
    docs[di] = { ...docs[di], ...patch };
    next[si] = { ...next[si], docs };
    setData({ ...data, sections: next });
  };

  const addDoc = (si: number) => {
    const next = [...data.sections];
    next[si] = { ...next[si], docs: [...next[si].docs, { title: 'Новый документ', url: '' }] };
    setData({ ...data, sections: next });
  };

  const removeDoc = (si: number, di: number) => {
    const next = [...data.sections];
    next[si] = { ...next[si], docs: next[si].docs.filter((_, i) => i !== di) };
    setData({ ...data, sections: next });
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[26px] uppercase tracking-tight">Раскрытие информации</h1>
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
          Чтобы документ открывался по клику, вставьте прямую ссылку на файл (например,
          опубликованную ссылку на Яндекс.Диск, Google Диск или файл в облаке). Если ссылку не
          указать, документ будет просто отображаться в списке названием.
        </p>
      </div>

      <div className="mt-6 max-w-3xl space-y-8">
        <section className="space-y-4">
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
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Ссылка на ГИС ЖКХ</Label>
            <Input
              value={data.gisLink}
              onChange={(e) => setData({ ...data, gisLink: e.target.value })}
              className="h-11 rounded-none border-border bg-background"
            />
          </div>
        </section>

        {data.sections.map((s, si) => (
          <section key={s.id} className="space-y-4 border border-border p-5">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Название раздела</Label>
              <Input
                value={s.title}
                onChange={(e) => updateSection(si, { title: e.target.value })}
                className="h-10 rounded-none border-border bg-background text-[13px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Описание</Label>
              <Textarea
                rows={2}
                value={s.text}
                onChange={(e) => updateSection(si, { text: e.target.value })}
                className="rounded-none border-border bg-background text-[13px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Документы</Label>
              {s.docs.map((d, di) => (
                <div key={di} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Название</Label>
                    <Input
                      value={d.title}
                      onChange={(e) => updateDoc(si, di, { title: e.target.value })}
                      className="h-9 rounded-none border-border bg-background text-[12px]"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Ссылка на файл (необязательно)</Label>
                    <Input
                      value={d.url}
                      onChange={(e) => updateDoc(si, di, { url: e.target.value })}
                      placeholder="https://…"
                      className="h-9 rounded-none border-border bg-background text-[12px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(si, di)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-border transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addDoc(si)}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-accent transition-colors hover:text-foreground"
              >
                <Icon name="Plus" size={14} />
                Добавить документ
              </button>
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDisclosure;
