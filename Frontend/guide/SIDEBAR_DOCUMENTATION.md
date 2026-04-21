# 📱 Sidebar Documentation - Single Collapsible Sidebar

## 📋 Overview

Sidebar telah diubah dari **2 sidebar terpisah** (icon rail + context panel) menjadi **1 sidebar tunggal** yang bisa diperkecil (collapsed) dan diperbesar (expanded).

## 🔄 What Changed

### Before (Old Design)
```
┌────────┬──────────────┐
│ Icon   │ Context      │
│ Rail   │ Panel        │
│ (72px) │ (260px)      │
│        │              │
│ Fixed  │ Dynamic      │
│        │ Content      │
└────────┴──────────────┘
Total: 332px
```

### After (New Design)
```
┌──────────────────┐     ┌────────┐
│ Expanded         │ or  │ Collapsed│
│ (260px)          │     │ (72px)   │
│                  │     │          │
│ - Logo + Toggle  │     │ - Icon   │
│ - Navigation     │     │ - Icons  │
│ - Theme Toggle   │     │ - Avatar │
│ - User Profile   │     │          │
└──────────────────┘     └──────────┘
```

## ✨ Features

### 1. **Collapsible/Expandable** 🔄
- Toggle button di header
- Smooth transition animation (0.3s)
- Remembers state (dapat ditambahkan localStorage)

### 2. **Expanded Mode (260px)** 📖
**Header:**
- Logo dengan icon ✦
- App name: "Mirei"
- Subtitle: "AI Assistant"
- Toggle button (chevron left)

**Navigation:**
- 5 menu items dengan icon + label:
  - 🏠 Beranda
  - 💬 Chat
  - 👤 Mirei (Characters)
  - 👤 Profile
  - ⚙️ Settings
- Active indicator (purple bar)
- Hover effects

**Footer:**
- Theme toggle (Dark/Light buttons)
- User profile card dengan avatar

### 3. **Collapsed Mode (72px)** 📱
**Header:**
- Logo icon only
- Toggle button (menu icon)

**Navigation:**
- Icons only (no labels)
- Tooltips on hover
- Active indicator

**Footer:**
- Theme toggle icon only
- User avatar only

## 🎨 Design System

### Colors
```css
Primary: #8b5cf6 (Purple)
Secondary: #ec4899 (Pink)
Background: rgba(12,14,22,0.7)
Border: rgba(255,255,255,0.06)
Active: rgba(139,92,246,0.15)
```

### Dimensions
```css
Expanded: 260px
Collapsed: 72px
Transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Typography
```css
Logo: 18px, bold
Nav item: 14px, medium/semibold
User name: 13px, semibold
User plan: 11px, regular
```

## 📁 File Structure

```
frontend/src/
├── components/
│   └── layout/
│       └── Sidebar.jsx        # ✏️ Completely rewritten
└── styles/
    └── sidebar.css            # ✨ New
```

## 🔧 Component Structure

```jsx
<Sidebar>
  ├── Header
  │   ├── Logo (expanded) / Icon (collapsed)
  │   └── Toggle Button
  │
  ├── Navigation
  │   └── Nav Items (5)
  │       ├── Icon
  │       ├── Label (expanded only)
  │       └── Active Indicator
  │
  └── Footer
      ├── Theme Toggle
      │   ├── Dark/Light Buttons (expanded)
      │   └── Icon Button (collapsed)
      └── User Profile
          ├── Avatar
          ├── Name + Plan (expanded)
          └── Menu Icon (expanded)
```

## 💻 Usage

### Basic Usage
```jsx
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main>{/* Content */}</main>
    </div>
  );
}
```

### State Management
```javascript
const [isCollapsed, setIsCollapsed] = useState(false);

const toggleSidebar = () => setIsCollapsed(!isCollapsed);
```

### Persist State (Optional)
```javascript
// Save to localStorage
const toggleSidebar = () => {
  const newState = !isCollapsed;
  setIsCollapsed(newState);
  localStorage.setItem('sidebarCollapsed', newState);
};

// Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem('sidebarCollapsed');
  if (saved !== null) {
    setIsCollapsed(JSON.parse(saved));
  }
}, []);
```

## 🎯 Navigation Items

### Current Menu
```javascript
const NAV_ITEMS = [
  { id: 'home',       label: 'Beranda',    icon: 'home' },
  { id: 'chat',       label: 'Chat',       icon: 'chat' },
  { id: 'characters', label: 'Mirei',      icon: 'characters' },
  { id: 'profile',    label: 'Profile',    icon: 'profile' },
  { id: 'settings',   label: 'Settings',   icon: 'settings' },
];
```

### Add New Menu Item
```javascript
// 1. Add to NAV_ITEMS array
{ id: 'newpage', label: 'New Page', icon: 'newicon' }

// 2. Add icon to Icons object
newicon: (
  <svg>...</svg>
)

