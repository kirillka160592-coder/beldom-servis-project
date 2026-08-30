import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { COMPANY } from '@/data/company';

const Contacts = () => (
  <section className="border-b border-border py-24 lg:py-32">
    <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
      <SectionHeading
        index="07"
        eyebrow="Контакты"
        title={
          <>
            Найти нас <em className="not-italic text-primary">просто</em>
          </>
        }
        description="Приходите в офис, звоните диспетчеру или пишите на почту — обращение зарегистрируем в любом случае."
      />

      <div className="reveal mt-14 grid gap-px bg-border lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-card p-8 lg:p-10">
          <dl className="space-y-7">
            {[
              { icon: 'MapPin', k: 'Адрес офиса', v: COMPANY.address },
              { icon: 'Siren', k: 'Аварийно-диспетчерская служба, 24/7', v: COMPANY.dispatchPhone, href: COMPANY.dispatchPhoneHref },
              { icon: 'Phone', k: 'Приёмная, бухгалтерия', v: COMPANY.officePhone, href: COMPANY.officePhoneHref },
              { icon: 'Mail', k: 'Электронная почта', v: COMPANY.email, href: `mailto:${COMPANY.email}` },
            ].map((c) => (
              <div key={c.k} className="flex items-start gap-4 border-b border-border/60 pb-6 last:border-0 last:pb-0">
                <Icon name={c.icon} fallback="Info" size={20} className="mt-1 shrink-0 text-primary" />
                <div className="min-w-0">
                  <dt className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                    {c.k}
                  </dt>
                  <dd className="mt-1.5 font-display text-[clamp(18px,2vw,24px)] uppercase leading-tight tracking-tight">
                    {c.href ? (
                      <a href={c.href} className="transition-colors hover:text-primary">
                        {c.v}
                      </a>
                    ) : (
                      c.v
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/request"
              className="cut-btn bg-primary px-7 py-4 font-display text-[14px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
            >
              Оставить заявку
            </Link>
            <a
              href={COMPANY.dispatchPhoneHref}
              className="border border-border px-7 py-4 font-display text-[14px] uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Позвонить диспетчеру
            </a>
          </div>
        </div>

        <div className="relative min-h-[380px] overflow-hidden bg-primary">
          <div className="absolute inset-0 grain opacity-40" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-[60%]" aria-hidden="true">
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-3">
              <div className="h-[120px] w-[70px] bg-paper" style={{ clipPath: 'polygon(0 8%,100% 0,100% 100%,0 100%)' }} />
              <div className="h-[190px] w-[92px] bg-paper" style={{ clipPath: 'polygon(0 0,100% 4%,99% 100%,1% 100%)' }} />
              <div className="h-[92px] w-[58px] bg-paper" style={{ clipPath: 'polygon(0 4%,100% 10%,100% 100%,0 100%)' }} />
            </div>
            <div
              className="absolute inset-x-0 bottom-0 h-[56px] bg-background"
              style={{ clipPath: 'polygon(0 22%,22% 8%,52% 16%,78% 4%,100% 12%,100% 100%,0 100%)' }}
            />
          </div>
          <div className="relative p-8 lg:p-10">
            <div className="font-display text-[13px] uppercase tracking-[0.22em] text-primary-foreground/70">
              Приём жителей
            </div>
            <div className="mt-6 space-y-3 text-primary-foreground">
              {[
                ['Пн — Чт', '08:30 — 17:30'],
                ['Пт', '08:30 — 16:15'],
                ['Сб — Вс', 'только аварийные заявки'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                  <span className="text-[15px] text-primary-foreground/80">{k}</span>
                  <span className="font-display text-[16px] uppercase tracking-[0.04em]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Contacts;