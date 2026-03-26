import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div data-fc-id="EmptyState" className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-400 text-center max-w-xs mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
