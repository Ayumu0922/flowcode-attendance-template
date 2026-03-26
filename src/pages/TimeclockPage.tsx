import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut } from 'lucide-react';
import { useAttendanceStore } from '../store/attendanceStore';
import { useToast } from '../components/ui/Toast';

export default function TimeclockPage() {
  const { todayRecord, clockIn, clockOut } = useAttendanceStore();
  const { showToast } = useToast();
  const record = todayRecord();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWorkHours = () => {
    if (!record?.clockIn || !record?.clockOut) return null;
    const [inH, inM] = record.clockIn.split(':').map(Number);
    const [outH, outM] = record.clockOut.split(':').map(Number);
    const total = (outH * 60 + outM) - (inH * 60 + inM) - record.breakMinutes;
    return `${Math.floor(total / 60)}時間${total % 60}分`;
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
        <div>
          <p className="text-zinc-500 text-sm mb-2">{time.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
          <p className="text-6xl font-black text-white tabular-nums">{time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><p className="text-xs text-zinc-500 mb-1">出勤</p><p className="text-2xl font-bold text-white">{record?.clockIn || '--:--'}</p></div>
            <div><p className="text-xs text-zinc-500 mb-1">退勤</p><p className="text-2xl font-bold text-white">{record?.clockOut || '--:--'}</p></div>
          </div>
          {getWorkHours() && <p className="text-sm text-zinc-400 text-center">勤務時間: <span className="text-white font-semibold">{getWorkHours()}</span></p>}
          <div className="flex gap-4">
            <button onClick={() => { clockIn(); showToast('出勤を記録しました', 'success'); }} disabled={!!record?.clockIn}
              className="flex-1 flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-4 rounded-xl font-semibold transition-colors">
              <LogIn className="w-5 h-5" /> 出勤
            </button>
            <button onClick={() => { clockOut(); showToast('退勤を記録しました', 'success'); }} disabled={!record?.clockIn || !!record?.clockOut}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-4 rounded-xl font-semibold transition-colors">
              <LogOut className="w-5 h-5" /> 退勤
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: '通常出勤', type: 'normal' }, { label: 'リモート', type: 'remote' }, { label: '有給休暇', type: 'paid-leave' }].map(({ label, type }) => (
            <div key={type} className={`bg-zinc-900/50 border rounded-xl p-3 text-center text-sm ${record?.type === type ? 'border-accent-500/50 text-accent-400' : 'border-zinc-800 text-zinc-500'}`}>{label}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
