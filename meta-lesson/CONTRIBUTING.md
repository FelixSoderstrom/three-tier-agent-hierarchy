# Contributing to Building with Agentic Workflows

First off, thank you for considering contributing to this educational platform! This project teaches students how to build complex projects using agentic workflows, and your contributions help make this learning resource better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Design System Usage](#design-system-usage)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Content Contributions](#content-contributions)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members
- Helping newcomers get started

**Unacceptable behaviors include:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, issues, and other contributions that do not align with this Code of Conduct. Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team.

---

## How Can I Contribute?

There are many ways to contribute to this project:

### 1. Report Bugs

Found a bug? Please help us improve by reporting it:
- Check if the bug is already reported in [Issues](https://github.com/YOUR_USERNAME/the-attention-mechanism/issues)
- If not, create a new issue using the [bug report template](#bug-report-template)
- Include as much detail as possible: browser, device, steps to reproduce
- Screenshots are very helpful!

### 2. Suggest Enhancements

Have an idea to make the platform better?
- Check if the idea is already suggested
- Open a new issue with the "enhancement" label
- Describe the feature, its benefits, and potential implementation
- Be open to discussion and feedback

### 3. Improve Documentation

Documentation is crucial for learning:
- Fix typos or unclear explanations
- Add missing documentation
- Improve code comments
- Create tutorials or guides
- Translate content (if multilingual support is added)

### 4. Add Workflow Examples

The gallery showcases diverse 2-epic workflows:
- Create new workflow examples for different domains
- Ensure examples are educational and practical
- Follow the [workflow example template](#workflow-example-template)
- Submit via pull request

### 5. Enhance Accessibility

Help make the platform accessible to everyone:
- Test with screen readers
- Improve ARIA labels
- Enhance keyboard navigation
- Increase color contrast where needed
- Add captions or transcripts (if media is added)

### 6. Code Contributions

Contribute code improvements:
- Bug fixes
- New features
- Performance optimizations
- Refactoring
- Test coverage improvements

---

## Development Setup

### Prerequisites

- **Git**: Version control
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Text Editor**: VS Code, Sublime Text, Atom, or your preferred editor
- **Local Server**: Python, Node.js, or VS Code Live Server extension

### Getting Started

1. **Fork the Repository**
   ```bash
   # Visit https://github.com/YOUR_USERNAME/the-attention-mechanism
   # Click "Fork" button in top right
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/the-attention-mechanism.git
   cd the-attention-mechanism
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Start Local Server**
   ```bash
   # Option 1: Python
   cd meta-lesson
   python -m http.server 8000

   # Option 2: Node.js
   npx http-server meta-lesson -p 8000

   # Option 3: VS Code Live Server
   # Right-click index.html → "Open with Live Server"
   ```

5. **Open in Browser**
   ```
   Navigate to http://localhost:8000/index.html
   ```

### Development Tools

**Recommended VS Code Extensions:**
- Live Server (for instant reload)
- ESLint (JavaScript linting)
- Prettier (code formatting)
- CSS Peek (jump to CSS definitions)
- HTML CSS Support (IntelliSense)
- Path Intellisense (file path autocomplete)

**Browser DevTools:**
- Chrome DevTools (F12)
- Firefox Developer Tools (F12)
- Accessibility Inspector
- Network Monitor
- Console for debugging

---

## Project Structure

Understanding the codebase organization:

```
meta-lesson/
├── index.html              # Landing page
├── story.html              # Story timeline page
├── gallery.html            # Workflow gallery page
├── learn.html              # Theory/learn page
├── builder.html            # Builder wizard - Step 1
├── builder-step2-example.html  # Builder - Step 2
├── builder-step3-example.html  # Builder - Step 3
├── builder-step4.html      # Builder - Step 4 (export)
│
├── css/                    # Stylesheets
│   ├── variables.css       # CSS custom properties (design tokens)
│   ├── main.css            # Base styles and utilities
│   ├── components.css      # Reusable components
│   ├── landing.css         # Landing page specific
│   ├── timeline.css        # Story timeline specific
│   ├── gallery.css         # Gallery page specific
│   ├── learn.css           # Learn page specific
│   ├── builder.css         # Builder wizard specific
│   └── editor.css          # Epic/agent editor specific
│
├── js/                     # JavaScript modules
│   ├── navigation.js       # Landing page navigation
│   ├── timeline.js         # Story timeline logic
│   ├── gallery.js          # Gallery filtering & display
│   ├── learn.js            # Learn page interactions
│   ├── builder.js          # Builder Step 1 logic
│   ├── epic-editor.js      # Epic editor component (Step 2)
│   ├── agent-editor.js     # Agent editor component (Step 3)
│   ├── state.js            # State management (localStorage)
│   └── export.js           # ZIP generation & download (Step 4)
│
├── content/                # Data files
│   ├── story/              # Epic story JSON files
│   │   ├── epic0.json
│   │   ├── epic1.json
│   │   ├── ...
│   │   ├── epic7.json
│   │   └── workflow-summary.json
│   └── gallery/
│       └── examples.json   # 15 workflow examples
│
├── templates/              # Agent instruction templates
│   ├── product-manager.md
│   ├── meta-agent.md
│   ├── epic-definition.md
│   ├── specialized-agent.md
│   └── README-template.md
│
├── README.md               # Main project documentation
├── TESTING.md              # Testing procedures
└── CONTRIBUTING.md         # This file
```

### Key File Descriptions

**HTML Files:**
- Self-contained pages with embedded structure
- Use semantic HTML5 elements
- Include ARIA attributes for accessibility
- Link to relevant CSS and JS modules

**CSS Architecture:**
- `variables.css`: Design tokens (colors, spacing, typography)
- `main.css`: Reset, base styles, utility classes
- `components.css`: Reusable UI components (buttons, cards, modals)
- Page-specific CSS: Styles unique to each page

**JavaScript Modules:**
- Each file is a self-contained module
- Uses vanilla JavaScript (no frameworks)
- Async/await for data fetching
- Event-driven architecture
- LocalStorage for state persistence

**JSON Data:**
- Valid JSON (use validator before committing)
- Consistent structure across files
- Descriptive keys and values
- Include all required fields

---

## Coding Standards

### HTML Guidelines

**Structure:**
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- Proper heading hierarchy (H1 → H2 → H3, no skipping)
- Close all tags properly
- Use lowercase for tags and attributes

**Accessibility:**
- Include `lang` attribute on `<html>` tag
- Use `alt` text for images
- Use `aria-label` for icon buttons
- Include `role` attributes where appropriate
- Use `aria-live` regions for dynamic content
- Ensure keyboard navigation works

**Example:**
```html
<button
  class="btn btn-primary"
  type="button"
  aria-label="Download workflow configuration"
  onclick="handleDownload()">
  <svg aria-hidden="true">...</svg>
  Download
</button>
```

### CSS Guidelines

**Naming Conventions:**
- Use BEM (Block Element Modifier) methodology
  - Block: `.gallery-card`
  - Element: `.gallery-card__title`
  - Modifier: `.gallery-card--featured`
- Use kebab-case for class names
- Avoid IDs for styling (use for JavaScript hooks only)

**Organization:**
- Group related properties
- Use CSS custom properties for theme values
- Mobile-first responsive design
- Use relative units (rem, em, %) over absolute (px)

**Example:**
```css
/* Block */
.gallery-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  transition: transform var(--transition-speed) ease;
}

/* Element */
.gallery-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

/* Modifier */
.gallery-card--featured {
  border: 2px solid var(--color-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .gallery-card {
    padding: var(--spacing-md);
  }
}
```

### JavaScript Guidelines

**Style:**
- Use ES6+ features (const/let, arrow functions, async/await)
- Use descriptive variable and function names
- Avoid global variables
- Use strict equality (`===` not `==`)
- Handle errors with try/catch
- Add JSDoc comments for functions

**Structure:**
```javascript
/**
 * Fetches workflow examples from JSON file
 * @returns {Promise<Array>} Array of workflow example objects
 * @throws {Error} If fetch fails or JSON is invalid
 */
async function loadWorkflowExamples() {
  try {
    const response = await fetch('content/gallery/examples.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.examples;

  } catch (error) {
    console.error('Failed to load workflow examples:', error);
    throw error;
  }
}
```

**Event Listeners:**
- Remove event listeners when no longer needed
- Use event delegation for dynamic content
- Debounce rapid events (search input, scroll)

**Example:**
```javascript
// Debounced search
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch(e.target.value);
  }, 300);
});
```

### JSON Guidelines

**Structure:**
- Use consistent indentation (2 spaces)
- Use double quotes for strings
- Include all required fields
- Validate before committing

**Example:**
```json
{
  "id": "unique-workflow-id",
  "name": "Workflow Name",
  "domain": "Domain Category",
  "complexity": "Beginner|Intermediate|Advanced",
  "description": "Clear description of the workflow",
  "epic1": {
    "name": "Epic 1 Name",
    "purpose": "What this epic accomplishes",
    "deliverables": [
      "Deliverable 1",
      "Deliverable 2"
    ]
  },
  "epic2": {
    "name": "Epic 2 Name",
    "purpose": "What this epic accomplishes",
    "deliverables": [
      "Deliverable 1",
      "Deliverable 2"
    ]
  }
}
```

---

## Design System Usage

### CSS Custom Properties (variables.css)

Always use design tokens from `variables.css` for consistency:

**Colors:**
```css
var(--color-background)      /* Main background: #121212 */
var(--color-surface)          /* Card/elevated surface: #1E1E1E */
var(--color-surface-hover)    /* Hover state: #2A2A2A */
var(--color-primary)          /* Primary orange: #FF8C42 */
var(--color-primary-dark)     /* Darker orange: #E67E3C */
var(--color-text)             /* Main text: #FFFFFF */
var(--color-text-secondary)   /* Secondary text: #B0B0B0 */
var(--color-border)           /* Border color: #333333 */
```

**Spacing:**
```css
var(--spacing-xs)    /* 0.25rem = 4px */
var(--spacing-sm)    /* 0.5rem = 8px */
var(--spacing-md)    /* 1rem = 16px */
var(--spacing-lg)    /* 1.5rem = 24px */
var(--spacing-xl)    /* 2rem = 32px */
var(--spacing-2xl)   /* 3rem = 48px */
var(--spacing-3xl)   /* 4rem = 64px */
```

**Typography:**
```css
var(--font-size-xs)    /* 0.75rem = 12px */
var(--font-size-sm)    /* 0.875rem = 14px */
var(--font-size-base)  /* 1rem = 16px */
var(--font-size-lg)    /* 1.125rem = 18px */
var(--font-size-xl)    /* 1.5rem = 24px */
var(--font-size-2xl)   /* 2rem = 32px */
var(--font-size-3xl)   /* 2.5rem = 40px */

var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */
```

### Reusable Components (components.css)

Use existing component classes when possible:

**Buttons:**
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-tertiary">Tertiary Action</button>
```

**Cards:**
```html
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">Body content</div>
  <div class="card-footer">Footer</div>
</div>
```

**Alerts:**
```html
<div class="alert alert-error">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-info">Info message</div>
```

**Forms:**
```html
<div class="form-group">
  <label for="input-id" class="form-label">Label</label>
  <input type="text" id="input-id" class="form-input">
  <span class="form-helper-text">Helper text</span>
</div>
```

### Creating New Components

If you need a new component:

1. Check if existing components can be extended
2. Add to `components.css` if reusable across pages
3. Add to page-specific CSS if only used on one page
4. Document the component with comments
5. Include responsive styles

**Example:**
```css
/* ============================================
   Component: Feature Card
   Used on: Landing page, Gallery page
   ============================================ */

.feature-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  transition: all var(--transition-speed) ease;
}

.feature-card:hover {
  background: var(--color-surface-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.feature-card__icon {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.feature-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.feature-card__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .feature-card {
    padding: var(--spacing-md);
  }

  .feature-card__icon {
    width: 36px;
    height: 36px;
  }
}
```

---

## Testing Requirements

### Before Submitting a Pull Request

All changes must pass these tests:

#### 1. Manual Testing

- [ ] Test in Chrome (desktop)
- [ ] Test in Firefox (desktop)
- [ ] Test in Safari (desktop) - if available
- [ ] Test in mobile viewport (DevTools)
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test screen reader (NVDA/VoiceOver) - critical features only

#### 2. Browser Console

- [ ] No JavaScript errors in console
- [ ] No 404 errors in Network tab
- [ ] No warnings (ideally)

#### 3. Validation

- [ ] HTML validates: https://validator.w3.org/
- [ ] CSS validates: https://jigsaw.w3.org/css-validator/
- [ ] JSON validates: https://jsonlint.com/ (if applicable)

#### 4. Accessibility

- [ ] Run axe DevTools scan (0 violations)
- [ ] Run Lighthouse accessibility audit (score ≥ 90)
- [ ] Manual keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)

