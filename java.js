// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZjge0YwVcqxLI2TMDfWvEqwBywMDJo2I",
  authDomain: "project-56e53.firebaseapp.com",
  projectId: "project-56e53",
  storageBucket: "project-56e53.firebasestorage.app",
  messagingSenderId: "188996642263",
  appId: "1:188996642263:web:62976517938a3a16efd792"
};

// Initialize Firebase (Compat version)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Friendly error messages
function getFriendlyError(errorCode) {
    const errors = {
        'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters long.',
        'auth/user-not-found': 'No account found with this email. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/user-disabled': 'This account has been disabled. Contact support.',
    };
    return errors[errorCode] || 'Something went wrong. Please try again.';
}

// Hide overlay with animation
function hideOverlay() {
    const authOverlay = document.getElementById('auth-overlay');
    if (!authOverlay) return;
    authOverlay.style.opacity = '0';
    setTimeout(() => {
        authOverlay.style.display = 'none';
        document.body.classList.remove('auth-modal-open');
    }, 500);
}

// Show overlay
function showOverlay() {
    const authOverlay = document.getElementById('auth-overlay');
    if (!authOverlay) return;
    authOverlay.style.display = 'flex';
    authOverlay.style.opacity = '1';
    document.body.classList.add('auth-modal-open');
}

// Logic to run once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const toggleText = document.getElementById('toggle-text');
    const authError = document.getElementById('auth-error');
    const userInfo = document.getElementById('user-info');
    const userNameElement = document.getElementById('user-name');
    const purchaseBtn = document.getElementById('btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Auth state listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            hideOverlay();
            if (userInfo && userNameElement) {
                userInfo.style.display = 'flex';
                userNameElement.innerText = user.displayName || user.email.split('@')[0];
            }
            if (purchaseBtn) purchaseBtn.style.display = 'none';
        } else {
            showOverlay();
            if (userInfo) userInfo.style.display = 'none';
            if (purchaseBtn) purchaseBtn.style.display = 'block';
        }
    });

    const clearError = () => {
        if (authError) {
            authError.style.display = 'none';
            authError.innerText = '';
        }
    };

    const showError = (message) => {
        if (authError) {
            authError.style.display = 'block';
            authError.innerText = message;
        }
    };

    // Toggle between Login and Signup
    if (toggleText) {
        let isLogin = true;
        toggleText.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                isLogin = !isLogin;
                clearError();

                if (isLogin) {
                    authTitle.innerText = 'Login';
                    authSubtitle.innerText = 'Welcome back! Please enter your details.';
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                    toggleText.innerHTML = "Don't have an account? <a href='#'>Sign Up</a>";
                } else {
                    authTitle.innerText = 'Sign Up';
                    authSubtitle.innerText = 'Join us today! Experience the best car rentals.';
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                    toggleText.innerHTML = "Already have an account? <a href='#'>Login</a>";
                }
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;

            if (!email || !password) {
                showError('Please fill in all fields.');
                return;
            }
            
            btn.innerText = 'Signing In...';
            btn.disabled = true;

            auth.signInWithEmailAndPassword(email, password)
                .catch((error) => {
                    showError(getFriendlyError(error.code));
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();

            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;

            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields.');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long.');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }

            btn.innerText = 'Creating Account...';
            btn.disabled = true;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return userCredential.user.updateProfile({ displayName: name });
                })
                .catch((error) => {
                    showError(getFriendlyError(error.code));
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => console.error('Logout Error:', error));
        });
    }
});

// Scroll to Top Logic
let topBtn = document.querySelector("#firstbtn");
window.addEventListener('scroll', function() {
    if (topBtn) {
        if (window.scrollY > 400) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    }
});