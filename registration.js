// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtiJi1Hz2a25liljvda5R0YFVZhcVlEAo",
  authDomain: "learn-igbo-with-ijeoma.firebaseapp.com",
  projectId: "learn-igbo-with-ijeoma",
  storageBucket: "learn-igbo-with-ijeoma.firebasestorage.app",
  messagingSenderId: "865611872091",
  appId: "1:865611872091:web:bb110465f23780cce1cc7e",
  measurementId: "G-XRVX0SCS4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════

    // ── Sanitize input ─────────────────────────────────────
    function sanitizeInput(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    // ── Show error ─────────────────────────────────────────
    function showError(input, message) {
        clearError(input);
        input.style.borderColor = '#e53e3e';
        input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';

        const error = document.createElement('p');
        error.classList.add('error-msg');
        error.textContent = message;
        error.style.cssText = `
            color: #e53e3e;
            font-size: 0.78rem;
            margin-top: 5px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        error.innerHTML = `<span>⚠️</span> ${message}`;
        input.closest('.form-group').appendChild(error);
    }

    // ── Clear error ───────────────────────────────────────
    function clearError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        const existing = input.closest('.form-group')?.querySelector('.error-msg');
        if (existing) existing.remove();
    }

    // ── Show success ───────────────────────────────────────
    function showSuccess(input) {
        clearError(input);
        input.style.borderColor = '#38a169';
        input.style.boxShadow = '0 0 0 3px rgba(56, 161, 105, 0.1)';
    }

    // ── Valid name ─────────────────────────────────────────
    function isValidName(value) {
        return /^[a-zA-Z\s]+$/.test(value.trim()) && value.trim().length >= 2;
    }

    // ── Valid email ────────────────────────────────────────
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    // ── Password strength checker ──────────────────────────
    function getPasswordStrength(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (password.length >= 8) {
            strength += 1;
        }

        if (/[a-z]/.test(password)) {
            strength += 1;
        }

        if (/[A-Z]/.test(password)) {
            strength += 1;
        }

        if (/[0-9]/.test(password)) {
            strength += 1;
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            strength += 1;
        }

        return { strength, feedback };
    }

    // ── Update password strength indicator ────────────────
    function updatePasswordStrength(password, container) {
        const strength = getPasswordStrength(password);
        const strengthBar = container.querySelector('.strength-bar');
        const strengthText = container.querySelector('.strength-text');

        if (!strengthBar || !strengthText) return;

        const percentage = (strength.strength / 6) * 100;
        strengthBar.style.width = `${percentage}%`;

        let color = '#e53e3e';
        let text = 'Very Weak';

        if (strength.strength >= 5) {
            color = '#38a169';
            text = 'Strong';
        } else if (strength.strength >= 4) {
            color = '#68d391';
            text = 'Good';
        } else if (strength.strength >= 3) {
            color = '#ecc94b';
            text = 'Medium';
        } else if (strength.strength >= 2) {
            color = '#ed8936';
            text = 'Weak';
        }

        strengthBar.style.backgroundColor = color;
        strengthText.textContent = password ? text : '';
        strengthText.style.color = color;
    }

    // ── Loading state ──────────────────────────────────────
    function setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Please wait...';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
            button.style.opacity = '1';
        }
    }

    // ═══════════════════════════════════════════════════════
    // REGISTRATION PAGE LOGIC
    // ═══════════════════════════════════════════════════════
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        const firstname = document.getElementById('firstname');
        const lastname = document.getElementById('lastname');
        const regEmail = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        const submitBtn = registrationForm.querySelector('button[type="submit"]');

        // Create password strength indicator
        const passwordGroup = password.closest('.form-group');
        if (passwordGroup) {
            const strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';
            strengthContainer.innerHTML = `
                <div class="strength-bar-container" style="height: 4px; background: #e2e8f0; border-radius: 2px; margin-top: 8px; overflow: hidden;">
                    <div class="strength-bar" style="height: 100%; width: 0%; transition: all 0.3s ease;"></div>
                </div>
                <p class="strength-text" style="font-size: 0.7rem; margin-top: 4px;"></p>
            `;
            passwordGroup.appendChild(strengthContainer);
        }

        // ── Live validation listeners ───────────────────────

        firstname.addEventListener('input', () => {
            const sanitized = sanitizeInput(firstname.value);
            if (!isValidName(sanitized)) {
                showError(firstname, 'First name must contain letters only (min 2 characters).');
            } else {
                clearError(firstname);
                showSuccess(firstname);
            }
        });

        lastname.addEventListener('input', () => {
            const sanitized = sanitizeInput(lastname.value);
            if (!isValidName(sanitized)) {
                showError(lastname, 'Last name must contain letters only (min 2 characters).');
            } else {
                clearError(lastname);
                showSuccess(lastname);
            }
        });

        regEmail.addEventListener('input', () => {
            const sanitized = sanitizeInput(regEmail.value);
            if (!isValidEmail(sanitized)) {
                showError(regEmail, 'Please enter a valid email address.');
            } else {
                clearError(regEmail);
                showSuccess(regEmail);
            }
        });

        password.addEventListener('input', () => {
            const sanitized = sanitizeInput(password.value);
            const strength = getPasswordStrength(sanitized);

            if (strength.strength < 3) {
                showError(password, `Password is too weak. ${strength.feedback.join(', ')}.`);
            } else {
                clearError(password);
                showSuccess(password);
            }

            // Update strength indicator
            const container = password.closest('.form-group');
            if (container) {
                updatePasswordStrength(sanitized, container);
            }

            // Re-check confirm password whenever password changes
            if (confirmPassword.value !== '') {
                if (confirmPassword.value !== password.value) {
                    showError(confirmPassword, 'Passwords do not match. Please re-enter your password.');
                } else {
                    clearError(confirmPassword);
                    showSuccess(confirmPassword);
                }
            }
        });

        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value === '') {
                showError(confirmPassword, 'Please confirm your password.');
            } else if (confirmPassword.value !== password.value) {
                showError(confirmPassword, 'Passwords do not match. Please re-enter your password.');
            } else {
                clearError(confirmPassword);
                showSuccess(confirmPassword);
            }
        });

        // ── Submit handler ──────────────────────────────────

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;

            // Sanitize inputs
            const sanitizedFirstname = sanitizeInput(firstname.value);
            const sanitizedLastname = sanitizeInput(lastname.value);
            const sanitizedEmail = sanitizeInput(regEmail.value);
            const sanitizedPassword = sanitizeInput(password.value);
            const sanitizedConfirmPassword = sanitizeInput(confirmPassword.value);

            // Validation checks
            if (!isValidName(sanitizedFirstname)) {
                showError(firstname, 'First name must contain letters only (min 2 characters).');
                hasError = true;
            }
            if (!isValidName(sanitizedLastname)) {
                showError(lastname, 'Last name must contain letters only (min 2 characters).');
                hasError = true;
            }
            if (!isValidEmail(sanitizedEmail)) {
                showError(regEmail, 'Please enter a valid email address.');
                hasError = true;
            }
            if (sanitizedPassword.length < 8) {
                showError(password, 'Password must be at least 8 characters.');
                hasError = true;
            }
            if (sanitizedConfirmPassword !== sanitizedPassword) {
                showError(confirmPassword, 'Passwords do not match. Please re-enter your password.');
                hasError = true;
            }

            if (hasError) return;

            // Set loading state
            setLoadingState(submitBtn, true);

            // Send to Firebase
            createUserWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword)
                .then((userCredential) => {
                    console.log("User created:", userCredential.user);
                    alert("🎉 Account created successfully! Welcome aboard.");
                    window.location.href = "thank-you.html";
                })
                .catch((error) => {
                    console.error("Firebase Error:", error.code);
                    setLoadingState(submitBtn, false);

                    if (error.code === 'auth/email-already-in-use') {
                        showError(regEmail, 'This email is already registered. Try signing in instead.');
                    } else if (error.code === 'auth/invalid-email') {
                        showError(regEmail, 'Please enter a valid email address.');
                    } else if (error.code === 'auth/weak-password') {
                        showError(password, 'Password is too weak. Please use a stronger password.');
                    } else {
                        showError(regEmail, `Registration failed: ${error.message}`);
                    }
                });
        });

    } // end registrationForm block


    // ═══════════════════════════════════════════════════════
    // LOGIN PAGE LOGIC
    // ═══════════════════════════════════════════════════════
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        const loginEmail = document.getElementById('email');
        const loginPassword = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const rememberMe = document.getElementById('rememberMe');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // ── Remember me functionality ───────────────────────
        // Check for saved email
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            loginEmail.value = savedEmail;
            if (rememberMe) rememberMe.checked = true;
        }

        // ── Show/hide password toggle ───────────────────────
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const isPassword = loginPassword.type === 'password';
                loginPassword.type = isPassword ? 'text' : 'password';
                togglePassword.textContent = isPassword ? '🙈' : '👁';
            });
        }

        // ── Live validation listeners ───────────────────────

        loginEmail.addEventListener('input', () => {
            const sanitized = sanitizeInput(loginEmail.value);
            if (!isValidEmail(sanitized)) {
                showError(loginEmail, 'Please enter a valid email address.');
            } else {
                clearError(loginEmail);
                showSuccess(loginEmail);
            }
        });

        loginPassword.addEventListener('input', () => {
            const sanitized = sanitizeInput(loginPassword.value);
            if (sanitized.length < 8) {
                showError(loginPassword, 'Password must be at least 8 characters.');
            } else {
                clearError(loginPassword);
                showSuccess(loginPassword);
            }
        });

        // ── Submit handler ──────────────────────────────────
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;

            const sanitizedEmail = sanitizeInput(loginEmail.value);
            const sanitizedPassword = sanitizeInput(loginPassword.value);

            if (!isValidEmail(sanitizedEmail)) {
                showError(loginEmail, 'Please enter a valid email address.');
                hasError = true;
            }
            if (sanitizedPassword.length < 8) {
                showError(loginPassword, 'Password must be at least 8 characters.');
                hasError = true;
            }

            if (hasError) return;

            // Handle remember me
            if (rememberMe && rememberMe.checked) {
                localStorage.setItem('rememberedEmail', sanitizedEmail);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Set loading state
            setLoadingState(submitBtn, true);

            // Send to Firebase
            signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword)
                .then((userCredential) => {
                    console.log("User signed in:", userCredential.user);
                    window.location.href = "thank-you.html";
                })
                .catch((error) => {
                    console.error("Firebase Error:", error.code);
                    setLoadingState(submitBtn, false);

                    if (error.code === 'auth/user-not-found') {
                        showError(loginEmail, 'No account found with this email. Please register first.');
                    } else if (error.code === 'auth/wrong-password') {
                        showError(loginPassword, 'Incorrect password. Please try again.');
                    } else if (error.code === 'auth/invalid-credential') {
                        showError(loginEmail, 'Invalid email or password. Please check and try again.');
                    } else if (error.code === 'auth/too-many-requests') {
                        showError(loginEmail, 'Too many failed attempts. Please try again later.');
                    } else {
                        showError(loginEmail, `Login failed: ${error.message}`);
                    }
                });
        });

    } // end loginForm block

    // ═══════════════════════════════════════════════════════
    // GOOGLE SIGN-IN (Optional - for both pages)
    // ═══════════════════════════════════════════════════════
    const googleButtons = document.querySelectorAll('.google-signin-btn, [id*="google"]');

    googleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            signInWithPopup(auth, googleProvider)
                .then((result) => {
                    console.log("Google sign-in successful:", result.user);
                    window.location.href = "thank-you.html";
                })
                .catch((error) => {
                    console.error("Google Error:", error.code);
                    alert(`Google sign-in failed: ${error.message}`);
                });
        });
    });

}); // end DOMContentLoaded