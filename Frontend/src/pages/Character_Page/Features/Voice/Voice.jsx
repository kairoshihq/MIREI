import React, { useState } from 'react';
import './voice.css';

// ── Voice Waveform ─────────────────────────────────────────────
const VoiceWaveform = ({ active }) => {
  const bars = 28;
  return (
    <div className="voice-waveform">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`voice-waveform-bar ${active ? 'voice-waveform-bar-active' : ''}`}
          style={{ animationDelay: `${(i * 0.06) % 0.8}s` }}
        />
      ))}
    </div>
  );
};

// ── Voice Section ──────────────────────────────────────────────
const VoiceSection = () => {
  const [selectedVoice, setSelectedVoice] = useState('mirei-default');
  const [selectedLang, setSelectedLang]   = useState('id');
  const [isChecking, setIsChecking]       = useState(false);

  const VOICES = [
    { id: 'mirei-default', label: 'Default',  desc: 'Suara asli Mirei' },
    { id: 'mirei-soft',    label: 'Soft',     desc: 'Lembut & tenang' },
    { id: 'mirei-energic', label: 'Energic',  desc: 'Ceria & bersemangat' },
    { id: 'mirei-calm',    label: 'Calm',     desc: 'Kalem & santai' },
  ];

  const LANGUAGES = [
    { id: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { id: 'en', label: 'English',          flag: '🇺🇸' },
    { id: 'ja', label: '日本語',            flag: '🇯🇵' },
    { id: 'ko', label: '한국어',            flag: '🇰🇷' },
  ];

  const handleCheck = () => {
    // Sementara hanya toggle animasi, belum ada fungsi nyata
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 3000);
  };

  return (
    <div className="voice-section">
      {/* Baris: Pilihan Voice (kiri) + Mic Center + Pilihan Bahasa (kanan) */}
      <div className="voice-layout">

        {/* Kiri: Voice options */}
        <div className="voice-options-col">
          <div className="voice-col-label">Tipe Suara</div>
          <div className="voice-options-list">
            {VOICES.map(v => (
              <button
                key={v.id}
                className={`voice-option-btn ${selectedVoice === v.id ? 'voice-option-btn-active' : ''}`}
                onClick={() => setSelectedVoice(v.id)}
              >
                <div className="voice-option-dot" />
                <div>
                  <div className="voice-option-label">{v.label}</div>
                  <div className="voice-option-desc">{v.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tengah: Mic + Waveform + Check */}
        <div className="voice-center-col">
          <div className="voice-mic-wrap">
            {isChecking ? (
              <VoiceWaveform active={isChecking} />
            ) : (
              <div className="voice-mic-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8"  y1="23" x2="16" y2="23"/>
                </svg>
              </div>
            )}
            {/* Ring pulse saat aktif */}
            {isChecking && <div className="voice-mic-ring" />}
          </div>
          <button className="voice-check-btn" onClick={handleCheck} disabled={isChecking}>
            {isChecking ? 'Memutar...' : 'Check'}
          </button>
          <div className="voice-center-hint">
            {isChecking ? 'Mendengarkan suara Mirei...' : 'Klik Check untuk pratinjau suara'}
          </div>
        </div>

        {/* Kanan: Language options */}
        <div className="voice-options-col">
          <div className="voice-col-label">Bahasa</div>
          <div className="voice-options-list">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                className={`voice-option-btn ${selectedLang === l.id ? 'voice-option-btn-active' : ''}`}
                onClick={() => setSelectedLang(l.id)}
              >
                <span className="voice-option-flag">{l.flag}</span>
                <div>
                  <div className="voice-option-label">{l.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceSection;
