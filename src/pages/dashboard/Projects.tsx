import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { mockProjects } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  'In progress': { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
  'Planning': { bg: 'rgba(59,154,196,0.12)', color: '#3B9AC4' },
  'Completed': { bg: 'rgba(74,85,104,0.12)', color: '#6DA8C4' },
  'On hold': { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
};

export default function Projects() {
  const { tokens: T } = useDashTheme();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, color: T.text, marginBottom: 4 }}>Projects</h1>
          <p style={{ fontSize: 13, color: T.textMid }}>Multi-day site work — plan each day, track delays.</p>
        </div>

        <div className="flex flex-col gap-3">
          {mockProjects.map((project, i) => (
            <Link
              key={project.id}
              to={`/dashboard/projects/${project.id}`}
              className="no-underline px-6 py-5 rounded-2xl transition-all animate-fade-up group"
              style={{
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                animationDelay: `${i * 80}ms`,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(8,145,178,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = T.cardBorder}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textMid }}>{project.ref}</span>
                    <span className="tag" style={{ background: STAGE_COLORS[project.stage]?.bg, color: STAGE_COLORS[project.stage]?.color }}>
                      {project.stage}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: T.text, fontWeight: 400, marginBottom: 2 }}>{project.name}</h3>
                  <p style={{ fontSize: 13, color: T.textMid }}>{project.client} · {project.address}</p>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: '#0891B2', fontWeight: 300 }}>
                    {project.budget.toLocaleString('sv-SE')} SEK
                  </div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>budget</div>
                </div>
              </div>

              {/* Day progress mini bar */}
              {project.days.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textDim, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {project.startDate} → {project.endDate}
                  </div>
                  <div className="flex gap-1">
                    {project.days.map((day, di) => (
                      <div
                        key={di}
                        title={`${day.date} — ${day.title}`}
                        className="flex-1 h-2 rounded-sm"
                        style={{
                          background: day.status === 'done' ? '#22C55E' :
                                      day.status === 'delayed' ? '#E53935' :
                                      day.status === 'planned' ? 'rgba(8,145,178,0.4)' : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span style={{ fontSize: 10, color: T.textDim, fontFamily: 'JetBrains Mono' }}>
                      {project.days.filter(d => d.status === 'done').length} done
                    </span>
                    <span style={{ fontSize: 10, color: T.textDim, fontFamily: 'JetBrains Mono' }}>
                      {project.days.length} total
                    </span>
                  </div>
                </div>
              )}
              {project.days.length === 0 && (
                <div style={{ fontSize: 12, color: T.textDim, fontStyle: 'italic' }}>No days planned yet</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
