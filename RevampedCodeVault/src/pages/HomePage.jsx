import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  FolderTree,
  Compass,
  GitFork,
  Download,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Play,
  Check,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'C',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Bash',
  'HTML/CSS',
];

const FAQS = [
  {
    q: 'Do I need to install anything?',
    a: 'No. CodeVault runs entirely in the browser \u2014 editor, compiler, and file storage all live online, so there\u2019s nothing to set up on your machine.',
  },
  {
    q: 'Which languages can I run?',
    a: 'JavaScript, TypeScript, Python 3, Java, C#, C++, C, Go, Rust, Ruby, PHP, and Bash all execute through an in-browser compiler. HTML/CSS renders live in a sandboxed preview.',
  },
  {
    q: 'Can other people see my code?',
    a: 'Every vault is private by default. Flip a single toggle to make one public, and it shows up in Explore for anyone to view or fork.',
  },
  {
    q: 'What happens when I fork a vault?',
    a: 'Forking copies every file from a public vault straight into a new private vault in your own account, ready to edit immediately.',
  },
  {
    q: 'Is CodeVault free?',
    a: 'Yes \u2014 CodeVault is a free student project built to remove the friction of Git for beginner programmers.',
  },
];

const SNIPPETS = [
  {
    file: 'main.py',
    output: 'Hello, world! \u00b7 42ms',
    lines: (
      <>
        <p><span className="text-purple-400">def</span> <span className="text-sky-400">greet</span>(<span className="text-orange-400">name</span>):</p>
        <p className="pl-4"><span className="text-purple-400">print</span>(<span className="text-emerald-500">f"Hello, {'{name}'}!"</span>)</p>
        <p className="pt-2"><span className="text-sky-400">greet</span>(<span className="text-emerald-500">"world"</span>)</p>
      </>
    ),
  },
  {
    file: 'main.js',
    output: 'Hello, world! \u00b7 18ms',
    lines: (
      <>
        <p><span className="text-purple-400">function</span> <span className="text-sky-400">greet</span>(<span className="text-orange-400">name</span>) {'{'}</p>
        <p className="pl-4"><span className="text-sky-400">console</span>.<span className="text-purple-400">log</span>(<span className="text-emerald-500">`Hello, ${'{name}'}!`</span>);</p>
        <p>{'}'}</p>
        <p className="pt-2"><span className="text-sky-400">greet</span>(<span className="text-emerald-500">"world"</span>);</p>
      </>
    ),
  },
  {
    file: 'Main.java',
    output: 'Hello, world! \u00b7 96ms',
    lines: (
      <>
        <p><span className="text-purple-400">public class</span> <span className="text-sky-400">Main</span> {'{'}</p>
        <p className="pl-4"><span className="text-purple-400">public static void</span> <span className="text-sky-400">main</span>(<span className="text-orange-400">String[] args</span>) {'{'}</p>
        <p className="pl-8"><span className="text-sky-400">System.out</span>.<span className="text-purple-400">println</span>(<span className="text-emerald-500">"Hello, world!"</span>);</p>
        <p className="pl-4">{'}'}</p>
        <p>{'}'}</p>
      </>
    ),
  },
];

