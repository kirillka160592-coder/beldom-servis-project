import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';

const STATS = [
  { value: '84', unit: 'дома', label: 'в управлении по Белорецку' },
  { value: '12 400', unit: 'жильцов', label: 'обслуживаем ежедневно' },
  { value: '24/7', unit: '', label: 'работает аварийная служба' },
  { value: '2 ч', unit: '', label: 'средний выезд по аварии' },
];

const PRINCIPLES = [
  {
    icon: 'Clock',
    title: 'Заявка не теряется',
    text: 'Каждое обращение получает номер, и вы можете узнать статус по телефону диспетчерской.',
  },
  {
    icon: 'Eye',
    title: 'Понятные расходы',
    text: 'Отчёт по каждому дому: сколько собрали, на что потратили, что запланировано.',
  },
  {
    icon: 'HardHat',
    title: 'Свои бригады',
    text: 'Сантехники, электрики и кровельщики в штате — не ждём подрядчика неделями.',
  },
];

const About = () => (
  <section id="about" className="relative overflow-hidden border-b border-border py-24 lg:py-32">
    <div className="grain pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
    <div className="relative mx-auto max-w-[1360px] px-5 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <SectionHeading
            index="02"
            eyebrow="О компании"
            title={
              <>
                Управляем домами,
                <br />а не бумагами
              </>
            }
          />
          <div className="reveal mt-8 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
            <p>
              ООО «БелорецкДомСервис» — управляющая организация, которая обслуживает многоквартирные
              дома в Белорецке. Мы отвечаем за инженерные сети, подъезды, кровли и придомовую
              территорию: за всё, что находится за порогом квартиры и принадлежит собственникам
              вместе.
            </p>
            <p>
              Работа устроена просто: диспетчерская принимает заявку, мастер выезжает, а житель
              видит результат в отчёте по дому. Плановые работы согласовываем с советом дома,
              аварийные выполняем немедленно — в любое время суток.
            </p>
          </div>

          <div className="reveal mt-10 grid gap-px bg-border sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-card p-6">
                <Icon name={p.icon} fallback="Check" size={22} className="text-accent" />
                <h3 className="mt-4 font-display text-[17px] uppercase leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="cut-card relative bg-primary p-8 lg:p-10">
            <div className="font-display text-[13px] uppercase tracking-[0.22em] text-primary-foreground/70">
              БелорецкДомСервис в цифрах
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[clamp(36px,5vw,54px)] font-semibold leading-none tracking-tight text-primary-foreground">
                    {s.value}
                    {s.unit ? (
                      <span className="ml-2 text-[16px] uppercase tracking-[0.1em] text-primary-foreground/70">
                        {s.unit}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 text-[14px] leading-snug text-primary-foreground/80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-px bg-card p-8 lg:p-10">
            <h3 className="font-display text-[20px] uppercase tracking-tight">График приёма</h3>
            <dl className="mt-6 space-y-3 text-[15px]">
              {[
                ['Понедельник — четверг', '08:30 — 17:30'],
                ['Пятница', '08:30 — 16:15'],
                ['Обед', '13:00 — 14:00'],
                ['Приём директора', 'вторник, 15:00 — 17:00'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="whitespace-nowrap font-display uppercase tracking-[0.06em] text-foreground">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
              Аварийные заявки принимаются круглосуточно, включая выходные и праздничные дни.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
