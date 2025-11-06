# Testing Guide

## Overview

This document provides comprehensive testing procedures for the **Building with Agentic Workflows** educational platform. The platform consists of a static HTML/CSS/JavaScript web application with four main components: Landing Page, Story Timeline, Workflow Gallery, Learn/Theory Page, and Builder Wizard.

### Testing Philosophy

Our testing approach emphasizes:

- **Manual Testing**: Comprehensive user-driven testing to verify all interactions work as intended
- **Cross-Browser Compatibility**: Ensuring consistent experience across modern browsers
- **Accessibility**: Meeting WCAG 2.1 AA standards for inclusive design
- **Performance**: Fast load times and smooth interactions
- **Responsive Design**: Seamless experience across devices from mobile to desktop

---

## Quick Start

### Setting Up Testing Environment

1. **Clone/Download Repository**
   ```bash
   git clone <repository-url>
   cd the-attention-mechanism/meta-lesson
   ```

2. **Serve Locally**
   ```bash
   # Option 1: Python
   python -m http.server 8000

   # Option 2: Node.js
   npx http-server -p 8000

   # Option 3: VS Code Live Server extension
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000/index.html`

---

## Manual Testing Checklist

### Landing Page (index.html)

#### Layout and Content
- [ ] Page loads without errors (check browser console)
- [ ] Hero section displays with title and subtitle
- [ ] All 3 statistics display correctly (8 Epics, 15 Examples, 5 Modules)
- [ ] All 4 navigation cards visible (Story, Gallery, Learn, Build)
- [ ] Footer displays with correct links
- [ ] No broken images or missing resources

#### Navigation
- [ ] Story card links to story.html
- [ ] Gallery card links to gallery.html
- [ ] Learn card links to learn.html
- [ ] Build card links to builder.html (highlighted as primary CTA)
- [ ] Footer "View Original Project" link works
- [ ] All links open in correct context (same/new tab as appropriate)

