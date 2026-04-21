import React, { useState, useRef, useEffect } from 'react';
import './control.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const LANGUAGES = [
  { id: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'en', label: 'English',          flag: '🇺🇸' },
  { id: 'ja', label: '日本語',            flag: '🇯🇵' },
  { id: 'ko', label: '한국어',            flag: '🇰🇷' },
];

const RESPONSE_LENGTHS = [
  { id: 'short',  label: 'Short',  desc: 'Singkat & padat' },
  { id: 'medium', label: 'Medium', desc: 'Seimbang' },
  { id: 'long',   label: 'Long',   desc: 'Detail & lengkap' },
];

const SPEECH_STYLES = [
  { id: 'straight',    label: 'Straight',    icon: '⚡', desc: 'Langsung ke inti' },
  { id: 'storytelling',label: 'Storytelling', icon: '📖', desc: 'Naratif & mengalir' },
];

const ASK_BACK = [
  { id: 'rarely',  label: 'Jarang',  desc: 'Mirei lebih banyak menjawab' },
  { id: 'often',   label: 'Sering',  desc: 'Mirei aktif bertanya balik' },
];

const MEMORY_MODES = [
  { id: 'off',      label: 'Off',      icon: '○', desc: 'Tidak ada memori' },
  { id: 'basic',    label: 'Basic',    icon: '◑', desc: 'Memori sesi saja' },
  { id: 'advanced', label: 'Advanced', icon: '●', desc: 'Memori jangka panjang' },
];

const MEMORY_TYPES = [
  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  { id: 'goals',       label: 'Goals',       icon: '🎯' },
  { id: 'emotions',    label: 'Emotions',    icon: '💝' },
];

