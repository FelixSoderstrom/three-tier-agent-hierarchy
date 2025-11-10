# Modal System Usage Guide

## Overview

The modal system provides a reusable, accessible, and flexible modal component for site-wide use. It includes keyboard navigation, focus management, smooth animations, and full ARIA support.

## Features

- **Reusable JavaScript Component** - `Modal` class and `ModalManager` singleton
- **Uniform CSS Styling** - Consistent design system integration
- **Accessibility First** - ARIA labels, keyboard navigation, focus trapping
- **Smooth Animations** - Fade in overlay, slide up container
- **Responsive Design** - Mobile, tablet, and desktop layouts
- **Flexible Layouts** - Standard, with-sidebar, multiple size variants
- **Tab Support** - Built-in tab navigation for multi-perspective content

## Files

- **JavaScript**: `/js/modal.js`
- **CSS**: `/css/modal.css`
- **Dependencies**: `variables.css`, `components.css`

## Basic Usage

### 1. Include Required Files

```html
<!-- CSS -->
<link rel="stylesheet" href="../css/variables.css">
<link rel="stylesheet" href="../css/components.css">
<link rel="stylesheet" href="../css/modal.css">

<!-- JavaScript -->
<script src="../js/modal.js"></script>
```

### 2. Create Modal HTML Structure

```html
<div id="myModal" class="modal-overlay d-none" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-container" role="document">
    <!-- Modal Header -->
    <div class="modal-header">
      <div class="modal-header-content">
        <h2 id="modalTitle" class="modal-title">Modal Title</h2>
        <p class="modal-subtitle">Optional subtitle</p>
      </div>
      <button class="modal-close" type="button" aria-label="Close modal" title="Close (Esc)">
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <!-- Modal Body -->
    <div class="modal-body" id="modalBody">
      <p>Modal content goes here...</p>
    </div>

    <!-- Modal Footer (Optional) -->
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### 3. Open/Close Modal with JavaScript

```javascript
// Simple approach - Manual control
const modal = document.getElementById('myModal');
const closeBtn = modal.querySelector('.modal-close');

