/**
 * Modal Component - Reusable Modal System
 * Attention Mechanism Educational Project
 *
 * A flexible, accessible modal component that supports:
 * - Multiple content areas (title, stats, content, sidebar, footer)
 * - Keyboard navigation (ESC to close, Tab trap)
 * - Focus management
 * - Smooth animations
 * - Responsive design
 * - Full accessibility (ARIA labels, screen reader support)
 */

class Modal {
  /**
   * Create a new Modal instance
   * @param {Object} options - Configuration options
   * @param {string} options.id - Unique identifier for the modal
   * @param {string} options.className - Additional CSS class(es) for the modal
   * @param {boolean} options.closeOnOverlayClick - Close modal when clicking overlay (default: true)
   * @param {boolean} options.closeOnEscape - Close modal on ESC key (default: true)
   * @param {Function} options.onOpen - Callback when modal opens
   * @param {Function} options.onClose - Callback when modal closes
   * @param {HTMLElement} options.returnFocusElement - Element to focus when closing (default: trigger element)
   */
  constructor(options = {}) {
    this.id = options.id || `modal-${Date.now()}`;
    this.className = options.className || '';
    this.closeOnOverlayClick = options.closeOnOverlayClick !== false;
    this.closeOnEscape = options.closeOnEscape !== false;
    this.onOpen = options.onOpen || null;
    this.onClose = options.onClose || null;
    this.returnFocusElement = options.returnFocusElement || null;

    this.isOpen = false;
    this.triggerElement = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;

    this.modalOverlay = null;
    this.modalContainer = null;
    this.closeButton = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.close = this.close.bind(this);
  }

  /**
   * Build the modal HTML structure
   * @param {Object} content - Content configuration object
   * @param {string} content.title - Modal title
   * @param {string} content.subtitle - Optional subtitle/tagline
   * @param {HTMLElement|string} content.header - Custom header content
   * @param {HTMLElement|string} content.body - Main modal content
   * @param {HTMLElement|string} content.sidebar - Optional sidebar content
   * @param {HTMLElement|string} content.footer - Optional footer content
   * @param {boolean} content.showCloseButton - Show close button (default: true)
   * @returns {HTMLElement} The modal overlay element
   */
  build(content = {}) {
    // Create modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = this.id;
    this.modalOverlay.className = `modal-overlay d-none ${this.className}`;
    this.modalOverlay.setAttribute('role', 'dialog');
    this.modalOverlay.setAttribute('aria-modal', 'true');
    this.modalOverlay.setAttribute('aria-hidden', 'true');

    // Create modal container
    this.modalContainer = document.createElement('div');
    this.modalContainer.className = 'modal-container';
    this.modalContainer.setAttribute('role', 'document');

    // Build header
    if (content.title || content.subtitle || content.header || content.showCloseButton !== false) {
      const header = this._buildHeader(content);
      this.modalContainer.appendChild(header);
    }

    // Build body (main content area)
    if (content.body) {
      const body = this._buildBody(content);
      this.modalContainer.appendChild(body);
    }

    // Build footer
    if (content.footer) {
      const footer = this._buildFooter(content);
      this.modalContainer.appendChild(footer);
    }

    this.modalOverlay.appendChild(this.modalContainer);

    return this.modalOverlay;
  }