const ControlSection = () => {
  const [language,      setLanguage]      = useState('id');
  const [responseLen,   setResponseLen]   = useState('medium');
  const [speechStyle,   setSpeechStyle]   = useState('straight');
  const [emojiUsage,    setEmojiUsage]    = useState(true);
  const [askBack,       setAskBack]       = useState('rarely');
  const [memoryMode,    setMemoryMode]    = useState('basic');
  const [memoryTypes,   setMemoryTypes]   = useState(['preferences']);
  const [memoryDepth,   setMemoryDepth]   = useState(50);
  const [saved,         setSaved]         = useState(false);
  const [viewMemory,    setViewMemory]    = useState(false);
  const [resetConfirm,  setResetConfirm]  = useState(false);

  // ── Preview state ──
  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewInput,    setPreviewInput]    = useState('');
  const [previewLoading,  setPreviewLoading]  = useState(false);
  const [previewSession]  = useState('preview_' + Math.random().toString(36).slice(2, 8));
  const previewEndRef     = useRef(null);

  useEffect(() => {
    previewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previewMessages, previewLoading]);

  const buildPreviewHint = () => {
    const hints = [];
    const langMap = { id: 'Bahasa Indonesia', en: 'English', ja: 'Japanese', ko: 'Korean' };
    hints.push(`Language: ${langMap[language] || language}`);
    hints.push(`Response length: ${responseLen}`);
    hints.push(`Speech style: ${speechStyle}`);
    hints.push(`Emoji: ${emojiUsage ? 'yes' : 'no'}`);
    hints.push(`Ask back: ${askBack}`);
    return `[Preview mode — settings: ${hints.join(', ')}]`;
  };

  const sendPreview = async () => {
    const text = previewInput.trim();
    if (!text || previewLoading) return;
    setPreviewInput('');
    setPreviewMessages(prev => [...prev, { role: 'user', content: text }]);
    setPreviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': previewSession },
        body: JSON.stringify({ message: `${buildPreviewHint()}\n${text}`, sessionId: previewSession }),
      });
      const data = await res.json();
      setPreviewMessages(prev => [...prev, {
        role: 'assistant',
        content: data.success ? data.message : 'Maaf, terjadi kesalahan. Coba lagi ya!',
      }]);
    } catch {
      setPreviewMessages(prev => [...prev, { role: 'assistant', content: 'Tidak bisa terhubung ke server.' }]);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPreview(); }
  };

  const toggleMemoryType = (id) => {
    setMemoryTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (resetConfirm) {
      setMemoryMode('off');
      setMemoryTypes([]);
      setMemoryDepth(0);
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  const memoryDisabled = memoryMode === 'off';

  return (
    <>
    <div className="ctrl-layout">

      {/* ── LEFT: Interaction Settings ── */}
      <div className="ctrl-col">
        <div className="ctrl-col-title">
          <span className="ctrl-col-icon">🎛️</span>
          Interaction Settings
        </div>

        {/* Language */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Language</div>
          <div className="ctrl-lang-grid">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                className={`ctrl-lang-btn ${language === l.id ? 'ctrl-lang-btn-active' : ''}`}
                onClick={() => setLanguage(l.id)}
              >
                <span className="ctrl-lang-flag">{l.flag}</span>
                <span className="ctrl-lang-label">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Response Length */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Response Length</div>
          <div className="ctrl-seg">
            {RESPONSE_LENGTHS.map(r => (
              <button
                key={r.id}
                className={`ctrl-seg-btn ${responseLen === r.id ? 'ctrl-seg-btn-active' : ''}`}
                onClick={() => setResponseLen(r.id)}
                title={r.desc}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Speech Style */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Speech Style</div>
          <div className="ctrl-cards-row">
            {SPEECH_STYLES.map(s => (
              <button
                key={s.id}
                className={`ctrl-style-card ${speechStyle === s.id ? 'ctrl-style-card-active' : ''}`}
                onClick={() => setSpeechStyle(s.id)}
              >
                <span className="ctrl-style-icon">{s.icon}</span>
                <span className="ctrl-style-label">{s.label}</span>
                <span className="ctrl-style-desc">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Usage */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Emoji Usage</div>
          <div className="ctrl-toggle-row">
            <div className="ctrl-toggle-info">
              <span className="ctrl-toggle-val">{emojiUsage ? 'ON' : 'OFF'}</span>
              <span className="ctrl-toggle-desc">
                {emojiUsage ? 'Mirei menggunakan emoji dalam balasan' : 'Balasan tanpa emoji'}
              </span>
            </div>
            <button
              className={`ctrl-toggle ${emojiUsage ? 'ctrl-toggle-on' : ''}`}
              onClick={() => setEmojiUsage(v => !v)}
            >
              <div className="ctrl-toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Ask Back Frequency */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Ask Back Frequency</div>
          <div className="ctrl-seg">
            {ASK_BACK.map(a => (
              <button
                key={a.id}
                className={`ctrl-seg-btn ${askBack === a.id ? 'ctrl-seg-btn-active' : ''}`}
                onClick={() => setAskBack(a.id)}
                title={a.desc}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="ctrl-hint">
            {ASK_BACK.find(a => a.id === askBack)?.desc}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Memory Control ── */}
      <div className="ctrl-col">
        <div className="ctrl-col-title">
          <span className="ctrl-col-icon">🧠</span>
          Memory Control
        </div>

        {/* Memory Mode */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Memory Mode</div>
          <div className="ctrl-memory-modes">
            {MEMORY_MODES.map(m => (
              <button
                key={m.id}
                className={`ctrl-memory-mode-btn ${memoryMode === m.id ? 'ctrl-memory-mode-btn-active' : ''}`}
                onClick={() => setMemoryMode(m.id)}
              >
                <span className="ctrl-memory-mode-icon">{m.icon}</span>
                <div>
                  <div className="ctrl-memory-mode-label">{m.label}</div>
                  <div className="ctrl-memory-mode-desc">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What to Remember */}
        <div className={`ctrl-group ${memoryDisabled ? 'ctrl-group-disabled' : ''}`}>
          <div className="ctrl-group-label">What to Remember</div>
          <div className="ctrl-memory-types">
            {MEMORY_TYPES.map(t => (
              <button
                key={t.id}
                className={`ctrl-memory-type-btn ${memoryTypes.includes(t.id) ? 'ctrl-memory-type-btn-active' : ''}`}
                onClick={() => !memoryDisabled && toggleMemoryType(t.id)}
                disabled={memoryDisabled}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span className="ctrl-memory-type-check">
                  {memoryTypes.includes(t.id) ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Memory Depth */}
        <div className={`ctrl-group ${memoryDisabled ? 'ctrl-group-disabled' : ''}`}>
          <div className="ctrl-group-label-row">
            <span className="ctrl-group-label">Memory Depth</span>
            <span className="ctrl-depth-val">{memoryDepth}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={memoryDepth}
            disabled={memoryDisabled}
            className="ctrl-slider"
            onChange={e => setMemoryDepth(Number(e.target.value))}
          />
          <div className="ctrl-slider-labels">
            <span>Minimal</span>
            <span>Maksimal</span>
          </div>
        </div>

        {/* Memory Actions */}
        <div className="ctrl-group">
          <div className="ctrl-group-label">Memory Actions</div>
          <div className="ctrl-memory-actions">
            <button
              className="ctrl-mem-action-btn ctrl-mem-view"
              onClick={() => setViewMemory(v => !v)}
            >
              <span>👁️</span>
              View Memory
            </button>
            <button
              className={`ctrl-mem-action-btn ctrl-mem-reset ${resetConfirm ? 'ctrl-mem-reset-confirm' : ''}`}
              onClick={handleReset}
            >
              <span>{resetConfirm ? '⚠️' : '🗑️'}</span>
              {resetConfirm ? 'Konfirmasi?' : 'Reset Memory'}
            </button>
          </div>

          {/* View Memory panel */}
          {viewMemory && (
            <div className="ctrl-memory-panel">
              <div className="ctrl-memory-panel-header">
                <span>Data Tersimpan</span>
                <button className="ctrl-memory-panel-close" onClick={() => setViewMemory(false)}>✕</button>
              </div>
              <div className="ctrl-memory-panel-body">
                {memoryMode === 'off' || memoryTypes.length === 0 ? (
                  <div className="ctrl-memory-empty">Belum ada data memori tersimpan.</div>
                ) : (
                  memoryTypes.map(t => (
                    <div key={t} className="ctrl-memory-entry">
                      <span className="ctrl-memory-entry-icon">
                        {MEMORY_TYPES.find(m => m.id === t)?.icon}
                      </span>
                      <div>
                        <div className="ctrl-memory-entry-label">
                          {MEMORY_TYPES.find(m => m.id === t)?.label}
                        </div>
                        <div className="ctrl-memory-entry-val">— belum ada data —</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <button
          className={`ctrl-save-btn ${saved ? 'ctrl-save-btn-saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Tersimpan' : 'Simpan Pengaturan'}
        </button>
      </div>

    </div>

    {/* ── PREVIEW MODE ── */}
    <div className="ctrl-preview-section">
      <div className="ctrl-preview-header">
        <div className="ctrl-preview-title">
          <span className="ctrl-preview-dot" />
          Preview Mode
        </div>
        <div className="ctrl-preview-badges">
          <span className="ctrl-preview-badge">{language.toUpperCase()}</span>
          <span className="ctrl-preview-badge">{responseLen}</span>
          <span className="ctrl-preview-badge">{speechStyle}</span>
          <span className="ctrl-preview-badge">{emojiUsage ? '😊 Emoji' : 'No Emoji'}</span>
        </div>
        {previewMessages.length > 0 && (
          <button className="ctrl-preview-clear" onClick={() => setPreviewMessages([])}>
            Bersihkan
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="ctrl-preview-messages">
        {previewMessages.length === 0 && !previewLoading && (
          <div className="ctrl-preview-empty">
            <span className="ctrl-preview-empty-icon">💬</span>
            <span>Coba kirim pesan untuk melihat bagaimana Mirei merespons dengan pengaturan ini</span>
          </div>
        )}
        {previewMessages.map((msg, i) => (
          <div key={i} className={`ctrl-preview-msg ${msg.role === 'user' ? 'ctrl-preview-msg-user' : 'ctrl-preview-msg-mirei'}`}>
            {msg.role === 'assistant' && (
              <div className="ctrl-preview-avatar">M</div>
            )}
            <div className="ctrl-preview-bubble">{msg.content}</div>
          </div>
        ))}
        {previewLoading && (
          <div className="ctrl-preview-msg ctrl-preview-msg-mirei">
            <div className="ctrl-preview-avatar">M</div>
            <div className="ctrl-preview-bubble ctrl-preview-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={previewEndRef} />
      </div>

      {/* Input */}
      <div className="ctrl-preview-input-row">
        <textarea
          className="ctrl-preview-input"
          placeholder="Ketik pesan untuk preview..."
          value={previewInput}
          rows={1}
          onChange={e => setPreviewInput(e.target.value)}
          onKeyDown={handlePreviewKey}
        />
        <button
          className="ctrl-preview-send"
          onClick={sendPreview}
          disabled={!previewInput.trim() || previewLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>

    </>
  );
};

export default ControlSection;
