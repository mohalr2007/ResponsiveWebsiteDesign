import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { todayEvents } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

function TimelineBlock({ event }: { event: typeof todayEvents[0] }) {
  const { tokens: T } = useDashTheme();
  if (event.travel) {
    return (
      <div className="flex items-center gap-3 py-1 px-3 rounded-lg" style={{ background: 'rgba(74,85,104,0.15)', border: '1px solid rgba(8,145,178,0.05)' }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textDim }}>{event.start}–{event.end}</span>
        <span style={{ fontSize: 12, color: T.textDim }}>→ Travel: {(event as any).from} → {(event as any).to}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all" style={{ background: `${event.color}10`, border: `1px solid ${event.color}25`, cursor: 'pointer' }}>
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: event.color }} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{(event as any).client}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textMid }}>{event.start}–{event.end}</span>
        </div>
        <div style={{ fontSize: 12, color: T.textMid }}>{(event as any).type} · {(event as any).zone}</div>
      </div>
      <span className="tag" style={{ background: `${event.color}20`, color: event.color }}>
        {(event as any).status === 'in_progress' ? 'Live' : 'Confirmed'}
      </span>
    </div>
  );
}

export default function Overview() {
  const { tokens: T } = useDashTheme();
  const [demoTime, setDemoTime] = useState(new Date('2026-09-27T09:00:00'));
  const hourNow = demoTime.getHours() + demoTime.getMinutes() / 60;

  const alerts = [
    { label: 'Jobs needing review', count: 2, href: '/dashboard/jobs', color: '#F59E0B' },
    { label: 'Unusual AI flags', count: 1, href: '/dashboard/jobs', color: '#E53935' },
    { label: 'Access confirmations pending', count: 1, href: '/dashboard/jobs', color: '#3B9AC4' },
    { label: 'Cancellation slot to recover', count: 1, href: '/dashboard/waitlist', color: '#0891B2' },
    { label: 'Projects needing sign-off', count: 1, href: '/dashboard/projects', color: '#7B61FF' },
    { label: 'Abandoned leads to recover', count: 1, href: '/dashboard/leads', color: '#6DA8C4' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-10 gap-4 flex-wrap">
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textMid, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              {demoTime.toLocaleDateString('en-SE', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 300, color: T.text, lineHeight: 1.15 }}>
              Good morning, Mats.
            </h1>
          </div>
          {/* Demo clock control */}
          <div className="p-3 rounded-xl" style={{ background: 'rgba(8,145,178,0.06)', border: '1px dashed rgba(8,145,178,0.18)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#0891B2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Demo clock</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, color: T.text, textAlign: 'center', marginBottom: 6 }}>
              {demoTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDemoTime(d => new Date(d.getTime() - 3600000))} className="flex-1 py-1 rounded text-xs" style={{ background: 'rgba(8,145,178,0.07)', color: T.textMid, border: 'none', cursor: 'pointer' }}>-1h</button>
              <button onClick={() => setDemoTime(d => new Date(d.getTime() + 3600000))} className="flex-1 py-1 rounded text-xs" style={{ background: 'rgba(8,145,178,0.07)', color: T.textMid, border: 'none', cursor: 'pointer' }}>+1h</button>
              <button onClick={() => setDemoTime(new Date('2026-09-27T09:00:00'))} className="flex-1 py-1 rounded text-xs" style={{ background: 'rgba(8,145,178,0.07)', color: T.textMid, border: 'none', cursor: 'pointer' }}>↺</button>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-6" style={{ background: T.card, border: '1px solid rgba(229,57,53,0.15)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textMid, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Revenue at risk</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 300, color: '#E53935', lineHeight: 1 }}>
              47 200 <span style={{ fontSize: 20 }}>SEK</span>
            </div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 4 }}>Unresolved opportunities</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: T.card, border: '1px solid rgba(34,197,94,0.15)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textMid, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Open capacity today</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 300, color: '#22C55E', lineHeight: 1 }}>
              3.5 <span style={{ fontSize: 20 }}>hrs</span>
            </div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 4 }}>Available work time</div>
          </div>
        </div>

        {/* Attention list */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, color: T.text }}>Needs your attention</h2>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, background: 'rgba(229,57,53,0.15)', color: '#E53935', borderRadius: 999, padding: '2px 8px' }}>
              {alerts.reduce((s, a) => s + a.count, 0)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map(alert => (
              <Link key={alert.label} to={alert.href} className="flex items-center justify-between px-4 py-3 rounded-xl no-underline transition-all group"
                style={{ background: T.card, border: `1px solid ${T.divider}` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${alert.color}40`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = T.divider}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: alert.color }} />
                  <span style={{ fontSize: 14, color: T.text }}>{alert.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: alert.color, fontWeight: 600 }}>{alert.count}</span>
                  <span style={{ color: T.textDim, fontSize: 12 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, color: T.text }}>Today</h2>
            <Link to="/dashboard/calendar" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#0891B2', textDecoration: 'none', letterSpacing: '0.06em' }}>
              Open calendar →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {todayEvents.map((event, i) => (
              <TimelineBlock key={i} event={event} />
            ))}
            {/* Current time indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#E53935', boxShadow: '0 0 6px rgba(229,57,53,0.6)' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#E53935' }}>
                Now — {demoTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
