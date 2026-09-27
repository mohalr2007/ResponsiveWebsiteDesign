import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockWaitlistClients } from '@/data/mock';
import { useDashTheme } from '@/context/DashTheme';

type WaitlistState = 'idle' | 'scanning' | 'matched' | 'offered' | 'recovered';

export default function Waitlist() {
  const { tokens: T } = useDashTheme();
  const [state, setState] = useState<WaitlistState>('idle');
  const [selected, setSelected] = useState(0);
  const [offerSeconds, setOfferSeconds] = useState(15 * 60);
  const [offerActive, setOfferActive] = useState(false);

  useEffect(() => {
    if (!offerActive) return;
    const t = setInterval(() => {
      setOfferSeconds(s => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [offerActive]);

  const handleScan = () => {
    setState('scanning');
    setTimeout(() => setState('matched'), 2000);
  };

  const handleSendOffer = () => {
    setState('offered');
    setOfferActive(true);
  };

  const handleRecovered = () => {
    setState('recovered');
    setOfferActive(false);
  };

  const client = mockWaitlistClients[selected];
  const mins = Math.floor(offerSeconds / 60);
  const secs = offerSeconds % 60;
  const progress = offerSeconds / (15 * 60);
  const circ = 2 * Math.PI * 42;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, color: T.text, marginBottom: 4 }}>Waitlist Recovery</h1>
          <p style={{ fontSize: 13, color: T.textMid }}>Turn cancellations into bookings — 15-minute offers to best-matched clients.</p>
        </div>

        {/* Cancelled slot card */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(229,57,53,0.05)', border: '1px solid rgba(229,57,53,0.2)' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#E53935', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Cancelled slot available
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: T.text, fontWeight: 300 }}>Monday, 29 September</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 30, color: '#0891B2', fontWeight: 500, lineHeight: 1.1 }}>10:30 – 12:00</div>
              <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>90 min · Central Västerås</div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: '#22C55E', fontWeight: 300 }}>3 200 SEK</div>
              <div style={{ fontSize: 12, color: T.textMid }}>slot value</div>
            </div>
          </div>
        </div>

        {state === 'recovered' && (
          <div className="rounded-2xl p-6 mb-8 text-center animate-scale-in" style={{ background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#22C55E', fontWeight: 300, marginBottom: 4 }}>Slot recovered!</div>
            <div style={{ fontSize: 13, color: T.textMid }}>Karin Åström has been booked for 10:30 on Monday 29 Sep.</div>
          </div>
        )}

        {state === 'idle' && (
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>◉</div>
            <p style={{ fontSize: 14, color: T.textMid, marginBottom: 24 }}>Find the best-matched client from your waitlist for this slot.</p>
            <button onClick={handleScan} className="btn-water px-8 py-4 rounded-xl font-semibold">
              Find best match →
            </button>
          </div>
        )}

        {state === 'scanning' && (
          <div className="text-center py-12 animate-fade-in">
            <div style={{ fontSize: 36, marginBottom: 16, animation: 'ticker 1s linear infinite', display: 'inline-block' }}>⟳</div>
            <p style={{ fontSize: 14, color: T.textMid }}>Scanning waitlist for best match…</p>
          </div>
        )}

        {(state === 'matched' || state === 'offered') && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Client ranking */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, color: T.text, fontWeight: 400 }}>Ranked matches</h3>
                <button onClick={handleScan} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#0891B2', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
                  Scan again →
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {mockWaitlistClients.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(i)}
                    className="text-left p-4 rounded-xl transition-all"
                    style={{
                      background: selected === i ? 'rgba(8,145,178,0.08)' : T.cardAlt,
                      border: `1px solid ${selected === i ? '#0891B2' : T.cardBorder}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: T.textDim }}>#{i + 1}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{c.name}</span>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: i === 0 ? '#0891B2' : T.textMid, fontWeight: 600 }}>
                        {c.score}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>{c.zone} · {c.jobType} · waiting {c.waitDays}d · {c.flexible ? 'Flexible' : 'Fixed'}</div>
                    {/* Score bar */}
                    <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: T.divider }}>
                      <div style={{ height: '100%', width: `${c.score}%`, background: i === 0 ? '#0891B2' : T.textDim, borderRadius: 999, transition: 'width 0.5s ease' }} />
                    </div>
                  </button>
                ))}
              </div>

              {state === 'matched' && (
                <button onClick={handleSendOffer} className="btn-water w-full py-4 rounded-xl font-semibold mt-4">
                  Send 15-min offer to {client.name.split(' ')[0]} →
                </button>
              )}
            </div>

            {/* Score breakdown + offer timer */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Score breakdown */}
              <div className="p-5 rounded-2xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: T.text, marginBottom: 14, fontWeight: 400 }}>Score breakdown</h4>
                {Object.entries(client.scoreBreakdown).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-1.5">
                    <span style={{ fontSize: 12, color: T.textMid, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: T.divider }}>
                        <div style={{ height: '100%', width: `${(val / 40) * 100}%`, background: '#0891B2', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#0891B2', width: 24, textAlign: 'right' }}>+{val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live offer timer */}
              {state === 'offered' && (
                <div className="p-5 rounded-2xl text-center animate-scale-in" style={{ background: 'rgba(8,145,178,0.06)', border: `1px solid ${T.cardBorderStrong}` }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#0891B2', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Offer sent to {client.name.split(' ')[0]}
                  </div>
                  <div className="relative inline-block mb-4">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke={T.divider} strokeWidth="6" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#0891B2" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - progress)}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: T.text, fontWeight: 500 }}>
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg text-xs font-mono" style={{ background: T.input, color: T.textMid, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                      Copy link
                    </button>
                    <button onClick={handleRecovered} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer' }}>
                      Simulate accept ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
