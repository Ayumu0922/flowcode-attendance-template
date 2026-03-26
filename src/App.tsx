import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';
import NotFoundPage from './components/ui/NotFoundPage';
import TimeclockPage from './pages/TimeclockPage';
import CalendarPage from './pages/CalendarPage';
import ReportPage from './pages/ReportPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TimeclockPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