// Open modal
function openModal() {
  modal.classList.remove('d-none');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

// Close modal
function closeModal() {
  modal.classList.add('d-none');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Event listeners
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

## Advanced Usage - Modal Class

### Creating a Modal Instance

```javascript
const modal = new Modal({
  id: 'myModal',
  className: 'modal-lg',
  closeOnOverlayClick: true,
  closeOnEscape: true,
  onOpen: () => console.log('Modal opened'),
  onClose: () => console.log('Modal closed')
});

// Build modal content
const modalElement = modal.build({
  title: 'My Modal',
  subtitle: 'Optional subtitle',
  body: '<p>Modal content here</p>',
  footer: '<button class="btn btn-primary">OK</button>',
  showCloseButton: true
});

// Append to document
document.body.appendChild(modalElement);

// Open modal
modal.open();

// Close modal
modal.close();
```

### Using ModalManager

```javascript
// Register modal
modalManager.register('myModal', modal);

// Open by ID
modalManager.open('myModal');

// Close by ID
modalManager.close('myModal');

// Get modal instance
const myModal = modalManager.get('myModal');

// Close all modals
modalManager.closeAll();
```

### Dynamic Content Updates

```javascript
// Update modal content while open
modal.updateContent({
  title: 'Updated Title',
  body: '<p>New content</p>',
  footer: '<button class="btn btn-primary">Save</button>'
});
```

## Modal Size Variants

Add size classes to `.modal-container`:

```html
<div class="modal-container modal-sm">   <!-- Small: 400px -->
<div class="modal-container modal-md">   <!-- Medium: 600px (default) -->
<div class="modal-container modal-lg">   <!-- Large: 800px -->
<div class="modal-container modal-xl">   <!-- Extra Large: 1000px -->
<div class="modal-container modal-full"> <!-- Full: 95vw x 95vh -->
```

## Modal with Sidebar Layout

```html
<div class="modal-body modal-body-with-sidebar">
  <div class="modal-main-content">
    <p>Main content area</p>
  </div>
  <aside class="modal-sidebar" aria-label="Additional information">
    <p>Sidebar content</p>
  </aside>
</div>
```

## Modal with Tabs

```html
<div class="modal-tabs" role="tablist" aria-label="Content sections">
  <button class="modal-tab-button active" role="tab" aria-selected="true">Tab 1</button>
  <button class="modal-tab-button" role="tab" aria-selected="false">Tab 2</button>
</div>

<div class="modal-body">
  <div class="modal-tab-panel active" role="tabpanel">
    <p>Tab 1 content</p>
  </div>
  <div class="modal-tab-panel" role="tabpanel">
    <p>Tab 2 content</p>
  </div>
</div>
```

## Modal Content Sections

```html
<div class="modal-body">
  <!-- Section with title bar -->
  <div class="modal-section">
    <h3 class="modal-section-title">Section Title</h3>
    <div class="modal-section-content">
      <p>Section content</p>
    </div>
  </div>

  <!-- Stats/Metrics -->
  <div class="modal-stats">
    <div class="modal-stat-item">
      <span class="modal-stat-label">Label</span>
      <span class="modal-stat-value">123</span>
    </div>
  </div>

  <!-- Lists -->
  <ul class="modal-list">
    <li class="modal-list-item">List item</li>
    <li class="modal-list-item checked">Checked item</li>
    <li class="modal-list-item warning">Warning item</li>
  </ul>
</div>
```

## Accessibility Features

### ARIA Attributes

```html
<div id="myModal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modalTitle"
     aria-describedby="modalBody"
     aria-hidden="true">
```

### Keyboard Navigation

- **ESC** - Close modal
- **Tab** - Navigate forward through focusable elements
- **Shift+Tab** - Navigate backward
- Focus is trapped within modal while open
- Focus returns to trigger element on close

### Screen Reader Support

- Live region announcements when modal opens/closes
- Proper heading hierarchy
- Semantic HTML structure
- All interactive elements properly labeled

## Examples

### Simple Modal (Gallery Workflow)

See `/pages/gallery.html` for a complete example:
- Click workflow card to open modal
- Modal displays workflow details
- ESC or overlay click to close

### Complex Modal (Story Epic Details)

See `/pages/story.html` for a complete example:
- Multi-tab interface
- Dynamic content sections
- Metrics footer
- Timeline integration

## Styling Customization

### CSS Variables

Override design tokens in your CSS:

```css
.modal-container {
  --modal-max-width: 900px;
  --modal-padding: var(--spacing-xl);
}
```

### Custom Animations

```css
@keyframes customSlideIn {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.modal-container {
  animation: customSlideIn 0.3s ease;
}
```

## Best Practices

1. **Always include aria-labelledby** pointing to modal title
2. **Use semantic HTML** - proper heading hierarchy
3. **Prevent body scroll** when modal is open
4. **Return focus** to trigger element on close
5. **Announce to screen readers** using live regions
6. **Trap focus** within modal during interaction
7. **Provide keyboard escape** - ESC key to close
8. **Use appropriate size** for content amount
9. **Keep content scannable** - use sections and headings
10. **Test with keyboard only** and screen readers

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Troubleshooting

### Modal won't open
- Check if `d-none` class is removed
- Verify JavaScript is loaded
- Check console for errors

### Focus not trapped
- Ensure focusable elements exist
- Check tab trap implementation
- Verify event listeners are attached

### Animations not working
- Check if `prefers-reduced-motion` is enabled
- Verify CSS is loaded
- Check for conflicting animations

### Overlay click not closing
- Verify event listener on overlay
- Check if event propagation is stopped
- Ensure overlay element is correct

## Performance Tips

1. **Lazy load modal content** - Only populate when needed
2. **Destroy unused modals** - Call `modal.destroy()` to clean up
3. **Debounce resize events** - If recalculating layout
4. **Use CSS transforms** - For animations (GPU accelerated)
5. **Minimize reflows** - Batch DOM updates

## Migration Guide

### From Old Modal System

1. Include new `modal.css` after `components.css`
2. Update HTML structure to match new format
3. Replace inline JavaScript with Modal class
4. Test keyboard navigation and accessibility
5. Verify animations and transitions work

### Breaking Changes from Components.css

The new `modal.css` extends and enhances the base modal styles from `components.css`:
- More layout options (sidebar, tabs)
- Enhanced accessibility
- Better animations
- Responsive improvements

No conflicts - both can coexist. The new `modal.css` takes precedence due to load order.

## Future Enhancements

Planned features for future versions:
- Modal stacking (multiple modals)
- Drag to reposition
- Resize handles
- Fullscreen mode
- Minimize to bottom bar
- Custom transition effects
- Modal templates

## Support

For issues or questions:
- Check examples in `/pages/story.html` and `/pages/gallery.html`
- Review this documentation
- Check browser console for errors
- Verify CSS and JavaScript are loaded correctly
