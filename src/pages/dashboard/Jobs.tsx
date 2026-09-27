import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { mockJobs } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  needs_review: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Review' },
  scheduled: { bg: 'rgba(59,154,196,0.12)', color: '#3B9AC4', label: 'Scheduled' },
  in_progress: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E', label: 'In progress' },
  completed: { bg: 'rgba(74,85,104,0.12)', color: '#2E5B75', label: 'Completed' },
  waitlist: { bg: 'rgba(123,97,255,0.12)', color: '#7B61FF', label: 'Waitlist' },
  cancelled: { bg: 'rgba(229,57,53,0.12)', color: '#E53935', label: 'Cancelled' },
};

const URGENCY_COLORS: Record<string, string> = {
  emergency: '#E53935',
  high: '#F59E0B',
  medium: '#3B9AC4',
  low: '#2E5B75',
};

const FILTERS = ['All', 'Review', 'Scheduled', 'In progress', 'Completed'];

export default function Jobs() {
  const { tokens: T } = useDashTheme();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockJobs.filter(j => {
    const matchFilter = filter === 'All' || STATUS_COLORS[j.status]?.label === filter;
    const matchSearch = !search || j.client.toLowerCase().includes(search.toLowerCase()) || j.type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, color: T.text, marginBottom: 4 }}>Jobs</h1>
            <p style={{ fontSize: 13, color: T.textMid }}>{mockJobs.length} total · {mockJobs.filter(j => j.status === 'needs_review').length} need review</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            className="vvs-input"
            placeholder="Search by client or type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280, background: T.input }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: filter === f ? 'rgba(8,145,178,0.12)' : 'rgba(8,145,178,0.04)',
                  color: filter === f ? '#0891B2' : T.textMid,
                  border: `1px solid ${filter === f ? 'rgba(8,145,178,0.3)' : T.cardBorder}`,
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: T.textDim }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>◌</div>
            <div style={{ fontSize: 14 }}>No jobs match this filter</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((job, i) => (
              <Link
                key={job.id}
                to={`/dashboard/jobs/${job.id}`}
                className="no-underline flex items-center gap-4 px-5 py-4 rounded-xl transition-all group animate-fade-up"
                style={{
                  background: T.card,
                  border: job.aiWarning ? '1px solid rgba(229,57,53,0.2)' : `1px solid ${T.divider}`,
                  animationDelay: `${i * 40}ms`,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(8,145,178,0.25)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = job.aiWarning ? 'rgba(229,57,53,0.2)' : T.divider}
              >
                {/* Urgency dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: URGENCY_COLORS[job.urgency] }} />

                {/* Client + type */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{job.client}</span>
                    {job.aiWarning && (
                      <span className="tag" style={{ background: 'rgba(229,57,53,0.12)', color: '#E53935' }}>AI flag</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: T.textMid, marginTop: 1 }}>
                    {job.id} · {job.type} · {job.zone}
                  </div>
                </div>

                {/* Estimate */}
                <div className="hidden sm:block text-right">
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#0891B2' }}>{job.estimate}</div>
                  <div style={{ fontSize: 11, color: T.textDim }}>{job.duration} min</div>
                </div>

                {/* AI score */}
                <div className="hidden md:flex flex-col items-center">
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: job.aiScore > 80 ? '#22C55E' : job.aiScore > 60 ? '#F59E0B' : '#E53935' }}>
                    {job.aiScore}%
                  </div>
                  <div style={{ fontSize: 10, color: T.textDim }}>AI conf.</div>
                </div>

                {/* Status */}
                <span className="tag" style={{ background: STATUS_COLORS[job.status]?.bg, color: STATUS_COLORS[job.status]?.color }}>
                  {STATUS_COLORS[job.status]?.label}
                </span>

                <span style={{ color: T.textDim, fontSize: 12 }}>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
