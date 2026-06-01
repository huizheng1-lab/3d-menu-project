# 3D Immersive Menu Experience

A fully immersive 3D interactive webpage featuring advanced CSS 3D transforms, perspective effects, and engaging animations across the entire interface.

## 🎯 Features

### 3D Effects & Animations
- **Full-page 3D perspective** - The entire page responds to mouse movement
- **Menu items with depth** - Rotate, scale, and translate in 3D space
- **Floating geometric shapes** - Animated background elements
- **Parallax scrolling** - Multiple layers of depth as you scroll
- **3D content cards** - All sections have immersive 3D styling

### Interactive Elements
- **Mouse-driven 3D tilt** - Page tilts based on cursor position
- **Hover effects** - Menus rotate, scale, and glow on hover
- **Icon animations** - Spinning and scaling icon transitions
- **Ripple effects** - Visual feedback on click
- **Smooth transitions** - All animations use cubic-bezier easing

### Navigation
- **Click navigation** - Select sections with menu items
- **Keyboard support** - Use arrow keys to navigate
- **Smooth scrolling** - Content scrolls to view with smooth animations
- **Multiple sections** - Home, About, Services, Portfolio, Contact

### Design Elements
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Gradient text** - Eye-catching gradient headers
- **Glowing effects** - Subtle glow animations and shadows
- **Dark theme** - Modern dark background with neon accents
- **Grid layouts** - Responsive feature and portfolio grids

### Responsive Design
- **Desktop optimized** - Full 3D effects on large screens
- **Tablet friendly** - Reduced transforms for better performance
- **Mobile responsive** - Touch-friendly interface
- **Performance first** - Respects prefers-reduced-motion

## 📁 Files

```
3d-menu-project/
├── index.html      # HTML structure with semantic markup
├── styles.css      # Comprehensive CSS with 3D transforms
├── script.js       # JavaScript interactivity and effects
└── README.md       # This file
```

## 🚀 How to Use

1. **Clone the repository:**
   ```bash
   git clone https://github.com/huizheng1-lab/3d-menu-project.git
   cd 3d-menu-project
   ```

2. **Open in browser:**
   - Open `index.html` directly in your web browser
   - Or use a local server: `python -m http.server 8000`

3. **Interact with the page:**
   - Move your mouse to see the 3D perspective effect
   - Hover over menu items to see 3D transformations
   - Click menu items to navigate between sections
   - Use arrow keys for keyboard navigation
   - Scroll to experience parallax effects

## 🎨 Key Technologies

### CSS 3D Transforms
- `perspective()` - Creates 3D space context
- `rotateX()`, `rotateY()`, `rotateZ()` - 3D rotations
- `translateZ()` - Depth positioning
- `transform-style: preserve-3d` - 3D space for children
- `backdrop-filter` - Glassmorphism effect

### JavaScript
- **Event listeners** - Mouse move, scroll, keyboard events
- **DOM manipulation** - Dynamic element creation and styling
- **Intersection Observer** - Animation trigger on scroll
- **requestAnimationFrame** - Smooth 60fps animations

### CSS Animations
- `@keyframes` - Floating, rotating, glowing effects
- `transition` - Smooth property changes
- `cubic-bezier()` - Custom easing functions
- `animation-delay` - Staggered animations

## 💻 Browser Support

| Browser | Support |
|---------|----------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Opera   | ✅ Full |
| IE 11   | ❌ No   |

Requires support for:
- CSS 3D Transforms
- CSS Backdrop Filter
- ES6 JavaScript

## 🎛️ Customization

### Change Colors
Edit the gradient in `styles.css`:
```css
body {
    background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #16213e 100%);
}
```

### Adjust 3D Intensity
Modify transform values in JavaScript:
```javascript
rotateX: ${15 + rotateX}deg  // Change 15 to adjust rotation intensity
```

### Add New Sections
1. Add section HTML in `index.html`
2. Add menu item pointing to new section
3. Add styling in `styles.css` for new classes

## ⚡ Performance Tips

- 3D transforms use GPU acceleration
- Parallax disabled on mobile for better performance
- Respects `prefers-reduced-motion` preference
- Optimized for 60fps on modern devices

## 📱 Mobile Optimizations

- Touch-friendly menu items
- Reduced 3D effects on smaller screens
- Simplified layout for mobile
- Faster animations for better UX

## 🔧 Advanced Features

### Floating Background Cubes
Animated geometric shapes in background using keyframe animations.

### Mouse-Driven Perspective
Entire page tilts based on cursor position for immersive effect.

### Ripple Effect
Click feedback with expanding ripple animation.

### Intersection Observer
Automatically triggers animations when sections scroll into view.

## 📄 License

MIT License - Feel free to use, modify, and distribute this project.

## 👨‍💻 Author

Created by huizheng1-lab

## 🤝 Contributing

Feel free to fork, modify, and create pull requests!

---

**Enjoy your immersive 3D web experience!** ✨🚀