import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { useContentBlock } from '@/hooks/use-content';

type ServiceItem = { icon: string; title: string; text: string };
type ServiceGroup = { id: string; label: string; lead: string; items: ServiceItem[] };
type ServicesData = {
  heading: { eyebrow: string; title: string; description: string };
  groups: ServiceGroup[];
};

const FALLBACK: ServicesData = {
  heading: { eyebrow: 'Услуги', title: 'Что мы делаем каждый день', description: '' },
  groups: [],
};

const Services = () => {
  const { data } = useContentBlock<ServicesData>('services', FALLBACK);
  const firstGroup = data.groups[0]?.id;

  return (
    <section className="border-b border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <SectionHeading
          index="01"
          eyebrow={data.heading.eyebrow}
          title={data.heading.title}
          description={data.heading.description}
        />

        {firstGroup ? (
          <Tabs defaultValue={firstGroup} className="reveal mt-14">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-none bg-transparent p-0">
              {data.groups.map((g) => (
                <TabsTrigger
                  key={g.id}
                  value={g.id}
                  className="rounded-none border border-border bg-card px-5 py-3 font-display text-[13px] uppercase tracking-[0.1em] text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                >
                  {g.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {data.groups.map((g) => (
              <TabsContent key={g.id} value={g.id} className="mt-10 animate-fade-in">
                <p className="max-w-2xl font-display text-[20px] uppercase leading-snug tracking-tight text-foreground/90">
                  {g.lead}
                </p>
                <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  {g.items.map((item) => (
                    <article
                      key={item.title}
                      className="group relative bg-card p-7 transition-colors duration-300 hover:bg-background"
                    >
                      <span className="absolute inset-x-0 top-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                      <Icon
                        name={item.icon}
                        fallback="Wrench"
                        size={26}
                        className="text-primary transition-transform duration-300 group-hover:-translate-y-1"
                      />
                      <h3 className="mt-5 font-display text-[19px] uppercase leading-tight tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </article>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
      </div>
    </section>
  );
};

export default Services;
