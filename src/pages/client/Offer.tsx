import { useState, useEffect } from 'react';
import ClientNav from '@/components/ClientNav';

type OfferState = 'pending' | 'accepted' | 'declined' | 'expired';

export default function Offer() {
  const [state, setState] = useState<OfferState>('pending');
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    if (state !== 'pending') return;
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { setState('expired'); clearInterval(timer); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = seconds / (15 * 60);
  const circumference = 2 * Math.PI * 54;

  if (state === 'accepted') {
    return (
      <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
        <ClientNav />
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)' }}>
              <span style={{ fontSize: 36 }}>✓</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>
              This time is yours.
            </h1>
            <p style={{ color: '#6DA8C4', marginBottom: 32, lineHeight: 1.6 }}>
              Monday 29 Sept · 10:30 is reserved for you. Mats will confirm shortly.
            </p>
            <div style={{ background: 'rgba(15,22,32,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              {[
                { label: 'Date', value: 'Monday, 29 September' },
                { label: 'Arrival window', value: '10:30 – 12:00' },
                { label: 'Service', value: 'Boiler repair' },
                { label: 'Address', value: 'Vasagatan 14, Västerås' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(8,145,178,0.07)' }}>
                  <span style={{ fontSize: 13, color: '#6DA8C4' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: '#D9EEF7', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button className="btn-copper w-full py-4 rounded-xl font-semibold">
              Confirm property access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'declined' || state === 'expired') {
    return (
      <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
        <ClientNav />
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'rgba(8,145,178,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 36, opacity: 0.5 }}>⏱</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>
              {state === 'expired' ? 'This offer has expired.' : 'Offer declined.'}
            </h1>
            <p style={{ color: '#6DA8C4', lineHeight: 1.6 }}>
              {state === 'expired'
                ? 'The slot has been offered to the next person in line. You remain on the waitlist — we\'ll contact you when another opens.'
                : 'You remain on the waitlist. We\'ll reach out when the next slot becomes available.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <ClientNav />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full animate-fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.18)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#0891B2', animation: 'copper-glow 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#0891B2', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Slot available</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 300, color: '#D9EEF7', lineHeight: 1.1, marginBottom: 12 }}>
              A time just<br /><em style={{ fontStyle: 'italic', color: '#0891B2' }}>opened for you.</em>
            </h1>
            <p style={{ color: '#6DA8C4', fontSize: 14, lineHeight: 1.6 }}>
              A cancellation freed this slot. Accept within the time shown — it'll be offered to the next person if you pass.
            </p>
          </div>

          {/* Slot info */}
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(15,22,32,0.8)', border: '1px solid rgba(8,145,178,0.18)' }}>
            <div className="text-center mb-4">
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: '#D9EEF7', fontWeight: 300 }}>Monday, 29 September</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, color: '#0891B2', fontWeight: 500, marginTop: 4 }}>10:30 – 12:00</div>
              <div style={{ fontSize: 13, color: '#6DA8C4', marginTop: 4 }}>Boiler repair · Central Västerås · ~90 min</div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center mb-8">
            <div style={{ fontSize: 13, color: '#6DA8C4', marginBottom: 16, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em' }}>
              OFFER EXPIRES IN
            </div>
            <div className="relative" style={{ width: 128, height: 128, animation: 'countdown-tick 1s ease-in-out infinite' }}>
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(8,145,178,0.08)" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke={seconds < 60 ? '#E53935' : seconds < 300 ? '#F59E0B' : '#0891B2'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  transform="rotate(-90 64 64)"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 500, color: '#D9EEF7', lineHeight: 1 }}>
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#6DA8C4', letterSpacing: '0.06em' }}>remaining</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button onClick={() => setState('accepted')} className="btn-copper w-full py-5 rounded-xl text-lg font-bold">
              Accept this time →
            </button>
            <button onClick={() => setState('declined')} className="btn-ghost w-full py-3 rounded-xl font-semibold text-sm"
              style={{ color: '#6DA8C4' }}>
              Decline — keep me on the waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
