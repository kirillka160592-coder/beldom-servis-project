import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type NewsItem = {
  id: number;
  category: 'Работы' | 'Отключения' | 'Объявления' | 'Отчёты';
  date: string;
  dateLabel: string;
  title: string;
  excerpt: string;
  body: string[];
  addresses?: string;
};

const NEWS: NewsItem[] = [
  {
    id: 1,
    category: 'Отключения',
    date: '2026-08-24',
    dateLabel: '24 августа 2026',
    title: 'Плановое отключение горячей воды на Ленина, 62–70',
    excerpt:
      'С 26 по 28 августа проводим замену участка розлива ГВС. Холодная вода и отопление работают в обычном режиме.',
    body: [
      'С 26 по 28 августа с 09:00 до 18:00 будет отключено горячее водоснабжение в домах по ул. Ленина, 62, 64, 68, 70.',
      'Причина — замена изношенного участка розлива горячей воды в подвальных помещениях. Работы выполняются собственной бригадой, подача возобновляется вечером каждого дня после опрессовки.',
      'Если после включения из крана идёт мутная или ржавая вода — дайте стечь 3–5 минут. Если ситуация не изменилась, оставьте заявку в диспетчерской.',
    ],
    addresses: 'Ленина, 62 · 64 · 68 · 70',
  },
  {
    id: 2,
    category: 'Работы',
    date: '2026-08-18',
    dateLabel: '18 августа 2026',
    title: 'Завершён ремонт кровли на Косоротова, 11',
    excerpt:
      'Заменено 340 м² мягкой кровли, обновлены примыкания и воронки внутреннего водостока.',
    body: [
      'Бригада кровельщиков завершила капитальный ремонт мягкой кровли дома по ул. Косоротова, 11. Заменено 340 м² покрытия, восстановлены примыкания к вентшахтам и парапетам, прочищены воронки внутреннего водостока.',
      'Работы приняты советом дома, акт подписан. Гарантия на выполненные работы — 5 лет.',
      'Собственникам верхних этажей, у которых ранее фиксировались протечки, просим сообщить о состоянии потолков после первых дождей.',
    ],
    addresses: 'Косоротова, 11',
  },
  {
    id: 3,
    category: 'Объявления',
    date: '2026-08-12',
    dateLabel: '12 августа 2026',
    title: 'Подготовка к отопительному сезону: доступ в подвалы и квартиры',
    excerpt:
      'До 10 сентября проводим опрессовку и промывку систем отопления. Просим обеспечить доступ к стоякам.',
    body: [
      'До 10 сентября во всех домах в управлении проводятся гидравлические испытания и промывка систем отопления — это обязательный этап подготовки к зиме.',
      'Просим собственников обеспечить доступ к стоякам отопления в квартирах. Если стояк зашит коробом или мебелью, заранее сообщите в диспетчерскую — мастер согласует удобное время.',
      'График по каждому дому вывешен на информационных стендах в подъездах.',
    ],
  },
  {
    id: 4,
    category: 'Отчёты',
    date: '2026-07-30',
    dateLabel: '30 июля 2026',
    title: 'Отчёты по домам за первое полугодие 2026 года',
    excerpt:
      'Опубликованы отчёты о доходах и расходах: сколько собрано, на что израсходовано, что запланировано.',
    body: [
      'В разделе «Раскрытие информации» опубликованы отчёты об исполнении договора управления за первое полугодие 2026 года по каждому дому.',
      'В отчёте указано: начислено и собрано за содержание жилья, перечень выполненных работ с суммами, остаток средств на конец периода и план работ на второе полугодие.',
      'Замечания и предложения по отчёту принимаются от совета дома в письменном виде в течение 30 дней.',
    ],
  },
  {
    id: 5,
    category: 'Работы',
    date: '2026-07-21',
    dateLabel: '21 июля 2026',
    title: 'Обновлено освещение в подъездах пяти домов',
    excerpt:
      'Установлены светодиодные светильники с датчиками движения — расход электроэнергии на ОДН снизится.',
    body: [
      'В подъездах домов по ул. Точисского, 19, 21 и ул. 5 Июля, 8, 10, 12 заменены светильники на светодиодные с датчиками движения и освещённости.',
      'Ожидаемое снижение расхода электроэнергии на общедомовые нужды — до 60%, что отразится в квитанциях уже в следующем расчётном периоде.',
      'О неработающем светильнике сообщайте в диспетчерскую с указанием подъезда и этажа.',
    ],
    addresses: 'Точисского, 19 · 21 · 5 Июля, 8 · 10 · 12',
  },
  {
    id: 6,
    category: 'Объявления',
    date: '2026-07-08',
    dateLabel: '8 июля 2026',
    title: 'Показания счётчиков — до 25 числа каждого месяца',
    excerpt:
      'Передать показания можно через форму на сайте, по телефону диспетчерской или в ГИС ЖКХ.',
    body: [
      'Напоминаем: показания индивидуальных приборов учёта передаются с 20 по 25 число каждого месяца.',
      'Если показания не переданы вовремя, начисление производится по среднемесячному расходу, а после трёх месяцев — по нормативу с повышающим коэффициентом.',
      'Удобнее всего передать показания через форму на сайте — они попадают напрямую в расчётный отдел.',
    ],
  },
];

