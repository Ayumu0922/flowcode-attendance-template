import { NavLink } from 'react-router-dom';
import { Clock, CalendarDays, FileBarChart, Settings } from 'lucide-react';
import SidebarSettings from '../ui/SidebarSettings';

const links = [
  { to: '/', icon: Clock, label: '打刻' },
  { to: '/calendar', icon: CalendarDays, label: 'カレンダー' },
  { to: '/report', icon: FileBarChart, label: 'レポート' },
  { to: '/settings', icon: Settings, label: '設定' },
];

export default function Sidebar() {
  return (
    <aside data-fc-id="Sidebar-root" className="w-60 h-full border-r border-zinc-800 bg-zinc-900/50 p-4 flex flex-col">
      <div data-fc-id="Sidebar-brand" className="flex items-center gap-2 px-3 py-4 mb-4">
        <Clock className="w-6 h-6 text-accent-500" />
        <span className="text-base font-bold text-white">勤怠管理</span>
      </div>
      <nav data-fc-id="Sidebar-nav" className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent-500/10 text-accent-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`
          }><Icon className="w-4 h-4" />{label}</NavLink>
        ))}
      </nav>
      <SidebarSettings storageKey="attendance-storage" exportFileName="attendance-data" />
    </aside>
  );
}
