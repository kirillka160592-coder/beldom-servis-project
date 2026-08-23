import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import SectionHeading from '@/components/SectionHeading';

const GROUPS = [
  {
    id: 'maintenance',
    label: 'Содержание дома',
    lead: 'Ежедневная работа, из которой складывается «дом в порядке».',
    items: [
      { icon: 'Brush', title: 'Уборка подъездов', text: 'Влажная уборка лестничных клеток по графику, мытьё окон и перил.' },
      { icon: 'Trees', title: 'Придомовая территория', text: 'Покос травы, вывоз снега, посыпка дорожек, уход за детскими площадками.' },
      { icon: 'Lightbulb', title: 'Освещение мест общего пользования', text: 'Замена ламп в подъездах, ремонт светильников и датчиков движения.' },
      { icon: 'DoorClosed', title: 'Подъездное оборудование', text: 'Доводчики, домофоны, почтовые ящики, окна и входные группы.' },
    ],
  },
  {
    id: 'repair',
    label: 'Ремонт и инженерия',
    lead: 'Сантехника, электрика и кровля — плановые и срочные работы.',
    items: [
      { icon: 'Wrench', title: 'Сантехнические работы', text: 'Стояки ХВС и ГВС, канализация, запорная арматура, устранение течей.' },
      { icon: 'Zap', title: 'Электромонтаж', text: 'Этажные щиты, вводные автоматы, внутридомовые сети до квартиры.' },
      { icon: 'Home', title: 'Кровля и фасад', text: 'Локальный ремонт кровли, межпанельные швы, козырьки над входами.' },
      { icon: 'Thermometer', title: 'Отопление', text: 'Промывка и опрессовка системы, регулировка, подготовка к зиме.' },
    ],
  },
  {
    id: 'accounting',
    label: 'Начисления и учёт',
    lead: 'Прозрачные квитанции и понятные расчёты по каждому дому.',
    items: [
      { icon: 'Receipt', title: 'Квитанции', text: 'Формирование единого платёжного документа и расшифровка строк.' },
      { icon: 'Gauge', title: 'Показания приборов учёта', text: 'Приём показаний ИПУ и ОДПУ, поверка общедомовых счётчиков.' },
      { icon: 'FileSpreadsheet', title: 'Отчёты по дому', text: 'Годовой отчёт о выполненных работах и расходовании средств.' },
      { icon: 'Scale', title: 'Работа с задолженностью', text: 'Сверка расчётов, рассрочка, досудебное урегулирование.' },
    ],
  },
  {
    id: 'legal',
    label: 'Работа с собственниками',
    lead: 'Собрания, документы и вопросы, которые решает управляющая организация.',
    items: [
      { icon: 'Users', title: 'Общие собрания', text: 'Подготовка, проведение и оформление протоколов ОСС.' },
      { icon: 'FileText', title: 'Справки и выписки', text: 'Выписка из лицевого счёта, справка о составе семьи, акты.' },
      { icon: 'ShieldCheck', title: 'Акты и осмотры', text: 'Комиссионные осмотры, акты о заливе и повреждении имущества.' },
      { icon: 'MessagesSquare', title: 'Обращения и жалобы', text: 'Регистрация обращений и ответ в установленные законом сроки.' },
    ],
  },
];

const Services = () => (
  <section id="services" className="border-b border-border py-24 lg:py-32">
    <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
      <SectionHeading
        index="01"
        eyebrow="Услуги"
        title={
          <>
            Что мы делаем <em className="not-italic text-primary">каждый день</em>
          </>
        }
        description="Полный цикл управления многоквартирным домом: от лампочки в подъезде до подготовки дома к отопительному сезону."
      />

      <Tabs defaultValue="maintenance" className="reveal mt-14">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-none bg-transparent p-0">
          {GROUPS.map((g) => (
            <TabsTrigger
              key={g.id}
              value={g.id}
              className="rounded-none border border-border bg-card px-5 py-3 font-display text-[13px] uppercase tracking-[0.1em] text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {GROUPS.map((g) => (
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
    </div>
  </section>
);

export default Services;