  /**
   * Build modal header
   * @private
   */
  _buildHeader(content) {
    const header = document.createElement('div');
    header.className = 'modal-header';

    if (content.header) {
      // Custom header content
      if (typeof content.header === 'string') {
        header.innerHTML = content.header;
      } else {
        header.appendChild(content.header);
      }
    } else {
      // Default header with title and close button
      const headerContent = document.createElement('div');
      headerContent.className = 'modal-header-content';

      if (content.title) {
        const title = document.createElement('h2');
        title.id = `${this.id}-title`;
        title.className = 'modal-title';
        title.textContent = content.title;
        headerContent.appendChild(title);

        this.modalOverlay.setAttribute('aria-labelledby', `${this.id}-title`);
      }

      if (content.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.className = 'modal-subtitle';
        subtitle.textContent = content.subtitle;
        headerContent.appendChild(subtitle);
      }

      header.appendChild(headerContent);
    }

    // Close button
    if (content.showCloseButton !== false) {
      this.closeButton = document.createElement('button');
      this.closeButton.className = 'modal-close';
      this.closeButton.type = 'button';
      this.closeButton.setAttribute('aria-label', 'Close modal');
      this.closeButton.setAttribute('title', 'Close (Esc)');
      this.closeButton.innerHTML = '<span aria-hidden="true">×</span>';
      this.closeButton.addEventListener('click', this.close);

      header.appendChild(this.closeButton);
    }

    return header;
  }

  /**
   * Build modal body
   * @private
   */
  _buildBody(content) {
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.id = `${this.id}-body`;

    if (content.sidebar) {
      // Layout with sidebar
      body.classList.add('modal-body-with-sidebar');

      const mainContent = document.createElement('div');
      mainContent.className = 'modal-main-content';

      if (typeof content.body === 'string') {
        mainContent.innerHTML = content.body;
      } else {
        mainContent.appendChild(content.body);
      }

      const sidebar = document.createElement('aside');
      sidebar.className = 'modal-sidebar';
      sidebar.setAttribute('aria-label', 'Additional information');

      if (typeof content.sidebar === 'string') {
        sidebar.innerHTML = content.sidebar;
      } else {
        sidebar.appendChild(content.sidebar);
      }

      body.appendChild(mainContent);
      body.appendChild(sidebar);
    } else {
      // Standard body content
      if (typeof content.body === 'string') {
        body.innerHTML = content.body;
      } else {
        body.appendChild(content.body);
      }
    }

    this.modalOverlay.setAttribute('aria-describedby', `${this.id}-body`);

    return body;
  }

  /**
   * Build modal footer
   * @private
   */
  _buildFooter(content) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    if (typeof content.footer === 'string') {
      footer.innerHTML = content.footer;
    } else {
      footer.appendChild(content.footer);
    }

