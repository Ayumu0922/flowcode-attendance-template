import { Clock, CalendarCheck, Coffee, TrendingUp } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import { useAttendanceStore } from '../store/attendanceStore';

export default function ReportPage() {
  const { records } = useAttendanceStore();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.date.startsWith(currentMonth));
  const workedDays = monthRecords.filter((r) => r.clockIn && r.clockOut).length;
  const remoteDays = monthRecords.filter((r) => r.type === 'remote').length;
  const paidLeave = monthRecords.filter((r) => r.type === 'paid-leave').length;

  const totalMinutes = monthRecords.reduce((sum, r) => {
    if (!r.clockIn || !r.clockOut) return sum;
    const [inH, inM] = r.clockIn.split(':').map(Number);
    const [outH, outM] = r.clockOut.split(':').map(Number);
    return sum + (outH * 60 + outM) - (inH * 60 + inM) - r.breakMinutes;
  }, 0);

  const avgHours = workedDays > 0 ? (totalMinutes / workedDays / 60).toFixed(1) : '0';

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-foreground">月次レポート</h1>
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: CalendarCheck, label: '出勤日数', value: `${workedDays}日`, color: '#f97316' },
          { icon: Clock, label: '総勤務時間', value: `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60}m`, color: '#3b82f6' },
          { icon: TrendingUp, label: '平均勤務', value: `${avgHours}h/日`, color: '#10b981' },
          { icon: Coffee, label: 'リモート', value: `${remoteDays}日`, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <Icon className="w-5 h-5 mb-2" style={{ color }} />
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-zinc-800">
            <th className="text-left text-xs text-zinc-500 px-5 py-3">日付</th>
            <th className="text-left text-xs text-zinc-500 px-5 py-3">種別</th>
            <th className="text-left text-xs text-zinc-500 px-5 py-3">出勤</th>
            <th className="text-left text-xs text-zinc-500 px-5 py-3">退勤</th>
            <th className="text-left text-xs text-zinc-500 px-5 py-3">勤務時間</th>
          </tr></thead>
          <tbody>
            {monthRecords.slice(0, 15).map((r) => {
              let hours = '';
              if (r.clockIn && r.clockOut) {
                const [iH, iM] = r.clockIn.split(':').map(Number);
                const [oH, oM] = r.clockOut.split(':').map(Number);
                const m = (oH * 60 + oM) - (iH * 60 + iM) - r.breakMinutes;
                hours = `${Math.floor(m / 60)}h${m % 60}m`;
              }
              return (
                <tr key={r.date} className="border-b border-zinc-800/50 last:border-0">
                  <td className="px-5 py-2.5 text-sm text-foreground">{r.date}</td>
                  <td className="px-5 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${r.type === 'remote' ? 'bg-blue-500/10 text-blue-400' : r.type === 'paid-leave' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{r.type === 'remote' ? 'リモート' : r.type === 'paid-leave' ? '有給' : '通常'}</span></td>
                  <td className="px-5 py-2.5 text-sm text-zinc-400">{r.clockIn || '-'}</td>
                  <td className="px-5 py-2.5 text-sm text-zinc-400">{r.clockOut || '-'}</td>
                  <td className="px-5 py-2.5 text-sm text-zinc-400">{hours || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageTransition>
  );
}
