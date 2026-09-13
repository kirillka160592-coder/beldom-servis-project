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
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { useCompany } from '@/hooks/use-company';
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
  const COMPANY = useCompany();
  const [form, setForm] = useState({ name: '', phone: '', address: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

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

  const field = (name: string) =>
    `rounded-none border-border bg-background h-12 text-[15px] focus-visible:ring-1 focus-visible:ring-primary ${
      errors[name] ? 'border-destructive' : ''
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
                { icon: 'PhoneCall', title: 'Аварийная служба', value: COMPANY.dispatchPhone, href: COMPANY.dispatchPhoneHref, internal: false },
                { icon: 'Mail', title: 'Электронная почта', value: COMPANY.email, href: `mailto:${COMPANY.email}`, internal: false },
                { icon: 'MapPin', title: 'Офис', value: COMPANY.address, href: '/contacts', internal: true },
              ].map((c) => {
                const content = (
                  <>
                    <Icon name={c.icon} fallback="Phone" size={20} className="text-primary" />
                    <span>
                      <span className="block text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                        {c.title}
                      </span>
                      <span className="mt-0.5 block text-[15px] text-foreground transition-colors group-hover:text-primary">
                        {c.value}
                      </span>
                    </span>
                  </>
                );
                const cls =
                  'group flex items-center gap-4 bg-card px-6 py-5 transition-colors hover:bg-background';
                return c.internal ? (
                  <Link key={c.title} to={c.href} className={cls}>
                    {content}
                  </Link>
                ) : (
                  <a key={c.title} href={c.href} className={cls}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="reveal bg-card p-6 sm:p-10">
            <div className="animate-fade-in">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;