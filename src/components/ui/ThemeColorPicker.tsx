import { useTheme, accentColors } from '../../hooks/useTheme';

export default function ThemeColorPicker() {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <div data-fc-id="ThemeColorPicker" className="px-3 py-2">
      <p className="text-[11px] font-medium text-zinc-500 mb-2">テーマカラー</p>
      <div className="flex flex-wrap gap-1.5">
        {accentColors.map((c) => (
          <button
            key={c.name}
            data-fc-id={`ThemeColorPicker-${c.name}`}
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
  );
}
