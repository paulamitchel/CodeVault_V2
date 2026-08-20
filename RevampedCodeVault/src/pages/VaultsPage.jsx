import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FolderPlus,
  Globe,
  Lock,
  Download,
  Pencil,
  Trash2,
  FileCode,
} from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { exportFolderAsZip } from '../utils/zipExporter';

export default function VaultsPage() {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Vault Modal State
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPublic, setNewPublic] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit Vault Modal State
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPublic, setEditPublic] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadFolders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setFolders(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const { error } = await supabase.from('folders').insert({
      user_id: user.id,
      name: newName.trim(),
      description: newDesc.trim(),
      is_public: newPublic,
    });
    setCreating(false);
    if (!error) {
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      setNewPublic(false);
      loadFolders();
    }
  };

  const handleOpenEdit = (folder) => {
    setEditingFolder(folder);
    setEditName(folder.name || '');
    setEditDesc(folder.description || '');
    setEditPublic(!!folder.is_public);
  };

  const handleUpdateVault = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingFolder) return;
    setUpdating(true);
    const { error } = await supabase
      .from('folders')
      .update({
        name: editName.trim(),
        description: editDesc.trim(),
        is_public: editPublic,
      })
      .eq('id', editingFolder.id);

    setUpdating(false);
    if (!error) {
      setEditingFolder(null);
      loadFolders();
    }
  };

  const handleDelete = async (folderId) => {
    if (!confirm('Delete this vault and all its files? This cannot be undone.')) return;
    await supabase.from('folders').delete().eq('id', folderId);
    loadFolders();
  };

  const handleTogglePublic = async (folder) => {
    await supabase
      .from('folders')
      .update({ is_public: !folder.is_public })
      .eq('id', folder.id);
    loadFolders();
  };

  const handleExport = async (folder) => {
    const { data: files } = await supabase
      .from('files')
      .select('*')
      .eq('folder_id', folder.id);
    await exportFolderAsZip(folder, files ?? []);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Vaults
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="pill-btn flex items-center gap-1.5 bg-slate-900 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <Plus size={16} />
          <span>New Vault</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading your vaults...</p>
      ) : folders.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-10 sm:p-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-400 dark:bg-white/5 dark:text-slate-500">
            <FolderPlus size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              No vaults yet
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Create your first vault to start writing and running code.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="glass-card group relative flex flex-col gap-3 overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-pink-200/50 to-sky-200/50 blur-2xl dark:from-indigo-500/20 dark:to-cyan-500/10" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-white/10 dark:text-slate-200">
                  <FileCode size={18} />
                </div>
                <button
                  onClick={() => handleTogglePublic(folder)}
                  className="flex items-center gap-1 rounded-full border border-slate-200/70 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-white/10 dark:text-slate-300 dark:hover:border-slate-600"
                >
                  {folder.is_public ? <Globe size={12} /> : <Lock size={12} />}
                  {folder.is_public ? 'Public' : 'Private'}
                </button>
              </div>

              <Link to={`/workspace/${folder.id}`} className="relative">
                <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                  {folder.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                  {folder.description || 'No description'}
                </p>
              </Link>

              <div className="relative mt-2 flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-slate-800/60">
                <span className="text-xs text-slate-400">
                  {new Date(folder.created_at).toLocaleDateString()}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExport(folder)}
                    aria-label="Download as ZIP"
                    title="Download as ZIP"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(folder)}
                    aria-label="Edit vault"
                    title="Edit Vault"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(folder.id)}
                    aria-label="Delete vault"
                    title="Delete Vault"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Vault Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 sm:p-6 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-5 sm:p-6 shadow-2xl">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              New Vault
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Vault name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={newPublic}
                  onChange={(e) => setNewPublic(e.target.checked)}
                />
                Make public
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="pill-btn flex-1 border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="pill-btn flex-1 bg-slate-900 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vault Modal */}
      {editingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 sm:p-6 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-5 sm:p-6 shadow-2xl">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              Edit Vault
            </h2>
            <form onSubmit={handleUpdateVault} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Vault name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
              />
              <textarea
                placeholder="Description (optional)"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                />
                Make public
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFolder(null)}
                  className="pill-btn flex-1 border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="pill-btn flex-1 bg-slate-900 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}