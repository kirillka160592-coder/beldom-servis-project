import { COMPANY } from '@/data/company';

const HERO_NAV = [
  { id: 'request', label: 'Диспетчерская' },
  { id: 'tariffs', label: 'Тарифы' },
  { id: 'services', label: 'Ремонт' },
  { id: 'disclosure', label: 'Документы' },
];

const Hero = () => {
  return (
    <section id="home" className="hero-stage">
      <div className="hero-left">
        <header className="hero-top">
          <div className="flex items-center gap-3">
            <div className="cut-mark h-[34px] w-[34px] bg-primary" aria-hidden="true" />
            <div className="font-display text-[1.05em] font-semibold uppercase leading-none tracking-[0.02em]">
              {COMPANY.short}
            </div>
          </div>
          <nav className="hidden gap-[26px] md:flex">
            {HERO_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="border-b border-transparent py-1 text-[0.8em] uppercase tracking-[0.09em] text-muted-foreground transition-colors hover:border-b-primary hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={COMPANY.dispatchPhoneHref}
            className="font-display text-[0.9em] uppercase tracking-[0.06em] text-foreground md:hidden"
          >
            {COMPANY.dispatchPhone}
          </a>
        </header>

        <div className="hero-content">
          <div className="hero-eyebrow">Управляющая организация · {COMPANY.city}</div>
          <h1 className="hero-h1">
            <span className="row">
              <span>Дом</span>
            </span>
            <span className="row">
              <span>не&nbsp;ждёт</span>
            </span>
            <span className="row">
              <span>
                <em>утра</em>
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            Течь в&nbsp;подвале, темнота в&nbsp;подъезде, холодная батарея. Диспетчер принимает
            заявку ночью так&nbsp;же, как днём: <b>{COMPANY.dispatchPhone}</b>.
          </p>
          <a className="hero-cta" href="#request">
            Оставить заявку диспетчеру
          </a>
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-city" aria-hidden="true">
          <div className="hero-block hero-block--a">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="hero-floor" />
            ))}
          </div>
          <div className="hero-block hero-block--b">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={i === 4 ? 'hero-floor hero-floor--lit' : 'hero-floor'} />
            ))}
          </div>
          <div className="hero-block hero-block--c">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="hero-floor" />
            ))}
          </div>
        </div>
        <div className="hero-ground" aria-hidden="true" />
        <div className="hero-caption">Свет горит — значит, вызов приняли</div>
      </div>
    </section>
  );
};

export default Hero;