#### Visual Design
- [ ] Orange accent color (#FF8C42) appears correctly
- [ ] Dark background (#121212) renders properly
- [ ] Text is readable with sufficient contrast
- [ ] Card hover effects work smoothly
- [ ] Typography is consistent (Inter font family)

#### Responsive Behavior
- [ ] **Desktop (1920x1080)**: Cards display in 2x2 grid
- [ ] **Laptop (1366x768)**: Layout remains functional
- [ ] **Tablet Portrait (768x1024)**: Cards stack appropriately
- [ ] **Mobile (375x667)**: Single column layout, readable text
- [ ] No horizontal scrolling at any viewport size
- [ ] Touch targets are at least 44x44px on mobile

---

### Story Timeline (story.html)

#### Data Loading
- [ ] Page displays loading spinner initially
- [ ] All 8 epic nodes load successfully
- [ ] Loading state disappears after data loads
- [ ] No error messages appear (check error-state element)
- [ ] Browser console shows no 404 errors for JSON files

#### Timeline Display
- [ ] Timeline displays horizontally on desktop
- [ ] All 8 epic nodes visible with numbers (0-7)
- [ ] Epic titles display beneath each node
- [ ] Connecting line between nodes is visible
- [ ] Current epic highlighted appropriately

#### Modal Interaction
- [ ] Clicking any epic node opens modal
- [ ] Modal displays epic title and tagline
- [ ] Modal shows 3 tabs: Product Manager, Team Lead, Specialists
- [ ] Product Manager tab is active by default
- [ ] Modal overlay darkens background
- [ ] Modal is centered on screen

#### Tab Navigation
- [ ] Clicking "Team Lead" tab switches content
- [ ] Clicking specialist tabs (if available) shows specialist content
- [ ] Active tab has visual indicator
- [ ] Tab content animates smoothly
- [ ] Keyboard navigation works (Tab, Arrow keys)

#### Modal Closing
- [ ] X button closes modal
- [ ] ESC key closes modal
- [ ] Clicking outside modal (on overlay) closes it
- [ ] Focus returns to triggering element after close

#### Content Display
- [ ] Product Manager narrative displays correctly
- [ ] Felix's quotes appear if present
- [ ] Team Lead decisions list displays
- [ ] Specialist narratives, challenges, and solutions render
- [ ] Completion metrics show (files created, lines of code)

#### Responsive Behavior
- [ ] **Desktop**: Timeline horizontal, modal full-featured
- [ ] **Tablet**: Timeline may wrap, modal adapts
- [ ] **Mobile Portrait**: Timeline vertical, modal full-screen
- [ ] Touch gestures work (swipe to close on mobile)

---

### Workflow Gallery (gallery.html)

#### Data Loading
- [ ] Gallery loads with loading spinner
- [ ] All 15 workflow examples load successfully
- [ ] Loading state disappears after data loads
- [ ] No JSON loading errors in console

#### Gallery Grid
- [ ] Cards display in responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- [ ] Each card shows: name, domain, complexity, description
- [ ] Epic 1 and Epic 2 information displays
- [ ] Suggested agents list appears
- [ ] Use cases displayed
- [ ] Sample output text visible

#### Search Functionality
- [ ] Search input appears at top
- [ ] Typing filters results in real-time (300ms debounce)
- [ ] Search matches workflow name
- [ ] Search matches workflow description
- [ ] Results update as search term changes
- [ ] Clearing search shows all results

#### Domain Filter
- [ ] Domain dropdown displays all 7 categories:
  - All Domains
  - Documentation
  - Testing
  - DevOps/Infrastructure
  - Data Processing
  - Web Development
  - Code Quality
  - Miscellaneous
- [ ] Selecting domain filters results correctly
- [ ] Multiple workflows per domain exist (test each)

#### Complexity Filter
- [ ] Complexity dropdown shows: All, Beginner, Intermediate, Advanced
- [ ] Filtering by Beginner shows only beginner workflows
- [ ] Filtering by Intermediate shows intermediate workflows
- [ ] Filtering by Advanced shows advanced workflows

#### Combined Filters
- [ ] Domain + Complexity filters work together
- [ ] Domain + Search work together
- [ ] Complexity + Search work together
- [ ] All three filters work simultaneously
- [ ] Results counter updates: "Showing X of 15"

#### Clear Filters
- [ ] "Clear Filters" button resets all filters
- [ ] Search input clears
- [ ] Dropdowns reset to "All"
- [ ] All 15 workflows display again
- [ ] Results counter shows "Showing 15 of 15"

#### Empty State
- [ ] Filtering with no matches shows empty state
- [ ] Empty state displays search icon and message
- [ ] "Clear Filters" button appears in empty state
- [ ] Clicking button in empty state resets filters

#### Card Interactions
- [ ] Hovering card shows subtle elevation/shadow
- [ ] Card content is readable
- [ ] Badge colors distinguish complexity levels
- [ ] Domain tags have consistent styling

---

### Learn/Theory Page (learn.html)

#### Page Structure
- [ ] Page loads with back button to home
- [ ] Reading progress bar appears at top
- [ ] Table of contents (TOC) visible on left sidebar
- [ ] Main content area displays on right
- [ ] "Back to Top" button appears after scrolling

#### Table of Contents
- [ ] TOC lists all 5 sections:
  - Agent Hierarchy
  - Epic Development
  - Meta-Agent Pattern
  - Delegation Best Practices
  - Getting Started
- [ ] Clicking TOC link scrolls to section (smooth scroll)
- [ ] Active section highlights in TOC
- [ ] Active section updates while scrolling
- [ ] TOC remains fixed during scroll on desktop

#### Reading Progress Bar
- [ ] Progress bar starts at 0% at top of page
- [ ] Progress bar fills as user scrolls down
- [ ] Progress bar reaches 100% at page bottom
- [ ] Progress bar color matches theme (orange)

#### Content Display
- [ ] All headings display with proper hierarchy
- [ ] Body text is readable (sufficient line height and spacing)
- [ ] Code blocks render with syntax highlighting
- [ ] Code blocks use dark theme (atom-one-dark)
- [ ] Inline code has distinct styling
- [ ] Lists (ordered and unordered) display correctly
- [ ] Blockquotes stand out visually
- [ ] Subsections have visual separation

#### Code Block Features
- [ ] Copy button appears on code blocks
- [ ] Clicking copy button copies code to clipboard
- [ ] Copy button shows "Copied!" feedback
- [ ] Syntax highlighting colors are legible
- [ ] Code scrolls horizontally if too long

#### Mobile TOC
- [ ] **Mobile**: TOC toggle button appears
- [ ] Clicking toggle opens/closes mobile TOC
- [ ] Mobile TOC overlays content
- [ ] Clicking link closes mobile TOC
- [ ] TOC is accessible via touch

#### Back to Top Button
- [ ] Button appears after scrolling down ~300px
- [ ] Button stays in bottom-right corner
- [ ] Clicking button scrolls to top smoothly
- [ ] Button has appropriate hover state

#### Responsive Behavior
- [ ] **Desktop**: TOC sidebar + content side-by-side
- [ ] **Tablet**: TOC may collapse, toggle button appears
- [ ] **Mobile**: TOC hidden by default, accessible via toggle
- [ ] Content remains readable at all sizes
- [ ] Code blocks don't break layout on mobile

---

### Builder Wizard

#### Step 1: Basic Configuration (builder.html)

**Progress Indicator**
- [ ] Progress bar shows 33% (Step 1 of 3)
- [ ] Current step labeled "Step 1 of 3: Basic Configuration"

**Epic Selection**
- [ ] 4 radio options visible: 2 Epics, 3 Epics, 4 Epics, Custom
- [ ] "2 Epics (Beginner)" selected by default
- [ ] Clicking option updates selection visually
- [ ] Custom option reveals number input
- [ ] Custom number input validates minimum of 2
- [ ] Custom input shows validation message

**Project Name**
- [ ] Optional text input for project name
- [ ] Input accepts text (max 100 characters)
- [ ] Helper text displays below input
- [ ] Input is not required (validation passes without it)

**Core Components**
- [ ] Product-Manager checkbox is checked
- [ ] Product-Manager checkbox is disabled (always required)
- [ ] "Required" badge displays on Product-Manager
- [ ] Meta-Agent checkbox is checked by default
- [ ] Meta-Agent checkbox can be unchecked
- [ ] "Recommended" badge displays on Meta-Agent

**Optional Features**
- [ ] 3 optional checkboxes: Specialized Agents, Logging, Custom Tools
- [ ] All unchecked by default
- [ ] Checkboxes can be toggled on/off
- [ ] Visual state updates when checked/unchecked

**Navigation Buttons**
- [ ] Reset button appears (clears form)
- [ ] Save Draft button appears (saves to localStorage)
- [ ] Continue button appears (validates and proceeds)
- [ ] Continue button has primary styling (orange)

**Form Validation**
- [ ] Clicking Continue with valid data proceeds to Step 2
- [ ] Invalid epic count shows error message
- [ ] Error messages are accessible (ARIA live region)

**State Persistence**
- [ ] Form data saves to localStorage on change
- [ ] Refreshing page restores saved state
- [ ] Reset button clears localStorage
- [ ] Save Draft button shows success message

**Keyboard Shortcuts**
- [ ] Ctrl+S saves draft
- [ ] Ctrl+Enter continues to next step
- [ ] Tab navigation works through all fields
- [ ] Enter/Space activates checkboxes and radios

#### Step 2: Epic Definitions (builder-step2-example.html)

**Progress Indicator**
- [ ] Progress bar shows 66% (Step 2 of 3)
- [ ] Current step labeled "Step 2 of 3: Epic Definitions"

**Epic Editors**
- [ ] Number of epic editors matches selected epic count
- [ ] Each epic editor has title field
- [ ] Each epic editor has purpose textarea
- [ ] Each epic editor has deliverables field
- [ ] Subagent chips can be added

**Markdown Editor**
- [ ] Text area accepts markdown input
- [ ] Preview tab shows rendered markdown
- [ ] Edit/Preview tabs toggle correctly
- [ ] Markdown formatting renders (headings, lists, code)

**Subagent Management**
- [ ] Input to add subagent name
- [ ] Clicking "Add" creates chip
- [ ] Chips display with remove button (X)
- [ ] Clicking X removes chip
- [ ] Duplicate subagents prevented

**Character Counter**
- [ ] Counter displays current character count
- [ ] Counter updates as user types
- [ ] Word count also displays
- [ ] Counter helps user gauge completeness

**Auto-Save**
- [ ] Form auto-saves every 30 seconds
- [ ] "Auto-saved" indicator briefly appears
- [ ] State persists across refresh

**Navigation**
- [ ] Back button returns to Step 1 without losing data
- [ ] Continue button validates and proceeds to Step 3
- [ ] Validation ensures all epic titles are filled

#### Step 3: Agent Configuration (builder-step3-example.html)

**Conditional Display**
- [ ] Step 3 only appears if "Specialized Agents" checked in Step 1
- [ ] If feature disabled, wizard skips to Step 4

**Agent Editor**
- [ ] Agent name input field
- [ ] Agent role/specialty field
- [ ] Tool selection checkboxes (Read, Write, Bash, etc.)
- [ ] Expertise description textarea

**Template Loading**
- [ ] Dropdown with agent templates
- [ ] Selecting template populates fields
- [ ] Templates include: Documentation Specialist, Test Engineer, etc.
- [ ] User can modify loaded template

**Tool Configuration**
- [ ] Checkboxes for each tool type
- [ ] Multiple tools can be selected
- [ ] Visual indication of selected tools

**Navigation**
- [ ] Back button returns to Step 2
- [ ] Continue button proceeds to Step 4

#### Step 4: Review & Export (builder-step4.html)

**Progress Indicator**
- [ ] Progress bar shows 100% (Step 4 of 3: Review & Export)

**Configuration Preview**
- [ ] Summary displays all selections from Step 1
- [ ] Epic count shown
- [ ] Project name shown (if provided)
- [ ] Core components list displayed
- [ ] Optional features list displayed

**Epic Summary**
- [ ] All epic titles listed
- [ ] Epic purposes summarized
- [ ] Deliverables count shown per epic
- [ ] Subagent count shown per epic

**Agent Summary (if applicable)**
- [ ] Agent names listed
- [ ] Tools assigned to each agent shown

**Validation Status**
- [ ] Green checkmark if all valid
- [ ] Warning icon if issues exist
- [ ] Specific validation messages displayed
- [ ] User can fix issues by going back

**Export Functionality**
- [ ] "Generate ZIP" button appears
- [ ] Button has clear call-to-action styling
- [ ] Clicking button generates ZIP file
- [ ] Progress indicator shows during generation
- [ ] ZIP downloads automatically when complete
- [ ] Success message appears after download

**ZIP Contents Verification**
- [ ] Download ZIP and extract
- [ ] Verify `.claude/` directory exists
- [ ] Check `commands/product-manager.md` present
- [ ] Check `commands/meta-agent.md` if enabled
- [ ] Check `commands/epics/epic-1.md` through `epic-N.md`
- [ ] Check `agents/` folder if specialized agents enabled
- [ ] Verify `README.md` in `.claude/` directory
- [ ] Open files and verify content matches configuration

**Error Handling**
- [ ] Network errors show helpful message
- [ ] Template loading errors handled gracefully
- [ ] Export errors don't crash page
- [ ] User can retry after error

---

## Browser Compatibility Testing

### Supported Browsers

Test on the latest stable versions of:

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome  | ✓ | ✓ | Primary |
| Firefox | ✓ | ✓ | Primary |
| Safari  | ✓ | ✓ | Primary |
| Edge    | ✓ | ✓ | Secondary |
| Opera   | ✓ | - | Secondary |

### Desktop Testing Matrix

For each browser, verify:

1. **Layout Rendering**
   - Grid systems display correctly
   - Flexbox layouts work
   - CSS custom properties (variables) apply
   - Animations and transitions smooth

2. **JavaScript Functionality**
   - Async/await works
   - Fetch API successful
   - LocalStorage operations
   - Event listeners trigger correctly
   - JSON parsing and manipulation

3. **CSS Features**
   - CSS Grid support
   - Flexbox support
   - Custom properties (CSS variables)
   - Transform and transition
   - Media queries

4. **Console Errors**
   - Open browser DevTools
   - Check Console tab for errors
   - Verify no 404s in Network tab
   - Confirm no JavaScript exceptions

### Mobile Testing

Test on actual devices or browser DevTools device emulation:

1. **iOS (Safari)**
   - iPhone SE (375×667)
   - iPhone 12 Pro (390×844)
   - iPad (768×1024)

2. **Android (Chrome)**
   - Pixel 5 (393×851)
   - Galaxy S20 (360×800)
   - Galaxy Tab (800×1280)

3. **Mobile-Specific Features**
   - Touch events work (tap, swipe)
   - Pinch-to-zoom disabled appropriately
   - Viewport meta tag prevents unwanted zoom
   - Text remains readable without zoom
   - Buttons are easily tappable (44×44px minimum)
   - Forms are usable with on-screen keyboard
   - Horizontal scrolling prevented

---

## Accessibility Testing

### WCAG 2.1 AA Compliance Checklist

#### Perceivable

**Text Alternatives (1.1)**
- [ ] All images have alt text or are marked decorative (aria-hidden="true")
- [ ] Icons have accessible labels (aria-label)
- [ ] SVGs have title elements or ARIA labels

**Time-based Media (1.2)**
- N/A (no video/audio content)

**Adaptable (1.3)**
- [ ] Headings follow proper hierarchy (H1 → H2 → H3)
- [ ] Lists use semantic markup (ul, ol, li)
- [ ] Forms use proper labels (label for="id")
- [ ] ARIA landmarks identify page regions (role="main", role="navigation")
- [ ] Tab order is logical
- [ ] Form fields grouped with fieldset/legend where appropriate

**Distinguishable (1.4)**
- [ ] Text contrast ratio at least 4.5:1 (body text)
- [ ] Large text contrast at least 3:1
- [ ] Focus indicators visible and clear
- [ ] Text can be resized to 200% without loss of functionality
- [ ] No information conveyed by color alone
- [ ] Background/foreground colors have sufficient contrast

#### Operable

**Keyboard Accessible (2.1)**
- [ ] All functionality available via keyboard
- [ ] No keyboard traps (can Tab in and out of all elements)
- [ ] Skip links provided ("Skip to main content")
- [ ] Focus order is logical and intuitive

**Enough Time (2.2)**
- [ ] No time limits on interactions
- [ ] Auto-save gives users control over timing

**Seizures and Physical Reactions (2.3)**
- [ ] No flashing content (none present)

**Navigable (2.4)**
- [ ] Skip link bypasses repeated content
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link text is descriptive (no "click here")
- [ ] Multiple ways to navigate (nav, breadcrumbs, footer links)
- [ ] Headings describe topic/purpose
- [ ] Focus is visible

#### Understandable

**Readable (3.1)**
- [ ] Page language set (lang="en")
- [ ] Section language changes identified (if applicable)

**Predictable (3.2)**
- [ ] Focus doesn't trigger unexpected changes
- [ ] Form inputs don't auto-submit
- [ ] Navigation consistent across pages
- [ ] Components have consistent identification

**Input Assistance (3.3)**
- [ ] Error messages clearly identify issues
- [ ] Labels or instructions provided for form inputs
- [ ] Error suggestions provided where possible
- [ ] Form validation prevents errors
- [ ] Required fields are indicated

#### Robust

**Compatible (4.1)**
- [ ] HTML validates (no parsing errors)
- [ ] ARIA roles, states, and properties valid
- [ ] Status messages announced (aria-live regions)
- [ ] Name, role, value available for all UI components

### Testing Tools

#### Automated Tools

1. **axe DevTools** (Browser Extension)
   ```
   1. Install axe DevTools for Chrome/Firefox
   2. Open DevTools → axe tab
   3. Click "Scan ALL of my page"
   4. Review violations and fix
   ```

2. **Lighthouse** (Chrome DevTools)
   ```
   1. Open Chrome DevTools
   2. Go to Lighthouse tab
   3. Select "Accessibility" category
   4. Click "Generate report"
   5. Aim for score ≥ 90
   ```

3. **WAVE** (WebAIM)
   ```
   1. Visit https://wave.webaim.org/
   2. Enter page URL
   3. Review errors, alerts, and features
   ```

#### Manual Testing

1. **Keyboard Navigation**
   ```
   - Tab through entire page
   - Ensure all interactive elements reachable
   - Verify focus indicators visible
   - Test modal keyboard traps
   - Test keyboard shortcuts
   ```

2. **Screen Reader Testing**
   - **Windows**: NVDA (free)
   - **macOS**: VoiceOver (built-in)
   - **Linux**: Orca (free)

   Test scenarios:
   - Navigate by headings (H key)
   - Navigate by landmarks (D key)
   - Navigate by links (Tab key)
   - Navigate forms (F key)
   - Listen to all content in order

3. **Color Contrast Analyzer**
   ```
   1. Use Paciello Group Color Contrast Analyzer
   2. Test all text/background combinations
   3. Ensure ratios meet WCAG AA standards:
      - Body text: 4.5:1 minimum
      - Large text: 3:1 minimum
      - UI components: 3:1 minimum
   ```

---

## Performance Testing

### Performance Benchmarks

Target metrics (Lighthouse scores):

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| Performance | ≥90 | 90-100 | <90 |
| First Contentful Paint | <1.5s | <1.8s | >1.8s |
| Time to Interactive | <3.0s | <3.8s | >3.8s |
| Speed Index | <3.0s | <4.3s | >4.3s |
| Total Blocking Time | <200ms | <300ms | >300ms |
| Largest Contentful Paint | <2.5s | <4.0s | >4.0s |
| Cumulative Layout Shift | <0.1 | <0.25 | >0.25 |

### Testing Procedure

#### 1. Lighthouse Audit

```bash
# Run from Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices
4. Device: Desktop and Mobile
5. Click "Generate report"
6. Review scores and opportunities
```

#### 2. Network Performance

**Test with Chrome DevTools Network Tab:**

- [ ] Disable cache (check "Disable cache")
- [ ] Set throttling to "Fast 3G" for mobile simulation
- [ ] Reload page and measure:
  - Total page size (target: <2MB)
  - Number of requests (target: <50)
  - DOMContentLoaded time (target: <1s)
  - Load time (target: <3s)

**File Size Audit:**
```bash
# Check file sizes
find meta-lesson -name "*.html" -exec du -h {} \;
find meta-lesson -name "*.css" -exec du -h {} \;
find meta-lesson -name "*.js" -exec du -h {} \;
find meta-lesson -name "*.json" -exec du -h {} \;
```

Expected sizes:
- HTML files: <50KB each
- CSS files: <100KB total
- JavaScript files: <150KB total
- JSON files: <50KB each

#### 3. Runtime Performance

**Chrome DevTools Performance Tab:**

1. Open Performance tab
2. Click Record
3. Interact with page (scroll, click, filter)
4. Stop recording
5. Analyze:
   - FPS (should stay at 60)
   - No long tasks (>50ms)
   - Minimal layout thrashing

**Specific Scenarios:**

- [ ] **Gallery Filtering**: Filter response <100ms
- [ ] **Modal Open/Close**: Smooth animation, 60fps
- [ ] **Scroll Performance**: Smooth scrolling, no jank
- [ ] **Learn Page Scroll**: Progress bar updates smoothly

#### 4. Load Testing

Simulate multiple users:

```bash
# Use Apache Bench (if available)
ab -n 100 -c 10 http://localhost:8000/index.html

# Or use browser tools:
# Open 10 tabs simultaneously
# Measure if page remains responsive
```

---

## Device Responsiveness Testing

### Viewport Breakpoints

Test at these exact sizes:

| Device Type | Width × Height | Layout Expected |
|-------------|----------------|-----------------|
| Desktop XL  | 1920×1080 | Full multi-column |
| Desktop L   | 1366×768 | Full layout |
| Laptop      | 1024×768 | Compact multi-column |
| Tablet L    | 1024×768 | Adapted layout |
| Tablet P    | 768×1024 | Stacked columns |
| Mobile L    | 414×896 | Single column |
| Mobile M    | 375×667 | Single column |
| Mobile S    | 320×568 | Single column (smallest) |

### Responsive Checklist

For each viewport:

#### Layout
- [ ] No horizontal overflow/scrolling
- [ ] Content fits within viewport
- [ ] Grids adjust appropriately
- [ ] Navigation remains accessible
- [ ] Footer always at bottom

#### Typography
- [ ] All text readable without zoom
- [ ] Font sizes appropriate for device
- [ ] Line length comfortable (45-75 characters)
- [ ] Line height sufficient (1.5-1.8)

#### Interactive Elements
- [ ] Buttons are tappable (44×44px minimum on mobile)
- [ ] Form fields are usable
- [ ] Dropdown menus work
- [ ] Modals display properly
- [ ] Cards/grids adapt

#### Images and Media
- [ ] Images scale proportionally
- [ ] No stretched or pixelated images
- [ ] Icons remain clear
- [ ] SVGs render correctly

#### Navigation
- [ ] Mobile menu accessible (if hamburger menu)
- [ ] All pages reachable
- [ ] Breadcrumbs visible (if applicable)
- [ ] Back buttons work

### Testing Tools

1. **Chrome DevTools Device Mode**
   - Press Ctrl+Shift+M (Windows/Linux) or Cmd+Shift+M (Mac)
   - Select device presets or custom dimensions
   - Test both portrait and landscape

2. **Firefox Responsive Design Mode**
   - Press Ctrl+Shift+M
   - Select from device list
   - Rotate device orientation

3. **Physical Devices**
   - Test on at least one iOS device
   - Test on at least one Android device
   - Test on at least one tablet

---

## Known Issues

### Current Limitations

1. **Browser Support**
   - Internet Explorer not supported (uses modern JS features)
   - Older browser versions may have degraded experience

2. **Offline Functionality**
   - Requires internet connection for Google Fonts
   - Requires internet for highlight.js CDN
   - No service worker for offline caching

3. **Export System**
   - Requires JSZip library (loaded via CDN)
   - Large configurations may take time to generate
   - Download behavior varies by browser

4. **Mobile Considerations**
   - Builder wizard may be complex on small screens
   - Code blocks require horizontal scroll on mobile
   - Modals are full-screen on mobile (by design)

### Planned Improvements

1. **Progressive Enhancement**
   - Add service worker for offline capability
   - Implement local font fallbacks
   - Bundle dependencies instead of CDN

2. **Performance Optimizations**
   - Implement lazy loading for gallery cards
   - Optimize JSON file sizes
   - Add image optimization pipeline

3. **Accessibility Enhancements**
   - Add more ARIA live regions for dynamic content
   - Improve screen reader announcements
   - Enhanced keyboard shortcuts

4. **Testing Infrastructure**
   - Automated visual regression testing
   - Automated accessibility testing in CI
   - Cross-browser testing automation

---

## Bug Reporting

### How to Report Issues

If you find a bug during testing:

1. **Check if it's a known issue** (see section above)
2. **Reproduce the issue** at least twice
3. **Document the bug** with this information:
   - Page affected (URL or filename)
   - Browser and version
   - Device and OS
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser console errors (if any)

### Bug Report Template

```markdown
**Page/Component:** [e.g., Gallery page filtering]

**Browser:** [e.g., Chrome 120.0 on Windows 11]

**Device:** [e.g., Desktop 1920×1080]

**Steps to Reproduce:**
1. Navigate to gallery.html
2. Select "Testing" domain filter
3. Select "Advanced" complexity filter
4. Enter "performance" in search box

**Expected Behavior:**
Gallery should show workflows matching all three filters.

**Actual Behavior:**
No workflows displayed, empty state shows incorrectly.

**Console Errors:**
```
Uncaught TypeError: Cannot read property 'length' of undefined
  at filterExamples (gallery.js:145)
```

**Screenshots:**
[Attach screenshot]

**Additional Context:**
Issue only occurs when all three filters are active simultaneously.
```

---

## Testing Tools Reference

### Recommended Tools

1. **Chrome DevTools** (Built-in)
   - Elements inspector
   - Console for errors
   - Network tab for performance
   - Lighthouse audits
   - Device emulation

2. **Firefox Developer Tools** (Built-in)
   - Accessibility inspector
   - Responsive design mode
   - Network monitor
   - Console

3. **axe DevTools** (Extension)
   - Install: [Chrome](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)
   - Automated accessibility testing
   - Element inspection
   - Issue guidance

4. **WAVE** (Web Tool)
   - URL: https://wave.webaim.org/
   - Visual feedback on accessibility
   - Identifies errors and warnings
   - No installation required

5. **Lighthouse** (Chrome Built-in)
   - Performance metrics
   - Accessibility audit
   - Best practices check
   - SEO analysis

6. **Color Contrast Analyzer** (Desktop App)
   - Download: https://www.tpgi.com/color-contrast-checker/
   - WCAG compliance checking
   - Color picker tool
   - Simulates vision deficiencies

7. **NVDA Screen Reader** (Windows)
   - Download: https://www.nvaccess.org/download/
   - Free and open source
   - Test keyboard navigation
   - Verify ARIA labels

8. **VoiceOver** (macOS Built-in)
   - Activate: Cmd + F5
   - Navigate with VO + arrow keys
   - Test screen reader experience

### Online Validators

- **HTML Validator**: https://validator.w3.org/
- **CSS Validator**: https://jigsaw.w3.org/css-validator/
- **JSON Validator**: https://jsonlint.com/

---

## Test Results Documentation

### Recording Test Results

Use this template to document your test session:

```markdown
# Test Session Report

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Environment:** [Browser, OS, Device]

## Tests Performed

### Landing Page
- [ ] Layout and Content: PASS
- [ ] Navigation: PASS
- [ ] Responsive: PASS

### Story Timeline
- [ ] Data Loading: PASS
- [ ] Modal Interaction: PASS
- [ ] Tab Navigation: FAIL - See Issue #1

### Workflow Gallery
- [ ] Search: PASS
- [ ] Filters: PASS
- [ ] Grid Layout: PASS

### Learn Page
- [ ] TOC Navigation: PASS
- [ ] Code Blocks: PASS
- [ ] Mobile Layout: PASS

### Builder Wizard
- [ ] Step 1: PASS
- [ ] Step 2: NOT TESTED
- [ ] Step 3: NOT TESTED
- [ ] Step 4: NOT TESTED

## Issues Found

### Issue #1: Tab Navigation Keyboard Focus
- **Severity:** Medium
- **Component:** Story Timeline Modal
- **Description:** Pressing Tab after modal opens doesn't focus on first tab button
- **Expected:** First tab should receive focus
- **Actual:** Focus remains on close button
- **Browser:** Firefox 120.0
- **Recommendation:** Add focus management in modal open function

## Summary

- **Total Tests:** 45
- **Passed:** 43
- **Failed:** 1
- **Skipped:** 1
- **Pass Rate:** 95.6%

## Notes

All core functionality working. One accessibility issue with keyboard navigation needs fixing before deployment.
```

---

## Conclusion

This testing guide ensures comprehensive coverage of all functionality, accessibility, performance, and compatibility requirements. Regular testing using these procedures will maintain high quality and excellent user experience across the platform.

For questions or clarifications, please refer to the CONTRIBUTING.md guide or open an issue in the repository.

**Happy Testing!**
