import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useToast } from './Toast';

interface DataManagerProps {
  storageKey: string;
  exportFileName: string;
}

export default function DataManager({ storageKey, exportFileName }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleExport = () => {
    const data = localStorage.getItem(storageKey);
    if (!data) {
      showToast('エクスポートするデータがありません', 'warning');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('データをエクスポートしました', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        JSON.parse(text);
        localStorage.setItem(storageKey, text);
        showToast('データをインポートしました。リロードします...', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        showToast('無効なファイル形式です', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div data-fc-id="DataManager-container" className="flex flex-col gap-1">
      <button
        data-fc-id="DataManager-export"
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full"
      >
        <Download className="w-4 h-4" />
        エクスポート
      </button>
      <button
        data-fc-id="DataManager-import"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full"
      >
        <Upload className="w-4 h-4" />
        インポート
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
