# Building with Agentic Workflows

An interactive web-based educational platform that teaches AI/ML students how to orchestrate multi-agent workflows for complex software development tasks.


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Browser Support](#browser-support)
- [Accessibility](#accessibility)
- [Development](#development)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Building with Agentic Workflows** is an educational platform that teaches students how to leverage AI agents to build complex software projects. Instead of traditional tutorials, students learn by exploring a real-world case study (how agents built an attention mechanism lesson through autonomous workflows) and then create their own custom workflow templates.

### What Makes This Unique

- **Meta-Narrative**: The story is told from the agents' perspective, reinforcing the concept that agents built the project
- **Hands-On Learning**: Students don't just read—they design and export their own workflow configurations
- **No Prerequisites**: No prior knowledge of Claude Code or agentic workflows required
- **Practical Focus**: 15 real-world workflow examples across 7 domains (Documentation, Testing, DevOps, Data, Web, Quality, Miscellaneous)
- **Export System**: Generate ready-to-use `.claude/` directory templates with custom commands

### Learning Outcomes

By completing this lesson, students will:

1. Understand the three-tier agent hierarchy (Product Manager → Team Lead → Specialist)
2. Learn how to break complex projects into manageable epics
3. Master delegation techniques for agent coordination
4. Design handoff protocols using completion files
5. Create their own multi-agent workflow configurations
6. Export production-ready workflow templates

---

## Features

### 1. Landing Page
- Clean, modern interface with project overview
- Statistics dashboard (8 Epics, 15 Examples, 5 Theory Modules)
- Quick navigation to all major sections
- Fully responsive design

### 2. Story Timeline
- Interactive timeline of the agents' 8-epic development journey
- Modal dialogs with three perspectives:
  - Product Manager: Strategic overview
  - Team Lead: Technical decisions
  - Specialists: Implementation details
- Real metrics: files created, lines of code
- Keyboard accessible with arrow navigation

### 3. Workflow Gallery
- 15 diverse 2-epic workflow examples
- Advanced filtering:
  - Domain: 7 categories
  - Complexity: Beginner, Intermediate, Advanced
  - Search: Real-time text search
  - Combined filters
- Detailed cards showing:
  - Epic breakdowns
  - Suggested agents
  - Use cases
  - Sample outputs

### 4. Learn/Theory Page
- Comprehensive theory on agentic workflows
- 5 major sections:
  1. Agent Hierarchy
  2. Epic Development
  3. Meta-Agent Pattern
  4. Delegation Best Practices
  5. Getting Started
- Interactive table of contents with scroll spy
- Syntax-highlighted code examples
- Copy-to-clipboard functionality
- Reading progress indicator

### 5. Builder Wizard (4-Step Configuration)
- **Step 1**: Basic configuration (epic count, project name, core components)
- **Step 2**: Epic definitions with markdown editors
- **Step 3**: Agent configuration with tool selection (conditional)
- **Step 4**: Review, validation, and ZIP export
- Features:
  - Real-time validation
  - Auto-save to localStorage
  - State persistence across sessions
  - Keyboard shortcuts (Ctrl+S, Ctrl+Enter)

### 6. Export System
- Generates complete `.claude/` directory structure
- Includes:
  - Product Manager configuration
  - Meta-Agent setup (optional)
  - Custom epic definitions (2-4 epics)
  - Specialized agent templates (optional)
  - README with usage instructions
- Downloads as ZIP file
- Ready to use immediately

---

## Live Demo

You can run this project locally in under 1 minute:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/the-attention-mechanism.git
cd the-attention-mechanism/meta-lesson

# Start a local server (choose one):

# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000

# Open in browser
# Navigate to http://localhost:8000/index.html
```

**No build process required!** This is a static HTML/CSS/JavaScript application.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server (Python, Node.js, or VS Code Live Server)
- No other dependencies required

### Installation

#### For Students (Using the Platform)

1. **Download or Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/the-attention-mechanism.git
   ```

2. **Navigate to Directory**
   ```bash
   cd the-attention-mechanism/meta-lesson
   ```

3. **Start Local Server**
   ```bash
   python -m http.server 8000
   ```

4. **Open in Browser**
   ```
   http://localhost:8000/index.html
   ```

#### For Developers (Contributing)

1. **Fork the Repository**
   - Visit https://github.com/YOUR_USERNAME/the-attention-mechanism
   - Click "Fork" button

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/the-attention-mechanism.git
   cd the-attention-mechanism
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes and Test**
   ```bash
   cd meta-lesson
   python -m http.server 8000
   # Test in browser at http://localhost:8000
   ```

5. **Submit Pull Request**
   - See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines

---

## Usage Guide

### For Students

#### Quick Start (15 minutes)

1. **Landing Page** → Understand the project overview
2. **Learn Page** → Read the theory (focus on Agent Hierarchy and Epic Development)
3. **Gallery Page** → Explore workflow examples in your domain of interest
4. **Builder Wizard** → Design your own workflow:
   - Choose 2-3 epics for your first workflow
   - Define epic purposes and deliverables
   - Export your configuration
5. **Deploy** → Extract the ZIP and use in your projects

#### Recommended Learning Path

**Beginner (1-2 hours):**
1. Read "Agent Hierarchy" and "Getting Started" on Learn page
2. Explore 3-5 Beginner workflows in Gallery
3. Build a simple 2-epic workflow in Builder
4. Export and examine the generated files

**Intermediate (3-4 hours):**
1. Read all Learn page sections
2. Review Story timeline for real-world example
3. Explore Intermediate and Advanced workflows
4. Build a 3-4 epic workflow with specialized agents
5. Customize epic definitions thoroughly

**Advanced (5+ hours):**
1. Deep dive into all Story epic perspectives
2. Analyze all 15 Gallery examples
3. Read Learn page multiple times, taking notes
4. Build multiple workflows for different use cases
5. Experiment with Meta-Agent and advanced features

### For Educators

#### Classroom Integration

**Option 1: Self-Paced Learning**
- Assign as homework
- Students explore at their own pace
- Final deliverable: Exported workflow ZIP

**Option 2: Guided Workshop (90 minutes)**
- 0-15 min: Instructor introduces agentic workflows (Learn page)
- 15-30 min: Students explore Gallery examples
- 30-45 min: Instructor walks through Story timeline
- 45-75 min: Students build workflows in Builder
- 75-90 min: Share and discuss designs

**Option 3: Project-Based Learning**
- Week 1: Read Learn page, explore Gallery
- Week 2: Analyze Story timeline, take notes
- Week 3: Design custom workflow for final project
- Week 4: Build project using exported workflow template

#### Assessment Ideas

**Non-Graded (Recommended):**
- Reflection on what they learned
- Share workflow designs with class
- Peer review of workflow configurations

**Graded (Optional):**
- Workflow design completeness
- Epic breakdown clarity
- Agent delegation strategy
- Practical application to real project

### For Developers

#### Customization

**Adding Workflow Examples:**
1. Edit `content/gallery/examples.json`
2. Follow the existing JSON structure
3. Include all required fields
4. Test in Gallery page

**Adding Story Epics:**
1. Create new `content/story/epicN.json`
2. Follow existing epic structure
3. Include all three perspectives
4. Update timeline rendering logic

**Modifying Design:**
1. Edit `css/variables.css` for theme changes
2. Modify component styles in `css/components.css`
3. Test responsiveness at all breakpoints

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.**

---

## Project Structure

```
meta-lesson/
│
├── index.html                    # Landing page
├── story.html                    # Story timeline
├── gallery.html                  # Workflow gallery
├── learn.html                    # Theory/learn page
├── builder.html                  # Builder wizard Step 1
├── builder-step2-example.html    # Builder Step 2
├── builder-step3-example.html    # Builder Step 3
├── builder-step4.html            # Builder Step 4 (export)
│
├── css/                          # Stylesheets
│   ├── variables.css             # Design tokens (colors, spacing, typography)
│   ├── main.css                  # Base styles and utilities
│   ├── components.css            # Reusable components
│   ├── landing.css               # Landing page specific
│   ├── timeline.css              # Story timeline specific
│   ├── gallery.css               # Gallery page specific
│   ├── learn.css                 # Learn page specific
│   ├── builder.css               # Builder wizard specific
│   └── editor.css                # Epic/agent editor specific
│
├── js/                           # JavaScript modules
│   ├── navigation.js             # Landing page navigation
│   ├── timeline.js               # Story timeline logic
│   ├── gallery.js                # Gallery filtering and display
│   ├── learn.js                  # Learn page interactions
│   ├── builder.js                # Builder Step 1 logic
│   ├── epic-editor.js            # Epic editor component (Step 2)
│   ├── agent-editor.js           # Agent editor component (Step 3)
│   ├── state.js                  # State management (localStorage)
│   └── export.js                 # ZIP generation and download (Step 4)
│
├── content/                      # Data files
│   ├── story/                    # Epic story JSON files
│   │   ├── epic0.json            # Product Manager initialization
│   │   ├── epic1.json            # Notebook structure setup
│   │   ├── epic2.json            # Attention mechanism implementation
│   │   ├── epic3.json            # Visualization components
│   │   ├── epic4.json            # Evaluation framework
│   │   ├── epic5.json            # Interactive exercises
│   │   ├── epic6.json            # Documentation generation
│   │   ├── epic7.json            # Testing and validation
│   │   └── workflow-summary.json # Overall workflow summary
│   │
│   └── gallery/
│       └── examples.json         # 15 workflow examples
│
├── templates/                    # Agent instruction templates
│   ├── product-manager.md        # Product Manager template
│   ├── meta-agent.md             # Meta-Agent template
│   ├── epic-definition.md        # Epic definition template
│   ├── specialized-agent.md      # Specialized agent template
│   └── README-template.md        # README template for exports
│
├── README.md                     # This file
├── TESTING.md                    # Testing procedures and checklist
├── CONTRIBUTING.md               # Contribution guidelines
│
└── [Additional documentation files]
```

### Key Directories Explained

**HTML Files:**
- Self-contained pages with semantic HTML5
- Accessible with ARIA attributes
- Link to relevant CSS and JS modules

**css/:**
- `variables.css`: Single source of truth for design tokens
- `components.css`: Reusable components (buttons, cards, modals)
- Page-specific CSS for unique layouts

**js/:**
- Vanilla JavaScript (no frameworks)
- Modular architecture
- Event-driven with async/await for data fetching

**content/:**
- JSON data files
- `story/`: 8 epic narratives with three perspectives each
- `gallery/`: 15 workflow examples with full details

**templates/:**
- Markdown templates for exported configurations
- Used by export system to generate ZIP files

---

## Technology Stack

### Frontend

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Modern layout (Grid, Flexbox), Custom Properties
- **JavaScript (ES6+)**: Vanilla JS, async/await, Fetch API

### Libraries (CDN-loaded)

- **highlight.js** (11.9.0): Syntax highlighting for code blocks
- **JSZip** (3.10.1): Client-side ZIP generation for exports

### Fonts

- **Inter**: Google Fonts (weights: 300, 400, 500, 600, 700)

### Development Tools

- **Git**: Version control
- **Local Server**: Python http.server, Node.js http-server, or VS Code Live Server
- **Browser DevTools**: Chrome, Firefox, Safari DevTools

### No Build Process

This is intentionally a **zero-build** project:
- No Node.js build tools (Webpack, Vite, etc.)
- No CSS preprocessors (SASS, LESS)
- No JavaScript frameworks (React, Vue, Angular)
- Immediate deployment (just serve static files)

**Why?** To maximize accessibility for students and educators who may not have Node.js installed or build tool experience.

---

## Browser Support

### Supported Browsers (Latest Versions)

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅ | ✅ | Fully supported |
| Firefox | ✅ | ✅ | Fully supported |
| Safari  | ✅ | ✅ | Fully supported |
| Edge    | ✅ | ✅ | Fully supported |
| Opera   | ✅ | ❌ | Desktop only |

### Minimum Versions

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Not Supported

- Internet Explorer (all versions)
- Opera Mini
- Browsers with JavaScript disabled

### Required Features

The application uses these modern web features:

- **ES6+ JavaScript**: Arrow functions, async/await, const/let, template literals
- **CSS Grid & Flexbox**: Layout systems
- **CSS Custom Properties**: Design tokens (CSS variables)
- **Fetch API**: Async data loading
- **LocalStorage**: State persistence
- **Promise**: Async operations
- **JSON**: Data storage and parsing

---

## Accessibility

### WCAG 2.1 AA Compliance

This project is designed to meet **WCAG 2.1 Level AA** standards:

✅ **Perceivable**
- All images have alt text or are marked decorative
- Sufficient color contrast (4.5:1 for text)
- Content is adaptable (semantic HTML)
- Text can be resized to 200%

✅ **Operable**
- All functionality available via keyboard
- No keyboard traps
- Skip links for navigation
- Focus indicators visible
- No time limits on interactions

✅ **Understandable**
- Clear, descriptive labels
- Consistent navigation
- Error messages are helpful
- Form validation with suggestions

✅ **Robust**
- Valid HTML5
- ARIA roles, states, and properties
- Compatible with assistive technologies

### Keyboard Navigation

**Global:**
- `Tab`: Navigate forward through interactive elements
- `Shift+Tab`: Navigate backward
- `Enter`: Activate buttons and links
- `Escape`: Close modals and dialogs

**Story Timeline:**
- `Arrow Keys`: Navigate between epic nodes
- `Enter`: Open epic modal
- `Escape`: Close modal

**Learn Page:**
- `Tab`: Navigate table of contents
- `Enter`: Jump to section

**Builder Wizard:**
- `Ctrl+S`: Save draft (Windows/Linux)
- `Cmd+S`: Save draft (macOS)
- `Ctrl+Enter`: Continue to next step
- Standard form navigation

### Screen Reader Support

Tested with:
- **NVDA** (Windows) - Primary
- **VoiceOver** (macOS) - Primary
- **JAWS** (Windows) - Secondary

All interactive elements have proper labels and roles. Dynamic content updates are announced via ARIA live regions.

### Accessibility Testing

Run these tools to verify:

1. **axe DevTools**: Automated accessibility testing
2. **Lighthouse**: Accessibility audit (target: 90+)
3. **WAVE**: Visual accessibility feedback
4. **Manual Keyboard Testing**: Ensure all functionality accessible
5. **Screen Reader Testing**: Test with NVDA or VoiceOver

See [TESTING.md](./TESTING.md) for detailed testing procedures.

---

## Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/the-attention-mechanism.git
cd the-attention-mechanism/meta-lesson

# Start local server
python -m http.server 8000

# Open browser
# Navigate to http://localhost:8000/index.html

# Make changes to files
# Refresh browser to see changes (no build step!)
```

### Development Workflow

1. **Branch**: Create feature branch from `main`
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Develop**: Make changes to HTML/CSS/JS files
   - Use browser DevTools for debugging
   - Check console for errors
   - Test responsiveness

3. **Test**: Run through testing checklist
   - Manual testing in multiple browsers
   - Accessibility testing (axe DevTools)
   - Performance testing (Lighthouse)
   - See [TESTING.md](./TESTING.md)

4. **Validate**: Ensure code quality
   - HTML: https://validator.w3.org/
   - CSS: https://jigsaw.w3.org/css-validator/
   - JSON: https://jsonlint.com/

5. **Commit**: Write clear commit messages
   ```bash
   git add .
   git commit -m "Add filtering functionality to gallery page"
   ```

6. **Push**: Push to your fork
   ```bash
   git push origin feature/your-feature
   ```

7. **PR**: Create pull request to main repository
   - See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Coding Standards

- **HTML**: Semantic HTML5, proper ARIA attributes
- **CSS**: BEM naming, design tokens from variables.css
- **JavaScript**: ES6+, JSDoc comments, error handling
- **JSON**: Valid format, consistent structure

See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete guidelines.

### Design Tokens

All styles use design tokens from `css/variables.css`:

```css
/* Colors */
--color-background: #121212;
--color-surface: #1E1E1E;
--color-primary: #FF8C42;
--color-text: #FFFFFF;

/* Spacing */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;

/* Typography */
--font-size-base: 1rem;
--font-weight-semibold: 600;
```

Always use tokens instead of hardcoded values for consistency.

---

## Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** via GitHub Issues
- 📖 **Improve documentation** via Pull Requests
- 🎨 **Enhance design** via Pull Requests
- 🔧 **Fix bugs** via Pull Requests
- ✨ **Add workflow examples** via Pull Requests
- ♿ **Improve accessibility** via Pull Requests

### Contribution Process

1. **Read** [CONTRIBUTING.md](./CONTRIBUTING.md)
2. **Fork** the repository
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](./CONTRIBUTING.md#code-of-conduct) before contributing.

### Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- Project README (optional)

---

## Testing

### Quick Test

```bash
# Start local server
cd meta-lesson
python -m http.server 8000

# Open browser to http://localhost:8000/index.html

# Test checklist:
# ✅ All pages load without errors
# ✅ Navigation works between pages
# ✅ Gallery filtering functions correctly
# ✅ Story modal opens and closes
# ✅ Builder wizard proceeds through steps
# ✅ Export generates ZIP file
# ✅ No console errors
```

### Comprehensive Testing

See [TESTING.md](./TESTING.md) for:
- Complete manual testing checklist
- Browser compatibility matrix
- Accessibility testing procedures
- Performance benchmarks
- Responsive design testing
- Known issues and workarounds

### Automated Testing

Currently, this project uses **manual testing**. Automated testing infrastructure is planned for future releases.

**Planned improvements:**
- Unit tests for JavaScript modules
- E2E tests with Playwright or Cypress
- Visual regression testing
- Automated accessibility testing in CI

---

## Performance

### Metrics

Target performance (Lighthouse scores):

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 85

### Optimization Techniques

- **Minimal Dependencies**: Only 2 external libraries (highlight.js, JSZip)
- **Efficient CSS**: Modern layout with Grid/Flexbox
- **Lazy Loading**: Images and content load as needed
- **Caching**: LocalStorage for state persistence
- **Minification**: Planned for production builds

### Load Times

Expected load times (3G connection):

- Landing Page: < 1.5s
- Gallery Page: < 2.0s (15 examples to render)
- Learn Page: < 2.0s (long content)
- Story Timeline: < 2.5s (loads 8 JSON files)
- Builder Wizard: < 1.5s

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Credits

### Created By

**Felix** - Original concept and development using agentic workflows

### Acknowledgments

- **Anthropic**: Claude AI for agent capabilities
- **Google Fonts**: Inter font family
- **highlight.js**: Code syntax highlighting
- **JSZip**: Client-side ZIP generation
- **The Open Source Community**: For inspiration and best practices

### Inspiration

This project was born from the realization that the *process* of building an educational project using agentic workflows was more valuable than the original project itself. The meta-lesson emerged naturally: students should learn how to orchestrate AI agents for their own projects.

### References

- **Attention Mechanism**: Original inspiration from transformer architecture
- **Agentic Workflows**: Concepts from AI agent orchestration patterns
- **Educational Design**: Constructivist learning theory (learn by doing)

---

## Roadmap

### Version 1.0 (Current)

✅ Landing page with navigation
✅ Story timeline with 8 epics
✅ Gallery with 15 workflow examples
✅ Learn page with comprehensive theory
✅ Builder wizard with 4-step process
✅ Export system generating ZIP files
✅ WCAG 2.1 AA accessibility compliance
✅ Responsive design (mobile to desktop)
✅ Comprehensive documentation

### Version 1.1 (Planned)

- [ ] Additional workflow examples (target: 25 total)
- [ ] Video tutorials embedded in Learn page
- [ ] More agent templates for export
- [ ] Enhanced builder with workflow validation
- [ ] Dark/light theme toggle
- [ ] Improved mobile experience for Builder

### Version 2.0 (Future)

- [ ] Backend integration for workflow sharing
- [ ] Community-submitted workflows
- [ ] Workflow rating and feedback system
- [ ] AI-powered workflow suggestions
- [ ] Integration with Claude Code directly
- [ ] Automated testing and validation
- [ ] Multilingual support (starting with Spanish, French, German)

### Community Requests

Have a feature request? Open an issue with the "enhancement" label!

---

## FAQ

### General Questions

**Q: Do I need to install anything?**
A: No! Just a web browser and a local server (Python's http.server works great).

**Q: Do I need to know Claude Code?**
A: No. This platform teaches the concepts. You can learn Claude Code later when you're ready to deploy your workflows.

**Q: Is this graded?**
A: No. This is a pure learning tool with no validation or grading.

**Q: Can I use this for my own projects?**
A: Yes! That's the entire point. Export your workflow and adapt it to your needs.

### Technical Questions

**Q: Why no build process?**
A: To maximize accessibility. Students can clone and run immediately without Node.js or build tools.

**Q: Why vanilla JavaScript instead of React/Vue?**
A: Simplicity. The focus is on learning agentic workflows, not JavaScript frameworks.

**Q: Can I deploy this to a web server?**
A: Yes! Upload the `meta-lesson/` directory to any static hosting (GitHub Pages, Netlify, Vercel, etc.).

**Q: Why is Internet Explorer not supported?**
A: IE doesn't support modern JavaScript (ES6+) and CSS features. Supporting it would require transpiling and polyfills, adding complexity.

**Q: Can I add my own workflow examples?**
A: Yes! Edit `content/gallery/examples.json` and submit a PR. See [CONTRIBUTING.md](./CONTRIBUTING.md).

### Troubleshooting

**Q: JSON files won't load (404 errors)?**
A: Make sure you're running a local server. Opening `index.html` directly (file://) won't work due to CORS restrictions.

**Q: Export button doesn't work?**
A: Ensure JSZip is loading from CDN. Check browser console for errors. Some ad blockers may interfere.

**Q: Fonts look different?**
A: Ensure you have an internet connection. Google Fonts loads from CDN. Fallback is system font.

**Q: Builder state not saving?**
A: Check if LocalStorage is enabled in your browser. Private/incognito mode may prevent storage.

---

## Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Email**: [your-email@example.com] (for security issues only)

---

## Changelog

### Version 1.0.0 (2024-11-06)

**Initial Release**

- ✨ Landing page with 4 navigation cards
- ✨ Story timeline with 8 interactive epic nodes
- ✨ Workflow gallery with 15 examples and advanced filtering
- ✨ Learn page with 5 comprehensive theory sections
- ✨ 4-step builder wizard for workflow configuration
- ✨ Export system generating ready-to-use .claude/ directories
- ✨ Full WCAG 2.1 AA accessibility compliance
- ✨ Responsive design from 320px to 1920px+
- ✨ Comprehensive documentation (README, TESTING, CONTRIBUTING)
- 🎨 Dark theme with orange accent (#FF8C42)
- 📱 Mobile-first responsive design
- ⚡ Performance optimized (Lighthouse 90+)
- ♿ Keyboard navigation and screen reader support

---

**Built with ❤️ by students, for students**

Learn to harness the power of AI agents for your own projects. Start exploring today!

[Get Started](#getting-started) | [View Demo](#live-demo) | [Contribute](#contributing)
