/* ==========================================================================
   FIT CLINIC - Premium Scroll Animations (Span.app-inspired)
   Intersection Observer for reveal + word-reveal + stagger
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // Word Reveal: Wrap words in animated spans
    // --------------------------------------------------------------------------
    function prepareWordReveal() {
        const wordRevealElements = document.querySelectorAll('[data-animate="word-reveal"]');

        wordRevealElements.forEach(el => {
            // Skip if already processed
            if (el.dataset.wordsProcessed) return;
            el.dataset.wordsProcessed = 'true';

            // Get text content, preserving <br> tags
            const html = el.innerHTML;
            // Split on HTML tags and spaces
            const fragments = html.split(/(<br\s*\/?>)/gi);

            let wordIndex = 0;
            const processedHTML = fragments.map(fragment => {
                // Keep <br> tags as-is
                if (fragment.match(/<br\s*\/?>/i)) {
                    return fragment;
                }
                // Process text fragments - wrap each word
                const words = fragment.trim().split(/\s+/).filter(w => w.length > 0);
                return words.map(word => {
                    const delay = wordIndex * 0.07; // 70ms between each word
                    wordIndex++;
                    return `<span class="word-wrap"><span class="word-inner" style="transition-delay: ${delay}s">${word}</span></span>`;
                }).join(' ');
            }).join('');

            el.innerHTML = processedHTML;
        });
    }

    // --------------------------------------------------------------------------
    // Hero Word Animation (on page load)
    // --------------------------------------------------------------------------
    function prepareHeroWords() {
        const heroTitles = document.querySelectorAll('.hero__title, .service-hero h1');

        heroTitles.forEach(heroTitle => {
            if (!heroTitle || heroTitle.dataset.wordsProcessed) return;
            heroTitle.dataset.wordsProcessed = 'true';

            const html = heroTitle.innerHTML;
            const fragments = html.split(/(<br\s*\/?>)/gi);

            let wordIndex = 0;
            const processedHTML = fragments.map(fragment => {
                if (fragment.match(/<br\s*\/?>/i)) {
                    return fragment;
                }
                const words = fragment.trim().split(/\s+/).filter(w => w.length > 0);
                return words.map(word => {
                    const delay = 0.2 + (wordIndex * 0.1); // Start at 0.2s, 100ms between words
                    wordIndex++;
                    return `<span class="word-wrap"><span class="word-inner" style="animation-delay: ${delay}s">${word}</span></span>`;
                }).join(' ');
            }).join('');

            heroTitle.innerHTML = processedHTML;
        });
    }

    // --------------------------------------------------------------------------
    // Intersection Observer for Scroll Animations
    // --------------------------------------------------------------------------
    function initScrollAnimations() {
        // Select all animated elements: data-animate, stagger-children, line-expand
        const animatedElements = document.querySelectorAll(
            '[data-animate], .stagger-children, .line-expand'
        );

        if (!animatedElements.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            animatedElements.forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        // Observer options — trigger when 15% visible, with slight offset
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve after animation for performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

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

                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }

                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');

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
        const isMobile = window.matchMedia('(max-width: 992px)').matches;
        if (isMobile) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

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
    // Stagger Animation for Grid Items (legacy data-stagger support)
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
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Initialize All
    // --------------------------------------------------------------------------
    function init() {
        // Prepare word animations first (before observer kicks in)
        prepareWordReveal();
        prepareHeroWords();

        // Then start observers
        initScrollAnimations();
        initLazyLoading();
        initParallax();
        initStaggerAnimation();
        initCounterAnimation();
        initSmoothScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
