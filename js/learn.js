/**
 * Learn Page Interactive Features
 * Attention Mechanism Educational Project
 *
 * Handles TOC navigation, scroll spy, code copying, and reading progress.
 */

(function() {
  'use strict';

  // ============================================
  // State Management
  // ============================================

  const state = {
    currentSection: null,
    isScrolling: false,
    scrollTimeout: null,
  };

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    progressBar: document.getElementById('reading-progress'),
    tocToggle: document.getElementById('toc-toggle'),
    tocNav: document.getElementById('toc-nav'),
    tocLinks: document.querySelectorAll('.toc-link'),
    sections: document.querySelectorAll('.content-section'),
    backToTop: document.getElementById('back-to-top'),
    copyButtons: document.querySelectorAll('.copy-btn'),
  };

  // ============================================
  // Initialize Syntax Highlighting
  // ============================================

  function initializeSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
      // Highlight all code blocks
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      console.log('Syntax highlighting initialized');
    } else {
      console.warn('highlight.js not loaded');
    }
  }

  // ============================================
  // Reading Progress Bar
  // ============================================

  function updateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercentage = (scrollTop / scrollableHeight) * 100;

    // Update progress bar width
    if (elements.progressBar) {
      elements.progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;

      // Update ARIA attribute
      const progressContainer = elements.progressBar.parentElement;
      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', Math.round(scrollPercentage));
      }
    }
  }

  // ============================================
  // Scroll Spy & Active Section Tracking
  // ============================================

  function updateActiveSection() {
    let currentActiveSection = null;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const offset = 150; // Offset for header and spacing

    // Find which section is currently in view
    elements.sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentActiveSection = section.id;
      }
    });

    // Update TOC link highlighting
    if (currentActiveSection && currentActiveSection !== state.currentSection) {
      state.currentSection = currentActiveSection;

      elements.tocLinks.forEach((link) => {
        const targetSection = link.getAttribute('data-section');

        if (targetSection === currentActiveSection) {
          link.classList.add('active');
          // Update ARIA for screen readers
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  // ============================================
  // Smooth Scrolling
  // ============================================

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);

    if (target) {
      const offset = 100; // Offset for header
      const targetPosition = target.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }

  function handleTocLinkClick(event) {
    event.preventDefault();
    const targetSection = event.currentTarget.getAttribute('data-section');

    if (targetSection) {
      smoothScrollTo(targetSection);

      // Close mobile menu after clicking
      if (window.innerWidth <= 768) {
        elements.tocNav.classList.remove('open');
        elements.tocToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // ============================================
  // Mobile TOC Toggle
  // ============================================

  function toggleMobileToc() {
    const isOpen = elements.tocNav.classList.toggle('open');
    elements.tocToggle.setAttribute('aria-expanded', isOpen);

    // Announce state change for screen readers
    const announcement = isOpen ? 'Table of contents expanded' : 'Table of contents collapsed';
    announceToScreenReader(announcement);
  }

  // ============================================
  // Back to Top Button
  // ============================================

  function updateBackToTopVisibility() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const showThreshold = 300; // Show after scrolling 300px

    if (elements.backToTop) {
      if (scrollPosition > showThreshold) {
        elements.backToTop.classList.add('visible');
      } else {
        elements.backToTop.classList.remove('visible');
      }
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // ============================================
  // Code Copy Functionality
  // ============================================

  function copyCodeToClipboard(button) {
    const codeWrapper = button.closest('.code-block-wrapper');
    const codeBlock = codeWrapper.querySelector('code');

    if (!codeBlock) {
      console.error('Code block not found');
      return;
    }

    const codeText = codeBlock.textContent;

    // Use Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText)
        .then(() => {
          showCopySuccess(button);
        })
        .catch((err) => {
          console.error('Failed to copy code:', err);
          fallbackCopyToClipboard(codeText, button);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyToClipboard(codeText, button);
    }
  }

  function fallbackCopyToClipboard(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess(button);
      } else {
        console.error('Fallback copy failed');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }

    document.body.removeChild(textarea);
  }

  function showCopySuccess(button) {
    // Add visual feedback
    button.classList.add('copied');
    const originalText = button.querySelector('.copy-text').textContent;
    button.querySelector('.copy-text').textContent = 'Copied';

    // Announce to screen readers
    announceToScreenReader('Code copied to clipboard');

    // Reset after 2 seconds
    setTimeout(() => {
      button.classList.remove('copied');
      button.querySelector('.copy-text').textContent = originalText;
    }, 2000);
  }

  // ============================================
  // Accessibility Utilities
  // ============================================

  function announceToScreenReader(message) {
    // Create or get announcement element
    let announcer = document.getElementById('sr-announcer');

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }

    // Update announcement
    announcer.textContent = message;

    // Clear after a moment
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function handleKeyboardNavigation(event) {
    // Handle Escape key to close mobile menu
    if (event.key === 'Escape' && elements.tocNav.classList.contains('open')) {
      elements.tocNav.classList.remove('open');
      elements.tocToggle.setAttribute('aria-expanded', 'false');
      elements.tocToggle.focus();
    }
  }

  // ============================================
  // Scroll Event Handler (Throttled)
  // ============================================

  function handleScroll() {
    // Throttle scroll events for better performance
    if (!state.isScrolling) {
      window.requestAnimationFrame(() => {
        updateReadingProgress();
        updateActiveSection();
        updateBackToTopVisibility();
        state.isScrolling = false;
      });

      state.isScrolling = true;
    }
  }

  // ============================================
  // Event Listeners Setup
  // ============================================

  function setupEventListeners() {
    // Scroll events (throttled)
    window.addEventListener('scroll', handleScroll, { passive: true });

    // TOC link clicks
    elements.tocLinks.forEach((link) => {
      link.addEventListener('click', handleTocLinkClick);
    });

    // Mobile TOC toggle
    if (elements.tocToggle) {
      elements.tocToggle.addEventListener('click', toggleMobileToc);
    }

    // Back to top button
    if (elements.backToTop) {
      elements.backToTop.addEventListener('click', scrollToTop);
    }

    // Copy buttons
    elements.copyButtons.forEach((button) => {
      button.addEventListener('click', function() {
        copyCodeToClipboard(this);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Handle hash navigation on page load
    if (window.location.hash) {
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        smoothScrollTo(targetId);
      }, 100);
    }

    console.log('Event listeners initialized');
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    console.log('Initializing learn page...');

    // Initialize syntax highlighting
    initializeSyntaxHighlighting();

    // Set up event listeners
    setupEventListeners();

    // Initial updates
    updateReadingProgress();
    updateActiveSection();
    updateBackToTopVisibility();

    // Mark first section as active if none detected
    if (!state.currentSection && elements.tocLinks.length > 0) {
      elements.tocLinks[0].classList.add('active');
      elements.tocLinks[0].setAttribute('aria-current', 'true');
      state.currentSection = elements.tocLinks[0].getAttribute('data-section');
    }

    console.log('Learn page initialized successfully');
  }

  // ============================================
  // Execute on DOM Ready
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // Expose utilities to global scope (optional)
  // ============================================

  window.learnPage = {
    scrollToSection: smoothScrollTo,
    updateProgress: updateReadingProgress,
    updateActiveSection: updateActiveSection,
  };

})();
