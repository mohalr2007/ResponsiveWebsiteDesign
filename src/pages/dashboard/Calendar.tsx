import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useDashTheme } from '@/context/DashTheme';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00–18:00

const events = [
  { id: 'e1', jobId: 'J-2404', client: 'Lars Pettersson', type: 'Emergency', start: 8, end: 9.5, zone: 'Central', status: 'in_progress', color: '#E53935', day: 0 },
  { id: 'travel1', travel: true, start: 9.5, end: 10, from: 'Central', to: 'West', color: '#2A3444', day: 0 },
  { id: 'e2', jobId: 'J-2402', client: 'Erik Johansson', type: 'Repair', start: 10, end: 10.75, zone: 'West', status: 'scheduled', color: '#3B9AC4', day: 0 },
  { id: 'travel2', travel: true, start: 10.75, end: 11.25, from: 'West', to: 'Central', color: '#2A3444', day: 0 },
  { id: 'e3', jobId: 'J-2401', client: 'Anna Lindström', type: 'Repair', start: 13, end: 14.5, zone: 'Central', status: 'scheduled', color: '#0891B2', day: 0 },
  { id: 'e4', jobId: 'J-2402', client: 'Maria Svensson', type: 'Installation', start: 9, end: 11, zone: 'East', status: 'scheduled', color: '#7B61FF', day: 1 },
  { id: 'e5', jobId: 'J-2405', client: 'Sofia Bergström', type: 'Repair', start: 14, end: 15, zone: 'South', status: 'scheduled', color: '#3B9AC4', day: 2 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DATES = ['28 Sep', '29 Sep', '30 Sep', '1 Oct', '2 Oct'];

const pct = (h: number) => ((h - 7) / 11) * 100;
const colHeight = 660; // px

export default function CalendarPage() {
  const { tokens: T } = useDashTheme();
  const [view, setView] = useState<'day' | 'week'>('week');
  const [selectedDay, setSelectedDay] = useState(0);

  const shownEvents = view === 'week' ? events : events.filter(e => e.day === selectedDay);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, color: T.text, marginBottom: 4 }}>Calendar</h1>
            <p style={{ fontSize: 13, color: T.textMid }}>Week of 28 Sep – 2 Oct 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost px-3 py-2 rounded-lg text-sm">← Prev</button>
            <button className="px-3 py-2 rounded-lg text-sm" style={{ background: 'rgba(8,145,178,0.1)', color: '#0891B2', border: `1px solid ${T.cardBorderStrong}`, cursor: 'pointer' }}>Today</button>
            <button className="btn-ghost px-3 py-2 rounded-lg text-sm">Next →</button>
            <div className="flex gap-1 ml-2 p-1 rounded-lg" style={{ background: T.input, border: `1px solid ${T.cardBorder}` }}>
              {(['day', 'week'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize"
                  style={{
                    background: view === v ? 'rgba(8,145,178,0.14)' : 'transparent',
                    color: view === v ? '#0891B2' : T.textMid,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-5 flex-wrap">
          {[
            { color: '#E53935', label: 'Emergency' },
            { color: '#0891B2', label: 'Repair' },
            { color: '#3B9AC4', label: 'Scheduled' },
            { color: '#7B61FF', label: 'Installation' },
            { color: '#2A3444', label: 'Travel' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span style={{ fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Day selector for day view */}
        {view === 'day' && (
          <div className="flex gap-2 mb-5">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelectedDay(i)}
                className="flex-1 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: selectedDay === i ? 'rgba(8,145,178,0.12)' : 'rgba(8,145,178,0.04)',
                  color: selectedDay === i ? '#0891B2' : T.textMid,
                  border: `1px solid ${selectedDay === i ? 'rgba(8,145,178,0.3)' : T.divider}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{d}</div>
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}>{DATES[i]}</div>
              </button>
            ))}
          </div>
        )}

        {/* Calendar grid */}
        <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
          {/* Day headers (week view) */}
          {view === 'week' && (
            <div className="grid border-b" style={{ gridTemplateColumns: '56px repeat(5, 1fr)', borderColor: T.cardBorder }}>
              <div />
              {DAYS.map((d, i) => (
                <div key={d} className="py-3 text-center" style={{ borderLeft: `1px solid ${T.divider}` }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textMid, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: i === 0 ? '#0891B2' : T.text, fontWeight: 300 }}>{DATES[i].split(' ')[0]}</div>
                </div>
              ))}
            </div>
          )}

          {/* Time grid */}
          <div className="relative" style={{ overflowY: 'auto', maxHeight: 600 }}>
            <div style={{ display: 'grid', gridTemplateColumns: view === 'week' ? '56px repeat(5, 1fr)' : '56px 1fr', position: 'relative' }}>
              {/* Hour labels */}
              <div className="relative">
                {HOURS.map(h => (
                  <div key={h} style={{ height: 55, display: 'flex', alignItems: 'flex-start', paddingTop: 4, paddingRight: 8, justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textDim }}>{h}:00</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {(view === 'week' ? DAYS : ['Today']).map((_, dayIdx) => (
                <div key={dayIdx} className="relative" style={{ borderLeft: `1px solid ${T.divider}` }}>
                  {HOURS.map(h => (
                    <div key={h} style={{ height: 55, borderBottom: `1px solid rgba(8,145,178,0.04)` }} />
                  ))}

                  {/* Events */}
                  {shownEvents
                    .filter(e => e.day === (view === 'week' ? dayIdx : selectedDay))
                    .map(ev => {
                      const top = ((ev.start - 7) / 11) * 100;
                      const height = ((ev.end - ev.start) / 11) * 100;
                      return (
                        <div
                          key={ev.id}
                          className="absolute left-1 right-1 rounded-lg overflow-hidden transition-all"
                          style={{
                            top: `${top}%`,
                            height: `${height}%`,
                            background: `${ev.color}22`,
                            border: `1px solid ${ev.color}44`,
                            cursor: ev.travel ? 'default' : 'pointer',
                            minHeight: 22,
                          }}
                          onMouseEnter={e => { if (!ev.travel) (e.currentTarget as HTMLElement).style.background = `${ev.color}35`; }}
                          onMouseLeave={e => { if (!ev.travel) (e.currentTarget as HTMLElement).style.background = `${ev.color}22`; }}
                        >
                          <div className="flex items-center gap-1 px-2 py-1" style={{ height: '100%' }}>
                            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: ev.color }} />
                            <div style={{ overflow: 'hidden' }}>
                              {ev.travel ? (
                                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: T.textDim }}>
                                  → travel
                                </span>
                              ) : (
                                <>
                                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: ev.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {(ev as any).client}
                                  </div>
                                  <div style={{ fontSize: 9, color: T.textMid }}>{(ev as any).type}</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Current time line (only today = day 0) */}
                  {dayIdx === 0 && (
                    <div className="absolute left-0 right-0" style={{ top: '18%', height: 2, background: '#E53935', zIndex: 10, boxShadow: '0 0 8px rgba(229,57,53,0.6)' }}>
                      <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full" style={{ background: '#E53935' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
