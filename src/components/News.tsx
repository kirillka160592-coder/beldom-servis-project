import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { newsApi, type NewsItemApi } from '@/lib/api';

const CATEGORIES = ['Все', 'Работы', 'Отключения', 'Объявления', 'Отчёты'] as const;

const CATEGORY_ICON: Record<string, string> = {
  Работы: 'Hammer',
  Отключения: 'PowerOff',
  Объявления: 'Megaphone',
  Отчёты: 'FileBarChart',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const News = () => {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('Все');
  const [active, setActive] = useState<NewsItemApi | null>(null);
  const [news, setNews] = useState<NewsItemApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi
      .list()
      .then(setNews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(
    () => (filter === 'Все' ? news : news.filter((n) => n.category === filter)),
    [filter, news],
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

        {loading ? (
          <p className="mt-14 text-muted-foreground">Загрузка новостей…</p>
        ) : (
          <div className="mt-14 grid gap-px bg-border lg:grid-cols-[1.15fr_0.85fr]">
            {lead ? (
              <article className="reveal group flex flex-col justify-between bg-card">
                {lead.images?.[0] ? (
                  <button
                    type="button"
                    onClick={() => setActive(lead)}
                    className="block aspect-[16/9] w-full overflow-hidden bg-background"
                  >
                    <img
                      src={lead.images[0]}
                      alt={lead.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                ) : null}
                <div className="flex flex-1 flex-col justify-between p-8 lg:p-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2 bg-primary px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-primary-foreground">
                        <Icon name={CATEGORY_ICON[lead.category]} fallback="Info" size={13} />
                        {lead.category}
                      </span>
                      <time
                        dateTime={lead.date}
                        className="text-[13px] uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {formatDate(lead.date)}
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
                </div>
              </article>
            ) : null}

            <div className="grid gap-px bg-border">
              {rest.map((n) => (
                <article key={n.id} className="reveal flex gap-5 bg-card p-7 lg:p-8">
                  {n.images?.[0] ? (
                    <button
                      type="button"
                      onClick={() => setActive(n)}
                      className="hidden h-[92px] w-[120px] shrink-0 overflow-hidden bg-background sm:block"
                    >
                      <img
                        src={n.images[0]}
                        alt={n.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </button>
                  ) : null}
                  <div className="min-w-0">
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
                        {formatDate(n.date)}
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
                  </div>
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
        )}
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
                {active ? formatDate(active.date) : ''}
              </span>
            </div>
            <DialogTitle className="mt-3 text-left font-display text-[24px] uppercase leading-tight tracking-tight">
              {active?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">Текст публикации</DialogDescription>
          </DialogHeader>

          {active?.images?.length ? (
            <Carousel className="w-full">
              <CarouselContent>
                {active.images.map((src, i) => (
                  <CarouselItem key={src}>
                    <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden bg-background">
                      <img
                        src={src}
                        alt={`${active.title} — фото ${i + 1}`}
                        className="max-h-[70vh] w-auto max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {active.images.length > 1 ? (
                <>
                  <CarouselPrevious className="left-3 rounded-none border-border bg-card/90" />
                  <CarouselNext className="right-3 rounded-none border-border bg-card/90" />
                </>
              ) : null}
            </Carousel>
          ) : null}

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