import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Compass, LogOut, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-pill px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
        : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100'
    }`;

  return (
    <div className="app-canvas flex min-h-screen">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-200/40 aura-blur animate-floatAura dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-sky-200/40 aura-blur animate-floatAura dark:bg-violet-500/20" />

      <aside className="relative z-10 hidden w-64 flex-shrink-0 flex-col gap-6 p-6 md:flex">
        <div className="glass-panel flex flex-1 flex-col p-5">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Code2 size={18} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              CodeVault
            </span>
          </div>

          <nav className="flex flex-1 flex-col gap-1.5">
            <NavLink to="/vaults" className={linkClass}>
              <LayoutGrid size={18} />
              My Vaults
            </NavLink>
            <NavLink to="/explore" className={linkClass}>
              <Compass size={18} />
              Explore
            </NavLink>
          </nav>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {profile?.username ?? 'Loading...'}
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500">
                Student
              </p>
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between p-6 pb-0 md:pl-0">
          <div className="glass-panel flex w-full items-center justify-between px-5 py-3 md:hidden">
            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
              CodeVault
            </span>
          </div>
          <div className="ml-auto hidden md:block">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}