import React, { useState } from 'react';
import { FlowerIcon } from '../../../../components/common/Icon';
import './skin.css';

const SKIN_PRESETS = [
  { id: 'default',    label: 'Default',    color: '#8b5cf6' },
  { id: 'casual',     label: 'Casual',     color: '#10b981' },
  { id: 'formal',     label: 'Formal',     color: '#3b82f6' },
  { id: 'futuristic', label: 'Futuristic', color: '#ec4899' },
];

const COSTUME_ITEMS = {
  default: [
    { id: 'd1', name: 'Seragam Ungu',   type: 'Outfit',    icon: '👗', rarity: 'Default', accent: '#8b5cf6', tags: ['Ungu', 'Elegan'] },
    { id: 'd2', name: 'Pita Rambut',    type: 'Aksesori',  icon: '🎀', rarity: 'Default', accent: '#ec4899', tags: ['Pink', 'Manis'] },
    { id: 'd3', name: 'Sepatu Putih',   type: 'Alas Kaki', icon: '👟', rarity: 'Default', accent: '#a78bfa', tags: ['Putih', 'Kasual'] },
    { id: 'd4', name: 'Kalung Bintang', type: 'Perhiasan', icon: '⭐', rarity: 'Default', accent: '#f59e0b', tags: ['Emas', 'Bersinar'] },
    { id: 'd5', name: 'Rok Pendek',     type: 'Outfit',    icon: '👚', rarity: 'Default', accent: '#8b5cf6', tags: ['Ungu', 'Ringan'] },
    { id: 'd6', name: 'Gelang Mutiara', type: 'Perhiasan', icon: '📿', rarity: 'Default', accent: '#a78bfa', tags: ['Putih', 'Elegan'] },
  ],
  casual: [
    { id: 'c1', name: 'Hoodie Hijau',   type: 'Outfit',    icon: '🧥', rarity: 'Common',  accent: '#10b981', tags: ['Hijau', 'Nyaman'] },
    { id: 'c2', name: 'Topi Kasual',    type: 'Aksesori',  icon: '🧢', rarity: 'Common',  accent: '#3b82f6', tags: ['Biru', 'Sporty'] },
    { id: 'c3', name: 'Sneakers',       type: 'Alas Kaki', icon: '👟', rarity: 'Common',  accent: '#10b981', tags: ['Putih', 'Trendy'] },
    { id: 'c4', name: 'Tas Selempang',  type: 'Aksesori',  icon: '👜', rarity: 'Common',  accent: '#f59e0b', tags: ['Coklat', 'Praktis'] },
    { id: 'c5', name: 'Jaket Denim',    type: 'Outfit',    icon: '🧥', rarity: 'Common',  accent: '#3b82f6', tags: ['Biru', 'Santai'] },
    { id: 'c6', name: 'Kacamata Hitam', type: 'Aksesori',  icon: '🕶️', rarity: 'Common',  accent: '#6366f1', tags: ['Hitam', 'Keren'] },
  ],
  formal: [
    { id: 'f1', name: 'Blazer Biru',     type: 'Outfit',    icon: '🥼', rarity: 'Rare',   accent: '#3b82f6', tags: ['Biru', 'Profesional'] },
    { id: 'f2', name: 'Kacamata Elegan', type: 'Aksesori',  icon: '🕶️', rarity: 'Rare',   accent: '#6366f1', tags: ['Hitam', 'Elegan'] },
    { id: 'f3', name: 'Heels Hitam',     type: 'Alas Kaki', icon: '👠', rarity: 'Rare',   accent: '#3b82f6', tags: ['Hitam', 'Formal'] },
    { id: 'f4', name: 'Jam Tangan',      type: 'Perhiasan', icon: '⌚', rarity: 'Rare',   accent: '#94a3b8', tags: ['Silver', 'Mewah'] },
    { id: 'f5', name: 'Kemeja Putih',    type: 'Outfit',    icon: '👔', rarity: 'Rare',   accent: '#3b82f6', tags: ['Putih', 'Rapi'] },
    { id: 'f6', name: 'Anting Berlian',  type: 'Perhiasan', icon: '💎', rarity: 'Rare',   accent: '#94a3b8', tags: ['Silver', 'Berkilau'] },
  ],
  futuristic: [
    { id: 'u1', name: 'Armor Neon',     type: 'Outfit',    icon: '🦾', rarity: 'Epic',    accent: '#ec4899', tags: ['Neon', 'Cyber'] },
    { id: 'u2', name: 'Visor Hologram', type: 'Aksesori',  icon: '🥽', rarity: 'Epic',    accent: '#06b6d4', tags: ['Hologram', 'Tech'] },
    { id: 'u3', name: 'Boots Cyber',    type: 'Alas Kaki', icon: '🥾', rarity: 'Epic',    accent: '#ec4899', tags: ['Hitam', 'Cyber'] },
    { id: 'u4', name: 'Gelang Energi',  type: 'Perhiasan', icon: '💎', rarity: 'Epic',    accent: '#06b6d4', tags: ['Biru', 'Energi'] },
    { id: 'u5', name: 'Bodysuit Tech',  type: 'Outfit',    icon: '🦾', rarity: 'Epic',    accent: '#ec4899', tags: ['Hitam', 'Futuristik'] },
    { id: 'u6', name: 'Helm Cyber',     type: 'Aksesori',  icon: '⛑️', rarity: 'Epic',    accent: '#06b6d4', tags: ['Silver', 'Cyber'] },
  ],
};

