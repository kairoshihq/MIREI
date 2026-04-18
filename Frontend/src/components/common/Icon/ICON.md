# Icon System

Centralized icon system for the Mirei application. All icons are SVG-based React components.

## Usage

Import icons from the centralized index file:

```jsx
import { ChatIcon, FlowerIcon, SettingsIcon } from '../../components/common/Icon';

// Use in your component
<ChatIcon size={20} color="#a78bfa" />
```

## Available Icons

### Communication & Social
- `ChatIcon` - Chat/message icon
- `EmailIcon` - Email icon
- `BellIcon` - Notification bell

### Navigation & Actions
- `ChevronIcon` - Chevron/arrow (supports direction prop: 'right', 'left', 'up', 'down')
- `PlusIcon` - Plus/add icon
- `TrashIcon` - Delete/trash icon
- `EditIcon` - Edit/pencil icon
- `CheckIcon` - Checkmark icon
- `ClockIcon` - Clock/history icon
- `LogoutIcon` - Logout/exit icon

### UI Elements
- `FlowerIcon` - Mirei's signature flower icon
- `StarIcon` - Star icon (supports filled prop)
- `TheaterIcon` - Theater/character icon
- `SettingsIcon` - Settings/gear icon
- `LockIcon` - Lock/security icon
- `UserIcon` - User/profile icon
- `BookIcon` - Book/documentation icon
- `SparklesIcon` - Sparkles/magic icon
- `PaletteIcon` - Palette/theme icon
- `GlobeIcon` - Globe/language icon
- `AlertIcon` - Alert/warning icon

### Data & Stats
- `CalendarIcon` - Calendar/date icon
- `ChartIcon` - Chart/statistics icon

## Props

All icons accept the following props:

- `size` (number, default: 16) - Icon size in pixels
- `color` (string, default: 'currentColor') - Icon color
- `className` (string, default: '') - Additional CSS classes

### Special Props

**ChevronIcon:**
- `direction` ('right' | 'left' | 'up' | 'down', default: 'right') - Arrow direction

**StarIcon:**
- `filled` (boolean, default: false) - Whether to fill the star

## Examples

```jsx
// Basic usage
<ChatIcon size={24} />

// With custom color
<FlowerIcon size={32} color="#a78bfa" />

// With className
<SettingsIcon size={20} className="my-custom-class" />

// Chevron with direction
<ChevronIcon size={16} direction="down" />

// Filled star
<StarIcon size={18} filled color="#f59e0b" />
```

## Adding New Icons

1. Create a new icon component file (e.g., `NewIcon.jsx`)
2. Follow the existing pattern with size, color, and className props
3. Export the icon from `index.jsx`
4. Update this README with the new icon

## Design Guidelines

- All icons use 2px stroke width by default
- Icons should be simple and recognizable at small sizes
- Use `currentColor` as default to inherit text color
- Keep viewBox at "0 0 24 24" for consistency
