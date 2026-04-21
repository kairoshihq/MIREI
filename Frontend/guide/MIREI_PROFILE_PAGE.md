# 🌸 Mirei Profile Page Documentation

## 📋 Overview

Halaman Characters telah diubah menjadi halaman profil khusus untuk Mirei, menampilkan biodata lengkap, latar belakang, kepribadian, dan tempat khusus untuk Live2D interaktif.

## 🎯 Fitur Utama

### 1. **Live2D Display Area**
Tempat khusus untuk menampilkan karakter Mirei dengan Live2D interaktif (coming soon).

**Lokasi:** Kolom kiri halaman
**Ukuran:** 380px width, 420px min-height
**Status:** Placeholder ready untuk integrasi Live2D

### 2. **Quick Info Card**
Menampilkan informasi singkat dan statistik Mirei.

**Konten:**
- Nama dan tagline
- Total chat count
- Rating

### 3. **Information Tabs**
Tiga tab untuk menampilkan informasi detail:

#### Tab 1: Biodata 👤
- Tanggal lahir
- Tipe (AI Entity)
- Warna favorit
- Hobi
- Motto hidup
- Kepribadian

#### Tab 2: Latar Belakang 📖
- Cerita Mirei
- Tujuan & Misi
- Keahlian khusus

#### Tab 3: Kepribadian ✨
- 6 trait cards (Ceria, Ramah, Helpful, dll)
- Gaya komunikasi

## 📁 File Structure

```
frontend/src/
├── pages/
│   └── CharactersPage.jsx    # Mirei Profile Page
└── styles/
    └── characters.css         # Styling untuk profile page
```

## 🎨 Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: "Tentang Mirei"                            │
└─────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────┐
│                  │  ┌─────────────────────────────┐ │
│  Live2D Canvas   │  │  Tabs: Bio | Background |  │ │
│  (380px)         │  │        Personality         │ │
│                  │  └─────────────────────────────┘ │
│  ┌────────────┐  │                                  │
│  │   Mirei    │  │  ┌─────────────────────────────┐│
│  │   Avatar   │  │  │                             ││
│  │   (160px)  │  │  │   Tab Content Area          ││
│  │            │  │  │   (Dynamic based on tab)    ││
│  │   Rings    │  │  │                             ││
│  └────────────┘  │  │                             ││
│                  │  └─────────────────────────────┘│
│  Quick Info Card │                                  │
│  - Stats         │                                  │
│  - Rating        │                                  │
└──────────────────┴──────────────────────────────────┘
```

## 🔧 Live2D Integration Guide

### Placeholder Structure

Saat ini ada placeholder untuk Live2D dengan struktur:

```jsx
<div className="mirei-live2d-canvas">
  <div className="mirei-live2d-placeholder">
    {/* Avatar placeholder */}
    <div className="mirei-avatar-large">
      <span>🌸</span>
    </div>
    
    {/* Animated rings */}
    <div className="mirei-live2d-rings">
      {/* 3 rings dengan pulse animation */}
    </div>
  </div>
  
  <div className="mirei-live2d-label">
    <div className="mirei-live2d-status" />
    <span>Live2D Canvas</span>
    <span>Coming Soon</span>
  </div>
</div>
```

### Cara Integrasi Live2D

Ketika Live2D sudah siap, replace placeholder dengan:

```jsx
<div className="mirei-live2d-canvas">
  {/* Live2D Canvas Component */}
  <Live2DCanvas 
    modelPath="/models/mirei.model3.json"
    width={340}
    height={380}
    onLoad={handleModelLoad}
    onInteraction={handleInteraction}
  />
  
  <div className="mirei-live2d-label">
    <div className="mirei-live2d-status" />
    <span>Live2D Active</span>
  </div>
