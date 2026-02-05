/* ==========================================================================
   FIT CLINIC - Main JavaScript
   Navigation, Language Switcher, UI Interactions
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // DOM Elements
    // --------------------------------------------------------------------------
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const langButtons = document.querySelectorAll('.lang-switch__btn');
    const accordionItems = document.querySelectorAll('.accordion__item');

    // --------------------------------------------------------------------------
    // Mobile Menu Toggle
    // --------------------------------------------------------------------------
    function initMobileMenu() {
        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.contains('active');
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isOpen);

            // Animate hamburger to X
            menuToggle.classList.toggle('is-active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu when clicking nav links
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        });
    }

    // --------------------------------------------------------------------------
    // Header Scroll Behavior
    // --------------------------------------------------------------------------
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 10) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }

            // Hide/show header on scroll direction
            if (currentScroll > scrollThreshold) {
                if (currentScroll > lastScroll) {
                    header.classList.add('is-hidden');
                } else {
                    header.classList.remove('is-hidden');
                }
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Language Switcher
    // --------------------------------------------------------------------------
    function initLanguageSwitcher() {
        if (!langButtons.length) return;

        // Store translations
        const translations = {
            pl: {
                nav: {
                    home: 'Strona główna',
                    about: 'O nas',
                    services: 'Usługi',
                    pricing: 'Cennik',
                    contact: 'Kontakt'
                },
                hero: {
                    subtitle: 'Medycyna estetyczna',
                    title: 'Odkryj piękno swojego ciała',
                    description: 'Profesjonalne zabiegi odmładzające i modelujące sylwetkę w sercu miasta.',
                    cta: 'Umów wizytę'
                },
                common: {
                    learnMore: 'Dowiedz się więcej',
                    bookNow: 'Zarezerwuj teraz',
                    readMore: 'Czytaj więcej'
                }
            },
            de: {
                nav: {
                    home: 'Startseite',
                    about: 'Über uns',
                    services: 'Leistungen',
                    pricing: 'Preise',
                    contact: 'Kontakt'
                },
                hero: {
                    subtitle: 'Ästhetische Medizin',
                    title: 'Entdecken Sie die Schönheit Ihres Körpers',
                    description: 'Professionelle Verjüngungs- und Körperformungsbehandlungen im Herzen der Stadt.',
                    cta: 'Termin buchen'
                },
                common: {
                    learnMore: 'Mehr erfahren',
                    bookNow: 'Jetzt buchen',
                    readMore: 'Weiterlesen'
                }
            }
        };

        // Get current language from localStorage or default to 'pl'
        let currentLang = localStorage.getItem('fitclinic-lang') || 'pl';

        // Set initial active state
        updateActiveLanguage(currentLang);

        // Handle language switch
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang === currentLang) return;

                currentLang = lang;
                localStorage.setItem('fitclinic-lang', lang);
                updateActiveLanguage(lang);
                applyTranslations(lang, translations);
            });
        });
    }

    function updateActiveLanguage(lang) {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function applyTranslations(lang, translations) {
        const t = translations[lang];
        if (!t) return;

        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            const keys = key.split('.');
            let value = t;

            for (const k of keys) {
                value = value?.[k];
            }

            if (value) {
                el.textContent = value;
            }
        });
    }

    // --------------------------------------------------------------------------
    // Accordion
    // --------------------------------------------------------------------------
    function initAccordion() {
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion__header');
            const content = item.querySelector('.accordion__content');

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');

                // Update ARIA
                header.setAttribute('aria-expanded', !isOpen);
            });
        });
    }

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // --------------------------------------------------------------------------
    // Form Handling
    // --------------------------------------------------------------------------
    function initContactForm() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            let isValid = true;
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-error');
                } else {
                    field.classList.remove('is-error');
                }
            });

            if (!isValid) {
                showToast('Proszę wypełnić wszystkie wymagane pola', 'error');
                return;
            }

            // Email validation
            const emailField = form.querySelector('[type="email"]');
            if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                showToast('Proszę podać prawidłowy adres e-mail', 'error');
                emailField.classList.add('is-error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            // Simulate sending (in production, this would POST to server)
            setTimeout(() => {
                submitBtn.classList.remove('btn--loading');
                submitBtn.textContent = 'Wysłano!';

                showToast('Dziękujemy! Wkrótce się skontaktujemy.', 'success');

                setTimeout(() => {
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    // Clear validation states
                    form.querySelectorAll('input, textarea').forEach(field => {
                        field.classList.remove('form-input--valid', 'form-input--error', 'is-error');
                    });
                }, 2000);
            }, 1000);
        });

        // Real-time validation on blur
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateContactField(field));
            field.addEventListener('input', () => {
                field.classList.remove('is-error', 'form-input--error');
            });
        });
    }

    // Validate a contact form field
    function validateContactField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        // Skip non-required empty fields
        if (!required && !value) return true;

        // Check required
        if (required && !value) {
            field.classList.add('form-input--error');
            field.classList.remove('form-input--valid');
            return false;
        }

        // Email validation
        if (type === 'email' && value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                field.classList.add('form-input--error');
                field.classList.remove('form-input--valid');
                return false;
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            if (!/^[\d\s\-+()]{9,}$/.test(value)) {
                field.classList.add('form-input--error');
                field.classList.remove('form-input--valid');
                return false;
            }
        }

        // Valid
        if (value) {
            field.classList.add('form-input--valid');
            field.classList.remove('form-input--error');
        }
        return true;
    }

    // --------------------------------------------------------------------------
    // Toast Notification System
    // --------------------------------------------------------------------------
    function showToast(message, type = 'default') {
        // Create container if doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        // Remove after delay
        setTimeout(() => {
            toast.classList.add('is-leaving');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // --------------------------------------------------------------------------
    // Team Cards - Tap to Flip on Mobile
    // --------------------------------------------------------------------------
    function initTeamCardsTap() {
        const teamCards = document.querySelectorAll('.team-card');
        if (!teamCards.length) return;

        // Check if touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice || window.innerWidth <= 992) {
            teamCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Close other cards
                    teamCards.forEach(c => {
                        if (c !== card) c.classList.remove('is-flipped');
                    });

                    // Toggle this card
                    card.classList.toggle('is-flipped');
                });
            });

            // Close cards when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.team-card')) {
                    teamCards.forEach(c => c.classList.remove('is-flipped'));
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // Initialize All
    // --------------------------------------------------------------------------
    function init() {
        initMobileMenu();
        initHeaderScroll();
        initLanguageSwitcher();
        initAccordion();
        initSmoothScroll();
        initContactForm();
        initScrollReveal();
        initFaqAccordion();
        initBeforeAfterSlider();
        initParallax();
        initGalleryFilter();
        initTeamCardsTap();
    }

    // --------------------------------------------------------------------------
    // Scroll Reveal Animation Observer
    // --------------------------------------------------------------------------
    function initScrollReveal() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --------------------------------------------------------------------------
    // FAQ Accordion (New minimal style)
    // --------------------------------------------------------------------------
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Before/After Slider
    // --------------------------------------------------------------------------
    function initBeforeAfterSlider() {
        const sliders = document.querySelectorAll('.before-after');
        if (!sliders.length) return;

        sliders.forEach(slider => {
            const handle = slider.querySelector('.before-after__handle');
            const beforeImage = slider.querySelector('.before-after__before');
            if (!handle || !beforeImage) return;

            let isDragging = false;

            const updateSlider = (clientX) => {
                const rect = slider.getBoundingClientRect();
                let position = ((clientX - rect.left) / rect.width) * 100;
                position = Math.max(0, Math.min(100, position));

                beforeImage.style.width = position + '%';
                handle.style.left = position + '%';
            };

            // Mouse events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                updateSlider(e.clientX);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch events
            handle.addEventListener('touchstart', (e) => {
                isDragging = true;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                updateSlider(e.touches[0].clientX);
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            // Click anywhere on slider
            slider.addEventListener('click', (e) => {
                if (e.target === handle || e.target.closest('.before-after__handle')) return;
                updateSlider(e.clientX);
            });
        });
    }

    // --------------------------------------------------------------------------
    // Parallax Effect for Hero (Desktop only)
    // --------------------------------------------------------------------------
    function initParallax() {
        // Disable parallax on mobile for stability
        const isMobile = window.matchMedia('(max-width: 992px)').matches;
        if (isMobile) return;

        const parallaxElements = document.querySelectorAll('.hero__parallax img, .hero__background img');
        if (!parallaxElements.length) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    parallaxElements.forEach(el => {
                        const speed = 0.4;
                        const yPos = scrolled * speed;
                        el.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Metamorphosis Gallery Filter
    // --------------------------------------------------------------------------
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.gallery-filter');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!filterButtons.length || !galleryItems.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const categories = item.dataset.category || '';

                    if (filter === 'all' || categories.includes(filter)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