// 3. Add route handler in App.jsx
```

## 🎨 Customization

### Change Width
```javascript
// In sidebarStyle
width: isCollapsed ? '72px' : '280px', // Change 280px
```

### Change Colors
```css
/* In sidebar.css or inline styles */
background: rgba(12,14,22,0.7); /* Change background */
border: 1px solid rgba(255,255,255,0.06); /* Change border */
```

### Change Transition Speed
```javascript
transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Change 0.3s
```

### Add Badge to Menu Item
```javascript
<button style={navItem}>
  {Icons[item.icon]}
  {!isCollapsed && <span>{item.label}</span>}
  {item.badge && (
    <span style={badgeStyle}>{item.badge}</span>
  )}
</button>
```

## 🎭 Animations

### Available Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes activePulse {
  0%, 100% { box-shadow: 0 0 14px rgba(139, 92, 246, 0.2); }
  50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
}

@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 6px #7c3aed); }
  50% { filter: drop-shadow(0 0 12px #7c3aed); }
}
```

### Usage
```jsx
// Stagger animation for nav items
animationDelay: `${i * 0.05}s`

// Active item pulse
className="sidebar-nav-item-active"

// Logo glow
className="sidebar-logo-icon"
```

## 📱 Responsive Design

### Mobile Behavior (Optional)
```css
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    transform: translateX(-100%);
  }
  
  .sidebar.sidebar-mobile-open {
    transform: translateX(0);
  }
}
```

### Implementation
```javascript
const [isMobileOpen, setIsMobileOpen] = useState(false);

// Add to sidebar
className={`sidebar ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}

// Mobile toggle button (in header/navbar)
<button onClick={() => setIsMobileOpen(!isMobileOpen)}>
  Menu
</button>
```

## 🎯 Interactions

### Hover Effects
- Nav items: Background lightens
- Toggle button: Border color changes
- Theme buttons: Background lightens
- User profile: Background lightens

### Active States
- Nav item: Purple background + border + glow
- Theme button: Purple background
- Active indicator: Purple gradient bar

### Click Actions
- Nav items: Navigate to page
- Toggle button: Collapse/expand sidebar
- Theme buttons: Switch theme
- User profile: Open profile menu (can be added)

## 🔮 Future Enhancements

### Phase 1: User Menu
```javascript
const [showUserMenu, setShowUserMenu] = useState(false);

<div onClick={() => setShowUserMenu(!showUserMenu)}>
  {/* User profile */}
</div>

{showUserMenu && (
  <div className="user-menu">
    <button>Edit Profile</button>
    <button>Settings</button>
    <button>Logout</button>
  </div>
)}
```

### Phase 2: Keyboard Shortcuts
```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'b') {
      toggleSidebar();
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Phase 3: Drag to Resize
```javascript
const handleDragStart = (e) => {
  // Implement drag logic
};

<div 
  className="resize-handle"
  onMouseDown={handleDragStart}
/>
```

## 🐛 Troubleshooting

### Sidebar tidak collapse
```javascript
// Check state update
console.log('isCollapsed:', isCollapsed);

// Check transition CSS
transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
```

### Icons tidak muncul
```javascript
// Check Icons object
console.log('Icons:', Icons);

// Check SVG paths
{Icons[item.icon] || Icons.home}
```

### Active state tidak update
```javascript
// Check activePage prop
console.log('activePage:', activePage);

// Check comparison
const isActive = activePage === item.id;
```

## ✅ Testing Checklist

### Visual Testing
- [ ] Sidebar expands/collapses smoothly
- [ ] Logo displays correctly in both modes
- [ ] All icons visible
- [ ] Labels show/hide correctly
- [ ] Active indicator appears
- [ ] Theme toggle works
- [ ] User profile displays

### Interaction Testing
- [ ] Toggle button works
- [ ] Navigation items clickable
- [ ] Theme buttons work
- [ ] Hover effects smooth
- [ ] Active states correct
- [ ] Tooltips show (collapsed mode)

### Responsive Testing
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] Transitions smooth on all devices

## 📊 Comparison

| Feature | Old (2 Sidebars) | New (1 Sidebar) |
|---------|------------------|-----------------|
| Width | 332px (72+260) | 260px / 72px |
| Components | 2 separate | 1 unified |
| Collapsible | No | Yes |
| Context Panel | Dynamic | Removed |
| Complexity | High | Low |
| Maintainability | Difficult | Easy |

## 💡 Tips

1. **Consistent Width**: Use same width for expanded mode across app
2. **Smooth Transitions**: Use cubic-bezier for natural feel
3. **Tooltips**: Always show tooltips in collapsed mode
4. **Icons**: Use consistent icon size (20px)
5. **Spacing**: Maintain consistent padding/gaps

## 📚 Resources

- [Sidebar Design Patterns](https://www.nngroup.com/articles/hamburger-menus/)
- [Navigation Best Practices](https://www.smashingmagazine.com/2019/01/navigation-design-patterns/)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

---

**Version**: 2.0.0
**Last Updated**: 2024
**Status**: ✅ Complete & Production Ready

**Sidebar is now simpler and better! 🎉**
