import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockROTSummaries } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Review: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  Ready: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
  Exported: { bg: 'rgba(74,85,104,0.12)', color: '#6DA8C4' },
};

export default function ROT() {
  const { tokens: T } = useDashTheme();
  const [summaries, setSummaries] = useState(mockROTSummaries);

  const setStatus = (id: string, status: string) => {
    setSummaries(ss => ss.map(s => s.id === id ? { ...s, status } : s));
  };

  const readyCount = summaries.filter(s => s.status === 'Ready').length;
  const totalDeduction = summaries.reduce((acc, s) => acc + s.rotDeduction, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-up">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, color: T.text, marginBottom: 4 }}>ROT Summaries</h1>
            <p style={{ fontSize: 13, color: T.textMid }}>Swedish tax deduction (ROT ≈ 30% of labour) for completed work.</p>
          </div>
          <button
            disabled={readyCount === 0}
            className="btn-copper px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
            style={{ opacity: readyCount === 0 ? 0.4 : 1 }}
          >
            Export ready summaries (CSV)
          </button>
        </div>

        {/* Demo notice */}
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: T.input, border: `1px dashed ${T.cardBorderStrong}` }}>
          <span style={{ fontSize: 14 }}>ℹ</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#0891B2', letterSpacing: '0.04em' }}>
            Demo export — no government connection
          </span>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total deductions', value: `${totalDeduction.toLocaleString('sv-SE')} SEK`, color: '#0891B2' },
            { label: 'Ready to export', value: readyCount, color: '#22C55E' },
            { label: 'Pending review', value: summaries.filter(s => s.status === 'Review').length, color: '#F59E0B' },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textMid, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: stat.color, fontWeight: 300 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Desktop table — hidden on mobile */}
        <div className="hidden md:block rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
          <div className="grid grid-cols-12 px-5 py-3" style={{ borderBottom: `1px solid ${T.cardBorder}`, background: 'rgba(255,255,255,0.02)' }}>
            {['Client', 'Work', 'Labour (SEK)', 'Materials (SEK)', 'ROT (SEK)', 'Status'].map(h => (
              <div key={h} className="col-span-2" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {h}
              </div>
            ))}
          </div>
          {summaries.map((s, i) => (
            <div key={s.id} className="grid grid-cols-12 px-5 py-4 items-center animate-fade-up"
              style={{ borderBottom: i < summaries.length - 1 ? `1px solid rgba(8,145,178,0.05)` : 'none', animationDelay: `${i * 60}ms` }}>
              <div className="col-span-2">
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{s.client}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textDim }}>{s.id}</div>
              </div>
              <div className="col-span-2" style={{ fontSize: 13, color: T.textMid }}>{s.work}</div>
              <div className="col-span-2" style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: T.text }}>{s.labour.toLocaleString('sv-SE')}</div>
              <div className="col-span-2" style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: T.text }}>{s.materials.toLocaleString('sv-SE')}</div>
              <div className="col-span-2" style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: '#0891B2', fontWeight: 300 }}>{s.rotDeduction.toLocaleString('sv-SE')}</div>
              <div className="col-span-2">
                <select value={s.status} onChange={e => setStatus(s.id, e.target.value)} className="text-sm rounded-lg px-2 py-1.5"
                  style={{ background: STATUS_COLORS[s.status]?.bg, color: STATUS_COLORS[s.status]?.color, border: `1px solid ${STATUS_COLORS[s.status]?.color}44`, cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                  {['Review', 'Ready', 'Exported'].map(st => <option key={st} value={st} style={{ background: '#0F1620', color: T.text }}>{st}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile card list */}
        <div className="md:hidden flex flex-col gap-3">
          {summaries.map((s, i) => (
            <div key={s.id} className="rounded-2xl p-4 animate-fade-up"
              style={{ background: T.card, border: `1px solid ${T.cardBorder}`, animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.client}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: T.textDim, marginTop: 2 }}>{s.id} · {s.work}</div>
                </div>
                <select value={s.status} onChange={e => setStatus(s.id, e.target.value)} className="text-sm rounded-lg px-2 py-1"
                  style={{ background: STATUS_COLORS[s.status]?.bg, color: STATUS_COLORS[s.status]?.color, border: `1px solid ${STATUS_COLORS[s.status]?.color}44`, cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                  {['Review', 'Ready', 'Exported'].map(st => <option key={st} value={st} style={{ background: '#0F1620', color: T.text }}>{st}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Labour', value: s.labour.toLocaleString('sv-SE') },
                  { label: 'Materials', value: s.materials.toLocaleString('sv-SE') },
                  { label: 'ROT', value: s.rotDeduction.toLocaleString('sv-SE'), accent: true },
                ].map(cell => (
                  <div key={cell.label} className="p-2 rounded-lg" style={{ background: T.cardAlt }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{cell.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: cell.accent ? '#0891B2' : T.text, fontWeight: 600 }}>{cell.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
