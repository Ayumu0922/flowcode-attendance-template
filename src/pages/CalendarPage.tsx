import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAttendanceStore } from '../store/attendanceStore';
import PageTransition from '../components/ui/PageTransition';

export default function CalendarPage() {
  const { records } = useAttendanceStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return day;
  });

  const getRecord = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find((r) => r.date === dateStr);
  };

  const typeColors: Record<string, string> = { normal: 'bg-emerald-500', remote: 'bg-blue-500', 'paid-leave': 'bg-purple-500', holiday: 'bg-zinc-600' };

  return (
    <PageTransition className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">勤怠カレンダー</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-zinc-400 hover:text-foreground"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-sm font-semibold text-foreground">{year}年{month + 1}月</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-zinc-400 hover:text-foreground"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
          <div key={d} className="text-center text-xs text-zinc-500 py-2">{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const record = getRecord(day);
          const isToday = new Date().toISOString().split('T')[0] === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return (
            <div key={i} className={`p-2 rounded-lg border text-center min-h-[70px] ${isToday ? 'border-accent-500/50 bg-accent-500/5' : 'border-zinc-800/50'}`}>
              <p className={`text-sm ${isToday ? 'text-accent-400 font-bold' : 'text-zinc-400'}`}>{day}</p>
              {record && (
                <div className="mt-1 space-y-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${typeColors[record.type] || 'bg-zinc-600'}`} />
                  <p className="text-[10px] text-zinc-500">{record.clockIn || ''}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {[{ label: '通常', color: 'bg-emerald-500' }, { label: 'リモート', color: 'bg-blue-500' }, { label: '有給', color: 'bg-purple-500' }].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-zinc-500"><span className={`w-2 h-2 rounded-full ${color}`} />{label}</span>
        ))}
      </div>
    </PageTransition>
  );
}
