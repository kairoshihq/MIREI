# Panduan Styling Frontend Mirei

## Struktur Styling

Proyek ini menggunakan kombinasi **Tailwind CSS** dan **CSS Modules** terpisah untuk setiap page.

### Folder Structure
```
frontend/src/styles/
├── globals.css          # Global styles + Tailwind imports
├── variables.css        # CSS variables
├── chat.css            # ChatPage styles
├── home.css            # HomePage styles
├── characters.css      # CharactersPage styles
├── profile.css         # ProfilePage styles
├── settings.css        # SettingsPage styles
├── notfound.css        # NotFoundPage styles
└── themes/
    └── light.css       # Light theme variables
```

## Instalasi Dependencies

Jalankan perintah berikut untuk menginstall Tailwind CSS dan dependencies:

```bash
cd frontend
npm install
```

Dependencies yang ditambahkan:
- `tailwindcss@^3.4.17`
- `postcss@^8.4.49`
- `autoprefixer@^10.4.20`

## Konfigurasi

### 1. tailwind.config.js
File konfigurasi Tailwind sudah dibuat dengan custom colors dan animations yang sesuai dengan design system Mirei.

### 2. postcss.config.js
PostCSS dikonfigurasi untuk memproses Tailwind CSS.

### 3. globals.css
Import Tailwind directives sudah ditambahkan:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Cara Penggunaan

### Menggunakan Tailwind Classes
```jsx
<div className="flex items-center gap-4 p-6 rounded-xl">
  <span className="text-lg font-semibold">Hello</span>
</div>
```

### Menggunakan Custom CSS Classes
Setiap page memiliki CSS file terpisah dengan class names yang semantic:

```jsx
// HomePage.jsx
import '../styles/home.css';

<div className="home-page-wrap">
  <div className="home-hero-section">
    <h1 className="home-hero-title">Title</h1>
  </div>
</div>
```

### Kombinasi Tailwind + Custom CSS
```jsx
<div className="home-stat-card flex flex-col gap-2">
  <span className="home-stat-value">100</span>
</div>
```

## CSS Variables

Gunakan CSS variables untuk konsistensi warna:

```css
color: var(--t1);  /* Primary text */
color: var(--t2);  /* Secondary text */
color: var(--t3);  /* Tertiary text */
```

## Animasi

Animasi sudah dikonfigurasi di Tailwind config dan dapat digunakan dengan:

```jsx
<div className="animate-slideUp">Content</div>
```

Available animations:
- `animate-slideUp`
- `animate-pageEnter`
- `animate-typingBounce`
- `animate-liveRingPulse`
- `animate-livePulseDot`

## Responsive Design

Gunakan Tailwind responsive utilities:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

## Best Practices

1. **Prioritas Tailwind**: Gunakan Tailwind untuk layout, spacing, dan utilities umum
2. **Custom CSS**: Gunakan custom CSS untuk styling spesifik page dan komponen kompleks
3. **CSS Variables**: Gunakan untuk warna dan nilai yang sering digunakan
4. **Semantic Class Names**: Gunakan nama class yang deskriptif (e.g., `home-hero-section`)
5. **Konsistensi**: Pertahankan pattern yang sama di semua pages

## Troubleshooting

### Tailwind classes tidak bekerja
1. Pastikan `npm install` sudah dijalankan
2. Restart development server
3. Check `tailwind.config.js` content paths

### Animasi tidak muncul
1. Check import CSS file di component
2. Pastikan `@keyframes` ada di CSS file
3. Verify animation name di Tailwind config

### CSS Variables tidak terdefinisi
1. Check import order di `globals.css`
2. Pastikan `variables.css` di-import sebelum digunakan

## Development

Untuk development:
```bash
npm run dev
```

Untuk production build:
```bash
npm run build
```

## Maintenance

Saat menambah page baru:
1. Buat file CSS baru di `src/styles/[pagename].css`
2. Import di component: `import '../styles/[pagename].css'`
3. Gunakan naming convention: `[pagename]-[element]-[modifier]`
4. Update dokumentasi ini

---

**Note**: Semua tampilan, ukuran, warna, animasi, dan layout dari design original telah dipertahankan. Hanya struktur styling yang direfactor untuk maintainability yang lebih baik.
