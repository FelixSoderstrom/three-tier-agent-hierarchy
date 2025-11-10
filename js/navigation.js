/**
 * Navigation functionality for Building with Agentic Workflows
 * Handles card interactions, keyboard navigation, and tracking
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================

    const CONFIG = {
        animationDuration: 300,
        enableTracking: true,
        pages: {
            story: 'story.html',
            gallery: 'gallery.html',
            learn: 'learn.html',
            builder: 'builder.html'
        }
    };

    // ============================================
    // State Management
    // ============================================

    const state = {
        currentPage: 'landing',
        navigationHistory: [],
        startTime: Date.now()
    };

    // ============================================
    // DOM Elements
    // ============================================

    let navCards = null;
    let initialized = false;

    // ============================================
    // Initialization
    // ============================================

    function init() {
        if (initialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        navCards = document.querySelectorAll('.nav-card');

        if (navCards.length === 0) {
            console.warn('No navigation cards found');
            return;
        }

        setupEventListeners();
        setupKeyboardNavigation();
        logPageView();
        initialized = true;

        console.log('Navigation initialized successfully');
    }

    // ============================================
    // Event Listeners
    // ============================================

    function setupEventListeners() {
        navCards.forEach((card) => {
            // Click events
            card.addEventListener('click', handleCardClick);

            // Touch events for mobile
            card.addEventListener('touchstart', handleTouchStart, { passive: true });

            // Hover effects for analytics
            card.addEventListener('mouseenter', handleCardHover);
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    function setupKeyboardNavigation() {
        navCards.forEach((card) => {
            // Make cards keyboard accessible
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }

            // Handle keyboard events
            card.addEventListener('keydown', (e) => {
                // Activate on Enter or Space
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardActivation(card);
                }
            });
        });

        // Arrow key navigation
        document.addEventListener('keydown', handleArrowNavigation);
    }

    // ============================================
    // Event Handlers
    // ============================================

    function handleCardClick(e) {
        // Don't prevent default - let the link work
        const card = e.currentTarget;
        handleCardActivation(card, false);
    }

    function handleTouchStart(e) {
        const card = e.currentTarget;
        card.classList.add('touch-active');

        setTimeout(() => {
            card.classList.remove('touch-active');
        }, 200);
    }

    function handleCardHover(e) {
        const card = e.currentTarget;
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle && CONFIG.enableTracking) {
            trackEvent('hover', cardTitle.textContent.trim().toLowerCase());
        }
    }

    function handleCardActivation(card, navigate = true) {
        const href = card.getAttribute('href');
        const cardTitle = card.querySelector('.card-title');
        const destination = cardTitle ? cardTitle.textContent.trim() : 'unknown';

        // Track the navigation
        trackNavigation(destination, href);

        // Add activation animation
        card.classList.add('activating');

        if (navigate) {
            // Smooth transition effect
            setTimeout(() => {
                window.location.href = href;
            }, CONFIG.animationDuration);
        }

        // Remove animation class after animation completes
        setTimeout(() => {
            card.classList.remove('activating');
        }, CONFIG.animationDuration);
    }

    function handleArrowNavigation(e) {
        const focusedElement = document.activeElement;
        const isNavCard = focusedElement.classList.contains('nav-card');

        if (!isNavCard) return;

        const navCardsArray = Array.from(navCards);
        const currentIndex = navCardsArray.indexOf(focusedElement);

        let nextIndex = -1;

        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % navCardsArray.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + navCardsArray.length) % navCardsArray.length;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = navCardsArray.length - 1;
                break;
        }

        if (nextIndex !== -1) {
            navCardsArray[nextIndex].focus();
        }
    }

    // ============================================
    // Tracking & Analytics
    // ============================================

    function trackNavigation(destination, url) {
        const navigationData = {
            from: state.currentPage,
            to: destination,
            url: url,
            timestamp: Date.now(),
            timeOnPage: Date.now() - state.startTime
        };

        state.navigationHistory.push(navigationData);

        if (CONFIG.enableTracking) {
            trackEvent('navigation', destination, navigationData);
        }

        // Store in sessionStorage for cross-page analytics
        try {
            const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
            history.push(navigationData);
            sessionStorage.setItem('navigationHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save navigation history:', e);
        }
    }

    function trackEvent(eventType, eventName, data = {}) {
        // Analytics hook - can be extended with Google Analytics, Plausible, etc.
        const event = {
            type: eventType,
            name: eventName,
            data: data,
            timestamp: Date.now()
        };

        console.log('Track event:', event);

        // Hook for custom analytics
        if (window.customAnalytics && typeof window.customAnalytics.track === 'function') {
            window.customAnalytics.track(event);
        }

        // Hook for Google Analytics (if present)
        if (window.gtag && typeof window.gtag === 'function') {
            window.gtag('event', eventType, {
                event_category: 'navigation',
                event_label: eventName,
                value: data.timeOnPage || 0
            });
        }
    }

    function logPageView() {
        if (CONFIG.enableTracking) {
            trackEvent('page_view', 'landing', {
                referrer: document.referrer,
                timestamp: Date.now()
            });
        }
    }

    // ============================================
    // Utility Functions
    // ============================================

    function getNavigationStats() {
        return {
            history: state.navigationHistory,
            timeOnPage: Date.now() - state.startTime,
            currentPage: state.currentPage
        };
    }

    // ============================================
    // Public API
    // ============================================

    window.NavigationManager = {
        getStats: getNavigationStats,
        state: state,
        CONFIG: CONFIG
    };

    // ============================================
    // Initialize on load
    // ============================================

    init();

    // ============================================
    // Error Handling
    // ============================================

    window.addEventListener('error', (e) => {
        console.error('Navigation error:', e);
    });

})();

/**
 * Additional accessibility enhancements
 */
(function() {
    'use strict';

    // Announce navigation changes to screen readers
    function announceNavigation(destination) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigating to ${destination}`;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Add to window for use by other scripts
    window.announceNavigation = announceNavigation;

})();

/**
 * Preload next pages for faster navigation
 */
(function() {
    'use strict';

    const PRELOAD_ENABLED = true;

    if (!PRELOAD_ENABLED) return;

    function preloadPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // Preload common destinations after a delay
    window.addEventListener('load', () => {
        setTimeout(() => {
            const pages = ['gallery.html', 'learn.html', 'builder.html'];
            pages.forEach(page => preloadPage(page));
        }, 2000);
    });

})();

/**
 * Page Visibility API - Pause animations when tab is hidden
 * Performance optimization to save battery and CPU
 */
(function() {
    'use strict';

    // Handle page visibility changes
    function handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations for battery saving
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible - resume animations
            document.body.classList.remove('page-hidden');
        }
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check
    handleVisibilityChange();

})();
