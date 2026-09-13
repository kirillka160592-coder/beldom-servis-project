import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { useContentBlock } from '@/hooks/use-content';

type AboutData = {
  heading: { eyebrow: string; title: string };
  paragraphs: string[];
  principles: { icon: string; title: string; text: string }[];
  stats: { value: string; unit: string; label: string }[];
  schedule: [string, string][];
  scheduleNote: string;
};

const FALLBACK: AboutData = {
  heading: { eyebrow: 'О компании', title: 'Управляем домами, а не бумагами' },
  paragraphs: [
    'ООО «БелорецкДомСервис» — управляющая организация, которая обслуживает многоквартирные дома в Белорецке.',
  ],
  principles: [],
  stats: [],
  schedule: [],
  scheduleNote: '',
};

const About = () => {
  const { data } = useContentBlock<AboutData>('about', FALLBACK);

  return (
    <section className="relative overflow-hidden border-b border-border py-24 lg:py-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <SectionHeading index="02" eyebrow={data.heading.eyebrow} title={data.heading.title} />
            <div className="reveal mt-8 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="reveal mt-10 grid gap-px bg-border sm:grid-cols-3">
              {data.principles.map((p) => (
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
                {data.stats.map((s) => (
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
                {data.schedule.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="whitespace-nowrap font-display uppercase tracking-[0.06em] text-foreground">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
                {data.scheduleNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
