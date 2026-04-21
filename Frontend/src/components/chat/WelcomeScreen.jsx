// components/chat/WelcomeScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FlowerIcon } from '../common/Icon';

// ── Canvas particle system (JS-driven, tidak stuck saat hidden) ──
const ParticleCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      // Simpan data partikel sebelum resize
      const prevW = canvas.width || canvas.offsetWidth;
      const prevH = canvas.height || canvas.offsetHeight;
      const newW = canvas.offsetWidth;
      const newH = canvas.offsetHeight;
      if (newW === prevW && newH === prevH) return; // tidak ada perubahan, skip
      canvas.width = newW;
      canvas.height = newH;
      // Sesuaikan posisi partikel secara proporsional agar tidak hilang
      if (prevW && prevH) {
        const scaleX = newW / prevW;
        const scaleY = newH / prevH;
        particlesRef.current.forEach(p => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Init particles
    const COLORS = ['#a78bfa', '#ec4899', '#6366f1', '#8b5cf6', '#f472b6', '#c4b5fd'];
    const COUNT = 22;
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.3,
      alpha: 0.2 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random(),
      speed: 0.0006 + Math.random() * 0.0008,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.life += p.speed;
        if (p.life > 1) {
          p.life = 0;
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -0.3 - Math.random() * 0.3;
          p.alpha = 0.2 + Math.random() * 0.5;
        }
        // fade in/out berdasarkan life
        const fade = p.life < 0.1 ? p.life / 0.1
                   : p.life > 0.85 ? (1 - p.life) / 0.15
                   : 1;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * fade;
        ctx.shadowBlur = p.r * 4;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };

    if (active) {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  // Pause/resume saat active berubah
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pts = particlesRef.current;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.life += p.speed;
          if (p.life > 1) {
            p.life = 0;
            p.x = Math.random() * canvas.width;
            p.y = canvas.height + 10;
            p.vx = (Math.random() - 0.5) * 0.4;
            p.vy = -0.3 - Math.random() * 0.3;
            p.alpha = 0.2 + Math.random() * 0.5;
          }
          const fade = p.life < 0.1 ? p.life / 0.1
                     : p.life > 0.85 ? (1 - p.life) / 0.15
                     : 1;
          p.x += p.vx;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * fade;
          ctx.shadowBlur = p.r * 4;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        rafRef.current = requestAnimationFrame(draw);
      };
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

// ── WelcomeScreen ─────────────────────────────────────────────
const WelcomeScreen = ({ username, onStart, active = true }) => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setVisible(false);
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 500);
    }, 60);
    return () => clearTimeout(t);
  }, [active]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onStart(input.trim());
  };

  const firstName = username?.split(' ')[0] || 'there';

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* JS-driven particle canvas */}
      <ParticleCanvas active={active} />

      {/* Ambient orbs (CSS transition, tidak pakai animation) */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, #8b5cf622 0%, transparent 70%)',
        filter: 'blur(40px)', top: '-20%', left: '-10%',
        opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, #ec489922 0%, transparent 70%)',
        filter: 'blur(40px)', bottom: '10%', right: '5%',
        opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 0.3s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, #6366f122 0%, transparent 70%)',
        filter: 'blur(40px)', top: '60%', left: '20%',
        opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 0.6s',
        pointerEvents: 'none',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: visible ? 0.04 : 0, transition: 'opacity 1.2s ease',
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Center content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '28px', padding: '0 24px', maxWidth: '560px', width: '100%',
      }}>
        {/* Avatar */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.6)',
          transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(139,92,246,0.5)',
            position: 'relative',
          }}>
            <FlowerIcon size={32} color="#fff" />
            <div style={{
              position: 'absolute', inset: '-6px', borderRadius: '50%',
              border: '1px solid rgba(139,92,246,0.4)',
              opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.8s',
            }} />
            <div style={{
              position: 'absolute', inset: '-14px', borderRadius: '50%',
              border: '1px solid rgba(139,92,246,0.2)',
              opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 1s',
            }} />
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700,
            lineHeight: 1.2, marginBottom: '8px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <span style={{ color: 'var(--t1)' }}>Welcome, </span>
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>{firstName}</span>
          </div>
          <div style={{
            fontSize: '15px', color: 'var(--t3)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease 0.35s',
            letterSpacing: '0.02em',
          }}>
            Let's Begin Chats ✨
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.5s',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '16px', padding: '12px 16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mulai percakapan dengan Mirei..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--t1)', fontSize: '14px', fontFamily: 'var(--font)',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.06)',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s ease',
                boxShadow: input.trim() ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? '#fff' : 'var(--t3)'} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </form>

        <div style={{
          fontSize: '12px', color: 'var(--t3)',
          opacity: visible ? 0.6 : 0, transition: 'opacity 0.6s ease 0.8s',
        }}>
          Tekan Enter atau klik kirim untuk memulai
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
