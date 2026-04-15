# 🎭 Live2D Integration Guide - Mirei Character

## 📋 Overview

Panduan lengkap untuk mengintegrasikan Live2D model Mirei ke dalam halaman profile.

## 🎯 Target Area

**Location:** `CharactersPage.jsx` - Left column
**Container:** `.mirei-live2d-canvas`
**Dimensions:** 340px × 380px (recommended)

## 📦 Recommended Libraries

### Option 1: pixi-live2d-display (Recommended)
```bash
npm install pixi.js pixi-live2d-display
```

**Pros:**
- Easy to use
- Good performance
- Active maintenance
- WebGL support

### Option 2: Live2D Cubism SDK
```bash
# Download from official site
# https://www.live2d.com/en/download/cubism-sdk/
```

**Pros:**
- Official SDK
- Full features
- Best compatibility

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd frontend
npm install pixi.js pixi-live2d-display
```

### Step 2: Create Live2D Component

Create `src/components/Live2DCanvas.jsx`:

```jsx
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

const Live2DCanvas = ({ 
  modelPath, 
  width = 340, 
  height = 380,
  onLoad,
  onError 
}) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    // Initialize PIXI Application
    const app = new PIXI.Application({
      view: canvasRef.current,
      width,
      height,
      transparent: true,
      antialias: true,
    });
    appRef.current = app;

    // Load Live2D Model
    Live2DModel.from(modelPath)
      .then(model => {
        modelRef.current = model;
        
        // Scale model to fit canvas
        const scale = Math.min(
          width / model.width,
          height / model.height
        ) * 0.8;
        
        model.scale.set(scale);
        model.x = width / 2;
        model.y = height / 2;
        model.anchor.set(0.5, 0.5);

        // Add to stage
        app.stage.addChild(model);

        // Enable interactions
        model.on('hit', (hitAreas) => {
          console.log('Hit areas:', hitAreas);
          // Play motion or expression
          if (hitAreas.includes('Body')) {
            model.motion('tap_body');
          }
        });

        // Callback
        if (onLoad) onLoad(model);
      })
      .catch(error => {
        console.error('Failed to load Live2D model:', error);
        if (onError) onError(error);
      });

    // Cleanup
    return () => {
      if (modelRef.current) {
        modelRef.current.destroy();
      }
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, [modelPath, width, height]);

  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        width: '100%', 
        height: '100%',
        cursor: 'pointer' 
      }}
    />
  );
};

export default Live2DCanvas;
```

### Step 3: Update CharactersPage.jsx

Replace placeholder dengan Live2D component:

```jsx
import Live2DCanvas from '../components/Live2DCanvas';

// In component
const [modelLoaded, setModelLoaded] = useState(false);

// Replace placeholder
<div className="mirei-live2d-canvas">
  {!modelLoaded && (
    <div className="mirei-live2d-placeholder">
      {/* Loading state */}
      <div className="mirei-avatar-large">
        <span className="text-[80px]">🌸</span>
      </div>
    </div>
  )}
  
  <Live2DCanvas
    modelPath="/models/mirei/mirei.model3.json"
    width={340}
    height={380}
    onLoad={() => setModelLoaded(true)}
    onError={(err) => console.error(err)}
  />
  
  <div className="mirei-live2d-label">
    <div className="mirei-live2d-status" />
    <span>Live2D {modelLoaded ? 'Active' : 'Loading...'}</span>
  </div>
</div>
```

## 📁 Model File Structure

```
public/models/mirei/
├── mirei.model3.json          # Model definition
├── mirei.moc3                 # Model data
├── mirei.physics3.json        # Physics settings
├── mirei.pose3.json           # Pose data (optional)
├── mirei.cdi3.json            # Display info (optional)
├── textures/
│   ├── texture_00.png         # Texture files
│   └── texture_01.png
├── motions/
│   ├── idle.motion3.json      # Idle animation
│   ├── tap_body.motion3.json  # Tap animations
│   └── ...
└── expressions/
    ├── happy.exp3.json        # Expressions
    ├── sad.exp3.json
    └── ...
```

## 🎨 Advanced Features

### 1. Auto Idle Motion

```javascript
useEffect(() => {
  if (modelRef.current) {
    // Start idle motion
    modelRef.current.motion('idle', 0, 3); // group, index, priority
    
    // Loop idle motion
    modelRef.current.on('motionFinish', () => {
      modelRef.current.motion('idle', 0, 3);
    });
  }
}, [modelLoaded]);
```

### 2. Expression Control

```javascript
const changeExpression = (expressionName) => {
  if (modelRef.current) {
    modelRef.current.expression(expressionName);
  }
};

// Usage
<button onClick={() => changeExpression('happy')}>
  😊 Happy
