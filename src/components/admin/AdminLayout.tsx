import { ReactNode } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { COMPANY } from '@/data/company';

const ADMIN_NAV = [
  { path: '/admin/news', label: 'Новости', icon: 'Newspaper' },
  { path: '/admin/services', label: 'Услуги', icon: 'Wrench' },
  { path: '/admin/about', label: 'О компании', icon: 'Building2' },
  { path: '/admin/disclosure', label: 'Раскрытие информации', icon: 'FolderOpen' },
  { path: '/admin/contacts', label: 'Контакты', icon: 'Phone' },
  { path: '/admin/media', label: 'Медиабиблиотека', icon: 'Images' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { login, loading, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Загрузка…
      </div>
    );
  }

  if (!login) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-card lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <span className="cut-mark h-7 w-7 bg-primary" aria-hidden="true" />
          <span className="font-display text-[14px] font-semibold uppercase leading-none tracking-[0.02em]">
            {COMPANY.short}
          </span>
        </div>
        <nav className="flex flex-row gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 px-3 py-2.5 font-display text-[13px] uppercase tracking-[0.06em] transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                }`
              }
            >
              <Icon name={item.icon} fallback="Circle" size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border px-6 py-4 lg:mt-auto">
          <p className="text-[12px] text-muted-foreground">Вы вошли как</p>
          <p className="font-display text-[14px] uppercase tracking-tight">{login}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-primary"
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </aside>

      <main className="px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
};

export default AdminLayout;