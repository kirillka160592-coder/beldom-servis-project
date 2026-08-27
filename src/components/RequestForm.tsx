import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { COMPANY } from '@/data/company';
import { toast } from '@/hooks/use-toast';

const TOPICS = [
  'Сантехника (течь, засор, стояк)',
  'Электрика (нет света, щиток)',
  'Отопление (холодные батареи)',
  'Кровля и подъезд',
  'Уборка и территория',
  'Начисления и квитанция',
  'Другое',
];

type Errors = Record<string, string>;

const RequestForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const [meters, setMeters] = useState({ account: '', cold: '', hot: '', power: '' });
  const [meterErrors, setMeterErrors] = useState<Errors>({});
  const [metersSent, setMetersSent] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Укажите имя, как к вам обращаться';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) e.phone = 'Телефон должен содержать не менее 10 цифр';
    if (form.address.trim().length < 5) e.address = 'Укажите улицу, дом и квартиру';
    if (!form.topic) e.topic = 'Выберите тему обращения';
    if (form.message.trim().length < 10) e.message = 'Опишите проблему подробнее (от 10 символов)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    toast({
      title: 'Заявка принята',
      description: `Номер заявки № ${Math.floor(1000 + Math.random() * 9000)}. Диспетчер перезвонит.`,
    });
  };

  const submitMeters = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (meters.account.trim().length < 4) e.account = 'Введите номер лицевого счёта';
    const numeric = (v: string) => v === '' || /^\d+([.,]\d{1,3})?$/.test(v.trim());
    if (!numeric(meters.cold)) e.cold = 'Только цифры';
    if (!numeric(meters.hot)) e.hot = 'Только цифры';
    if (!numeric(meters.power)) e.power = 'Только цифры';
    if (!meters.cold && !meters.hot && !meters.power) e.cold = 'Заполните хотя бы одно показание';
    setMeterErrors(e);
    if (Object.keys(e).length) return;
    setMetersSent(true);
    toast({ title: 'Показания переданы', description: 'Они попадут в квитанцию текущего месяца.' });
  };

  const field = (name: string) =>
    `rounded-none border-border bg-background h-12 text-[15px] focus-visible:ring-1 focus-visible:ring-primary ${
      errors[name] || meterErrors[name] ? 'border-destructive' : ''
    }`;

  return (
    <section id="request" className="border-b border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              index="05"
              eyebrow="Приём заявок"
              title={
                <>
                  Опишите проблему —<br />
                  <em className="not-italic text-primary">мы приедем</em>
                </>
              }
              description="Заявку можно оставить здесь, позвонить диспетчеру или прийти в офис. Аварийные обращения принимаются круглосуточно."
            />

            <div className="reveal mt-10 space-y-px bg-border">
              {[
                { icon: 'PhoneCall', title: 'Аварийная служба', value: COMPANY.dispatchPhone, href: COMPANY.dispatchPhoneHref },
                { icon: 'Mail', title: 'Электронная почта', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
                { icon: 'MapPin', title: 'Офис', value: COMPANY.address, href: '#contacts' },
              ].map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  className="group flex items-center gap-4 bg-card px-6 py-5 transition-colors hover:bg-background"
                >
                  <Icon name={c.icon} fallback="Phone" size={20} className="text-primary" />
                  <span>
                    <span className="block text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-[15px] text-foreground transition-colors group-hover:text-primary">
                      {c.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="reveal bg-card p-6 sm:p-10">
            <Tabs defaultValue="request">
              <TabsList className="mb-8 flex h-auto w-full gap-2 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="request"
                  className="flex-1 rounded-none border border-border bg-background px-4 py-3 font-display text-[13px] uppercase tracking-[0.1em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                >
                  Заявка на ремонт
                </TabsTrigger>
                <TabsTrigger
                  value="meters"
                  className="flex-1 rounded-none border border-border bg-background px-4 py-3 font-display text-[13px] uppercase tracking-[0.1em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                >
                  Показания счётчиков
                </TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="animate-fade-in">
                {sent ? (
                  <div className="flex flex-col items-start gap-4 border border-primary/40 bg-background p-8">
                    <Icon name="CheckCircle2" size={34} className="text-accent" />
                    <h3 className="font-display text-[24px] uppercase leading-tight tracking-tight">
                      Заявка принята
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      Диспетчер свяжется с вами по номеру {form.phone} и согласует время визита
                      мастера. Аварийные заявки выполняются в течение двух часов.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setForm({ name: '', phone: '', address: '', topic: '', message: '' });
                      }}
                      className="mt-2 font-display text-[13px] uppercase tracking-[0.1em] text-primary hover:text-foreground"
                    >
                      Оставить ещё одну заявку
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                          Ваше имя
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => set('name')(e.target.value)}
                          placeholder="Иван Петрович"
                          className={field('name')}
                        />
                        {errors.name && <p className="text-[13px] text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => set('phone')(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                          className={field('phone')}
                        />
                        {errors.phone && <p className="text-[13px] text-destructive">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                        Адрес
                      </Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => set('address')(e.target.value)}
                        placeholder="ул. Ленина, д. 68, кв. 12"
                        className={field('address')}
                      />
                      {errors.address && <p className="text-[13px] text-destructive">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                        Тема обращения
                      </Label>
                      <Select value={form.topic} onValueChange={set('topic')}>
                        <SelectTrigger
                          className={`h-12 rounded-none border-border bg-background text-[15px] ${
                            errors.topic ? 'border-destructive' : ''
                          }`}
                        >
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border bg-card">
                          {TOPICS.map((t) => (
                            <SelectItem key={t} value={t} className="text-[15px]">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.topic && <p className="text-[13px] text-destructive">{errors.topic}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                        Что случилось
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => set('message')(e.target.value)}
                        placeholder="Опишите проблему: где, когда, что происходит"
                        className={`rounded-none border-border bg-background text-[15px] focus-visible:ring-1 focus-visible:ring-primary ${
                          errors.message ? 'border-destructive' : ''
                        }`}
                      />
                      {errors.message && <p className="text-[13px] text-destructive">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="cut-btn w-full bg-primary px-8 py-4 font-display text-[15px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                    >
                      Отправить заявку
                    </button>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Отправляя форму, вы соглашаетесь на обработку персональных данных.
                    </p>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="meters" className="animate-fade-in">
                {metersSent ? (
                  <div className="flex flex-col items-start gap-4 border border-primary/40 bg-background p-8">
                    <Icon name="CheckCircle2" size={34} className="text-accent" />
                    <h3 className="font-display text-[24px] uppercase leading-tight tracking-tight">
                      Показания приняты
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      Лицевой счёт {meters.account}. Данные учтены в начислениях за текущий месяц.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMetersSent(false);
                        setMeters({ account: '', cold: '', hot: '', power: '' });
                      }}
                      className="mt-2 font-display text-[13px] uppercase tracking-[0.1em] text-primary hover:text-foreground"
                    >
                      Передать ещё раз
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitMeters} noValidate className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="account" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                        Лицевой счёт
                      </Label>
                      <Input
                        id="account"
                        value={meters.account}
                        onChange={(e) => {
                          setMeters((p) => ({ ...p, account: e.target.value }));
                          setMeterErrors((p) => ({ ...p, account: '' }));
                        }}
                        placeholder="Например, 04512377"
                        className={field('account')}
                      />
                      {meterErrors.account && (
                        <p className="text-[13px] text-destructive">{meterErrors.account}</p>
                      )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                      {[
                        { key: 'cold' as const, label: 'ХВС, м³', icon: 'Droplet' },
                        { key: 'hot' as const, label: 'ГВС, м³', icon: 'Flame' },
                        { key: 'power' as const, label: 'Электро, кВт·ч', icon: 'Zap' },
                      ].map((m) => (
                        <div key={m.key} className="space-y-2">
                          <Label
                            htmlFor={m.key}
                            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                          >
                            <Icon name={m.icon} fallback="Gauge" size={14} className="text-primary" />
                            {m.label}
                          </Label>
                          <Input
                            id={m.key}
                            inputMode="decimal"
                            value={meters[m.key]}
                            onChange={(e) => {
                              setMeters((p) => ({ ...p, [m.key]: e.target.value }));
                              setMeterErrors((p) => ({ ...p, [m.key]: '' }));
                            }}
                            placeholder="0000"
                            className={field(m.key)}
                          />
                          {meterErrors[m.key] && (
                            <p className="text-[13px] text-destructive">{meterErrors[m.key]}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="cut-btn w-full bg-primary px-8 py-4 font-display text-[15px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                    >
                      Передать показания
                    </button>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Показания принимаются с 20 по 25 число каждого месяца.
                    </p>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;
