import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import PageTransition from './PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div data-fc-id="NotFound-icon" className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-zinc-500" />
      </div>
      <h1 data-fc-id="NotFound-title" className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p data-fc-id="NotFound-message" className="text-zinc-400 mb-8 text-center">
        お探しのページは見つかりませんでした
      </p>
      <Link
        data-fc-id="NotFound-home-link"
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 hover:bg-accent-500 text-on-accent text-sm font-medium rounded-lg transition-colors"
      >
        <Home className="w-4 h-4" />
        ホームに戻る
      </Link>
    </PageTransition>
  );
}