</button>
```

### 3. Eye Tracking (Follow Mouse)

```javascript
useEffect(() => {
  const handleMouseMove = (e) => {
    if (modelRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = (e.clientY - rect.top) / rect.height * 2 - 1;
      
      // Update eye position
      modelRef.current.internalModel.coreModel.setParameterValueById(
        'ParamAngleX',
        x * 30
      );
      modelRef.current.internalModel.coreModel.setParameterValueById(
        'ParamAngleY',
        y * 30
      );
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [modelLoaded]);
```

### 4. Lip Sync (Audio)

```javascript
const playVoice = async (audioUrl) => {
  const audio = new Audio(audioUrl);
  
  // Analyze audio for lip sync
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
  const updateLipSync = () => {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    // Update mouth parameter
    if (modelRef.current) {
      modelRef.current.internalModel.coreModel.setParameterValueById(
        'ParamMouthOpenY',
        average / 255
      );
    }
    
    if (!audio.paused) {
      requestAnimationFrame(updateLipSync);
    }
  };
  
  audio.play();
  updateLipSync();
};
```

### 5. Touch/Click Interactions

```javascript
const handleCanvasClick = (e) => {
  if (!modelRef.current) return;
  
  const rect = canvasRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Check hit areas
  const hitAreas = modelRef.current.hitTest(x, y);
  
  if (hitAreas.includes('Head')) {
    modelRef.current.motion('tap_head');
    changeExpression('happy');
  } else if (hitAreas.includes('Body')) {
    modelRef.current.motion('tap_body');
  }
};

<canvas 
  ref={canvasRef}
  onClick={handleCanvasClick}
/>
```

## 🎭 Emotion System Integration

Connect Live2D with chat emotion detection:

```javascript
// In CharactersPage.jsx
const [currentEmotion, setCurrentEmotion] = useState('neutral');

// Update expression based on emotion
useEffect(() => {
  if (live2dModelRef.current) {
    const expressionMap = {
      'happy': 'happy',
      'sad': 'sad',
      'laugh': 'laugh',
      'neutral': 'neutral'
    };
    
    live2dModelRef.current.expression(expressionMap[currentEmotion]);
  }
}, [currentEmotion]);
```

## 📊 Performance Optimization

### 1. Lazy Loading

```javascript
const Live2DCanvas = React.lazy(() => import('../components/Live2DCanvas'));

// In component
<Suspense fallback={<LoadingPlaceholder />}>
  <Live2DCanvas modelPath="..." />
</Suspense>
```

### 2. Reduce Draw Calls

```javascript
// Limit FPS for better performance
app.ticker.maxFPS = 30; // Instead of 60
```

### 3. Texture Optimization

```bash
# Compress textures
# Use tools like TinyPNG or ImageOptim
# Recommended: PNG-8 or WebP format
```

### 4. Model Optimization

```javascript
// Disable unnecessary features
const model = await Live2DModel.from(modelPath, {
  autoUpdate: false,  // Manual update
  autoInteract: false // Manual interaction
});
```

## 🐛 Common Issues & Solutions

### Issue 1: Model tidak muncul

**Solution:**
```javascript
// Check model path
console.log('Model path:', modelPath);

// Check CORS
// Serve models from same domain or enable CORS

// Check console for errors
model.catch(err => console.error('Model error:', err));
```

### Issue 2: Performance lag

**Solution:**
```javascript
// Reduce canvas size
width={280}  // Instead of 340
height={320} // Instead of 380

// Lower FPS
app.ticker.maxFPS = 24;

// Disable anti-aliasing
antialias: false
```

### Issue 3: Model terlalu besar/kecil

**Solution:**
```javascript
// Adjust scale
const scale = Math.min(
  width / model.width,
  height / model.height
) * 0.7; // Adjust multiplier

model.scale.set(scale);
```

## 📱 Mobile Optimization

```javascript
// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Adjust settings for mobile
const Live2DCanvas = ({ modelPath }) => {
  const config = {
    width: isMobile ? 280 : 340,
    height: isMobile ? 320 : 380,
    antialias: !isMobile,
    maxFPS: isMobile ? 24 : 30
  };
  
  // Use config...
};
```

## 🎨 Styling Tips

```css
/* Smooth transitions */
.mirei-live2d-canvas {
  transition: all 0.3s ease;
}

/* Hover effect */
.mirei-live2d-canvas:hover {
  transform: scale(1.02);
}

/* Loading state */
.mirei-live2d-canvas.loading {
  opacity: 0.5;
  pointer-events: none;
}
```

## 📚 Resources

### Official Documentation
- [Live2D Cubism SDK](https://docs.live2d.com/cubism-sdk-manual/top/)
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- [PIXI.js Documentation](https://pixijs.download/release/docs/index.html)

### Model Creation
- [Live2D Cubism Editor](https://www.live2d.com/en/download/cubism/)
- [Live2D Tutorials](https://docs.live2d.com/cubism-editor-manual/top/)

### Community
- [Live2D Forum](https://community.live2d.com/)
- [GitHub Discussions](https://github.com/guansss/pixi-live2d-display/discussions)

## ✅ Integration Checklist

- [ ] Install dependencies (pixi.js, pixi-live2d-display)
- [ ] Create Live2DCanvas component
- [ ] Prepare model files in public/models/
- [ ] Update CharactersPage.jsx
- [ ] Test model loading
- [ ] Add loading states
- [ ] Implement interactions (click, hover)
- [ ] Add expressions
- [ ] Test on mobile
- [ ] Optimize performance
- [ ] Add error handling
- [ ] Document custom features

## 🎓 Next Steps

1. **Get Model Files**
   - Create or commission Mirei Live2D model
   - Export from Cubism Editor
   - Optimize textures

2. **Test Integration**
   - Start with simple model
   - Test all features
   - Optimize performance

3. **Add Features**
   - Emotion expressions
   - Voice reactions
   - Interactive animations

4. **Polish**
   - Smooth transitions
   - Loading animations
   - Error states

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: 📝 Ready for Implementation

**Good luck with Live2D integration! 🎭✨**