#### 5. Performance

- [ ] Lighthouse performance score ≥ 90
- [ ] Page loads in < 3 seconds
- [ ] No layout shift during load (CLS < 0.1)
- [ ] Interactions are smooth (60fps)

#### 6. Responsive Design

- [ ] Test at 1920×1080 (desktop)
- [ ] Test at 768×1024 (tablet)
- [ ] Test at 375×667 (mobile)
- [ ] No horizontal scroll at any size
- [ ] Content readable without zoom

### Running Tests

```bash
# Start local server
cd meta-lesson
python -m http.server 8000

# Open in browser and test manually
# Use browser DevTools for debugging
```

See [TESTING.md](./TESTING.md) for comprehensive testing procedures.

---

## Pull Request Process

### 1. Before Creating PR

- [ ] Create a branch with descriptive name
- [ ] Make your changes
- [ ] Test thoroughly (see [Testing Requirements](#testing-requirements))
- [ ] Update documentation if needed
- [ ] Commit with clear messages
- [ ] Push to your fork

### 2. Creating the PR

1. **Go to Original Repository**
   - Navigate to https://github.com/ORIGINAL_OWNER/the-attention-mechanism

2. **Click "New Pull Request"**

3. **Select Branches**
   - Base: `main` (original repo)
   - Compare: `your-feature-branch` (your fork)

4. **Fill Out PR Template**

```markdown
## Description

Brief description of what this PR does and why.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Content addition (workflow example, story epic)

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing Performed

- [ ] Manual testing in Chrome
- [ ] Manual testing in Firefox
- [ ] Mobile viewport testing
- [ ] Accessibility testing (axe DevTools)
- [ ] Performance testing (Lighthouse)

**Browsers Tested:**
- Chrome 120.0
- Firefox 119.0

**Devices Tested:**
- Desktop 1920×1080
- Mobile 375×667 (DevTools)

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings or errors
- [ ] I have tested across required browsers
- [ ] I have checked for accessibility issues
- [ ] I have added/updated tests if needed
```

### 3. PR Review Process

- Maintainer will review within 1-2 weeks
- Address any requested changes
- Once approved, maintainer will merge
- Your contribution will be credited!

### 4. After PR is Merged

- Delete your feature branch (optional)
- Pull latest changes from main
- Celebrate! You've contributed!

---

## Issue Reporting

### Bug Report Template

Use this template when reporting bugs:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- Browser: [e.g., Chrome 120.0]
- OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- Device: [e.g., Desktop 1920×1080, iPhone 12 Pro]
- Page: [e.g., gallery.html, builder.html]

**Console Errors**
```
Paste any errors from the browser console here
```

**Additional Context**
Add any other context about the problem here.
```

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Problem It Solves**
Explain what problem this feature would solve or what improvement it would bring.

**Proposed Solution**
Describe how you imagine this feature working.

**Alternatives Considered**
Any alternative solutions or features you've considered.

**Use Cases**
Specific scenarios where this feature would be useful:
1. Use case 1
2. Use case 2

**Additional Context**
Any mockups, examples, or additional information.
```

---

## Content Contributions

### Adding Workflow Examples

The gallery showcases 2-epic workflow examples. To add a new example:

#### 1. Choose Your Workflow

- Must be a 2-epic structure
- Should demonstrate agent delegation
- Should be educational and practical
- Should fit one of the existing domains (or propose new domain)

#### 2. Create JSON Entry

Add to `content/gallery/examples.json`:

```json
{
  "id": "unique-kebab-case-id",
  "name": "Descriptive Workflow Name",
  "domain": "Domain Category",
  "complexity": "Beginner|Intermediate|Advanced",
  "description": "2-3 sentence description of the workflow and what it accomplishes",
  "epic1": {
    "name": "Epic 1 Name",
    "purpose": "Clear statement of what Epic 1 accomplishes and why",
    "deliverables": [
      "Specific deliverable 1",
      "Specific deliverable 2",
      "Specific deliverable 3",
      "Specific deliverable 4"
    ]
  },
  "epic2": {
    "name": "Epic 2 Name",
    "purpose": "Clear statement of what Epic 2 accomplishes and why",
    "deliverables": [
      "Specific deliverable 1",
      "Specific deliverable 2",
      "Specific deliverable 3",
      "Specific deliverable 4"
    ]
  },
  "suggestedAgents": [
    {
      "role": "Agent Role Name",
      "responsibility": "What this agent is responsible for"
    },
    {
      "role": "Another Agent Role",
      "responsibility": "What this agent does"
    }
  ],
  "useCases": [
    "Practical use case 1",
    "Practical use case 2",
    "Practical use case 3"
  ],
  "sampleOutput": "Detailed description of what the final output looks like, including specific metrics, formats, or examples"
}
```

#### 3. Guidelines

**Good workflow examples:**
- Solve a real problem
- Demonstrate clear agent delegation
- Have specific, measurable deliverables
- Are appropriate for the stated complexity level
- Provide educational value

**Bad workflow examples:**
- Too vague ("improve the code")
- Single-step tasks (not showing delegation)
- Overly complex for stated difficulty
- Unrealistic expectations

#### 4. Submit PR

- Test that your JSON is valid
- Test that gallery displays correctly
- Include rationale for the new example in PR description

### Adding Story Epics

If expanding the story timeline with new epic perspectives:

1. Follow existing JSON structure in `content/story/epic0.json`
2. Include all three perspectives: Product Manager, Team Lead, Specialists
3. Write in first-person agent voice
4. Include completion metrics
5. Maintain consistent narrative tone

---

## Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Feature Requests**: Open a GitHub Issue with "enhancement" label
- **Security Issues**: Email maintainer directly (do not open public issue)

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project README (optional)
- Release notes for significant contributions

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Building with Agentic Workflows!**

Your efforts help students worldwide learn to harness the power of AI agents for complex software development. Every contribution, no matter how small, makes a difference.

Happy coding!
