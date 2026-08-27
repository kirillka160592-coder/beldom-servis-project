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

const SECTIONS = [
  {
    id: 'org',
    title: 'Общая информация об организации',
    text: 'Сведения об управляющей организации, реквизиты, лицензия, структура и контакты руководства.',
    docs: [
      'Устав ООО «БелорецкДомСервис»',
      'Лицензия на управление МКД',
      'Свидетельство о постановке на налоговый учёт',
      'Сведения о членстве в СРО и объединениях',
    ],
  },
  {
    id: 'houses',
    title: 'Перечень домов в управлении',
    text: 'Адреса многоквартирных домов, год постройки, этажность, площадь и характеристики общего имущества.',
    docs: [
      'Реестр многоквартирных домов на 2026 год',
      'Технические паспорта домов',
      'Перечень домов, где расторгнут договор управления',
    ],
  },
  {
    id: 'contracts',
    title: 'Договоры управления',
    text: 'Типовой договор управления, перечень работ и услуг, порядок изменения условий обслуживания.',
    docs: [
      'Типовой договор управления МКД',
      'Перечень работ и услуг по содержанию общего имущества',
      'Протоколы общих собраний собственников',
    ],
  },
  {
    id: 'reports',
    title: 'Отчёты и финансовая отчётность',
    text: 'Годовые отчёты о выполнении договора управления по каждому дому, бухгалтерская отчётность.',
    docs: [
      'Годовой отчёт о выполнении договора управления за 2025 год',
      'Бухгалтерский баланс за 2025 год',
      'Отчёт о расходовании средств текущего ремонта',
    ],
  },
  {
    id: 'works',
    title: 'Выполняемые работы и планы',
    text: 'План работ по текущему ремонту, подготовка к отопительному сезону, графики уборки и осмотров.',
    docs: [
      'План текущего ремонта на 2026 год',
      'График подготовки домов к отопительному сезону',
      'График санитарного содержания подъездов',
    ],
  },
];

const Disclosure = () => {
  const [active, setActive] = useState<(typeof SECTIONS)[number] | null>(null);

  return (
    <section id="disclosure" className="border-b border-border bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              index="04"
              eyebrow="Раскрытие информации"
              title={
                <>
                  Всё открыто
                  <br />
                  по 731-ПП
                </>
              }
              description="Управляющая организация обязана раскрывать информацию о своей работе. Мы публикуем документы в ГИС ЖКХ и дублируем их здесь — чтобы искать не пришлось."
            />
            <div className="reveal mt-8 space-y-3">
              <a
                href="https://dom.gosuslugi.ru"
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
              {SECTIONS.map((s, i) => (
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
              <li key={doc} className="flex items-center gap-3 py-3.5">
                <Icon name="FileText" size={18} className="shrink-0 text-primary" />
                <span className="text-[15px] leading-snug">{doc}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Disclosure;
