import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/data/company';
import { useCompany } from '@/hooks/use-company';
import logoIcon from '@/assets/logo-icon.png';

const Footer = () => {
  const COMPANY = useCompany();
  return (
  <footer className="bg-background py-14">
    <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
      <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt={COMPANY.short} className="h-10 w-auto" />
            <span className="font-display text-[18px] font-semibold uppercase leading-none tracking-[0.02em]">
              {COMPANY.short}
            </span>
          </div>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Управляющая организация многоквартирных домов в городе Белорецк. Содержание, ремонт,
            аварийное обслуживание и работа с собственниками.
          </p>
        </div>

        <div>
          <h4 className="font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
            Разделы
          </h4>
          <ul className="mt-5 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className="link-underline text-[15px] text-foreground/85 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
            Контакты
          </h4>
          <ul className="mt-5 space-y-2.5 text-[15px] text-foreground/85">
            <li>
              <a href={COMPANY.dispatchPhoneHref} className="hover:text-primary">
                {COMPANY.dispatchPhone} — аварийная
              </a>
            </li>
            <li>
              <a href={COMPANY.officePhoneHref} className="hover:text-primary">
                {COMPANY.officePhone} — приёмная
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">
                {COMPANY.email}
              </a>
            </li>
            <li className="text-muted-foreground">{COMPANY.address}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-7 text-[13px] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {COMPANY.name}. Все права защищены.</p>
        <p>Информация раскрывается в соответствии с ПП РФ № 731 и размещается в ГИС ЖКХ.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;