import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AttendanceRecord {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakMinutes: number;
  note: string;
  type: 'normal' | 'remote' | 'holiday' | 'paid-leave';
}

interface AttendanceState {
  records: AttendanceRecord[];
  todayRecord: () => AttendanceRecord | undefined;
  clockIn: () => void;
  clockOut: () => void;
  updateRecord: (date: string, data: Partial<AttendanceRecord>) => void;
}

const today = () => new Date().toISOString().split('T')[0];
const now = () => new Date().toTimeString().slice(0, 5);

const generateSampleData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const d = new Date();
  for (let i = 1; i <= 20; i++) {
    d.setDate(d.getDate() - 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const dateStr = d.toISOString().split('T')[0];
    const types: AttendanceRecord['type'][] = ['normal', 'normal', 'normal', 'remote', 'normal'];
    records.push({
      date: dateStr,
      clockIn: `09:${String(Math.floor(Math.random() * 15)).padStart(2, '0')}`,
      clockOut: `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`,
      breakMinutes: 60,
      note: '',
      type: types[Math.floor(Math.random() * types.length)],
    });
  }
  return records;
};

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: generateSampleData(),
      todayRecord: () => get().records.find((r) => r.date === today()),
      clockIn: () =>
        set((s) => {
          const existing = s.records.find((r) => r.date === today());
          if (existing) return { records: s.records.map((r) => r.date === today() ? { ...r, clockIn: now() } : r) };
          return { records: [{ date: today(), clockIn: now(), clockOut: null, breakMinutes: 60, note: '', type: 'normal' }, ...s.records] };
        }),
      clockOut: () =>
        set((s) => ({ records: s.records.map((r) => r.date === today() ? { ...r, clockOut: now() } : r) })),
      updateRecord: (date, data) =>
        set((s) => ({ records: s.records.map((r) => r.date === date ? { ...r, ...data } : r) })),
    }),
    { name: 'attendance-storage' }
  )
);
