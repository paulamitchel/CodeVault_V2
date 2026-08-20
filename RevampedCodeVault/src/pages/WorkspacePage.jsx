import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Play,
  Plus,
  Trash2,
  Loader2,
  ChevronRight,
  Download,
  FileCode,
  Terminal,
} from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import Select from '../components/common/Select';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCompiler } from '../hooks/useCompiler';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../utils/constants';
import { exportFolderAsZip } from '../utils/zipExporter';

function StatusBadge({ result, error }) {
  if (error) {
    return (
      <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-500">
        Error
      </span>
    );
  }
  if (!result) return null;

  const desc = (result.statusDescription || '').toLowerCase();
  const isSuccess = !result.stderr && (desc === '' || desc.includes('accepted'));

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isSuccess
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
          : 'bg-red-500/15 text-red-500'
      }`}
    >
      {isSuccess ? 'Success' : result.statusDescription || 'Runtime error'}
      {' \u00b7 '}
      {result.time ? `${result.time}s` : `${result.durationMs} ms`}
    </span>
  );
}

export default function WorkspacePage() {
  const { folderId } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { run, isRunning, result, error } = useCompiler();

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [consoleTab, setConsoleTab] = useState('output');
  const [isExporting, setIsExporting] = useState(false);

  const saveTimer = useRef(null);
  const editorRef = useRef(null);
  const activeFileRef = useRef(null);
  const codeRef = useRef(code);
  const stdinRef = useRef(stdin);

  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    stdinRef.current = stdin;
  }, [stdin]);

  useEffect(() => {
    loadFolder();
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  const loadFolder = async () => {
    const { data } = await supabase
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .single();
    if (data) setFolder(data);
  };

  const loadFiles = async () => {
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: true });
    setFiles(data ?? []);
    if (data && data.length > 0) {
      setActiveFile(data[0]);
      setCode(data[0].content || '');
    }
  };

  const selectFile = (file) => {
    setActiveFile(file);
    setCode(file.content || '');
  };

  const handleCodeChange = (value) => {
    const newCode = value ?? '';
    setCode(newCode);
    if (!activeFile) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase
        .from('files')
        .update({ content: newCode })
        .eq('id', activeFile.id);
    }, 800);
  };

  const handleAddFile = async () => {
    const name = prompt('File name (e.g. main.py, index.js):');
    if (!name) return;
    const guessedLang =
      SUPPORTED_LANGUAGES.find((l) => name.endsWith(`.${l.ext}`))?.id ??
      'javascript';
    const { data, error: insertError } = await supabase
      .from('files')
      .insert({
        folder_id: folderId,
        user_id: user.id,
        name,
        language: guessedLang,
        content: '',
      })
      .select()
      .single();
    if (!insertError && data) {
      await loadFiles();
      setActiveFile(data);
      setCode('');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file permanently?')) return;
    await supabase.from('files').delete().eq('id', fileId);
    await loadFiles();
  };

  const handleLanguageChange = async (langId) => {
    if (!activeFile) return;
    await supabase.from('files').update({ language: langId }).eq('id', activeFile.id);
    setActiveFile({ ...activeFile, language: langId });
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, language: langId } : f))
    );
  };

  const handleRun = useCallback(() => {
    const currentFile = activeFileRef.current;
    if (!currentFile) return;
    setConsoleTab('output');
    run(currentFile.language, codeRef.current, stdinRef.current);
  }, [run]);

  // Monaco Editor mount: Bind Ctrl+Enter / Cmd+Enter
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };

  // ZIP Export Handler
  const handleExportZip = async () => {
    if (!folder || files.length === 0) return;
    setIsExporting(true);
    try {
      await exportFolderAsZip(folder, files);
    } catch (err) {
      console.error('ZIP export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const activeMeta = activeFile ? getLanguageMeta(activeFile.language) : null;
  const languageOptions = SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label }));

  return (
    <DashboardLayout>
      {/* Top Header & Clean Breadcrumb Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link
              to="/vaults"
              className="rounded-lg px-1.5 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              My Vaults
            </Link>
            <ChevronRight size={13} className="flex-shrink-0 text-slate-300 dark:text-slate-700" />
            <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
              {folder?.name ?? 'Loading...'}
            </span>
            {activeFile && (
              <>
                <ChevronRight size={13} className="flex-shrink-0 text-slate-300 dark:text-slate-700" />
                <span className="truncate text-slate-500 dark:text-slate-500">
                  {activeFile.name}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportZip}
            disabled={isExporting || files.length === 0}
            className="pill-btn flex items-center gap-1.5 border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-white/10"
            title="Download full vault as .zip"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            <span>Export ZIP</span>
          </button>

          {activeMeta && (
            <>
              <Select
                value={activeFile.language}
                onChange={handleLanguageChange}
                options={languageOptions}
                className="w-40"
              />
              <button
                onClick={handleRun}
                disabled={isRunning}
                title="Run code (Ctrl + Enter)"
                className="pill-btn flex items-center gap-1.5 bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm shadow-emerald-500/30 transition-colors hover:bg-emerald-600 disabled:opacity-60"
              >
                {isRunning ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Play size={13} />
                )}
                <span>Run</span>
                <span className="hidden opacity-60 sm:inline text-[10px] ml-0.5 font-mono">⌘↵</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3-Column Split Workspace */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_1fr_340px]">
        {/* Column 1: Files Sidebar */}
        <div className="glass-card flex flex-col gap-1 p-3 xl:order-1">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Files
            </span>
            <button
              onClick={handleAddFile}
              aria-label="Add file"
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
            >
              <Plus size={14} />
            </button>
          </div>
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => selectFile(file)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                activeFile?.id === file.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileCode size={14} className="flex-shrink-0 opacity-70" />
                <span className="truncate">{file.name}</span>
              </div>
              <Trash2
                size={12}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
                className="opacity-0 transition-opacity group-hover:opacity-70 hover:text-red-400"
              />
            </div>
          ))}
          {files.length === 0 && (
            <p className="px-2 py-3 text-xs text-slate-500">No files yet.</p>
          )}
        </div>

        {/* Column 2: Monaco Code Editor */}
        <div className="glass-card monaco-wrapper p-1 xl:order-2">
          {activeFile ? (
            <Editor
              height="500px"
              language={activeMeta?.monacoLang || 'javascript'}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-sm text-slate-500">
              Select or create a file to start coding.
            </div>
          )}
        </div>

        {/* Column 3: Output & Stdin Panel */}
        <div className="glass-card flex flex-col overflow-hidden xl:order-3">
          <div className="flex items-center gap-1 border-b border-slate-200/70 p-2 dark:border-slate-800/60">
            <button
              onClick={() => setConsoleTab('output')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                consoleTab === 'output'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setConsoleTab('stdin')}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                consoleTab === 'stdin'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              stdin
              {stdin.trim().length > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
              )}
            </button>
            {consoleTab === 'output' && (
              <div className="ml-auto">
                <StatusBadge result={activeMeta?.id === 'html' ? null : result} error={error} />
              </div>
            )}
          </div>

          <div className="min-h-[456px] flex-1 overflow-auto p-4">
            {consoleTab === 'stdin' ? (
              <div className="flex h-full flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Terminal size={12} />
                  <span>Standard Input (passed to input / cin / stdin during execution)</span>
                </div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter inputs here (e.g. arguments or interactive answers)..."
                  className="h-full min-h-[380px] w-full resize-none rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm outline-none dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
                />
              </div>
            ) : activeMeta?.id === 'html' ? (
              result?.isHtml ? (
                <iframe
                  title="html-sandbox"
                  sandbox="allow-scripts"
                  srcDoc={code}
                  className="h-full min-h-[420px] w-full rounded-xl bg-white"
                />
              ) : (
                <p className="text-sm text-slate-500">
                  Click Run to render the live preview here.
                </p>
              )
            ) : (
              <>
                {error && (
                  <pre className="whitespace-pre-wrap font-mono text-sm text-red-500">{error}</pre>
                )}
                {result?.stdout && (
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300">
                    {result.stdout}
                  </pre>
                )}
                {result?.stderr && (
                  <pre className="whitespace-pre-wrap font-mono text-sm text-red-500">
                    {result.stderr}
                  </pre>
                )}
                {!error && result && !result.stdout && !result.stderr && (
                  <p className="text-sm text-slate-500">Program finished with no output.</p>
                )}
                {!error && !result && (
                  <p className="text-sm text-slate-500">
                    Click Run or press <kbd className="rounded bg-slate-200 px-1 py-0.5 text-xs font-mono dark:bg-slate-800">Ctrl+Enter</kbd> to see output here.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}