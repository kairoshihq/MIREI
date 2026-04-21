# 🚀 Quick Reference - Styling Frontend Mirei

## ⚡ Quick Start

```bash
cd frontend
npm install
npm run dev
```

## 📁 CSS Files Location

```
frontend/src/styles/
├── home.css         → HomePage
├── characters.css   → CharactersPage
├── profile.css      → ProfilePage
├── settings.css     → SettingsPage
├── notfound.css     → NotFoundPage
└── chat.css         → ChatPage
```

## 🎨 Class Naming Pattern

```
[page]-[element]-[modifier]
```

**Examples:**
```css
.home-hero-section
.characters-card-active
.profile-edit-btn
.settings-toggle-active
```

## 💻 Usage Examples

### Import CSS in Component
```jsx
import '../styles/home.css';
```

### Use Tailwind Classes
```jsx
<div className="flex items-center gap-4 p-6">
```

### Use Custom Classes
```jsx
<div className="home-hero-section">
```

### Combine Both
```jsx
<div className="home-stat-card flex flex-col gap-2">
```

### Dynamic Styles (inline)
```jsx
<div 
  className="characters-card"
  style={{ 
    borderColor: `${color}50`,
    animationDelay: `${i * 0.07}s`
  }}
>
```

## 🎯 Common Tailwind Classes

### Layout
```jsx
flex flex-col flex-row
grid grid-cols-2 grid-cols-4
items-center justify-between
gap-2 gap-4 gap-6
```

### Spacing
```jsx
p-4 p-6 px-4 py-2
m-4 m-6 mx-auto my-4
space-x-2 space-y-4
```

### Sizing
```jsx
w-full w-1/2 w-[280px]
h-full h-screen h-[42px]
max-w-md min-h-screen
```

### Typography
```jsx
text-sm text-base text-lg text-xl
font-normal font-medium font-semibold font-bold
leading-tight leading-relaxed
```

### Colors (use CSS variables)
```jsx
style={{ color: 'var(--t1)' }}  // Primary text
style={{ color: 'var(--t2)' }}  // Secondary text
style={{ color: 'var(--t3)' }}  // Tertiary text
```

### Borders & Radius
```jsx
rounded rounded-lg rounded-full
border border-2
```

### Effects
```jsx
shadow shadow-lg
opacity-50 opacity-100
transition-all duration-200
hover:opacity-80
```

## 🎭 Animations

### Available Animations
```jsx
animate-slideUp
animate-pageEnter
animate-typingBounce
animate-liveRingPulse
animate-livePulseDot
```

### Usage
```jsx
<div className="animate-slideUp">
```

### With Delay (inline)
```jsx
<div 
  className="animate-slideUp"
  style={{ animationDelay: '0.2s' }}
>
```

## 🎨 CSS Variables

```css
var(--t1)  /* Primary text color */
var(--t2)  /* Secondary text color */
var(--t3)  /* Tertiary text color */
```

## 📦 Page-Specific Classes

### HomePage
```css
.home-page-wrap
.home-hero-section
.home-hero-title
.home-stat-card
.home-recent-card
.home-quick-card
```

### CharactersPage
```css
.characters-page-wrap
.characters-card
.characters-card-active
.characters-avatar
.characters-chat-btn
```

### ProfilePage
```css
.profile-page-wrap
.profile-hero-card
.profile-big-avatar
.profile-edit-btn
.profile-act-card
```

### SettingsPage
```css
.settings-page-wrap
.settings-section-card
.settings-toggle
.settings-toggle-active
.settings-select
```

### NotFoundPage
```css
.notfound-wrap
.notfound-big-num
.notfound-home-btn
```

### ChatPage
```css
.chat-window
.message-wrapper
.message-bubble
.user-bubble
.assistant-bubble
.typing-indicator
.chat-input-field
.send-button
```

## 🔧 Common Patterns

### Card Component
```jsx
<div className="rounded-2xl p-6 bg-white/5 border border-white/10">
  {/* Content */}
</div>
```

### Button
```jsx
<button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
  Click Me
</button>
```

### Input
```jsx
<input 
  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500"
  placeholder="Type here..."
/>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Flex Layout
```jsx
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

## 🎯 Responsive Design

```jsx
// Mobile first approach
<div className="
  grid 
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-4       // Desktop: 4 columns
  gap-4
">
```

### Breakpoints
```
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

## 🐛 Quick Fixes

### Styles not applying?
```bash
# 1. Restart dev server
npm run dev

# 2. Clear browser cache
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# 3. Check import
import '../styles/[page].css';
```

### Tailwind not working?
```bash
# Check tailwind.config.js content paths
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### Build errors?
```bash
# Clear cache
rm -rf node_modules/.vite
npm run build
```

## 📚 Documentation Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Full Styling Guide](./STYLING_GUIDE.md)
- [Installation Guide](./INSTALLATION.md)

## 💡 Pro Tips

1. **Use Tailwind IntelliSense** - VS Code extension for autocomplete
2. **Inspect with DevTools** - See applied classes in browser
3. **Combine wisely** - Tailwind for layout, custom CSS for complex styling
4. **Keep it semantic** - Use meaningful class names
5. **Stay consistent** - Follow the naming convention

## 🎨 Color Palette

```css
/* Primary Purple */
#7c3aed, #8b5cf6, #a855f7, #a78bfa

/* Pink Accent */
#ec4899, #f9a8d4

/* Success Green */
#10b981

/* Warning Orange */
#f59e0b

/* Error Red */
#ef4444

/* Info Blue */
#06b6d4, #93c5fd, #a5b4fc

/* Yellow */
#fde68a
```

## ⚡ Performance Tips

1. **Use Tailwind utilities** - Smaller bundle size
2. **Avoid deep nesting** - Keep CSS flat
3. **Reuse classes** - Don't repeat yourself
4. **Lazy load** - Split code when needed

---

**Quick Reference v1.0.0**
**Last Updated**: 2026