const FOLDER_CHIPS = ['Python', 'Web', 'DSA', 'Java', 'Notes', 'Fork'];

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeSection({ children, className = '' }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`glass-card overflow-hidden transition-colors ${
        open ? 'border-slate-300/80 dark:border-indigo-500/40' : ''
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {answer}
        </p>
      )}
    </div>
  );
}

function EditorMockup() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % SNIPPETS.length);
        setFading(false);
      }, 250);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  const snippet = SNIPPETS[index];

  return (
    <div className="glass-card mx-auto w-full max-w-md p-1">
      <div className="monaco-wrapper bg-white/40 dark:bg-black/20">
        <div className="flex items-center gap-1.5 border-b border-slate-200/60 px-4 py-3 dark:border-slate-800/60">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span
            className="ml-3 text-xs text-slate-400 transition-opacity duration-200"
            style={{ opacity: fading ? 0 : 1 }}
          >
            {snippet.file}
          </span>
        </div>
        <div
          className="space-y-1.5 px-5 py-4 font-mono text-[13px] leading-relaxed transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {snippet.lines}
        </div>
        <div className="flex items-center justify-between border-t border-slate-200/60 px-4 py-3 dark:border-slate-800/60">
          <span className="flex items-center gap-1.5 rounded-pill bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Play size={11} />
            Run
          </span>
          <span
            className="text-xs text-slate-400 transition-opacity duration-200"
            style={{ opacity: fading ? 0 : 1 }}
          >
            {snippet.output}
          </span>
        </div>
      </div>
    </div>
  );
}

function NavAnchor({ href, label, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {label}
    </a>
  );
}

function HeroSecondaryLink() {
  return (
    <a
      href="#features"
      className="pill-btn border border-slate-200/80 bg-white/60 px-6 py-3 text-sm font-medium text-slate-700 backdrop-blur-xl hover:bg-white dark:border-slate-800 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
    >
      See how it works
    </a>
  );
}

function StepBadge({ icon }) {
  return (
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
      {icon}
    </div>
  );
}

function WriteRunVisual() {
  return (
    <div className="flex h-48 w-full flex-col justify-center gap-2 px-7">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
      <div className="mt-2 h-2.5 w-3/4 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
      <div className="h-2.5 w-1/2 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
      <div className="h-2.5 w-2/3 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <Play size={11} />
        </span>
        <span className="h-2 w-16 rounded-full bg-emerald-200 dark:bg-emerald-900/50" />
      </div>
    </div>
  );
}

function FoldersVisual() {
  return (
    <div className="grid h-48 w-full grid-cols-3 items-center gap-3 px-7">
      {FOLDER_CHIPS.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/70 py-3 text-center shadow-sm dark:bg-white/5"
        >
          <FolderTree size={16} className="text-slate-400" />
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExploreVisual() {
  return (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
          JS
        </div>
        <GitFork size={14} className="text-slate-300 dark:text-slate-600" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xs font-semibold text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-300">
          +1
        </div>
      </div>
      <span className="text-xs text-slate-400">Forked into your vault</span>
    </div>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#languages', label: 'Languages' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <div className="app-canvas min-h-screen">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-pink-200/40 aura-blur animate-floatAura dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute right-0 top-60 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 aura-blur animate-floatAura dark:bg-violet-500/20" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-mint-200/30 aura-blur animate-floatAura dark:bg-cyan-500/15" />

      <nav className={`sticky top-0 z-30 transition-all ${scrolled ? 'backdrop-blur-xl' : ''}`}>
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between py-4 pl-3 pr-6 transition-all ${
            scrolled ? 'glass-panel mt-3 rounded-pill' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Code2 size={16} />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              CodeVault
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-slate-900 dark:hover:text-white">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/auth"
              className="pill-btn hidden bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-slate-900 sm:block"
            >
              Sign in
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="glass-panel mx-4 mt-2 flex flex-col gap-1 p-4 md:hidden">
            {navLinks.map((link) => (
              <NavAnchor
                key={link.href}
                href={link.href}
                label={link.label}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="pill-btn mt-2 bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Sign in
            </Link>
          </div>
        )}
      </nav>

      <header className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-10 pt-8 text-center sm:pt-12">
        <span className="mb-3 rounded-pill border border-slate-200/80 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 backdrop-blur-xl dark:border-slate-800 dark:bg-white/5 dark:text-slate-400">
          Built for beginner programmers
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
          Where student ideas compile.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">
          A multi-user code vault and in-browser IDE. Organize projects into
          folders, run code in a dozen-plus languages, and share your work
          with one click.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth"
            className="pill-btn flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
          >
            Start building
            <ArrowRight size={15} />
          </Link>
          <HeroSecondaryLink />
        </div>

        <div className="mt-8 w-full">
          <EditorMockup />
        </div>
      </header>

      <section id="languages" className="relative z-10 scroll-mt-28 overflow-hidden py-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas-light to-transparent dark:from-canvas-dark sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas-light to-transparent dark:from-canvas-dark sm:w-40" />
        <div className="marquee-track flex w-max gap-3">
          {[...LANGUAGES, ...LANGUAGES].map((lang, i) => (
            <span
              key={i}
              className="glass-card flex-shrink-0 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-5xl scroll-mt-28 px-6 py-20">
        <FadeSection className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Three steps from idea to running code
          </h2>
        </FadeSection>

        <div className="flex flex-col gap-16">
          <FadeSection className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <StepBadge icon={<Terminal size={18} />} number="01" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Write, run, repeat
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Monaco editor with full syntax highlighting for every supported language
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Interactive stdin drawer for programs that read input
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Live sandboxed preview for HTML/CSS
                </li>
              </ul>
            </div>
            <div className="glass-card overflow-hidden">
              <WriteRunVisual />
            </div>
          </FadeSection>

          <FadeSection className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="glass-card overflow-hidden md:order-1">
              <FoldersVisual />
            </div>
            <div className="md:order-2">
              <StepBadge icon={<FolderTree size={18} />} number="02" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Folders, not commits
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Group files into vaults the way you already think about projects
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Autosaves as you type &mdash; no manual commits or pushes
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Toggle any vault private or public in one click
                </li>
              </ul>
            </div>
          </FadeSection>

          <FadeSection className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <StepBadge icon={<Compass size={18} />} number="03" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Explore, fork, ship
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <GitFork size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Browse public vaults from other students and fork with one click
                </li>
                <li className="flex items-start gap-2">
                  <Download size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Export any vault as a ready-to-run .zip whenever you need it offline
                </li>
                <li className="flex items-start gap-2">
                  <Code2 size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  Sign in with email or Google in seconds
                </li>
              </ul>
            </div>
            <div className="glass-card overflow-hidden">
              <ExploreVisual />
            </div>
          </FadeSection>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <FadeSection className="glass-card flex flex-col items-center gap-4 p-10 text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Free to use, start to finish
          </h3>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            CodeVault is a free student project. No paid tiers, no locked
            features &mdash; every vault, every language, every export.
          </p>
          <Link
            to="/auth"
            className="pill-btn mt-2 flex items-center gap-2 bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
          >
            Create your vault
            <ArrowRight size={15} />
          </Link>
        </FadeSection>
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-2xl scroll-mt-28 px-6 py-20">
        <FadeSection className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Questions
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Frequently asked
          </h2>
        </FadeSection>
        <div className="flex flex-col gap-3">
          {FAQS.map((item) => (
            <FAQItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200/60 px-6 py-10 dark:border-slate-800/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Code2 size={14} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              CodeVault
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-slate-900 dark:hover:text-white">
                {link.label}
              </a>
            ))}
            <Link to="/auth" className="hover:text-slate-900 dark:hover:text-white">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            A student portfolio project. Built with React, Supabase &amp;
            Judge0.
          </p>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="pill-btn fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center bg-slate-900 text-white shadow-lg transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}