const RARITY_COLOR = {
  Default: '#a78bfa',
  Common:  '#10b981',
  Rare:    '#3b82f6',
  Epic:    '#ec4899',
};

const COLOR_PALETTES = [
  { label: 'Violet',   colors: ['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd','#ede9fe'] },
  { label: 'Rose',     colors: ['#be185d','#ec4899','#f472b6','#fbcfe8','#fdf2f8'] },
  { label: 'Cyan',     colors: ['#0e7490','#06b6d4','#22d3ee','#a5f3fc','#ecfeff'] },
  { label: 'Emerald',  colors: ['#065f46','#10b981','#34d399','#a7f3d0','#ecfdf5'] },
  { label: 'Amber',    colors: ['#b45309','#f59e0b','#fbbf24','#fde68a','#fffbeb'] },
  { label: 'Slate',    colors: ['#334155','#64748b','#94a3b8','#cbd5e1','#f1f5f9'] },
];

const EFFECTS = [
  { id: 'none',     label: 'None',     icon: '○' },
  { id: 'glow',     label: 'Glow',     icon: '✦' },
  { id: 'sparkle',  label: 'Sparkle',  icon: '✧' },
  { id: 'aura',     label: 'Aura',     icon: '◎' },
  { id: 'neon',     label: 'Neon',     icon: '⬡' },
  { id: 'hologram', label: 'Hologram', icon: '⬢' },
];

