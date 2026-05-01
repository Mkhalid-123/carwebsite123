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

// Social Auth Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

// Handle redirect result (for when popup is blocked and we fall back to redirect)
auth.getRedirectResult()
    .then((result) => {
        if (result.user) {
            console.log('Redirect Sign-In Success:', result.user.email);
        }
    })
    .catch((error) => {
        console.error('Redirect Sign-In Error:', error.code, error.message);
    });

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
        'auth/operation-not-allowed': 'This sign-in method is not enabled in the Firebase Console.',
        'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
        'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the process.',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Please sign in using your original method.',
        'auth/operation-not-supported-in-this-environment': 'This operation is not supported in the current environment. Please make sure you are running the site through a local web server (http://localhost) and not opening the HTML file directly.',
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
    const googleBtn = document.getElementById('google-btn');
    const githubBtn = document.getElementById('github-btn');

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

    // Helper: Set button loading state
    function setBtnLoading(btn, loading) {
        if (!btn) return;
        btn.disabled = loading;
        btn.style.opacity = loading ? '0.6' : '1';
        btn.style.pointerEvents = loading ? 'none' : 'auto';
        if (loading) {
            btn.dataset.originalHtml = btn.innerHTML;
            const label = btn.querySelector('span');
            if (label) label.textContent = 'Signing in...';
        } else {
            if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
        }
    }

    // Handle Google Login
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Google Sign-In clicked');
            clearError();
            
            // Check protocol first
            if (window.location.protocol === 'file:') {
                showError('Google Sign-In requires a web server. Please run "npm start" and open http://localhost:3000');
                return;
            }

            setBtnLoading(googleBtn, true);

            // Try popup first, then auto-fallback to redirect
            auth.signInWithPopup(googleProvider)
                .then((result) => {
                    console.log('Google Sign-In Success:', result.user.email);
                })
                .catch((error) => {
                    console.error('Google Sign-In Error:', error.code, error.message);
                    
                    if (error.code === 'auth/popup-blocked' || 
                        error.code === 'auth/cancelled-popup-request' ||
                        error.code === 'auth/operation-not-supported-in-this-environment') {
                        // Fallback to redirect
                        console.log('Popup failed, falling back to redirect...');
                        showError('Redirecting to Google sign-in...');
                        return auth.signInWithRedirect(googleProvider);
                    }
                    
                    if (error.code === 'auth/popup-closed-by-user') {
                        // User closed it intentionally, just reset
                        setBtnLoading(googleBtn, false);
                        return;
                    }
                    
                    // Show a helpful error for common issues
                    if (error.code === 'auth/operation-not-allowed') {
                        showError('Google Sign-In is not enabled. Please enable it in your Firebase Console → Authentication → Sign-in method.');
                    } else if (error.code === 'auth/unauthorized-domain') {
                        showError('This domain is not authorized. Add "localhost" in Firebase Console → Authentication → Settings → Authorized domains.');
                    } else {
                        showError(getFriendlyError(error.code));
                    }
                    setBtnLoading(googleBtn, false);
                });
        });
    } else {
        console.warn('Google button (#google-btn) not found in DOM');
    }

    // Handle GitHub Login
    if (githubBtn) {
        githubBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('GitHub Sign-In clicked');
            clearError();

            // Check protocol first
            if (window.location.protocol === 'file:') {
                showError('GitHub Sign-In requires a web server. Please run "npm start" and open http://localhost:3000');
                return;
            }

            setBtnLoading(githubBtn, true);

            // Try popup first, then auto-fallback to redirect
            auth.signInWithPopup(githubProvider)
                .then((result) => {
                    console.log('GitHub Sign-In Success:', result.user.email);
                })
                .catch((error) => {
                    console.error('GitHub Sign-In Error:', error.code, error.message);
                    
                    if (error.code === 'auth/popup-blocked' || 
                        error.code === 'auth/cancelled-popup-request' ||
                        error.code === 'auth/operation-not-supported-in-this-environment') {
                        // Fallback to redirect
                        console.log('Popup failed, falling back to redirect...');
                        showError('Redirecting to GitHub sign-in...');
                        return auth.signInWithRedirect(githubProvider);
                    }
                    
                    if (error.code === 'auth/popup-closed-by-user') {
                        setBtnLoading(githubBtn, false);
                        return;
                    }
                    
                    // Show a helpful error for common issues
                    if (error.code === 'auth/operation-not-allowed') {
                        showError('GitHub Sign-In is not enabled. Please enable it in your Firebase Console → Authentication → Sign-in method.');
                    } else if (error.code === 'auth/unauthorized-domain') {
                        showError('This domain is not authorized. Add "localhost" in Firebase Console → Authentication → Settings → Authorized domains.');
                    } else {
                        showError(getFriendlyError(error.code));
                    }
                    setBtnLoading(githubBtn, false);
                });
        });
    } else {
        console.warn('GitHub button (#github-btn) not found in DOM');
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

// Protocol Check Warning
if (window.location.protocol === 'file:') {
    const warning = document.createElement('div');
    warning.id = 'protocol-warning';
    warning.innerHTML = `
        <div style="background: #ff4444; color: white; padding: 15px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; font-family: sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            ⚠️ <strong>CRITICAL ERROR:</strong> You are opening this as a local file (file://). 
            Google/GitHub Sign-In <strong>WILL NOT WORK</strong>. 
            Please open <strong><a href="http://localhost:3000" style="color: #fff; text-decoration: underline; font-weight: bold;">http://localhost:3000</a></strong> in your browser instead.
        </div>`;
    document.body.prepend(warning);
}