import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { mockJobs, mockSlots } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

export default function JobDetail() {
  const { tokens: T } = useDashTheme();
  const { id } = useParams();
  const job = mockJobs.find(j => j.id === id) || mockJobs[0];
  const [approved, setApproved] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState(job.status);
  const [editedType, setEditedType] = useState(job.type);
  const [editedDuration, setEditedDuration] = useState(job.duration);
  const [editedEstimate, setEditedEstimate] = useState(job.estimate);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-SE', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-up">
        {/* Back */}
        <Link to="/dashboard/jobs" className="flex items-center gap-1.5 no-underline mb-6 group"
          style={{ color: T.textMid, fontSize: 13 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = T.text}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = T.textMid}
        >
          ← Jobs
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: T.textMid }}>{job.id}</span>
              <span className="tag" style={{ background: job.aiScore > 80 ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: job.aiScore > 80 ? '#22C55E' : '#F59E0B' }}>
                AI {job.aiScore}%
              </span>
              {job.urgency === 'emergency' && (
                <span className="tag" style={{ background: 'rgba(229,57,53,0.12)', color: '#E53935' }}>EMERGENCY</span>
              )}
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: T.text }}>{job.client}</h1>
            <p style={{ fontSize: 13, color: T.textMid }}>{job.address}</p>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textMid }}>
            {new Date(job.createdAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
          </div>
        </div>

        {/* AI warning */}
        {job.aiWarning && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-up" style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.25)' }}>
            <span style={{ fontSize: 16 }}>⚠</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#EF5350', marginBottom: 2 }}>Manual review recommended</div>
              <div style={{ fontSize: 12, color: '#A07070', lineHeight: 1.5 }}>{job.aiWarning}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: editable form */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="p-5 rounded-2xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: T.text, marginBottom: 16, fontWeight: 400 }}>Job details</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Type</label>
                  <select className="vvs-input" value={editedType} onChange={e => setEditedType(e.target.value)} style={{ background: T.input }}>
                    {['Repair', 'Emergency', 'Installation', 'Renovation', 'Inspection'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Duration (min)</label>
                    <input type="number" className="vvs-input" value={editedDuration} onChange={e => setEditedDuration(+e.target.value)} style={{ background: T.input }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Estimate (SEK)</label>
                    <input type="text" className="vvs-input" value={editedEstimate} onChange={e => setEditedEstimate(e.target.value)} style={{ background: T.input }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Client description</label>
                  <textarea className="vvs-input" style={{ minHeight: 90, resize: 'vertical', background: T.input }} defaultValue={job.description} />
                </div>
              </div>
              <button className="btn-ghost w-full py-2.5 rounded-lg text-sm font-medium mt-4">
                Save edited details
              </button>
            </div>

            {/* Client info */}
            <div className="p-5 rounded-2xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: T.text, marginBottom: 14, fontWeight: 400 }}>Client</h3>
              {[
                { label: 'Name', value: job.client },
                { label: 'Phone', value: job.phone },
                { label: 'Address', value: job.address },
                { label: 'Zone', value: job.zone },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${T.divider}` }}>
                  <span style={{ fontSize: 12, color: T.textMid }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: T.text }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Decision panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-5 rounded-2xl" style={{ background: T.card, border: `1px solid ${T.cardBorderStrong}` }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: T.text, marginBottom: 14, fontWeight: 400 }}>Decision</h3>

              {!approved ? (
                <button onClick={() => setApproved(true)} className="btn-copper w-full py-3 rounded-xl font-semibold text-sm mb-3">
                  Approve & Find Slots →
                </button>
              ) : (
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#22C55E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                    ✓ Approved — pick a slot
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    {mockSlots.slice(0, 4).map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className="text-left p-3 rounded-lg transition-all"
                        style={{
                          background: selectedSlot === slot.id ? 'rgba(8,145,178,0.12)' : 'rgba(8,145,178,0.04)',
                          border: `1px solid ${selectedSlot === slot.id ? '#0891B2' : T.cardBorder}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: T.text }}>
                          {formatDate(slot.date)} · {slot.time}
                        </div>
                        <div style={{ fontSize: 11, color: T.textMid }}>{slot.zone} · +{slot.travel}min travel</div>
                      </button>
                    ))}
                  </div>
                  {selectedSlot && (
                    <button onClick={() => setStatus('scheduled')} className="btn-copper w-full py-2.5 rounded-lg text-sm font-semibold">
                      Book this slot ✓
                    </button>
                  )}
                </div>
              )}

              <div className="copper-line my-4" />

              <div className="flex flex-col gap-2">
                {status === 'scheduled' && (
                  <button onClick={() => setStatus('in_progress')} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer' }}>
                    Start job
                  </button>
                )}
                {status === 'in_progress' && (
                  <button onClick={() => setStatus('completed')} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer' }}>
                    Mark completed ✓
                  </button>
                )}
                <button onClick={() => setStatus('waitlist')} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(123,97,255,0.1)', color: '#7B61FF', border: '1px solid rgba(123,97,255,0.2)', cursor: 'pointer' }}>
                  Move to waitlist
                </button>
                <button onClick={() => setStatus('cancelled')} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(229,57,53,0.06)', color: '#E53935', border: '1px solid rgba(229,57,53,0.15)', cursor: 'pointer' }}>
                  Cancel appointment
                </button>
              </div>

              {status === 'cancelled' && (
                <div className="mt-3 p-3 rounded-lg animate-slide-up" style={{ background: T.divider, border: `1px solid ${T.cardBorderStrong}` }}>
                  <div style={{ fontSize: 12, color: '#0891B2' }}>
                    <Link to="/dashboard/waitlist" style={{ color: '#0891B2' }}>Recover this slot from the waitlist →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Current status */}
            <div className="p-4 rounded-xl" style={{ background: T.cardAlt, border: `1px solid ${T.divider}` }}>
              <div style={{ fontSize: 11, color: T.textMid, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Current status</div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 600, textTransform: 'capitalize' }}>
                {status.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
