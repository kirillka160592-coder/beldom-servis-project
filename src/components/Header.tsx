import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { COMPANY, NAV_LINKS } from '@/data/company';

const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-6 px-5 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="cut-mark h-7 w-7 bg-primary" aria-hidden="true" />
            <span className="font-display text-base font-semibold uppercase leading-none tracking-[0.02em]">
              {COMPANY.short}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `link-underline text-[13px] uppercase tracking-[0.09em] transition-colors hover:text-foreground ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={COMPANY.dispatchPhoneHref}
              className="hidden items-center gap-2 font-display text-sm uppercase tracking-[0.06em] text-foreground sm:flex"
            >
              <Icon name="Phone" size={16} className="text-primary" />
              {COMPANY.dispatchPhone}
            </a>
            <button
              type="button"
              aria-label="Открыть меню"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* мобильное меню */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col border-l border-border bg-card transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <span className="font-display text-sm uppercase tracking-[0.14em] text-muted-foreground">
              Навигация
            </span>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center border border-border text-foreground"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-border/60 py-4 font-display text-xl uppercase tracking-tight transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`
                }
              >
                <span className="mr-3 text-xs text-muted-foreground">0{i + 1}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-border px-6 py-6">
            <a
              href={COMPANY.dispatchPhoneHref}
              className="cut-btn block bg-primary px-6 py-4 text-center font-display text-sm uppercase tracking-[0.08em] text-primary-foreground"
            >
              Аварийная служба 24/7
            </a>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {COMPANY.dispatchPhone}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
