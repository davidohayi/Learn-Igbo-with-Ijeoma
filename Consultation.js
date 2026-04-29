document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('consultForm');
    if (!form) return;

    const nameInput     = document.getElementById('name');
    const emailInput    = document.getElementById('email');
    const datetimeInput = document.getElementById('datetime');

    // ── Helper: show error ──────────────────────────────────
    function showError(input, message) {
        clearError(input);
        input.style.borderColor = '#e53e3e';
        const error = document.createElement('p');
        error.classList.add('error-msg');
        error.textContent = message;
        input.closest('.form-group').appendChild(error);
    }

    // ── Helper: clear error ─────────────────────────────────
    function clearError(input) {
        input.style.borderColor = '';
        const existing = input.closest('.form-group').querySelector('.error-msg');
        if (existing) existing.remove();
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function isValidName(value) {
        return /^[a-zA-Z\s]+$/.test(value.trim()) && value.trim().length >= 2;
    }

    // ── Live validation ─────────────────────────────────────
    nameInput.addEventListener('input', () => {
        if (!isValidName(nameInput.value)) {
            showError(nameInput, 'Please enter your full name (letters only).');
        } else {
            clearError(nameInput);
            nameInput.style.borderColor = '#D4A017';
        }
    });

    emailInput.addEventListener('input', () => {
        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address.');
        } else {
            clearError(emailInput);
            emailInput.style.borderColor = '#D4A017';
        }
    });

    datetimeInput.addEventListener('change', () => {
        const chosen = new Date(datetimeInput.value);
        const now = new Date();
        if (chosen <= now) {
            showError(datetimeInput, 'Please choose a future date and time.');
        } else {
            clearError(datetimeInput);
            datetimeInput.style.borderColor = '#D4A017';
        }
    });

    // ── Submit ──────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // always prevent default — we handle it manually

        let hasError = false;

        if (!isValidName(nameInput.value)) {
            showError(nameInput, 'Please enter your full name (letters only).');
            hasError = true;
        }

        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address.');
            hasError = true;
        }

        const chosen = new Date(datetimeInput.value);
        const now = new Date();
        if (!datetimeInput.value || chosen <= now) {
            showError(datetimeInput, 'Please choose a future date and time.');
            hasError = true;
        }

        if (hasError) return;

        // ── Disable button & show loading state ─────────────
        const btn = form.querySelector('.btn-submit');
        btn.disabled = true;
        btn.textContent = 'Sending…';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // ✅ Success — redirect to thank-you page
                window.location.href = 'thank-you.html';
            } else {
                // Formspree returned an error
                btn.disabled = false;
                btn.textContent = 'Request My Session →';
                alert('Something went wrong. Please try again.');
            }
        } catch (err) {
            // Network error
            btn.disabled = false;
            btn.textContent = 'Request My Session →';
            alert('Network error. Please check your connection and try again.');
        }
    });

});