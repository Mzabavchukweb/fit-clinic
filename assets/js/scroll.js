/* ==========================================================================
   FIT CLINIC - Scroll Animations Observer
   Intersection Observer for reveal animations
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // Intersection Observer for Scroll Animations
    // --------------------------------------------------------------------------
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (!animatedElements.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Skip animations for users who prefer reduced motion
            animatedElements.forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        // Observer options
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Optional: unobserve after animation (better performance)
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --------------------------------------------------------------------------
    // Lazy Loading Images
    // --------------------------------------------------------------------------
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Set the src from data-src
                    img.src = img.dataset.src;

                    // Handle srcset if present
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }

                    // Remove data attributes
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');

                    // Add loaded class for fade-in effect
                    img.addEventListener('load', () => {
                        img.classList.add('is-loaded');
                    });

                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // --------------------------------------------------------------------------
    // Parallax Effect (Subtle) - Desktop only
    // --------------------------------------------------------------------------
    function initParallax() {
        // Disable parallax on mobile for stability
        const isMobile = window.matchMedia('(max-width: 992px)').matches;
        if (isMobile) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (!parallaxElements.length) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.5;
                        const rect = el.getBoundingClientRect();
                        const scrolled = window.pageYOffset;

                        // Only apply when element is in view
                        if (rect.bottom > 0 && rect.top < window.innerHeight) {
                            const yPos = -(scrolled * speed);
                            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Stagger Animation for Grid Items
    // --------------------------------------------------------------------------
    function initStaggerAnimation() {
        const staggerContainers = document.querySelectorAll('[data-stagger]');

        if (!staggerContainers.length) return;

        staggerContainers.forEach(container => {
            const items = container.children;
            const delay = parseInt(container.dataset.stagger) || 100;

            Array.from(items).forEach((item, index) => {
                item.style.transitionDelay = `${index * delay}ms`;
            });
        });
    }

    // --------------------------------------------------------------------------
    // Counter Animation
    // --------------------------------------------------------------------------
    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-counter]');

        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = parseInt(counter.dataset.duration) || 2000;

                    animateCounter(counter, target, duration);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // --------------------------------------------------------------------------
    // Initialize All
    // --------------------------------------------------------------------------
    function init() {
        initScrollAnimations();
        initLazyLoading();
        initParallax();
        initStaggerAnimation();
        initCounterAnimation();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
