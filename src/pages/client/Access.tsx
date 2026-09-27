import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientNav from '@/components/ClientNav';

const ACCESS_OPTIONS = [
  { id: 'present', icon: '🏠', title: "I'll be there", desc: 'Someone will let Mats in on arrival.' },
  { id: 'key', icon: '🔑', title: 'Key left somewhere', desc: 'I\'ll leave a key — I\'ll add details.' },
  { id: 'unlocked', icon: '🚪', title: 'Door will be unlocked', desc: 'I\'ll leave the front door open.' },
  { id: 'other', icon: '✏️', title: 'Other arrangement', desc: 'I\'ll describe the access in a note.' },
];

export default function Access() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState('');

  const handleSelect = (id: string) => {
    setSelected(id);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div style={{ background: '#030E1C', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <ClientNav />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        {/* Booking summary */}
        <div className="animate-fade-up mb-8 p-5 rounded-2xl" style={{ background: 'rgba(15,22,32,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#6DA8C4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your booking</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#0891B2' }}>VVS-X7K2M</span>
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#D9EEF7', fontWeight: 400, marginBottom: 4 }}>
            Boiler / hot water repair
          </div>
          <div style={{ fontSize: 14, color: '#6DA8C4' }}>Monday, 29 September · 10:30 – 12:00</div>
          <div style={{ fontSize: 13, color: '#2E5B75', marginTop: 2 }}>Vasagatan 14, Västerås</div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.18)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0891B2' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#0891B2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confirmed</span>
          </div>
        </div>

        {/* Access question */}
        <div className="animate-fade-up delay-100 mb-6">
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 300, color: '#D9EEF7', marginBottom: 6 }}>
            How will Mats get in?
          </h2>
          <p style={{ fontSize: 14, color: '#6DA8C4', lineHeight: 1.6 }}>
            Choose the access method so there's no delay on the day.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-up delay-200">
          {ACCESS_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="text-left p-4 rounded-xl transition-all duration-200"
              style={{
                background: selected === opt.id ? 'rgba(8,145,178,0.1)' : 'rgba(15,22,32,0.6)',
                border: `1px solid ${selected === opt.id ? '#0891B2' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: selected === opt.id ? '0 0 0 3px rgba(8,145,178,0.12)' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#D9EEF7', marginBottom: 4 }}>{opt.title}</div>
              <div style={{ fontSize: 11, color: '#6DA8C4', lineHeight: 1.4 }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        {(selected === 'key' || selected === 'other') && (
          <div className="animate-slide-up mb-6">
            <label style={{ display: 'block', fontSize: 12, color: '#6DA8C4', fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
              {selected === 'key' ? 'Where is the key?' : 'Describe the arrangement'}
            </label>
            <textarea
              className="vvs-input"
              style={{ minHeight: 80, resize: 'vertical' }}
              placeholder={selected === 'key' ? 'e.g. Under the mat by the blue door.' : 'e.g. My neighbour in apartment 4B has a spare key.'}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        )}

        {selected && (
          <div className="animate-slide-up">
            {confirmed ? (
              <div className="p-5 rounded-xl flex items-center gap-4 mb-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span style={{ fontSize: 24 }}>✓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#22C55E', marginBottom: 2 }}>Mats has been informed.</div>
                  <div style={{ fontSize: 12, color: '#6DA8C4' }}>Access: {ACCESS_OPTIONS.find(o => o.id === selected)?.title}</div>
                </div>
              </div>
            ) : (
              <button onClick={handleConfirm} className="btn-copper w-full py-4 rounded-xl font-semibold mb-3">
                Confirm access →
              </button>
            )}
            <Link to="/reschedule/demo-token" className="btn-ghost w-full no-underline flex items-center justify-center py-3 rounded-xl font-semibold text-sm" style={{ color: '#6DA8C4' }}>
              Need another time? Reschedule
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
