import { useState } from 'react';
import ClientNav from '@/components/ClientNav';
import { mockSlots } from '@/data/mock';

export default function Reschedule() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const slots = mockSlots.slice(0, 8);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-SE', { weekday: 'short', month: 'short', day: 'numeric' });

  if (confirmed) {
    const slot = slots.find(s => s.id === selected);
    return (
      <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
        <ClientNav />
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
              <span style={{ fontSize: 36 }}>✓</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#D9EEF7', marginBottom: 8 }}>
              Rescheduled.
            </h1>
            <p style={{ color: '#6DA8C4', marginBottom: 24, lineHeight: 1.6 }}>
              Your new time has been saved. Mats is aware of the change.
            </p>
            {slot && (
              <div style={{ background: 'rgba(15,22,32,0.8)', border: '1px solid rgba(8,145,178,0.18)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#D9EEF7', fontWeight: 300, marginBottom: 4 }}>{formatDate(slot.date)}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 32, color: '#0891B2', fontWeight: 500 }}>{slot.time}</div>
                <div style={{ fontSize: 13, color: '#6DA8C4', marginTop: 4 }}>{slot.duration} min · {slot.zone}</div>
              </div>
            )}
            <button className="btn-copper w-full py-4 rounded-xl font-semibold">
              Confirm property access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <ClientNav />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-32">
        {/* Current booking */}
        <div className="animate-fade-up mb-8 p-5 rounded-2xl" style={{ background: 'rgba(15,22,32,0.7)', border: '1px solid rgba(8,145,178,0.1)' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#6DA8C4', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Current booking — kept until you confirm the new time
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#D9EEF7' }}>Monday, 29 September</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, color: '#0891B2', marginTop: 2 }}>10:30 – 12:00</div>
          <div style={{ fontSize: 13, color: '#6DA8C4', marginTop: 4 }}>Boiler repair · Vasagatan 14</div>
        </div>

        <div className="animate-fade-up delay-100 mb-6">
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#D9EEF7', marginBottom: 6 }}>
            Choose a new time
          </h2>
          <p style={{ fontSize: 14, color: '#6DA8C4', lineHeight: 1.6 }}>
            Select from the next available slots. Your current booking remains until you confirm.
          </p>
        </div>

        <div className="flex flex-col gap-2 animate-fade-up delay-200 mb-6">
          {slots.map((slot, i) => (
            <button
              key={slot.id}
              onClick={() => setSelected(slot.id)}
              className="flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: selected === slot.id ? 'rgba(8,145,178,0.1)' : 'rgba(15,22,32,0.5)',
                border: `1px solid ${selected === slot.id ? '#0891B2' : 'rgba(8,145,178,0.1)'}`,
                cursor: 'pointer',
                animationDelay: `${i * 50}ms`,
              }}
            >
              <div>
                <div style={{ color: '#6DA8C4', marginBottom: 2, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                  {formatDate(slot.date)}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, color: '#D9EEF7', fontWeight: 500 }}>
                  {slot.time}
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: 12, color: '#6DA8C4' }}>{slot.duration} min</div>
                <div style={{ fontSize: 11, color: '#2E5B75' }}>+{slot.travel} min travel</div>
                {selected === slot.id && (
                  <div style={{ fontSize: 11, color: '#0891B2', fontWeight: 600, marginTop: 2 }}>Selected ✓</div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="sticky-bar">
          <button
            onClick={() => setConfirmed(true)}
            disabled={!selected}
            className="btn-copper w-full py-4 rounded-xl font-semibold"
            style={{ opacity: !selected ? 0.4 : 1 }}
          >
            Confirm new time →
          </button>
        </div>
      </div>
    </div>
  );
}
