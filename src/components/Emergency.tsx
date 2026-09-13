import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCompany } from '@/hooks/use-company';

const Emergency = () => {
  const COMPANY = useCompany();

  const ITEMS = [
    {
      icon: 'Siren',
      title: 'Аварийная служба',
      text: 'Круглосуточно, без выходных',
      value: COMPANY.dispatchPhone,
      href: COMPANY.dispatchPhoneHref,
      internal: false,
    },
    {
      icon: 'Headset',
      title: 'Диспетчерская',
      text: 'Приём заявок и консультации',
      value: COMPANY.officePhone,
      href: COMPANY.officePhoneHref,
      internal: false,
    },
    {
      icon: 'Gauge',
      title: 'Показания счётчиков',
      text: 'Принимаем с 20 по 25 число',
      value: 'Передать онлайн',
      href: '/request',
      internal: true,
    },
  ];

  return (
    <section className="relative z-10 border-y border-border bg-card">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 md:grid-cols-3">
        {ITEMS.map((item, i) => {
          const cls = `group flex items-start gap-4 px-6 py-8 transition-colors hover:bg-background/60 lg:px-10 ${
            i < ITEMS.length - 1 ? 'border-b border-border md:border-b-0 md:border-r' : ''
          }`;
          const inner = (
            <>
              <span className="cut-mark mt-1 flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-transform duration-300 group-hover:-translate-y-1">
                <Icon name={item.icon} fallback="CircleAlert" size={20} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
                  {item.title}
                </span>
                <span className="mt-1 block font-display text-[22px] uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {item.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.text}</span>
              </span>
            </>
          );
          return item.internal ? (
            <Link key={item.title} to={item.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <a key={item.title} href={item.href} className={cls}>
              {inner}
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Emergency;
