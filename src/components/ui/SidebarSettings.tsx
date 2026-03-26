import { useState } from 'react';
import { Settings2, Sun, Moon, ChevronUp, Download, Upload } from 'lucide-react';
import { useTheme, accentColors } from '../../hooks/useTheme';
import { useToast } from './Toast';
import { useRef } from 'react';

interface SidebarSettingsProps {
  storageKey?: string;
  exportFileName?: string;
}

export default function SidebarSettings({ storageKey, exportFileName }: SidebarSettingsProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div data-fc-id="SidebarSettings" className="border-t border-zinc-800">
      <button
        data-fc-id="SidebarSettings-toggle"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        <span className="flex-1 text-left text-xs font-medium">設定</span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform ${expanded ? '' : 'rotate-180'}`} />
      </button>

      {expanded && (
        <div data-fc-id="SidebarSettings-content" className="px-3 pb-3 space-y-3">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">カラー</p>
            <div className="flex flex-wrap gap-1.5">
              {accentColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setAccentColor(c.name)}
                  title={c.label}
                  className={`w-5 h-5 rounded-full transition-all ${
                    accentColor === c.name
                      ? 'ring-2 ring-offset-1 ring-offset-zinc-900 ring-white scale-110'
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'ライトモード' : 'ダークモード'}
            </button>

            {storageKey && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  エクスポート
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
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
