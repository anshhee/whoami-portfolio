# Dot Grid Visual Behavior Rules

## Cursor Proximity Reactions

### Opacity Behavior
- **Base state**: `0.05` opacity (very subtle, barely visible)
- **Near cursor**: Gradually increases to `0.15` opacity
- **Transition**: Smooth fade using smoothstep easing function
- **Formula**: `opacity = base + (easedProximityFactor × (hover - base))`

### Scale Behavior
- **Base state**: `1.0` scale (original size)
- **Near cursor**: Gradually increases to `1.1` scale (10% larger)
- **Transition**: Smooth scaling using same easing as opacity
- **Formula**: `scale = 1.0 + (easedProximityFactor × 0.1)`

### Easing Function
- **Type**: Smoothstep (cubic hermite interpolation)
- **Formula**: `f(x) = x² × (3 - 2x)`
- **Effect**: Natural acceleration and deceleration
- **Result**: Smooth fade in and fade out

### Proximity Detection
- **Radius**: 100px from cursor center
- **Falloff**: Linear distance, smoothstep easing applied
- **Factor calculation**: `1 - (distance / radius)`
- **Range**: `0.0` (at edge) to `1.0` (at cursor)

## Constraints

❌ **No movement** - Dots remain in fixed grid positions  
❌ **No trailing** - No motion blur or ghost effects  
❌ **No continuous animation** - Only reacts to cursor proximity  
✅ **Smooth transitions** - Eased opacity and scale changes  
✅ **Subtle effect** - Minimal visual disruption  

## Performance Notes

- Updates throttled to 16ms (60fps max)
- Canvas-based rendering (no DOM manipulation)
- RequestAnimationFrame for smooth updates
- Desktop only (disabled on touch devices)
