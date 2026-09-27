import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientNav from '@/components/ClientNav';
import { mockSlots } from '@/data/mock';

type Step = 1 | 2 | 3 | 4 | 5 | 'done';

const STEPS = ['Service', 'Details', 'Location', 'Time', 'Confirm'];
const BG = '#030E1C';
const SURF = 'rgba(7,26,46,0.75)';
const W = '#0891B2';
const WL = '#22D3EE';
const CU = '#B87333';

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full max-w-lg mx-auto">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400"
                style={{
                  background: done ? W : active ? 'rgba(8,145,178,0.12)' : 'rgba(255,255,255,0.04)',
                  border: active ? `2px solid ${W}` : done ? `2px solid ${W}` : '2px solid rgba(8,145,178,0.15)',
                  color: done ? '#030E1C' : active ? W : '#2E5B75',
                  fontFamily: 'JetBrains Mono',
                  boxShadow: active ? `0 0 12px rgba(8,145,178,0.4)` : 'none',
                }}>
                {done ? '✓' : num}
              </div>
              <span className="mt-1 text-center hidden sm:block"
                style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: active ? WL : '#2E5B75', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 transition-all duration-500"
                style={{ background: done ? `linear-gradient(90deg, ${W}, ${WL})` : 'rgba(8,145,178,0.1)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-SE', { weekday: 'short', month: 'short', day: 'numeric' });

const groupSlotsByDay = (slots: typeof mockSlots) => {
  const groups: Record<string, typeof mockSlots> = {};
  slots.forEach(s => { if (!groups[s.date]) groups[s.date] = []; groups[s.date].push(s); });
  return groups;
};

export default function Book() {
  const [step, setStep] = useState<Step>(1);
  const [jobType, setJobType] = useState<'repair' | 'install' | null>(null);
  const [leaking, setLeaking] = useState<boolean | null>(null);
  const [description, setDescription] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingRef] = useState('VVS-' + Math.random().toString(36).substring(2, 7).toUpperCase());

  const goNext = () => setStep(s => (typeof s === 'number' && s < 5 ? (s + 1) as Step : s === 5 ? 'done' : s));
  const goBack = () => setStep(s => (typeof s === 'number' && s > 1 ? (s - 1) as Step : s));

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 1800);
  };

  const groups = groupSlotsByDay(mockSlots);

  if (step === 'done') {
    const slot = mockSlots.find(s => s.id === selectedSlot);
    return (
      <div style={{ background: BG, minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
        <ClientNav />
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', boxShadow: '0 0 40px rgba(16,185,129,0.15)' }}>
              <span style={{ fontSize: 36 }}>✓</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>Booking received.</h1>
            <p style={{ color: '#6DA8C4', marginBottom: 24 }}>Mats will review and confirm within 2 hours.</p>
            <div style={{ background: SURF, border: `1px solid rgba(8,145,178,0.15)`, borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'left' }}>
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#6DA8C4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Reference</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: WL }}>{bookingRef}</span>
              </div>
              {[
                { label: 'Service', value: jobType === 'repair' ? 'Repair / Emergency' : 'Installation' },
                ...(slot ? [{ label: 'Time', value: `${formatDate(slot.date)} · ${slot.time}` }] : []),
                { label: 'Address', value: form.address || 'Provided' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(8,145,178,0.07)' }}>
                  <span style={{ fontSize: 13, color: '#6DA8C4' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: '#D9EEF7' }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link to="/access/demo-token" className="flex-1 btn-water no-underline inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold">
                View booking
              </Link>
              <button className="flex-1 btn-ghost py-3 rounded-xl text-sm font-semibold">Add to calendar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <ClientNav />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-32">
        {/* Progress */}
        <div className="mb-12 animate-fade-up">
          <StepProgress current={typeof step === 'number' ? step : 5} />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>What do you need?</h2>
            <p style={{ color: '#6DA8C4', marginBottom: 32, fontSize: 15 }}>Choose the type of service.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { id: 'repair', title: 'Repair / Emergency', desc: 'Something is broken, leaking, or not working.', icon: '🔧' },
                { id: 'install', title: 'New Installation', desc: 'A new fixture, appliance, or full renovation.', icon: '🏗' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setJobType(opt.id as 'repair' | 'install')}
                  className="text-left p-6 rounded-xl transition-all duration-200"
                  style={{
                    background: jobType === opt.id ? 'rgba(8,145,178,0.1)' : SURF,
                    border: `1px solid ${jobType === opt.id ? W : 'rgba(8,145,178,0.12)'}`,
                    boxShadow: jobType === opt.id ? `0 0 0 3px rgba(8,145,178,0.15)` : 'none',
                    cursor: 'pointer',
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{opt.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#D9EEF7', marginBottom: 6 }}>{opt.title}</div>
                  <div style={{ fontSize: 13, color: '#6DA8C4', lineHeight: 1.5 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            {jobType === 'repair' && (
              <div className="animate-slide-up p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#D9EEF7', marginBottom: 12 }}>Is water actively leaking right now?</p>
                <div className="flex gap-3">
                  <Link to="/emergency" className="btn-emergency no-underline flex-1 text-center py-3 rounded-lg text-sm font-semibold">
                    Yes — emergency
                  </Link>
                  <button onClick={() => setLeaking(false)} className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: leaking === false ? 'rgba(8,145,178,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${leaking === false ? W : 'rgba(255,255,255,0.1)'}`, color: leaking === false ? WL : '#D9EEF7', cursor: 'pointer' }}>
                    No, it can wait
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>Describe the problem</h2>
            <p style={{ color: '#6DA8C4', marginBottom: 24, fontSize: 15 }}>Use your own words — no technical knowledge needed.</p>
            <textarea className="vvs-input" style={{ minHeight: 140, resize: 'vertical' }}
              placeholder="e.g. The hot water in my bathroom stopped working yesterday. The boiler clicks but doesn't ignite…"
              value={description} onChange={e => setDescription(e.target.value)} />
            <button onClick={handleAnalyze} disabled={description.length < 10 || analyzing}
              className="btn-water w-full py-3 rounded-xl mt-4 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ opacity: description.length < 10 ? 0.4 : 1 }}>
              {analyzing ? <><span style={{ display: 'inline-block', animation: 'ticker 0.8s linear infinite' }}>⟳</span> Analysing…</> : 'Understand request →'}
            </button>
            {analyzed && (
              <div className="animate-slide-up mt-6 p-5 rounded-xl" style={{ background: SURF, border: `1px solid rgba(8,145,178,0.2)` }}>
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: W, letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI understanding</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(8,145,178,0.2)' }} />
                  <span className="tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>87% confidence</span>
                </div>
                {[
                  { label: 'Type', value: 'Boiler / hot water system failure' },
                  { label: 'Urgency', value: 'Medium — not an emergency' },
                  { label: 'Est. duration', value: '90 min' },
                  { label: 'Price range', value: '2 200 – 3 400 SEK' },
                  { label: 'Missing info', value: 'Boiler brand & age (helpful but not required)' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(8,145,178,0.07)' }}>
                    <span style={{ fontSize: 13, color: '#6DA8C4' }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: '#D9EEF7', fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>Your details</h2>
            <p style={{ color: '#6DA8C4', marginBottom: 24, fontSize: 15 }}>So Mats knows where to go and how to reach you.</p>
            <div className="flex flex-col gap-4">
              {[
                { key: 'name', label: 'Full name', placeholder: 'Anna Lindström', type: 'text' },
                { key: 'address', label: 'Address', placeholder: 'Vasagatan 14, Västerås', type: 'text' },
                { key: 'phone', label: 'Phone number', placeholder: '+46 73 456 78 90', type: 'tel' },
                { key: 'email', label: 'Email (optional)', placeholder: 'anna@example.com', type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6DA8C4', fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input type={field.type} className="vvs-input" placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#6DA8C4', fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Photo (optional)
                </label>
                <div className="w-full p-6 rounded-xl flex flex-col items-center gap-2 cursor-pointer"
                  style={{ border: `2px dashed rgba(8,145,178,0.2)`, color: '#6DA8C4', fontSize: 13 }}>
                  <span style={{ fontSize: 24 }}>📷</span>
                  <span>Tap to upload a photo of the issue</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>Pick a time</h2>
            <p style={{ color: '#6DA8C4', marginBottom: 24, fontSize: 15 }}>Only real available slots — travel time included.</p>
            {Object.entries(groups).map(([date, slots]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: W, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {formatDate(date)}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(8,145,178,0.1)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map(slot => (
                    <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                      className={`slot-card text-left ${selectedSlot === slot.id ? 'selected' : ''}`}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 500, color: '#D9EEF7', marginBottom: 4 }}>
                        {slot.time}
                      </div>
                      <div style={{ fontSize: 12, color: '#6DA8C4' }}>{slot.duration} min · {slot.zone}</div>
                      <div style={{ fontSize: 11, color: '#2E5B75', marginTop: 2 }}>+{slot.travel} min travel</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>Review & confirm</h2>
            <p style={{ color: '#6DA8C4', marginBottom: 24, fontSize: 15 }}>Nothing is confirmed until you press the button below.</p>
            {(() => {
              const slot = mockSlots.find(s => s.id === selectedSlot);
              return (
                <div style={{ background: SURF, border: `1px solid rgba(8,145,178,0.12)`, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
                  {[
                    { label: 'Service', value: jobType === 'repair' ? 'Repair / Emergency' : 'New Installation' },
                    { label: 'Client', value: form.name || '—' },
                    { label: 'Address', value: form.address || '—' },
                    { label: 'Phone', value: form.phone || '—' },
                    { label: 'Time', value: slot ? `${formatDate(slot.date)} at ${slot.time}` : '—' },
                    { label: 'Estimate', value: '2 200 – 3 400 SEK' },
                  ].map((row, i, arr) => (
                    <div key={row.label} className="flex justify-between px-5 py-4"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(8,145,178,0.07)' : 'none' }}>
                      <span style={{ fontSize: 13, color: '#6DA8C4' }}>{row.label}</span>
                      <span style={{ fontSize: 13, color: '#D9EEF7', fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div className="p-4 rounded-xl mb-2" style={{ background: 'rgba(184,115,51,0.06)', border: '1px solid rgba(184,115,51,0.15)' }}>
              <p style={{ fontSize: 13, color: '#A08060', lineHeight: 1.6 }}>
                This is an estimate — not a binding quote. Final price depends on what Mats finds on site.
              </p>
            </div>
          </div>
        )}

        {/* Sticky nav */}
        <div className="sticky-bar">
          <div className="flex gap-3">
            {typeof step === 'number' && step > 1 && (
              <button onClick={goBack} className="btn-ghost flex-1 py-4 rounded-xl font-semibold">← Back</button>
            )}
            {step === 1 && (
              <button onClick={goNext} disabled={!jobType || (jobType === 'repair' && leaking === null)}
                className="btn-water flex-1 py-4 rounded-xl font-semibold"
                style={{ opacity: !jobType || (jobType === 'repair' && leaking === null) ? 0.4 : 1 }}>
                Continue →
              </button>
            )}
            {step === 2 && (
              <button onClick={goNext} disabled={!analyzed} className="btn-water flex-1 py-4 rounded-xl font-semibold"
                style={{ opacity: !analyzed ? 0.4 : 1 }}>Continue →</button>
            )}
            {step === 3 && (
              <button onClick={goNext} disabled={!form.name || !form.address || !form.phone}
                className="btn-water flex-1 py-4 rounded-xl font-semibold"
                style={{ opacity: !form.name || !form.address || !form.phone ? 0.4 : 1 }}>Continue →</button>
            )}
            {step === 4 && (
              <button onClick={goNext} disabled={!selectedSlot} className="btn-water flex-1 py-4 rounded-xl font-semibold"
                style={{ opacity: !selectedSlot ? 0.4 : 1 }}>Continue →</button>
            )}
            {step === 5 && (
              <button onClick={() => setStep('done')} className="btn-water flex-1 py-4 rounded-xl font-semibold">
                Confirm booking ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