    return footer;
  }

  /**
   * Open the modal
   * @param {HTMLElement} triggerElement - Element that triggered the modal (for focus return)
   */
  open(triggerElement = null) {
    if (this.isOpen) return;

    this.triggerElement = triggerElement || this.returnFocusElement;

    // Show modal
    this.modalOverlay.classList.remove('d-none');
    this.modalOverlay.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Set up event listeners
    this._setupEventListeners();

    // Set up focus trap
    this._setupFocusTrap();

    // Focus first element
    this._focusFirstElement();

    // Announce to screen readers
    this._announceOpen();

    this.isOpen = true;

    // Call onOpen callback
    if (this.onOpen && typeof this.onOpen === 'function') {
      this.onOpen();
    }
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isOpen) return;

    // Hide modal
    this.modalOverlay.classList.add('d-none');
    this.modalOverlay.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Remove event listeners
    this._removeEventListeners();

    // Return focus
    this._returnFocus();

    this.isOpen = false;

    // Call onClose callback
    if (this.onClose && typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Update modal content
   * @param {Object} content - New content configuration
   */
  updateContent(content) {
    if (!this.modalContainer) return;

    // Clear existing content
    this.modalContainer.innerHTML = '';

    // Rebuild modal
    const newModal = this.build(content);
    this.modalContainer.innerHTML = newModal.querySelector('.modal-container').innerHTML;

    // If modal is open, update focus trap
    if (this.isOpen) {
      this._setupFocusTrap();
    }
  }

  /**
   * Set up event listeners
   * @private
   */
  _setupEventListeners() {
    // Keyboard events
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleKeyDown);
    }

    // Overlay click
    if (this.closeOnOverlayClick) {
      this.modalOverlay.addEventListener('click', this.handleOverlayClick);
    }
  }

  /**
   * Remove event listeners
   * @private
   */
  _removeEventListeners() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.modalOverlay.removeEventListener('click', this.handleOverlayClick);
  }

  /**
   * Handle keyboard events
   * @private
   */
  handleKeyDown(e) {
    if (e.key === 'Escape' && this.closeOnEscape) {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'Tab') {
      this._trapFocus(e);
    }
  }

  /**
   * Handle overlay click
   * @private
   */
  handleOverlayClick(e) {
    if (e.target === this.modalOverlay) {
      this.close();
    }
  }

  /**
   * Set up focus trap
   * @private
   */
  _setupFocusTrap() {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.modalContainer.querySelectorAll(focusableSelectors.join(', '))
    );

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }

  /**
   * Trap focus within modal
   * @private
   */
  _trapFocus(e) {
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }

  /**
   * Focus first focusable element
   * @private
   */
  _focusFirstElement() {
    if (this.closeButton) {
      this.closeButton.focus();
    } else if (this.firstFocusable) {
      this.firstFocusable.focus();
    }
  }

  /**
   * Return focus to trigger element
   * @private
   */
  _returnFocus() {
    if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
      this.triggerElement.focus();
    }
  }

  /**
   * Announce modal open to screen readers
   * @private
   */
  _announceOpen() {
    let liveRegion = document.getElementById('modal-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'modal-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const title = this.modalContainer.querySelector('.modal-title');
    const titleText = title ? title.textContent : 'Modal';
    liveRegion.textContent = `${titleText} dialog opened. Press Escape to close.`;
  }

  /**
   * Destroy the modal and clean up
   */
  destroy() {
    if (this.isOpen) {
      this.close();
    }

    if (this.modalOverlay && this.modalOverlay.parentNode) {
      this.modalOverlay.parentNode.removeChild(this.modalOverlay);
    }

    this.modalOverlay = null;
    this.modalContainer = null;
    this.closeButton = null;
    this.focusableElements = [];
  }
}

/**
 * ModalManager - Singleton for managing multiple modals
 */
class ModalManager {
  constructor() {
    if (ModalManager.instance) {
      return ModalManager.instance;
    }

    this.modals = new Map();
    this.activeModal = null;

    ModalManager.instance = this;
  }

  /**
   * Register a modal with the manager
   * @param {string} id - Modal identifier
   * @param {Modal} modal - Modal instance
   */
  register(id, modal) {
    this.modals.set(id, modal);
  }

  /**
   * Unregister a modal
   * @param {string} id - Modal identifier
   */
  unregister(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.destroy();
      this.modals.delete(id);
    }
  }

  /**
   * Get a modal by ID
   * @param {string} id - Modal identifier
   * @returns {Modal|null}
   */
  get(id) {
    return this.modals.get(id) || null;
  }

  /**
   * Open a modal by ID
   * @param {string} id - Modal identifier
   * @param {HTMLElement} triggerElement - Element that triggered the modal
   */
  open(id, triggerElement = null) {
    const modal = this.modals.get(id);
    if (modal) {
      // Close active modal if different
      if (this.activeModal && this.activeModal !== modal) {
        this.activeModal.close();
      }

      modal.open(triggerElement);
      this.activeModal = modal;
    }
  }

  /**
   * Close a modal by ID
   * @param {string} id - Modal identifier
   */
  close(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.close();
      if (this.activeModal === modal) {
        this.activeModal = null;
      }
    }
  }

  /**
   * Close all modals
   */
  closeAll() {
    this.modals.forEach(modal => modal.close());
    this.activeModal = null;
  }
}

// Create singleton instance
const modalManager = new ModalManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Modal, ModalManager, modalManager };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.Modal = Modal;
  window.ModalManager = ModalManager;
  window.modalManager = modalManager;
}
