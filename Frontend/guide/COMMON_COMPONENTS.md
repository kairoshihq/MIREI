# Common Components Documentation

Dokumentasi komponen-komponen reusable yang telah dimigrasikan ke folder `common/`.

## 📁 Struktur Folder

```
src/components/common/
├── Button/
│   ├── Button.jsx          # Tombol utama dengan berbagai variant
│   ├── IconButton.jsx      # Tombol icon kecil
│   ├── Button.css
│   └── index.js
├── Input/
│   ├── Input.jsx           # Input field reusable
│   ├── Toggle.jsx          # Toggle switch
│   ├── Select.jsx          # Dropdown select
│   ├── Input.css
│   └── index.js
├── Loading/
│   ├── TypingIndicator.jsx # Indikator typing 3 dots
│   ├── PulseDot.jsx        # Status dot dengan animasi pulse
│   └── index.js
├── Modal/
│   ├── Modal.jsx           # Modal dasar
│   ├── ConfirmModal.jsx    # Modal konfirmasi (pengganti window.confirm)
│   ├── Modal.css
│   └── index.js
├── Toast/
│   ├── Toast.jsx           # Toast notification
│   ├── ToastContainer.jsx  # Container untuk toast
│   ├── useToast.js         # Hook untuk trigger toast
│   ├── Toast.css
│   └── index.js
└── index.js                # Barrel export semua komponen
```

---

## 🎨 Button Components

### Button
Tombol utama dengan berbagai variant dan size.

**Props:**
- `variant`: `'primary'` | `'secondary'` | `'ghost'` | `'danger'` | `'icon-only'` (default: `'primary'`)
- `size`: `'small'` | `'medium'` | `'large'` (default: `'medium'`)
- `disabled`: boolean
- `loading`: boolean (menampilkan spinner)
- `icon`: ReactNode (icon SVG)
- `iconPosition`: `'left'` | `'right'` (default: `'left'`)
- `onClick`: function
- `type`: `'button'` | `'submit'` | `'reset'` (default: `'button'`)

**Contoh:**
```jsx
import Button from '../components/common/Button';

<Button variant="primary" size="medium" onClick={handleClick}>
  Simpan
</Button>

<Button variant="danger" loading={isLoading}>
  Hapus
</Button>
```

### IconButton
Tombol icon kecil untuk toolbar/topbar.

**Props:**
- `icon`: ReactNode (SVG icon)
- `onClick`: function
- `title`: string (tooltip)
- `size`: `'small'` | `'medium'` | `'large'`
- `variant`: `'icon-only'` (default)

**Contoh:**
```jsx
import { IconButton } from '../components/common/Button';

<IconButton
  onClick={handleHistory}
  title="Lihat riwayat"
  icon={<svg>...</svg>}
/>
```

---

## 📝 Input Components

### Input
Input field reusable dengan styling konsisten.

**Props:**
- `value`: string
- `onChange`: function
- `placeholder`: string
- `disabled`: boolean
- `type`: string (default: `'text'`)
- `autoFocus`: boolean

**Contoh:**
```jsx
import Input from '../components/common/Input';

<Input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Masukkan username"
/>
```

### Toggle
Toggle switch untuk settings.

**Props:**
- `value`: boolean
- `onChange`: function

**Contoh:**
```jsx
import { Toggle } from '../components/common/Input';

<Toggle value={darkMode} onChange={setDarkMode} />
```

### Select
Dropdown select dengan styling konsisten.

**Props:**
- `value`: string
- `onChange`: function
- `options`: Array<{ value: string, label: string }>

**Contoh:**
```jsx
import { Select } from '../components/common/Input';

<Select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  options={[
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' }
  ]}
/>
```

---

## ⏳ Loading Components

### TypingIndicator
Indikator typing dengan 3 dots bouncing.

**Props:**
- `characterName`: string (default: `'Mirei'`)

**Contoh:**
```jsx
import { TypingIndicator } from '../components/common/Loading';

{isLoading && <TypingIndicator characterName="Mirei" />}
```

### PulseDot
Status dot dengan animasi pulse.

**Props:**
- `color`: string (default: `'#10b981'`)
- `animate`: boolean (default: `false`)
- `size`: number (default: `5`)

**Contoh:**
```jsx
import { PulseDot } from '../components/common/Loading';

<PulseDot color="#a78bfa" animate={isTyping} />
```

---

## 🪟 Modal Components

