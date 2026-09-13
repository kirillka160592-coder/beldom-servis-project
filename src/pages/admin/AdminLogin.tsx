import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { COMPANY } from '@/data/company';

const AdminLogin = () => {
  const { login, loading, signIn } = useAdminAuth();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && login) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(form.login, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <span className="cut-mark h-8 w-8 bg-primary" aria-hidden="true" />
          <span className="font-display text-[16px] font-semibold uppercase leading-none tracking-[0.02em]">
            {COMPANY.short}
          </span>
        </div>
        <h1 className="mt-6 font-display text-[22px] uppercase tracking-tight">Вход в админку</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Редактирование новостей и текстов сайта
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
              Логин
            </Label>
            <Input
              id="login"
              autoFocus
              value={form.login}
              onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
              className="h-12 rounded-none border-border bg-background text-[15px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="h-12 rounded-none border-border bg-background text-[15px]"
            />
          </div>
          {error && (
            <p className="flex items-center gap-2 text-[13px] text-destructive">
              <Icon name="AlertCircle" size={15} />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="cut-btn w-full bg-primary px-8 py-4 font-display text-[15px] uppercase tracking-[0.08em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
