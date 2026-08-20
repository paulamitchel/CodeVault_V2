import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GitFork, Globe, FileCode } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getLanguageMeta } from '../utils/constants';

function Avatar({ username }) {
  const initial = (username || '?').charAt(0).toUpperCase();
  return (
    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
      {initial}
    </div>
  );
}

export default function ExplorePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [forkingId, setForkingId] = useState(null);

  useEffect(() => {
    loadPublicFolders();
  }, []);

  const loadPublicFolders = async () => {
    setLoading(true);
    const { data: folderData } = await supabase
      .from('folders')
      .select('*, profiles(username)')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    const list = folderData ?? [];

    if (list.length > 0) {
      const ids = list.map((f) => f.id);
      const { data: fileData } = await supabase
        .from('files')
        .select('folder_id, language')
        .in('folder_id', ids);

      const metaByFolder = {};
      (fileData ?? []).forEach((f) => {
        if (!metaByFolder[f.folder_id]) {
          metaByFolder[f.folder_id] = { count: 0, languages: new Set() };
        }
        metaByFolder[f.folder_id].count += 1;
        metaByFolder[f.folder_id].languages.add(f.language);
      });

      list.forEach((folder) => {
        const meta = metaByFolder[folder.id];
        folder.fileCount = meta?.count ?? 0;
        folder.languageIds = meta ? Array.from(meta.languages) : [];
      });
    }

    setFolders(list);
    setLoading(false);
  };

  const filtered = folders.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleFork = async (folder) => {
    setForkingId(folder.id);
    const { data: newFolder, error: folderError } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: `${folder.name} (fork)`,
        description: folder.description,
        is_public: false,
      })
      .select()
      .single();

    if (!folderError) {
      const { data: sourceFiles } = await supabase
        .from('files')
        .select('*')
        .eq('folder_id', folder.id);

      if (sourceFiles?.length) {
        const inserts = sourceFiles.map((f) => ({
          folder_id: newFolder.id,
          user_id: user.id,
          name: f.name,
          language: f.language,
          content: f.content,
        }));
        await supabase.from('files').insert(inserts);
      }
      navigate(`/workspace/${newFolder.id}`);
    }
    setForkingId(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Community
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Explore
        </h1>
      </div>

      <div className="glass-card mb-6 flex items-center gap-3 px-4 py-3">
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search public vaults..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading public vaults...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-2 p-16 text-center">
          <Globe size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No public vaults match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((folder) => {
            const languageLabels = (folder.languageIds ?? []).map(
              (id) => getLanguageMeta(id).label
            );
            const visibleLabels = languageLabels.slice(0, 3);
            const extraCount = languageLabels.length - visibleLabels.length;

            return (
              <div
                key={folder.id}
                className="glass-card relative flex flex-col gap-3 overflow-hidden p-5"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-200/50 to-violet-200/50 blur-2xl dark:from-cyan-500/20 dark:to-violet-500/20" />
                <div className="relative">
                  <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {folder.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {folder.description || 'No description'}
                  </p>
                </div>

                {visibleLabels.length > 0 && (
                  <div className="relative flex flex-wrap gap-1.5">
                    {visibleLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-pill border border-slate-200/70 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300"
                      >
                        {label}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="rounded-pill border border-slate-200/70 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                )}

                <div className="relative flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Avatar username={folder.profiles?.username} />
                    <span className="truncate">{folder.profiles?.username ?? 'unknown'}</span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileCode size={12} />
                      {folder.fileCount ?? 0}
                    </span>
                    <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleFork(folder)}
                  disabled={forkingId === folder.id}
                  className="pill-btn relative mt-1 flex items-center justify-center gap-2 border border-slate-200 bg-white/70 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white disabled:opacity-60 dark:border-slate-700 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <GitFork size={14} />
                  {forkingId === folder.id ? 'Forking...' : 'Fork this vault'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}