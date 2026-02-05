/**
 * Fit Clinic - Custom Booking System
 * 3-step booking wizard with calendar and time slot selection
 */

(function () {
    'use strict';

    // State
    let currentStep = 1;
    let selectedService = null;
    let selectedDate = null;
    let selectedTime = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // DOM Elements
    const panels = document.querySelectorAll('.booking-panel');
    const steps = document.querySelectorAll('.booking-step');
    const serviceOptions = document.querySelectorAll('.service-option');
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    const timeSlotsContainer = document.getElementById('time-slots');
    const timeSlots = document.querySelectorAll('.time-slot');

    // Navigation Buttons
    const nextTo2 = document.getElementById('next-to-2');
    const nextTo3 = document.getElementById('next-to-3');
    const backTo1 = document.getElementById('back-to-1');
    const backTo2 = document.getElementById('back-to-2');
    const submitBooking = document.getElementById('submit-booking');
    const prevMonth = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Polish month names
    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    // Initialize
    function init() {
        if (!serviceOptions.length) return;

        bindEvents();
        renderCalendar();
        setupFormValidation();
    }

    // Bind all events
    function bindEvents() {
        // Service selection
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => selectService(option));
        });

        // Navigation
        if (nextTo2) nextTo2.addEventListener('click', () => goToStep(2));
        if (nextTo3) nextTo3.addEventListener('click', () => goToStep(3));
        if (backTo1) backTo1.addEventListener('click', () => goToStep(1));
        if (backTo2) backTo2.addEventListener('click', () => goToStep(2));
        if (submitBooking) submitBooking.addEventListener('click', handleSubmit);

        // Calendar navigation
        if (prevMonth) prevMonth.addEventListener('click', () => changeMonth(-1));
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => changeMonth(1));

        // Time slots
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => selectTime(slot));
        });
    }

    // Select a service
    function selectService(option) {
        // Remove selected from all
        serviceOptions.forEach(o => o.classList.remove('selected'));

        // Add selected to clicked
        option.classList.add('selected');
        selectedService = option.dataset.service;

        // Enable next button
        if (nextTo2) nextTo2.disabled = false;
    }

    // Go to a specific step
    function goToStep(step) {
        currentStep = step;

        // Update panels
        panels.forEach(panel => panel.classList.remove('active'));
        const activePanel = document.getElementById(`panel-${step}`);
        if (activePanel) activePanel.classList.add('active');

        // Update progress
        steps.forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');

            if (stepNum < step) {
                s.classList.add('completed');
            } else if (stepNum === step) {
                s.classList.add('active');
            }
        });

        // Update booking summary when going to step 3
        if (step === 3) {
            updateSummary();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update booking summary display
    function updateSummary() {
        const summaryService = document.getElementById('summary-service');
        const summaryDate = document.getElementById('summary-date');
        const summaryTime = document.getElementById('summary-time');

        // Service name mapping
        const serviceNames = {
            'mezoterapia': 'Mezoterapia igłowa',
            'botox': 'Botox',
            'wypelniacze': 'Wypełniacze',
            'endermologia': 'Endermologia',
            'kobido': 'Masaż Kobido',
            'konsultacja': 'Konsultacja'
        };

        if (summaryService) {
            summaryService.textContent = serviceNames[selectedService] || selectedService || '—';
        }

        if (summaryDate && selectedDate) {
            summaryDate.textContent = selectedDate.toLocaleDateString('pl-PL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        if (summaryTime) {
            summaryTime.textContent = selectedTime || '—';
        }
    }

    // Render calendar
    function renderCalendar() {
        if (!calendarGrid || !currentMonthEl) return;

        // Update month display
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Clear existing days (keep weekday headers)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Get first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();

        // Adjust for Monday start (0 = Sunday in JS)
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        // Add empty cells for days before first
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateObj = new Date(currentYear, currentMonth, day);

            // Check if past date
            if (dateObj < today.setHours(0, 0, 0, 0)) {
                dayEl.classList.add('disabled');
            } else if (dateObj.getDay() === 0) {
                // Disable Sundays
                dayEl.classList.add('disabled');
            } else {
                // Make clickable
                dayEl.addEventListener('click', () => selectDate(day, dayEl));
            }

            // Mark today
            if (dateObj.toDateString() === new Date().toDateString()) {
                dayEl.classList.add('today');
            }

            calendarGrid.appendChild(dayEl);
        }
    }

    // Change month
    function changeMonth(direction) {
        currentMonth += direction;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        // Don't allow going to past months
        const today = new Date();
        if (currentYear < today.getFullYear() ||
            (currentYear === today.getFullYear() && currentMonth < today.getMonth())) {
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
            return;
        }

        renderCalendar();
    }

    // Select a date
    function selectDate(day, element) {
        // Remove selected from all days
        const allDays = calendarGrid.querySelectorAll('.calendar-day');
        allDays.forEach(d => d.classList.remove('selected'));

        // Add selected to clicked
        element.classList.add('selected');
        selectedDate = new Date(currentYear, currentMonth, day);

        // Show time slots
        if (timeSlotsContainer) {
            timeSlotsContainer.style.display = 'block';
        }

        // Reset time selection
        selectedTime = null;
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        if (nextTo3) nextTo3.disabled = true;
    }

    // Select a time slot
    function selectTime(slot) {
        // Remove selected from all
        timeSlots.forEach(s => s.classList.remove('selected'));

        // Add selected to clicked
        slot.classList.add('selected');
        selectedTime = slot.textContent;

        // Enable next button
        if (nextTo3) nextTo3.disabled = false;
    }

    // Validation patterns
    const validationPatterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-+()]{9,}$/,
        name: /^.{2,}$/
    };

    // Validation error messages
    const errorMessages = {
        name: 'Proszę podać imię i nazwisko (min. 2 znaki)',
        email: 'Proszę podać prawidłowy adres e-mail',
        phone: 'Proszę podać prawidłowy numer telefonu'
    };

    // Validate a single field
    function validateField(field) {
        const name = field.name;
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        let errorEl = formGroup.querySelector('.form-error');

        // Create error element if doesn't exist
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            formGroup.appendChild(errorEl);
        }

        // Skip optional message field
        if (name === 'message') {
            return true;
        }

        // Check if empty
        if (!value) {
            field.classList.add('form-input--error');
            field.classList.remove('form-input--valid');
            errorEl.textContent = errorMessages[name] || 'This field is required';
            errorEl.style.display = 'block';
            return false;
        }

        // Check pattern
        const pattern = validationPatterns[name];
        if (pattern && !pattern.test(value)) {
            field.classList.add('form-input--error');
            field.classList.remove('form-input--valid');
            errorEl.textContent = errorMessages[name];
            errorEl.style.display = 'block';
            return false;
        }

        // Valid
        field.classList.remove('form-input--error');
        field.classList.add('form-input--valid');
        errorEl.style.display = 'none';
        return true;
    }

    // Validate entire form
    function validateForm() {
        const form = document.getElementById('booking-form');
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Setup real-time validation
    function setupFormValidation() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => validateField(input));

            // Clear error on input
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                const errorEl = formGroup.querySelector('.form-error');
                if (errorEl) {
                    errorEl.style.display = 'none';
                }
                input.classList.remove('form-input--error');
            });
        });
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        const form = document.getElementById('booking-form');
        if (!form) return;

        // Validate all fields
        if (!validateForm()) {
            // Focus first error field
            const firstError = form.querySelector('.form-input--error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Prepare booking data
        const bookingData = {
            service: selectedService,
            date: selectedDate ? selectedDate.toLocaleDateString('pl-PL') : null,
            time: selectedTime,
            name,
            email,
            phone,
            message
        };

        console.log('Booking submitted:', bookingData);

        // Store in localStorage for confirmation
        localStorage.setItem('lastBooking', JSON.stringify(bookingData));

        // Here you would typically send to backend
        // For now, show success message
        showSuccess();
    }

    // Show success panel
    function showSuccess() {
        panels.forEach(panel => panel.classList.remove('active'));
        const successPanel = document.getElementById('panel-success');
        if (successPanel) successPanel.classList.add('active');

        // Update all steps as completed
        steps.forEach(s => {
            s.classList.remove('active');
            s.classList.add('completed');
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
