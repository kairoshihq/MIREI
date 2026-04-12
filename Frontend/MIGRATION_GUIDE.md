# 🔄 Migration Guide - Inline Styles ke Tailwind + CSS Modules

## 📋 Overview

Panduan ini menjelaskan cara migrate component dari inline styles ke kombinasi Tailwind CSS + CSS Modules.

## 🎯 Migration Strategy

### Before (Inline Styles)
```jsx
const MyComponent = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--t1)'
      }}>
        Title
      </h1>
    </div>
  );
};
```

### After (Tailwind + CSS Modules)
```jsx
import '../styles/mycomponent.css';

const MyComponent = () => {
  return (
    <div className="mycomponent-container">
      <h1 className="mycomponent-title">
        Title
      </h1>
    </div>
  );
};
```

```css
/* mycomponent.css */
.mycomponent-container {
  @apply flex items-center gap-4 p-5 rounded-xl;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mycomponent-title {
  @apply text-2xl font-bold;
  color: var(--t1);
}
```

## 📝 Step-by-Step Migration

### Step 1: Analyze Component

Identifikasi:
1. **Layout styles** (flex, grid, positioning)
2. **Spacing** (padding, margin, gap)
3. **Typography** (font-size, font-weight, color)
4. **Colors & Backgrounds**
5. **Borders & Radius**
6. **Animations**
7. **Dynamic styles** (dari props/state)

### Step 2: Create CSS File

```bash
# Create new CSS file
touch src/styles/componentname.css
```

### Step 3: Convert Styles

#### Layout → Tailwind
```jsx
// Before
style={{ display: 'flex', flexDirection: 'column' }}

// After
className="flex flex-col"
```

#### Spacing → Tailwind
```jsx
// Before
style={{ padding: '20px', gap: '16px' }}

// After
className="p-5 gap-4"
```

#### Typography → Tailwind
```jsx
// Before
style={{ fontSize: '24px', fontWeight: 700 }}

// After
className="text-2xl font-bold"
```

#### Complex Styles → Custom CSS
```jsx
// Before
style={{
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(12px)'
}}

// After
className="component-card"

// In CSS file:
.component-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}
```

### Step 4: Handle Dynamic Styles

Keep inline styles untuk dynamic values:

```jsx
// Dynamic colors from props
<div 
  className="character-card"
  style={{ 
    borderColor: `${color}50`,
    boxShadow: `0 0 20px ${color}15`
  }}
>

// Animation delays
<div 
  className="stat-card"
  style={{ animationDelay: `${index * 0.07}s` }}
>
```

### Step 5: Import CSS

```jsx
import '../styles/componentname.css';
```

### Step 6: Test

```bash
npm run dev
```

Verify:
- ✅ Visual appearance sama
- ✅ Animations bekerja
- ✅ Interactions bekerja
- ✅ Responsive design OK

## 🎨 Conversion Cheat Sheet

### Display & Layout

| Inline Style | Tailwind Class |
|-------------|----------------|
| `display: 'flex'` | `flex` |
| `display: 'grid'` | `grid` |
| `flexDirection: 'column'` | `flex-col` |
| `flexDirection: 'row'` | `flex-row` |
| `alignItems: 'center'` | `items-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| `position: 'relative'` | `relative` |
| `position: 'absolute'` | `absolute` |

### Spacing

| Inline Style | Tailwind Class |
|-------------|----------------|
| `padding: '16px'` | `p-4` |
| `padding: '20px'` | `p-5` |
| `paddingLeft: '16px'` | `pl-4` |
| `margin: '16px'` | `m-4` |
| `gap: '8px'` | `gap-2` |
| `gap: '16px'` | `gap-4` |

### Sizing

| Inline Style | Tailwind Class |
|-------------|----------------|
| `width: '100%'` | `w-full` |
| `height: '100%'` | `h-full` |
| `width: '280px'` | `w-[280px]` |
| `maxWidth: '400px'` | `max-w-[400px]` |
| `minHeight: '180px'` | `min-h-[180px]` |

### Typography

| Inline Style | Tailwind Class |
|-------------|----------------|
| `fontSize: '12px'` | `text-xs` |
| `fontSize: '14px'` | `text-sm` |
| `fontSize: '16px'` | `text-base` |
| `fontSize: '20px'` | `text-xl` |
| `fontSize: '24px'` | `text-2xl` |
| `fontWeight: 500` | `font-medium` |
| `fontWeight: 600` | `font-semibold` |
| `fontWeight: 700` | `font-bold` |
| `textAlign: 'center'` | `text-center` |
| `lineHeight: 1.6` | `leading-relaxed` |

### Borders & Radius

| Inline Style | Tailwind Class |
|-------------|----------------|
| `borderRadius: '8px'` | `rounded-lg` |
| `borderRadius: '12px'` | `rounded-xl` |
| `borderRadius: '16px'` | `rounded-2xl` |
| `borderRadius: '50%'` | `rounded-full` |
| `border: '1px solid'` | `border` |

### Effects

| Inline Style | Tailwind Class |
|-------------|----------------|
| `opacity: 0.5` | `opacity-50` |
| `cursor: 'pointer'` | `cursor-pointer` |
| `overflow: 'hidden'` | `overflow-hidden` |
| `overflowY: 'auto'` | `overflow-y-auto` |

## 🎯 Best Practices

### 1. Use Tailwind for Common Patterns
```jsx
// ✅ Good
<div className="flex items-center gap-4 p-6">

