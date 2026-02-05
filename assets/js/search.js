/**
 * Fit Clinic - Premium Site Search
 * Advanced client-side search with keyboard navigation and categories
 */

(function () {
    'use strict';

    // Detect current page depth for relative URLs
    const pathDepth = (function () {
        const path = window.location.pathname;
        if (path.includes('/pages/uslugi/')) return '../../';
        if (path.includes('/pages/')) return '../';
        return '';
    })();

    // Search data with categories
    const searchData = [
        // Main Pages
        {
            title: 'Strona główna',
            url: pathDepth + 'index.html',
            keywords: 'strona główna home start początek',
            description: 'Profesjonalne zabiegi medycyny estetycznej',
            category: 'Strony'
        },
        {
            title: 'O nas',
            url: pathDepth + 'pages/o-nas.html',
            keywords: 'o nas zespół klinika historia doświadczenie eksperci specjaliści',
            description: 'Poznaj zespół ekspertów Fit Clinic',
            category: 'Strony'
        },
        {
            title: 'Cennik',
            url: pathDepth + 'pages/cennik.html',
            keywords: 'cennik ceny koszt ile kosztuje opłata',
            description: 'Przejrzyste ceny wszystkich zabiegów',
            category: 'Strony'
        },
        {
            title: 'Rezerwacja',
            url: pathDepth + 'pages/rezerwacja.html',
            keywords: 'rezerwacja umów wizytę termin zapisz się zarezerwuj',
            description: 'Zarezerwuj wizytę online',
            category: 'Strony'
        },
        {
            title: 'Kontakt',
            url: pathDepth + 'pages/kontakt.html',
            keywords: 'kontakt telefon email adres lokalizacja godziny otwarcia',
            description: 'Skontaktuj się z nami',
            category: 'Strony'
        },

        // Face Treatments
        {
            title: 'Mezoterapia igłowa',
            url: pathDepth + 'pages/uslugi/mezoterapia.html',
            keywords: 'mezoterapia igłowa nawilżenie odmłodzenie skóra witaminy kolagen twarz',
            description: 'Głębokie nawilżenie i odmłodzenie skóry',
            category: 'Zabiegi na twarz'
        },
        {
            title: 'Masaż Kobido',
            url: pathDepth + 'pages/uslugi/kobido.html',
            keywords: 'kobido masaż twarzy lifting naturalny japoński anti-aging',
            description: 'Japoński masaż liftingujący twarz',
            category: 'Zabiegi na twarz'
        },
        {
            title: 'Botox',
            url: pathDepth + 'pages/uslugi/botox.html',
            keywords: 'botox toksyna botulinowa zmarszczki czoło kurze łapki mimiczne',
            description: 'Redukcja zmarszczek mimicznych',
            category: 'Zabiegi na twarz'
        },
        {
            title: 'Wypełniacze',
            url: pathDepth + 'pages/uslugi/wypelniacz.html',
            keywords: 'wypełniacze kwas hialuronowy usta policzki modelowanie objętość',
            description: 'Modelowanie rysów twarzy',
            category: 'Zabiegi na twarz'
        },
        {
            title: 'Peeling chemiczny',
            url: pathDepth + 'pages/uslugi/peeling.html',
            keywords: 'peeling chemiczny złuszczanie odnowa skóry glikolowy',
            description: 'Profesjonalne peelingi dla odnowy skóry',
            category: 'Zabiegi na twarz'
        },

        // Body Treatments
        {
            title: 'Endermologia',
            url: pathDepth + 'pages/uslugi/endermologia.html',
            keywords: 'endermologia cellulit modelowanie ciała lpg masaż wbakum',
            description: 'Skuteczna walka z cellulitem',
            category: 'Zabiegi na ciało'
        },
        {
            title: 'Lipoliza',
            url: pathDepth + 'pages/uslugi/liposukcja.html',
            keywords: 'lipoliza liposukcja redukcja tkanki tłuszczowej odchudzanie',
            description: 'Nieinwazyjne usuwanie tkanki tłuszczowej',
            category: 'Zabiegi na ciało'
        },

        // Services Overview
        {
            title: 'Wszystkie usługi',
            url: pathDepth + 'pages/uslugi/index.html',
            keywords: 'usługi zabiegi oferta katalog wszystkie',
            description: 'Pełna oferta zabiegów medycyny estetycznej',
            category: 'Strony'
        }
    ];

    // State
    let searchModal = null;
    let searchInput = null;
    let searchResults = null;
    let selectedIndex = -1;
    let currentResults = [];

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
                        <svg class="search-modal__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input type="text" class="search-modal__input" id="search-input" placeholder="Szukaj zabiegów, usług, stron..." autocomplete="off" spellcheck="false">
                        <div class="search-modal__shortcut">ESC</div>
                    </div>
                </div>
                <div class="search-modal__results" id="search-results">
                    <div class="search-modal__initial">
                        <div class="search-modal__popular">
                            <div class="search-modal__popular-title">Popularne wyszukiwania</div>
                            <div class="search-modal__popular-tags">
                                <button class="search-tag" data-query="botox">Botox</button>
                                <button class="search-tag" data-query="mezoterapia">Mezoterapia</button>
                                <button class="search-tag" data-query="cennik">Cennik</button>
                                <button class="search-tag" data-query="rezerwacja">Rezerwacja</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search-modal__footer">
                    <div class="search-modal__nav-hint">
                        <span class="search-key">↑↓</span> nawigacja
                        <span class="search-key">↵</span> wybierz
                        <span class="search-key">ESC</span> zamknij
                    </div>
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
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', handleKeyboard);

        // Popular tags
        modal.querySelectorAll('.search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.dataset.query;
                handleSearch();
                searchInput.focus();
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });
    }

    // Create search trigger button
    function createSearchTrigger() {
        const header = document.querySelector('.header__inner');
        if (!header) return;

        const trigger = document.createElement('button');
        trigger.className = 'search-trigger';
        trigger.id = 'search-trigger';
        trigger.setAttribute('aria-label', 'Szukaj (Ctrl+K)');
        trigger.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
        `;

        const menuToggle = header.querySelector('.menu-toggle');
        if (menuToggle) {
            header.insertBefore(trigger, menuToggle);
        } else {
            header.appendChild(trigger);
        }

        trigger.addEventListener('click', openSearch);

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchModal.classList.contains('active')) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
        });
    }

    // Open search
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
        searchInput.value = '';
        selectedIndex = -1;
        currentResults = [];
        showInitialState();
    }

    // Close search
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        selectedIndex = -1;
    }

    // Show initial state
    function showInitialState() {
        searchResults.innerHTML = `
            <div class="search-modal__initial">
                <div class="search-modal__popular">
                    <div class="search-modal__popular-title">Popularne wyszukiwania</div>
                    <div class="search-modal__popular-tags">
                        <button class="search-tag" data-query="botox">Botox</button>
                        <button class="search-tag" data-query="mezoterapia">Mezoterapia</button>
                        <button class="search-tag" data-query="cennik">Cennik</button>
                        <button class="search-tag" data-query="rezerwacja">Rezerwacja</button>
                    </div>
                </div>
            </div>
        `;
        searchResults.querySelectorAll('.search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.dataset.query;
                handleSearch();
                searchInput.focus();
            });
        });
    }

    // Handle search
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        selectedIndex = -1;

        if (query.length < 1) {
            showInitialState();
            currentResults = [];
            return;
        }

        // Score-based search
        const scored = searchData.map(item => {
            const searchText = `${item.title} ${item.keywords} ${item.description}`.toLowerCase();
            let score = 0;

            if (item.title.toLowerCase().includes(query)) score += 10;
            if (item.title.toLowerCase().startsWith(query)) score += 5;
            if (item.keywords.toLowerCase().includes(query)) score += 3;
            if (item.description.toLowerCase().includes(query)) score += 1;

            return { ...item, score };
        }).filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        currentResults = scored;

        if (scored.length === 0) {
            searchResults.innerHTML = `
                <div class="search-modal__no-results">
                    <div class="search-modal__no-results-text">Brak wyników dla "<strong>${escapeHtml(query)}</strong>"</div>
                    <div class="search-modal__no-results-hint">Spróbuj innego słowa kluczowego</div>
                </div>
            `;
            return;
        }

        // Group by category
        const grouped = {};
        scored.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });

        let html = '';
        let globalIndex = 0;

        for (const [category, items] of Object.entries(grouped)) {
            html += `<div class="search-category">
                <div class="search-category__title">${category}</div>
                <div class="search-category__items">`;

            items.forEach((item) => {
                html += `
                    <a href="${item.url}" class="search-result" data-index="${globalIndex}">
                        <div class="search-result__content">
                            <div class="search-result__title">${highlightMatch(item.title, query)}</div>
                            <div class="search-result__desc">${highlightMatch(item.description, query)}</div>
                        </div>
                        <span class="search-result__arrow">→</span>
                    </a>
                `;
                globalIndex++;
            });

            html += '</div></div>';
        }

        searchResults.innerHTML = html;
    }

    // Handle keyboard navigation
    function handleKeyboard(e) {
        const results = searchResults.querySelectorAll('.search-result');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
            updateSelection(results);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(results);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selected = results[selectedIndex];
            if (selected) {
                window.location.href = selected.href;
            }
        }
    }

    // Update visual selection
    function updateSelection(results) {
        results.forEach((r, i) => {
            r.classList.toggle('selected', i === selectedIndex);
            if (i === selectedIndex) {
                r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }

    // Highlight match
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Escape regex special chars
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Escape HTML
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize
    function init() {
        createSearchModal();
        createSearchTrigger();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