### Modal
Modal dasar dengan overlay dan animasi.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: ReactNode
- `footer`: ReactNode
- `size`: `'small'` | `'medium'` | `'large'` (default: `'medium'`)

**Contoh:**
```jsx
import Modal from '../components/common/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Detail"
  footer={<Button onClick={handleSave}>Simpan</Button>}
>
  <p>Konten modal...</p>
</Modal>
```

### ConfirmModal
Modal konfirmasi (pengganti `window.confirm()`).

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `onConfirm`: function
- `title`: string (default: `'Konfirmasi'`)
- `message`: string
- `confirmLabel`: string (default: `'Ya, Lanjutkan'`)
- `cancelLabel`: string (default: `'Batal'`)
- `danger`: boolean (default: `false`)

**Contoh:**
```jsx
import { ConfirmModal } from '../components/common/Modal';

<ConfirmModal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Hapus Akun"
  message="Apakah Anda yakin ingin menghapus akun?"
  confirmLabel="Ya, Hapus"
  danger
/>
```

---

## 🔔 Toast Components

### useToast Hook
Hook untuk menampilkan toast notification (pengganti `alert()`).

**Returns:**
- `toasts`: Array (daftar toast aktif)
- `removeToast`: function
- `toast.success(message)`: function
- `toast.error(message)`: function
- `toast.info(message)`: function

**Contoh:**
```jsx
import { ToastContainer, useToast } from '../components/common/Toast';

function MyComponent() {
  const { toasts, removeToast, toast } = useToast();

  const handleSave = () => {
    // ... save logic
    toast.success('Data berhasil disimpan!');
  };

  return (
    <>
      <button onClick={handleSave}>Simpan</button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

---

## 🎯 Chat History Panel

Panel riwayat chat yang slide in dari kiri.

**Lokasi:** `src/components/chat/ChatHistoryPanel.jsx`

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `onSelectChat`: function (callback saat chat dipilih)

**Fitur:**
- Slide in animation dari kiri
- Overlay dengan blur effect
- Search bar untuk cari percakapan
- List riwayat chat dengan preview
- Auto close saat chat dipilih
- Tombol hapus semua riwayat

**Contoh:**
```jsx
import ChatHistoryPanel from '../components/chat/ChatHistoryPanel';

const [historyOpen, setHistoryOpen] = useState(false);

const handleSelectChat = (chat) => {
  console.log('Selected:', chat);
  // Load chat messages...
};

<ChatHistoryPanel
  isOpen={historyOpen}
  onClose={() => setHistoryOpen(false)}
  onSelectChat={handleSelectChat}
/>
```

---

## 📦 Import Shortcuts

Semua komponen bisa diimport dari barrel export:

```jsx
// Single import
import {
  Button,
  IconButton,
  Input,
  Toggle,
  Select,
  TypingIndicator,
  PulseDot,
  Modal,
  ConfirmModal,
  Toast,
  ToastContainer,
  useToast
} from '../components/common';
```

---

## ✅ Migration Checklist

- [x] Button components (Button, IconButton)
- [x] Input components (Input, Toggle, Select)
- [x] Loading components (TypingIndicator, PulseDot)
- [x] Modal components (Modal, ConfirmModal)
- [x] Toast components (Toast, ToastContainer, useToast)
- [x] Chat History Panel
- [x] Update ChatPage dengan IconButton & PulseDot
- [x] Update SettingsPage dengan Toggle, Select, ConfirmModal, Toast
- [x] Update ProfilePage dengan ConfirmModal, Toast
- [x] Backward compatibility (re-export TypingIndicator dari chat/)

---

## 🎨 Design Tokens

Semua komponen menggunakan CSS variables yang konsisten:

```css
/* Colors */
--t1, --t2, --t3          /* Text colors */
--accent, --accent-soft   /* Accent colors */
--bg-base, --bg-panel     /* Background colors */

/* Spacing & Radius */
--r-sm, --r-md, --r-lg    /* Border radius */

/* Transitions */
--t-fast, --t-med         /* Transition duration */
--ease                    /* Easing function */
```

---

## 📝 Notes

- Semua komponen sudah responsive dan accessible
- Styling menggunakan CSS modules untuk menghindari konflik
- Animasi menggunakan CSS animations untuk performa optimal
- Komponen lama tetap berfungsi (backward compatible)
- Tidak ada perubahan pada tampilan atau logika yang sudah ada
