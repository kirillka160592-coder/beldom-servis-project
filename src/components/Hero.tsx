import { Link } from 'react-router-dom';
import { useCompany } from '@/hooks/use-company';

const Hero = () => {
  const COMPANY = useCompany();
  return (
    <section className="hero-stage">
      <div className="hero-left">
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
          <Link className="hero-cta" to="/request">
            Оставить заявку диспетчеру
          </Link>
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