const SkinSection = () => {
  const [activeSkin,   setActiveSkin]   = useState('default');
  const [activeItem,   setActiveItem]   = useState(null);
  const [activeColor,  setActiveColor]  = useState('#8b5cf6');
  const [customColor,  setCustomColor]  = useState('#8b5cf6');
  const [activeEffect, setActiveEffect] = useState('none');
  const [saved,        setSaved]        = useState(false);

  const preset       = SKIN_PRESETS.find(s => s.id === activeSkin);
  const currentItems = COSTUME_ITEMS[activeSkin] || [];
  const previewColor = activeColor;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="skin-layout">

      {/* ── LEFT: Category tabs + item cards ── */}
      <div className="skin-left">
        {/* Category tabs */}
        <div className="skin-category-tabs">
          {SKIN_PRESETS.map(s => (
            <button
              key={s.id}
              className={`skin-cat-tab ${activeSkin === s.id ? 'skin-cat-tab-active' : ''}`}
              style={{ '--cat-color': s.color }}
              onClick={() => { setActiveSkin(s.id); setActiveItem(null); }}
            >
              <span className="skin-cat-dot" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Section label */}
        <div className="skin-section-label">
          <span>Kostum</span>
          <span className="skin-section-count">{currentItems.length} item</span>
        </div>

        {/* Item cards — 2 col grid scrollable */}
        <div className="skin-items-grid">
          {currentItems.map(item => (
            <button
              key={item.id}
              className={`skin-item-card ${activeItem === item.id ? 'skin-item-card-active' : ''}`}
              style={{ '--item-accent': item.accent }}
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
            >
              {/* Visual area */}
              <div className="skin-item-visual" style={{ background: `linear-gradient(145deg, ${item.accent}28, ${item.accent}0a)` }}>
                <div className="skin-item-icon">{item.icon}</div>
                <div
                  className="skin-item-rarity"
                  style={{ color: RARITY_COLOR[item.rarity], background: `${RARITY_COLOR[item.rarity]}20`, borderColor: `${RARITY_COLOR[item.rarity]}50` }}
                >
                  {item.rarity}
                </div>
              </div>

              {/* Info area */}
              <div className="skin-item-info">
                <div className="skin-item-header">
                  <div className="skin-item-name">{item.name}</div>
                  <div className="skin-item-action">Pilih →</div>
                </div>
                <div className="skin-item-tags">
                  <span className="skin-item-type-tag">{item.type}</span>
                  {item.tags.map((tag, i) => (
                    <span key={i} className="skin-item-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── CENTER: Live2D Preview ── */}
      <div className="skin-center">
        <div className="skin-preview-label">Preview</div>

        <div className="skin-preview-stage" style={{ '--preview-color': previewColor }}>
          {/* Background glow */}
          <div className="skin-stage-glow" style={{ background: `radial-gradient(ellipse at center, ${previewColor}30 0%, transparent 70%)` }} />

          {/* Rings */}
          <div className="skin-stage-rings">
            {[160, 200, 240].map((s, i) => (
              <div key={i} className="skin-stage-ring"
                style={{ width: s, height: s, animationDelay: `${i * 0.6}s`, borderColor: `${previewColor}35` }} />
            ))}
          </div>

          {/* Avatar */}
          <div className="skin-stage-avatar"
            style={{ borderColor: `${previewColor}70`, boxShadow: `0 0 40px ${previewColor}40, 0 0 80px ${previewColor}20` }}>
            <FlowerIcon size={72} color={previewColor} />
          </div>

          {/* Effect badge */}
          {activeEffect !== 'none' && (
            <div className="skin-stage-effect-badge" style={{ color: previewColor, borderColor: `${previewColor}50`, background: `${previewColor}18` }}>
              {EFFECTS.find(e => e.id === activeEffect)?.icon} {EFFECTS.find(e => e.id === activeEffect)?.label}
            </div>
          )}

          {/* Skin label */}
          <div className="skin-stage-preset-badge" style={{ color: previewColor, borderColor: `${previewColor}40`, background: `${previewColor}14` }}>
            {preset?.label}
          </div>

          {/* Live2D status */}
          <div className="skin-stage-footer">
            <div className="skin-live2d-dot" />
            <span>Live2D Canvas</span>
            <span className="skin-coming-soon-pill">Coming Soon</span>
          </div>
        </div>

        {/* Save button */}
        <button
          className={`skin-save-btn ${saved ? 'skin-save-btn-saved' : ''}`}
          style={!saved ? { background: `linear-gradient(135deg, ${previewColor}, ${previewColor}bb)` } : {}}
          onClick={handleSave}
        >
          {saved ? '✓ Tersimpan' : 'Simpan Skin'}
        </button>
      </div>

      {/* ── RIGHT: Color & Effects ── */}
      <div className="skin-right">

        {/* Custom color picker */}
        <div className="skin-right-section">
          <div className="skin-right-label">Warna Kustom</div>
          <div className="skin-color-picker-wrap">
            <input
              type="color"
              className="skin-color-input"
              value={customColor}
              onChange={e => { setCustomColor(e.target.value); setActiveColor(e.target.value); }}
            />
            <div className="skin-color-picker-info">
              <div className="skin-color-preview-swatch" style={{ background: activeColor }} />
              <span className="skin-color-hex">{activeColor.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="skin-right-section">
          <div className="skin-right-label">Palet Warna</div>
          <div className="skin-palettes">
            {COLOR_PALETTES.map(palette => (
              <div key={palette.label} className="skin-palette-row">
                <span className="skin-palette-name">{palette.label}</span>
                <div className="skin-palette-swatches">
                  {palette.colors.map(c => (
                    <button
                      key={c}
                      className={`skin-swatch ${activeColor === c ? 'skin-swatch-active' : ''}`}
                      style={{ background: c }}
                      onClick={() => { setActiveColor(c); setCustomColor(c); }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="skin-right-section">
          <div className="skin-right-label">Efek</div>
          <div className="skin-effects-grid">
            {EFFECTS.map(ef => (
              <button
                key={ef.id}
                className={`skin-effect-btn ${activeEffect === ef.id ? 'skin-effect-btn-active' : ''}`}
                style={activeEffect === ef.id ? { borderColor: `${activeColor}80`, color: activeColor, background: `${activeColor}18` } : {}}
                onClick={() => setActiveEffect(ef.id)}
              >
                <span className="skin-effect-icon">{ef.icon}</span>
                <span>{ef.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkinSection;
