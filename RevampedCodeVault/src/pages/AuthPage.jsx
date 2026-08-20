import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, username);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === 'signup') {
      setError('Check your email to confirm your account, then sign in.');
      setMode('signin');
      return;
    }

    navigate('/vaults');
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="app-canvas flex min-h-screen items-center justify-center p-6">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-purple-200/40 aura-blur animate-floatAura dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-200/40 aura-blur animate-floatAura dark:bg-cyan-500/15" />

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="glass-card relative z-10 w-full max-w-sm p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <Code2 size={22} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === 'signin' ? 'Welcome back' : 'Create your vault'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'signin'
              ? 'Sign in to continue to CodeVault'
              : 'Start building in seconds'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-white/5 dark:text-slate-100"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-white/5 dark:text-slate-100"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-white/5 dark:text-slate-100"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="pill-btn mt-2 flex items-center justify-center gap-2 bg-slate-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-slate-900"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="pill-btn flex w-full items-center justify-center gap-2 border border-slate-200/80 bg-white/60 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white dark:border-slate-800 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <Mail size={16} />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="font-medium text-slate-900 underline underline-offset-2 dark:text-slate-100"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}