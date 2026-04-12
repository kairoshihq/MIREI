# Instalasi Frontend Mirei

## Prerequisites

- Node.js v18+ 
- npm atau yarn

## Langkah Instalasi

### 1. Install Dependencies

```bash
cd frontend
npm install
```

Ini akan menginstall semua dependencies termasuk:
- React 18.3.1
- Tailwind CSS 3.4.17
- Vite 5.4.21
- Dan dependencies lainnya

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173` (default Vite port)

### 4. Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### 5. Preview Production Build

```bash
npm run preview
```

## Struktur Project

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── styles/         # CSS files (Tailwind + Custom)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── index.jsx       # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies
```

## Styling System

Project ini menggunakan kombinasi:
- **Tailwind CSS**: Untuk utility classes dan responsive design
- **Custom CSS**: File terpisah untuk setiap page di `src/styles/`

Lihat [STYLING_GUIDE.md](./STYLING_GUIDE.md) untuk detail lengkap.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build

## Troubleshooting

### Port sudah digunakan

Jika port 5173 sudah digunakan, Vite akan otomatis menggunakan port lain. Check console output untuk port yang digunakan.

### Module not found

Pastikan semua dependencies sudah terinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind classes tidak bekerja

1. Restart development server
2. Clear browser cache
3. Check `tailwind.config.js` content paths

### Build error

1. Check Node.js version (minimal v18)
2. Clear cache: `rm -rf node_modules/.vite`
3. Rebuild: `npm run build`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Tips

1. **Hot Module Replacement (HMR)**: Vite mendukung HMR, perubahan akan langsung terlihat tanpa refresh
2. **CSS IntelliSense**: Install Tailwind CSS IntelliSense extension di VS Code
3. **React DevTools**: Install React DevTools browser extension untuk debugging

## Next Steps

Setelah instalasi berhasil:
1. Baca [STYLING_GUIDE.md](./STYLING_GUIDE.md) untuk memahami styling system
2. Check `src/pages/` untuk melihat implementasi pages
3. Lihat `src/components/` untuk reusable components

## Support

Jika ada masalah, check:
- Console browser untuk error messages
- Terminal untuk build errors
- Network tab untuk API issues

---

**Happy Coding! 🚀**
