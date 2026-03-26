import { useState, useRef, useEffect } from 'react';
import { Settings2, Sun, Moon, Download, Upload } from 'lucide-react';
import { useTheme, accentColors } from '../../hooks/useTheme';
import { useToast } from './Toast';

interface SettingsDropdownProps {
  storageKey?: string;
  exportFileName?: string;
}

export default function SettingsDropdown({ storageKey, exportFileName }: SettingsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExport = () => {
    if (!storageKey) return;
    const data = localStorage.getItem(storageKey);
    if (!data) { showToast('エクスポートするデータがありません', 'warning'); return; }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('データをエクスポートしました', 'success');
    setOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        JSON.parse(text);
        localStorage.setItem(storageKey!, text);
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
    <div ref={ref} data-fc-id="SettingsDropdown" className="relative">
      <button
        data-fc-id="SettingsDropdown-trigger"
        onClick={() => setOpen(!open)}
        className="p-2 text-zinc-400 hover:text-foreground transition-colors rounded-lg hover:bg-zinc-800/50"
        title="表示設定"
      >
        <Settings2 className="w-4 h-4" />
      </button>
      {open && (
        <div
          data-fc-id="SettingsDropdown-panel"
          className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="px-3 pt-3 pb-2">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">カラー</p>
            <div className="flex flex-wrap gap-1.5">
              {accentColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setAccentColor(c.name)}
                  title={c.label}
                  className={`w-5 h-5 rounded-full transition-all ${
                    accentColor === c.name
                      ? 'ring-2 ring-offset-1 ring-offset-zinc-900 ring-foreground scale-110'
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-800 p-1 space-y-0.5">
            <button
              onClick={() => { toggleTheme(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'ライトモード' : 'ダークモード'}
            </button>
            {storageKey && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  エクスポート
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
