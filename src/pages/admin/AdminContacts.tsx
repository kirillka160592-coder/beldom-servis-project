import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type CompanyData = {
  name: string;
  short: string;
  city: string;
  dispatchPhone: string;
  dispatchPhoneHref: string;
  officePhone: string;
  officePhoneHref: string;
  email: string;
  address: string;
  inn: string;
  ogrn: string;
};

type ContactsData = {
  heading: { eyebrow: string; title: string; description: string };
  schedule: [string, string][];
};

const AdminContacts = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [contacts, setContacts] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([contentApi.get('company'), contentApi.get('contacts')])
      .then(([c, ct]) => {
        setCompany(c.company as CompanyData);
        setContacts(ct.contacts as ContactsData);
      })
      .catch(() => toast({ title: 'Не удалось загрузить раздел', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!company || !contacts) return;
    setSaving(true);
    try {
      await Promise.all([
        contentApi.update('company', company),
        contentApi.update('contacts', contacts),
      ]);
      toast({ title: 'Контакты обновлены' });
    } catch {
      toast({ title: 'Не удалось сохранить', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !company || !contacts) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Загрузка…</p>
      </AdminLayout>
    );
  }

  const field = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="space-y-2">
      <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-none border-border bg-background"
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[26px] uppercase tracking-tight">Контакты и реквизиты</h1>
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
        <section className="grid gap-5 sm:grid-cols-2">
          {field('Полное название', company.name, (v) => setCompany({ ...company, name: v }))}
          {field('Короткое название', company.short, (v) => setCompany({ ...company, short: v }))}
          {field('Город', company.city, (v) => setCompany({ ...company, city: v }))}
          {field('Почта', company.email, (v) => setCompany({ ...company, email: v }))}
          {field('Аварийная служба (текст)', company.dispatchPhone, (v) => setCompany({ ...company, dispatchPhone: v }))}
          {field('Аварийная служба (tel: ссылка)', company.dispatchPhoneHref, (v) => setCompany({ ...company, dispatchPhoneHref: v }))}
          {field('Приёмная (текст)', company.officePhone, (v) => setCompany({ ...company, officePhone: v }))}
          {field('Приёмная (tel: ссылка)', company.officePhoneHref, (v) => setCompany({ ...company, officePhoneHref: v }))}
          {field('ИНН', company.inn, (v) => setCompany({ ...company, inn: v }))}
          {field('ОГРН', company.ogrn, (v) => setCompany({ ...company, ogrn: v }))}
        </section>
        <div className="space-y-2">
          <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Адрес</Label>
          <Textarea
            rows={2}
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            className="rounded-none border-border bg-background"
          />
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">Заголовок страницы «Контакты»</h2>
          {field('Рубрика', contacts.heading.eyebrow, (v) => setContacts({ ...contacts, heading: { ...contacts.heading, eyebrow: v } }))}
          {field('Заголовок', contacts.heading.title, (v) => setContacts({ ...contacts, heading: { ...contacts.heading, title: v } }))}
          <div className="space-y-2">
            <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Описание</Label>
            <Textarea
              rows={2}
              value={contacts.heading.description}
              onChange={(e) => setContacts({ ...contacts, heading: { ...contacts.heading, description: e.target.value } })}
              className="rounded-none border-border bg-background"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[16px] uppercase tracking-tight text-accent">График приёма жителей</h2>
          {contacts.schedule.map(([k, v], i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Input
                value={k}
                onChange={(e) => {
                  const next: [string, string][] = [...contacts.schedule];
                  next[i] = [e.target.value, next[i][1]];
                  setContacts({ ...contacts, schedule: next });
                }}
                className="h-10 rounded-none border-border bg-background text-[13px]"
              />
              <Input
                value={v}
                onChange={(e) => {
                  const next: [string, string][] = [...contacts.schedule];
                  next[i] = [next[i][0], e.target.value];
                  setContacts({ ...contacts, schedule: next });
                }}
                className="h-10 rounded-none border-border bg-background text-[13px]"
              />
            </div>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