const CATEGORIES = ['Все', 'Работы', 'Отключения', 'Объявления', 'Отчёты'] as const;

const CATEGORY_ICON: Record<string, string> = {
  Работы: 'Hammer',
  Отключения: 'PowerOff',
  Объявления: 'Megaphone',
  Отчёты: 'FileBarChart',
};

const News = () => {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('Все');
  const [active, setActive] = useState<NewsItem | null>(null);

  const items = useMemo(
    () => (filter === 'Все' ? NEWS : NEWS.filter((n) => n.category === filter)),
    [filter],
  );

  const [lead, ...rest] = items;

  return (
    <section id="news" className="relative overflow-hidden border-b border-border py-24 lg:py-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Новости"
            title={
              <>
                Что происходит
                <br />в ваших домах
              </>
            }
            description="Отключения, ход работ, объявления и отчёты — публикуем сразу, чтобы не искать информацию на подъездном стенде."
          />

          <div className="reveal flex flex-wrap gap-px bg-border">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`px-5 py-3 font-display text-[12px] uppercase tracking-[0.12em] transition-colors ${
                  filter === c
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-px bg-border lg:grid-cols-[1.15fr_0.85fr]">
          {lead ? (
            <article className="reveal group flex flex-col justify-between bg-card p-8 lg:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 bg-primary px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-primary-foreground">
                    <Icon
                      name={CATEGORY_ICON[lead.category]}
                      fallback="Info"
                      size={13}
                    />
                    {lead.category}
                  </span>
                  <time
                    dateTime={lead.date}
                    className="text-[13px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {lead.dateLabel}
                  </time>
                </div>
                <h3 className="mt-7 font-display text-[clamp(24px,3vw,36px)] uppercase leading-[1.08] tracking-tight">
                  {lead.title}
                </h3>
                <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                  {lead.excerpt}
                </p>
                {lead.addresses ? (
                  <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                    <Icon name="MapPin" size={15} className="mt-0.5 shrink-0 text-accent" />
                    {lead.addresses}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setActive(lead)}
                className="mt-9 inline-flex items-center gap-3 self-start font-display text-[13px] uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary"
              >
                Читать полностью
                <Icon name="ArrowRight" size={16} />
              </button>
            </article>
          ) : null}

          <div className="grid gap-px bg-border">
            {rest.map((n) => (
              <article key={n.id} className="reveal bg-card p-7 lg:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Icon
                    name={CATEGORY_ICON[n.category]}
                    fallback="Info"
                    size={15}
                    className="text-accent"
                  />
                  <span className="font-display text-[11px] uppercase tracking-[0.14em] text-accent">
                    {n.category}
                  </span>
                  <span className="h-px w-6 bg-border" />
                  <time
                    dateTime={n.date}
                    className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {n.dateLabel}
                  </time>
                </div>
                <h3 className="mt-4 font-display text-[18px] uppercase leading-tight tracking-tight">
                  {n.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  {n.excerpt}
                </p>
                <button
                  type="button"
                  onClick={() => setActive(n)}
                  className="mt-5 inline-flex items-center gap-2 font-display text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary"
                >
                  Подробнее
                  <Icon name="ArrowRight" size={14} />
                </button>
              </article>
            ))}
            {!rest.length && lead ? (
              <div className="bg-card p-8 text-[14px] leading-relaxed text-muted-foreground">
                В этой категории пока одна публикация. Новые материалы появляются каждую неделю.
              </div>
            ) : null}
            {!items.length ? (
              <div className="bg-card p-8 text-[14px] leading-relaxed text-muted-foreground">
                В этой категории пока нет публикаций.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.14em] text-accent">
                {active?.category}
              </span>
              <span className="h-px w-6 bg-border" />
              <span className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
                {active?.dateLabel}
              </span>
            </div>
            <DialogTitle className="mt-3 text-left font-display text-[24px] uppercase leading-tight tracking-tight">
              {active?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">Текст публикации</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {active?.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {active?.addresses ? (
              <p className="flex items-start gap-2 border-t border-border pt-4 text-[13px]">
                <Icon name="MapPin" size={15} className="mt-0.5 shrink-0 text-accent" />
                {active.addresses}
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default News;