// ❌ Avoid
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
```

### 2. Use Custom CSS for Complex Styles
```css
/* ✅ Good */
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

/* ❌ Avoid inline */
style={{ background: 'rgba(255,255,255,0.04)', ... }}
```

### 3. Keep Dynamic Styles Inline
```jsx
// ✅ Good - Dynamic value
<div 
  className="card"
  style={{ borderColor: `${color}50` }}
>

// ❌ Avoid - Static value
<div style={{ borderColor: 'rgba(139,92,246,0.5)' }}>
```

### 4. Use Semantic Class Names
```css
/* ✅ Good */
.home-hero-section
.characters-card-active
.profile-edit-btn

/* ❌ Avoid */
.section1
.card-blue
.btn2
```

### 5. Group Related Styles
```css
/* ✅ Good */
.card {
  @apply rounded-xl p-6;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card-title {
  @apply text-xl font-bold mb-2;
  color: var(--t1);
}

.card-content {
  @apply text-sm;
  color: var(--t2);
}
```

## 🔄 Migration Patterns

### Pattern 1: Simple Component

**Before:**
```jsx
const Button = ({ children }) => (
  <button style={{
    padding: '12px 24px',
    borderRadius: '99px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer'
  }}>
    {children}
  </button>
);
```

**After:**
```jsx
import '../styles/button.css';

const Button = ({ children }) => (
  <button className="btn-primary">
    {children}
  </button>
);
```

```css
/* button.css */
.btn-primary {
  @apply px-6 py-3 rounded-full text-sm font-semibold border-none cursor-pointer;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
}
```

### Pattern 2: Component with States

**Before:**
```jsx
const Card = ({ active }) => (
  <div style={{
    padding: '20px',
    borderRadius: '16px',
    background: active ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.04)',
    border: active ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)'
  }}>
    Content
  </div>
);
```

**After:**
```jsx
import '../styles/card.css';

const Card = ({ active }) => (
  <div className={`card ${active ? 'card-active' : ''}`}>
    Content
  </div>
);
```

```css
/* card.css */
.card {
  @apply p-5 rounded-2xl;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: all 0.2s ease;
}

.card-active {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.5);
}
```

### Pattern 3: Component with Dynamic Values

**Before:**
```jsx
const Badge = ({ color, label }) => (
  <div style={{
    padding: '4px 12px',
    borderRadius: '99px',
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}40`,
    fontSize: '12px',
    fontWeight: 500
  }}>
    {label}
  </div>
);
```

**After:**
```jsx
import '../styles/badge.css';

const Badge = ({ color, label }) => (
  <div 
    className="badge"
    style={{ 
      background: `${color}18`,
      color: color,
      borderColor: `${color}40`
    }}
  >
    {label}
  </div>
);
```

```css
/* badge.css */
.badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
  border: 1px solid;
}
```

## ✅ Migration Checklist

Per component:

- [ ] Analyze all inline styles
- [ ] Create CSS file
- [ ] Convert layout to Tailwind
- [ ] Convert spacing to Tailwind
- [ ] Move complex styles to CSS
- [ ] Keep dynamic styles inline
- [ ] Import CSS in component
- [ ] Test visual appearance
- [ ] Test interactions
- [ ] Test responsive design
- [ ] Remove old inline styles
- [ ] Update documentation

## 🐛 Common Issues

### Issue 1: Styles Not Applying

**Problem:** CSS classes tidak apply
**Solution:**
```bash
# Restart dev server
npm run dev

# Check import
import '../styles/component.css';

# Check class name spelling
```

### Issue 2: Specificity Conflicts

**Problem:** Tailwind classes di-override
**Solution:**
```css
/* Use !important sparingly */
.my-class {
  color: var(--t1) !important;
}

/* Or increase specificity */
.parent .my-class {
  color: var(--t1);
}
```

### Issue 3: Dynamic Styles Not Working

**Problem:** Dynamic values tidak update
**Solution:**
```jsx
// ✅ Use inline styles for dynamic values
<div 
  className="card"
  style={{ borderColor: `${color}50` }}
>
```

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)
- [Existing Examples](./src/pages/) - Check migrated pages

## 🎓 Tips

1. **Start Small**: Migrate one component at a time
2. **Test Often**: Verify after each change
3. **Use DevTools**: Inspect to debug
4. **Follow Patterns**: Look at existing migrated components
5. **Ask for Help**: Check with team if unsure

---

**Migration Guide Version**: 1.0.0
**Last Updated**: 2026

**Happy Migrating! 🚀**
