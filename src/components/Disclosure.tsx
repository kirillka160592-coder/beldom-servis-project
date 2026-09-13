import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';
import { useContentBlock } from '@/hooks/use-content';

type Doc = { title: string; url: string };
type Section = { id: string; title: string; text: string; docs: Doc[] };
type DisclosureData = {
  heading: { eyebrow: string; title: string; description: string };
  gisLink: string;
  sections: Section[];
};

const FALLBACK: DisclosureData = {
  heading: { eyebrow: 'Раскрытие информации', title: 'Всё открыто по 731-ПП', description: '' },
  gisLink: 'https://dom.gosuslugi.ru',
  sections: [],
};

const Disclosure = () => {
  const { data } = useContentBlock<DisclosureData>('disclosure', FALLBACK);
  const [active, setActive] = useState<Section | null>(null);

  return (
    <section className="border-b border-border bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              index="04"
              eyebrow={data.heading.eyebrow}
              title={data.heading.title}
              description={data.heading.description}
            />
            <div className="reveal mt-8 space-y-3">
              <a
                href={data.gisLink}
                target="_blank"
                rel="noreferrer noopener"
                className="cut-btn inline-flex items-center gap-3 bg-primary px-7 py-4 font-display text-[14px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Icon name="ExternalLink" size={17} />
                Открыть в ГИС ЖКХ
              </a>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Не нашли документ? Запросите его письменно — ответим в течение 10 рабочих дней.
              </p>
            </div>
          </div>

          <div className="reveal">
            <Accordion type="single" collapsible className="border-t border-border">
              {data.sections.map((s, i) => (
                <AccordionItem key={s.id} value={s.id} className="border-b border-border">
                  <AccordionTrigger className="group gap-6 py-6 text-left hover:no-underline">
                    <span className="flex flex-1 items-start gap-5">
                      <span className="mt-1 font-display text-[13px] tracking-[0.14em] text-primary">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[clamp(18px,2.1vw,24px)] uppercase leading-tight tracking-tight transition-colors group-hover:text-primary">
                        {s.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 pl-[52px] pr-6">
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                    <button
                      type="button"
                      onClick={() => setActive(s)}
                      className="mt-4 inline-flex items-center gap-2 font-display text-[13px] uppercase tracking-[0.1em] text-accent transition-colors hover:text-foreground"
                    >
                      <Icon name="FolderOpen" size={16} />
                      Показать документы ({s.docs.length})
                    </button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg rounded-none border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-[22px] uppercase leading-tight tracking-tight">
              {active?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Документы доступны в офисе управляющей организации и в ГИС ЖКХ.
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {active?.docs.map((doc) => (
              <li key={doc.title} className="flex items-center gap-3 py-3.5">
                <Icon name="FileText" size={18} className="shrink-0 text-primary" />
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[15px] leading-snug text-foreground transition-colors hover:text-primary"
                  >
                    {doc.title}
                  </a>
                ) : (
                  <span className="text-[15px] leading-snug">{doc.title}</span>
                )}
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Disclosure;
