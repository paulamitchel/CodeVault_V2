import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getLanguageMeta } from './constants';

export async function exportFolderAsZip(folder, files) {
  const zip = new JSZip();
  const root = zip.folder(sanitize(folder.name) || 'codevault-project');

  files.forEach((file) => {
    const meta = getLanguageMeta(file.language);
    const filename = file.name.includes('.')
      ? file.name
      : `${file.name}.${meta.ext}`;
    root.file(filename, file.content ?? '');
  });

  const readme = `# ${folder.name}\n\n${folder.description ?? ''}\n\nExported from CodeVault.`;
  root.file('README.md', readme);

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${sanitize(folder.name) || 'codevault-project'}.zip`);
}

function sanitize(name) {
  return (name ?? '').trim().replace(/[^a-z0-9-_]+/gi, '-');
}