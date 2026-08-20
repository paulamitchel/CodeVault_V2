import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Compass, LogOut, Code2, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/auth');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100'
    }`;

  return (
    <div className="app-canvas flex min-h-screen">
      {/* Background Aura Gradients */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-200/40 aura-blur animate-floatAura dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-sky-200/40 aura-blur animate-floatAura dark:bg-violet-500/20" />

      {/* Desktop Sidebar (md and up) */}
      <aside className="relative z-10 hidden w-64 flex-shrink-0 flex-col gap-6 p-6 md:flex">
        <div className="glass-panel flex flex-1 flex-col p-5">
          <div className="mb-8 flex items-center gap-2.5 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
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
            <div className="min-w-0 pr-2">
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
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar (< md) */}
      <div className="relative z-20 flex min-w-0 flex-1 flex-col">
        <header className="p-4 pb-0 md:p-6 md:pb-0 md:pl-0">
          <div className="glass-panel flex w-full items-center justify-between px-4 py-3 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Code2 size={16} />
              </div>
              <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                CodeVault
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-white/10 dark:text-slate-200"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Desktop Top Bar Theme Switcher */}
          <div className="ml-auto hidden md:block">
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Slide-Over Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 backdrop-blur-sm md:hidden">
            <div className="glass-panel m-4 flex flex-1 flex-col p-5 shadow-2xl">
              <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <Code2 size={16} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Navigation
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2">
                <NavLink
                  to="/vaults"
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClass}
                >
                  <LayoutGrid size={18} />
                  My Vaults
                </NavLink>
                <NavLink
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClass}
                >
                  <Compass size={18} />
                  Explore
                </NavLink>
              </nav>

              <div className="mt-auto flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profile?.username ?? 'Logged In'}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Student
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/80 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}