</div>
```

### CSS Classes untuk Live2D

```css
.mirei-live2d-canvas {
  /* Container untuk Live2D */
  min-height: 420px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mirei-live2d-placeholder {
  /* Placeholder sementara */
  width: 100%;
  height: 300px;
}

.mirei-avatar-large {
  /* Avatar placeholder */
  width: 160px;
  height: 160px;
  /* Ganti dengan Live2D canvas */
}
```

## 📊 Data Structure

### MIREI_DATA Object

```javascript
const MIREI_DATA = {
  name: 'Mirei',
  fullName: 'Mirei AI Assistant',
  tagline: 'Asisten Virtual Ceria & Ramah',
  emoji: '🌸',
  accentColor: '#8b5cf6',
  
  bio: {
    age: 'AI Entity',
    birthday: '1 Januari 2024',
    personality: 'Ceria · Ramah · Helpful · Energetic',
    hobby: 'Membantu orang, belajar hal baru, ngobrol santai',
    favoriteColor: 'Ungu & Pink',
    motto: 'Setiap hari adalah kesempatan untuk membantu dan belajar! ✨'
  },
  
  background: {
    story: '...',
    purpose: '...',
    specialties: [...]
  },
  
  personality: {
    traits: [...],
    communicationStyle: [...]
  }
};
```

### Cara Update Data

Edit langsung di `CharactersPage.jsx`:

```javascript
// Update biodata
bio: {
  birthday: '1 Januari 2024', // Ubah tanggal
  hobby: 'New hobby',          // Ubah hobi
  // ...
}

// Tambah trait baru
traits: [
  {
    icon: '🎨',
    title: 'Creative',
    desc: 'Suka berpikir kreatif'
  },
  // ...
]
```

## 🎨 Customization

### Mengubah Warna Accent

```javascript
// Di MIREI_DATA
accentColor: '#8b5cf6', // Ubah ke warna lain
```

### Menambah Tab Baru

```jsx
// 1. Tambah tab di array
const tabs = [
  { id: 'bio', label: 'Biodata', icon: '👤' },
  { id: 'background', label: 'Latar Belakang', icon: '📖' },
  { id: 'personality', label: 'Kepribadian', icon: '✨' },
  { id: 'newtab', label: 'New Tab', icon: '🎯' } // Baru
];

// 2. Tambah content untuk tab baru
{activeTab === 'newtab' && (
  <div className="mirei-content-section animate-slideUp">
    <h2 className="mirei-content-title">New Tab Title</h2>
    {/* Content here */}
  </div>
)}
```

### Mengubah Layout Grid

```css
/* Di characters.css */
.mirei-profile-grid {
  grid-template-columns: 380px 1fr; /* Ubah ukuran kolom */
}

/* Untuk mobile */
@media (max-width: 1024px) {
  .mirei-profile-grid {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

## 🎭 Animations

### Available Animations

1. **slideUp** - Fade in dari bawah
2. **liveRingPulse** - Pulse effect untuk rings
3. **livePulseDot** - Pulse effect untuk status dot

### Cara Menggunakan

```jsx
// Slide up animation
<div className="animate-slideUp">

// Dengan delay
<div 
  className="animate-slideUp"
  style={{ animationDelay: '0.2s' }}
>
```

## 📱 Responsive Design

### Breakpoints

- **Desktop (>1200px)**: Full layout dengan 2 kolom
- **Tablet (1024px-1200px)**: Kolom lebih kecil
- **Mobile (<1024px)**: Single column, info tabs di atas

### Mobile Adjustments

```css
@media (max-width: 768px) {
  .mirei-bio-grid {
    grid-template-columns: 1fr; /* Single column */
  }
  
  .mirei-tabs {
    flex-direction: column; /* Vertical tabs */
  }
}
```

## 🔮 Future Enhancements

### Planned Features

1. **Live2D Integration**
   - Interactive character model
   - Emotion expressions
   - Click/touch interactions
   - Voice reactions

2. **Dynamic Stats**
   - Real-time chat count
   - User rating system
   - Activity timeline

3. **More Tabs**
   - Gallery (screenshots, moments)
   - Achievements
   - Voice samples

4. **Customization**
   - Theme switcher
   - Outfit selector (untuk Live2D)
   - Background options

## 🛠️ Development Tips

### Testing Live2D Integration

```javascript
// Mock Live2D component untuk testing
const MockLive2D = () => (
  <div className="mirei-live2d-canvas">
    <canvas id="live2d-canvas" width="340" height="380" />
    {/* Your Live2D initialization code */}
  </div>
);
```

### Adding Interactive Elements

```javascript
// Example: Click counter
const [clickCount, setClickCount] = useState(0);

<div 
  className="mirei-avatar-large"
  onClick={() => setClickCount(c => c + 1)}
  style={{ cursor: 'pointer' }}
>
  {/* Avatar */}
</div>
```

### Performance Optimization

```javascript
// Lazy load tabs
const BioTab = React.lazy(() => import('./tabs/BioTab'));
const BackgroundTab = React.lazy(() => import('./tabs/BackgroundTab'));

// Use in component
<Suspense fallback={<Loading />}>
  {activeTab === 'bio' && <BioTab />}
</Suspense>
```

## 📚 Resources

### Live2D Resources
- [Live2D Cubism SDK](https://www.live2d.com/en/download/cubism-sdk/)
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- [Live2D Web Samples](https://github.com/Live2D/CubismWebSamples)

### Design Inspiration
- Character profile pages
- AI assistant interfaces
- Interactive character displays

## 🐛 Troubleshooting

### Live2D Canvas tidak muncul
```javascript
// Check canvas initialization
useEffect(() => {
  const canvas = document.getElementById('live2d-canvas');
  if (!canvas) {
    console.error('Canvas not found');
  }
}, []);
```

### Tabs tidak switch
```javascript
// Check state update
const [activeTab, setActiveTab] = useState('bio');
console.log('Current tab:', activeTab); // Debug
```

### Responsive layout broken
```css
/* Check media queries */
@media (max-width: 1024px) {
  .mirei-profile-grid {
    grid-template-columns: 1fr !important;
  }
}
```

## ✅ Checklist untuk Live2D Integration

Saat akan integrate Live2D:

- [ ] Install Live2D SDK/library
- [ ] Prepare model files (.model3.json, textures)
- [ ] Create Live2D component
- [ ] Replace placeholder dengan Live2D canvas
- [ ] Test model loading
- [ ] Add interaction handlers
- [ ] Test performance
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Optimize for mobile

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: ✅ Ready for Live2D Integration

**Happy Coding! 🌸**
