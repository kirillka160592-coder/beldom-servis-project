import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';

const CATEGORIES = [
  {
    id: 'content',
    label: 'Содержание жилья',
    unit: 'руб. / м² в месяц',
    rows: [
      ['Управление многоквартирным домом', '4,12'],
      ['Санитарное содержание подъездов', '2,86'],
      ['Уборка придомовой территории', '3,04'],
      ['Техническое обслуживание инженерных сетей', '5,41'],
      ['Аварийно-диспетчерское обслуживание', '1,73'],
      ['Текущий ремонт общего имущества', '6,08'],
    ],
    total: ['Итого содержание жилья', '23,24'],
  },
  {
    id: 'utilities',
    label: 'Коммунальные ресурсы',
    unit: 'по тарифам поставщиков',
    rows: [
      ['Холодное водоснабжение, руб./м³', '38,64'],
      ['Водоотведение, руб./м³', '31,20'],
      ['Горячее водоснабжение, руб./м³', '191,55'],
      ['Отопление, руб./Гкал', '2 486,90'],
      ['Электроэнергия (день), руб./кВт·ч', '4,68'],
      ['Обращение с ТКО, руб./чел.', '118,42'],
    ],
    total: null,
  },
  {
    id: 'extra',
    label: 'Дополнительные услуги',
    unit: 'разовые работы',
    rows: [
      ['Замена смесителя (без стоимости материалов)', '750'],
      ['Устранение засора внутриквартирной канализации', '1 100'],
      ['Замена участка трубы ХВС/ГВС до 1 м', '1 450'],
      ['Установка счётчика воды с опломбировкой', '1 900'],
      ['Выдача справки/выписки из лицевого счёта', 'бесплатно'],
      ['Составление акта о заливе', 'бесплатно'],
    ],
    total: null,
  },
];

const Tariffs = () => {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const current = CATEGORIES.find((c) => c.id === active)!;

  return (
    <section id="tariffs" className="border-b border-border bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <SectionHeading
          index="06"
          eyebrow="Тарифы и квитанции"
          title={
            <>
              Сколько стоит <em className="not-italic text-primary">порядок</em>
            </>
          }
          description="Тарифы на содержание жилья утверждены решением общего собрания собственников. Коммунальные ресурсы начисляются по тарифам ресурсоснабжающих организаций."
        />

        <div className="reveal mt-12 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`border px-5 py-3 font-display text-[13px] uppercase tracking-[0.1em] transition-colors ${
                active === c.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="reveal mt-8 border border-border bg-background">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 py-5">
            <h3 className="font-display text-[20px] uppercase tracking-tight">{current.label}</h3>
            <span className="text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
              {current.unit}
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="px-6 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  Наименование
                </TableHead>
                <TableHead className="px-6 text-right text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  Тариф
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {current.rows.map(([name, price]) => (
                <TableRow key={name} className="border-border transition-colors hover:bg-card">
                  <TableCell className="px-6 py-4 text-[15px]">{name}</TableCell>
                  <TableCell className="px-6 py-4 text-right font-display text-[17px] tracking-tight text-foreground">
                    {price}
                  </TableCell>
                </TableRow>
              ))}
              {current.total ? (
                <TableRow className="border-border bg-primary/10 hover:bg-primary/10">
                  <TableCell className="px-6 py-4 font-display text-[15px] uppercase tracking-[0.06em]">
                    {current.total[0]}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right font-display text-[20px] tracking-tight text-primary">
                    {current.total[1]}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <div className="reveal mt-8 grid gap-px bg-border sm:grid-cols-3">
          {[
            {
              icon: 'CalendarClock',
              title: 'Срок оплаты',
              text: 'До 10 числа месяца, следующего за расчётным.',
            },
            {
              icon: 'CreditCard',
              title: 'Как оплатить',
              text: 'В офисе, в банке, через приложение банка по QR-коду на квитанции.',
            },
            {
              icon: 'FileWarning',
              title: 'Вопрос по квитанции',
              text: 'Сверку расчётов делаем в день обращения — приходите с квитанцией.',
            },
          ].map((c) => (
            <div key={c.title} className="bg-background p-6">
              <Icon name={c.icon} fallback="Info" size={22} className="text-accent" />
              <h4 className="mt-4 font-display text-[17px] uppercase tracking-tight">{c.title}</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tariffs;
