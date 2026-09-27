import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { DashThemeProvider } from '@/context/DashTheme';

// Client pages
import Home from '@/pages/client/Home';
import Book from '@/pages/client/Book';
import Emergency from '@/pages/client/Emergency';
import Offer from '@/pages/client/Offer';
import Access from '@/pages/client/Access';
import Reschedule from '@/pages/client/Reschedule';

// Dashboard pages
import Login from '@/pages/dashboard/Login';
import Overview from '@/pages/dashboard/Overview';
import Jobs from '@/pages/dashboard/Jobs';
import JobDetail from '@/pages/dashboard/JobDetail';
import Calendar from '@/pages/dashboard/Calendar';
import Waitlist from '@/pages/dashboard/Waitlist';
import Leads from '@/pages/dashboard/Leads';
import Projects from '@/pages/dashboard/Projects';
import ProjectDetail from '@/pages/dashboard/ProjectDetail';
import Inbox from '@/pages/dashboard/Inbox';
import ROT from '@/pages/dashboard/ROT';
import Settings from '@/pages/dashboard/Settings';

function DashboardShell() {
  return (
    <DashThemeProvider>
      <Outlet />
    </DashThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client */}
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/offer/:token" element={<Offer />} />
        <Route path="/access/:token" element={<Access />} />
        <Route path="/reschedule/:token" element={<Reschedule />} />

        {/* Dashboard — shared theme context across all routes */}
        <Route element={<DashboardShell />}>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/jobs" element={<Jobs />} />
          <Route path="/dashboard/jobs/:id" element={<JobDetail />} />
          <Route path="/dashboard/calendar" element={<Calendar />} />
          <Route path="/dashboard/waitlist" element={<Waitlist />} />
          <Route path="/dashboard/leads" element={<Leads />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/projects/:id" element={<ProjectDetail />} />
          <Route path="/dashboard/inbox" element={<Inbox />} />
          <Route path="/dashboard/rot" element={<ROT />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
