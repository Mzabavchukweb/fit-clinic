/**
 * Fit Clinic - Site Search
 * Simple client-side search functionality
 */

(function () {
    'use strict';

    // Search data - pages and their content
    const searchData = [
        {
            title: 'Strona główna',
            url: '../index.html',
            keywords: 'strona główna home medycyna estetyczna zabiegi fit clinic',
            description: 'Profesjonalne zabiegi medycyny estetycznej. Naturalne efekty, które podkreślą Twoje piękno.'
        },
        {
            title: 'O nas',
            url: 'o-nas.html',
            keywords: 'o nas zespół klinika historia doświadczenie eksperci',
            description: 'Poznaj zespół Fit Clinic - ekspertów medycyny estetycznej z wieloletnim doświadczeniem.'
        },
        {
            title: 'Usługi',
            url: 'uslugi/index.html',
            keywords: 'usługi zabiegi twarz ciało modelowanie odmładzanie',
            description: 'Kompleksowa oferta zabiegów medycyny estetycznej na twarz i ciało.'
        },
        {
            title: 'Mezoterapia igłowa',
            url: 'uslugi/mezoterapia.html',
            keywords: 'mezoterapia igłowa nawilżenie odmłodzenie skóra witaminy',
            description: 'Głębokie nawilżenie i odmłodzenie skóry dzięki mezoterapii igłowej.'
        },
        {
            title: 'Masaż Kobido',
            url: 'uslugi/kobido.html',
            keywords: 'kobido masaż twarzy lifting naturalny japoński',
            description: 'Japoński masaż liftingujący twarz - naturalny lifting bez skalpela.'
        },
        {
            title: 'Endermologia',
            url: 'uslugi/endermologia.html',
            keywords: 'endermologia cellulit modelowanie ciała lpg masaż',
            description: 'Skuteczna walka z cellulitem i modelowanie sylwetki.'
        },
        {
            title: 'Lipoliza',
            url: 'uslugi/liposukcja.html',
            keywords: 'lipoliza liposukcja redukcja tkanki tłuszczowej',
            description: 'Nieinwazyjne usuwanie tkanki tłuszczowej.'
        },
        {
            title: 'Botox',
            url: 'uslugi/botox.html',
            keywords: 'botox toksyna botulinowa zmarszczki czoło kurze łapki',
            description: 'Redukcja zmarszczek mimicznych toksyną botulinową.'
        },
        {
            title: 'Wypełniacze',
            url: 'uslugi/wypelniacz.html',
            keywords: 'wypełniacze kwas hialuronowy usta policzki modelowanie',
            description: 'Modelowanie rysów twarzy kwasem hialuronowym.'
        },
        {
            title: 'Peeling chemiczny',
            url: 'uslugi/peeling.html',
            keywords: 'peeling chemiczny złuszczanie odnowa skóry',
            description: 'Profesjonalne peelingi chemiczne dla odnowy skóry.'
        },
        {
            title: 'Cennik',
            url: 'cennik.html',
            keywords: 'cennik ceny koszt zabiegi ile kosztuje',
            description: 'Przejrzyste ceny wszystkich zabiegów w Fit Clinic.'
        },
        {
            title: 'Kontakt',
            url: 'kontakt.html',
            keywords: 'kontakt telefon email adres lokalizacja godziny',
            description: 'Skontaktuj się z nami - adres, telefon, godziny otwarcia.'
        },
        {
            title: 'Rezerwacja',
            url: 'rezerwacja.html',
            keywords: 'rezerwacja umów wizytę termin zapisz się',
            description: 'Zarezerwuj wizytę online - wybierz zabieg i termin.'
        }
    ];

    // DOM elements
    let searchModal = null;
    let searchInput = null;
    let searchResults = null;
    let searchTrigger = null;

    // Create search modal HTML
    function createSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.id = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal__backdrop"></div>
            <div class="search-modal__content">
                <div class="search-modal__header">
                    <div class="search-modal__input-wrapper">
                        <svg class="search-modal__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input type="text" class="search-modal__input" id="search-input" placeholder="Szukaj zabiegów, usług..." autocomplete="off">
                        <button class="search-modal__close" id="search-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="search-modal__results" id="search-results">
                    <div class="search-modal__hint">Wpisz minimum 2 znaki aby wyszukać...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Get elements
        searchModal = modal;
        searchInput = modal.querySelector('#search-input');
        searchResults = modal.querySelector('#search-results');

        // Bind events
        modal.querySelector('.search-modal__backdrop').addEventListener('click', closeSearch);
        modal.querySelector('#search-close').addEventListener('click', closeSearch);
        searchInput.addEventListener('input', handleSearch);

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });
    }

    // Create search trigger button
    function createSearchTrigger() {
        // Add search button to header
        const header = document.querySelector('.header__inner');
        if (!header) return;

        const trigger = document.createElement('button');
        trigger.className = 'search-trigger';
        trigger.id = 'search-trigger';
        trigger.setAttribute('aria-label', 'Szukaj');
        trigger.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
        `;

        // Insert before menu toggle
        const menuToggle = header.querySelector('.menu-toggle');
        if (menuToggle) {
            header.insertBefore(trigger, menuToggle);
        } else {
            header.appendChild(trigger);
        }

        trigger.addEventListener('click', openSearch);
        searchTrigger = trigger;

        // Open search with Ctrl+K or Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });
    }

    // Open search modal
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        searchInput.focus();
        searchInput.value = '';
        searchResults.innerHTML = '<div class="search-modal__hint">Wpisz minimum 2 znaki aby wyszukać...</div>';
    }

    // Close search modal
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Handle search input
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.innerHTML = '<div class="search-modal__hint">Wpisz minimum 2 znaki aby wyszukać...</div>';
            return;
        }

        const results = searchData.filter(item => {
            const searchText = `${item.title} ${item.keywords} ${item.description}`.toLowerCase();
            return searchText.includes(query);
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-modal__no-results">Brak wyników dla "' + query + '"</div>';
            return;
        }

        searchResults.innerHTML = results.map(item => `
            <a href="${item.url}" class="search-result">
                <div class="search-result__title">${highlightMatch(item.title, query)}</div>
                <div class="search-result__desc">${highlightMatch(item.description, query)}</div>
            </a>
        `).join('');
    }

    // Highlight matching text
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Initialize
    function init() {
        createSearchModal();
        createSearchTrigger();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
