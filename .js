
// Global state
let isAuthenticated = false;
let currentUser = null;
let selectedPlan = null;
let currentSubject = null;
let currentLesson = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeModals();
    initializeSmoothScrolling();
    checkAuthState();
}

// Navigation functionality
function initializeNavigation() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showAuthModal);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal functionality
function initializeModals() {
    const authModal = document.getElementById('auth-modal');
    const paymentModal = document.getElementById('payment-modal');
    const closeBtns = document.querySelectorAll('.close');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Initialize form handlers
    initializeAuthForms();
    initializePaymentForm();
}

// Authentication functionality
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'block';
        showMainAuth();
    }
}

function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showMainAuth() {
    document.getElementById('auth-options').style.display = 'block';
    document.getElementById('phone-auth-form').style.display = 'none';
}

function showPhoneAuth() {
    document.getElementById('auth-options').style.display = 'none';
    document.getElementById('phone-auth-form').style.display = 'block';
}

function signInWithGoogle() {
    simulateAuth('Google', 'google-user@gmail.com');
}

function signInWithFacebook() {
    simulateAuth('Facebook', 'facebook-user@facebook.com');
}

function sendOTP() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value;
    
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    const fullPhone = countryCode + phoneNumber;
    document.getElementById('phone-display').textContent = fullPhone;
    document.getElementById('phone-step-1').style.display = 'none';
    document.getElementById('phone-step-2').style.display = 'block';
}

function verifyOTP() {
    const otpCode = document.getElementById('otp-code').value;
    
    if (otpCode.length !== 6) {
        alert('Please enter a 6-digit verification code');
        return;
    }

    const phoneNumber = document.getElementById('phone-display').textContent;
    simulateAuth('Phone', phoneNumber);
}

function simulateAuth(method, identifier) {
    // Simulate authentication process
    isAuthenticated = true;
    currentUser = {
        name: method === 'Google' ? 'John Doe' : method === 'Facebook' ? 'Jane Smith' : 'Phone User',
        email: identifier,
        method: method
    };

    hideAuthModal();
    updateAuthUI();
    
    // Show pricing modal for plan selection
    setTimeout(() => {
        showPricingSelection();
    }, 500);
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    if (isAuthenticated && currentUser) {
        authSection.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${currentUser.name}</span>
                <button onclick="showDashboard()" class="btn btn-primary">Dashboard</button>
                <button onclick="logout()" class="btn btn-secondary">Logout</button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <button id="login-btn" class="btn btn-primary" onclick="showAuthModal()">Login</button>
        `;
    }
}

function logout() {
    isAuthenticated = false;
    currentUser = null;
    selectedPlan = null;
    updateAuthUI();
    hideAllContent();
    showMainSite();
}

// Plan selection functionality
function selectPlan(planType) {
    if (!isAuthenticated) {
        alert('Please sign in first');
        showAuthModal();
        return;
    }

    selectedPlan = {
        type: planType,
        price: planType === 'basic' ? 299 : planType === 'premium' ? 499 : 799,
        name: planType.charAt(0).toUpperCase() + planType.slice(1)
    };

    showPaymentModal();
}

function showPricingSelection() {
    alert('Please select a subscription plan to continue');
    scrollToSection('pricing');
}

// Payment functionality
function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const planInfo = document.getElementById('selected-plan-info');
    const emailInput = document.querySelector('input[name="email"]');
    const amountSpan = document.getElementById('payment-amount');
    
    if (selectedPlan) {
        planInfo.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem; padding: 1rem; background: #f8faff; border-radius: 8px;">
                <h3>${selectedPlan.name} Plan</h3>
                <div style="font-size: 2rem; color: var(--primary-color); font-weight: bold;">
                    R${selectedPlan.price}/month
                </div>
            </div>
        `;
        
        // Populate email and amount
        if (emailInput && currentUser) {
            emailInput.value = currentUser.email;
        }
        if (amountSpan) {
            amountSpan.textContent = selectedPlan.price;
        }
    }
    
    modal.style.display = 'block';
}

function initializeAuthForms() {
    const emailForm = document.getElementById('email-auth-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            simulateAuth('Email', email);
        });
    }
}

function initializePaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
}

function processPayment() {
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    
    // PayFast configuration
    const merchantId = '11568073';
    const merchantKey = 'vj06t0nj2hdyr';
    const returnUrl = window.location.origin + '/payment-success.html';
    const cancelUrl = window.location.origin + '/payment-cancel.html';
    const notifyUrl = window.location.origin + '/payment-notify';
    
    // Generate unique payment ID
    const paymentId = 'EDU' + Date.now();
    
    // Create PayFast payment data
    const paymentData = {
        merchant_id: merchantId,
        merchant_key: merchantKey,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        name_first: formData.get('firstName') || 'Student',
        name_last: formData.get('lastName') || 'User',
        email_address: currentUser.email,
        m_payment_id: paymentId,
        amount: selectedPlan.price + '.00',
        item_name: `EduMath Pro - ${selectedPlan.name} Plan`,
        item_description: `Monthly subscription to ${selectedPlan.name} plan`,
        custom_str1: currentUser.email,
        custom_str2: selectedPlan.type
    };
    
    // Create form and submit to PayFast
    const paymentForm = document.createElement('form');
    paymentForm.method = 'POST';
    paymentForm.action = 'https://sandbox.payfast.co.za/eng/process'; // Use https://www.payfast.co.za/eng/process for live
    
    // Add all payment data as hidden inputs
    Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        paymentForm.appendChild(input);
    });
    
    // Save user data before redirect
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    
    // Hide current modal
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
    
    // Show loading message
    alert('Redirecting to PayFast secure payment gateway...');
    
    // Submit form to PayFast
    document.body.appendChild(paymentForm);
    paymentForm.submit();
}

// Dashboard functionality
function showDashboard() {
    if (!isAuthenticated) {
        alert('Please sign in first');
        showAuthModal();
        return;
    }

    hideAllContent();
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-name').textContent = currentUser.name;
}

function hideAllContent() {
    // Hide main site content
    document.querySelector('main').style.display = 'none';
    
    // Hide all dynamic content
    const contentSections = [
        'dashboard',
        'mathematics-content',
        'physics-content',
        'chemistry-content',
        'lesson-viewer'
    ];
    
    contentSections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function showMainSite() {
    document.querySelector('main').style.display = 'block';
}

function backToDashboard() {
    hideAllContent();
    showDashboard();
}

// Course navigation
function openSubject(subject) {
    currentSubject = subject;
    hideAllContent();
    document.getElementById(`${subject}-content`).style.display = 'block';
}

function backToSubject() {
    hideAllContent();
    if (currentSubject) {
        document.getElementById(`${currentSubject}-content`).style.display = 'block';
    }
}

// Lesson functionality
function openLesson(subject, lessonId) {
    currentSubject = subject;
    currentLesson = lessonId;
    hideAllContent();
    
    const lessonViewer = document.getElementById('lesson-viewer');
    const lessonTitle = document.getElementById('lesson-title');
    const lessonText = document.getElementById('lesson-text');
    
    // Set lesson title and content
    const lessonData = getLessonData(subject, lessonId);
    lessonTitle.textContent = lessonData.title;
    lessonText.innerHTML = lessonData.content;
    
    lessonViewer.style.display = 'block';
}

function getLessonData(subject, lessonId) {
    const lessons = {
        'math': {
            '1.1': {
                title: 'Linear Functions',
                content: `
                    <h3>Linear Functions</h3>
                    <p>A linear function is a function whose graph is a straight line. It has the general form:</p>
                    <p><strong>f(x) = mx + b</strong></p>
                    <p>Where:</p>
                    <ul>
                        <li><strong>m</strong> is the slope of the line</li>
                        <li><strong>b</strong> is the y-intercept</li>
                    </ul>
                    <h3>Key Properties:</h3>
                    <ul>
                        <li>The domain and range are all real numbers</li>
                        <li>The graph is a straight line</li>
                        <li>The rate of change is constant</li>
                        <li>If m > 0, the function is increasing</li>
                        <li>If m < 0, the function is decreasing</li>
                        <li>If m = 0, the function is constant</li>
                    </ul>
                    <h3>Examples:</h3>
                    <p>1. f(x) = 2x + 3 (slope = 2, y-intercept = 3)</p>
                    <p>2. f(x) = -x + 5 (slope = -1, y-intercept = 5)</p>
                    <p>3. f(x) = 4 (constant function, slope = 0)</p>
                `
            },
            '1.2': {
                title: 'Quadratic Functions',
                content: `
                    <h3>Quadratic Functions</h3>
                    <p>A quadratic function has the general form:</p>
                    <p><strong>f(x) = ax² + bx + c</strong></p>
                    <p>Where a ≠ 0</p>
                    <h3>Key Properties:</h3>
                    <ul>
                        <li>The graph is a parabola</li>
                        <li>If a > 0, the parabola opens upward</li>
                        <li>If a < 0, the parabola opens downward</li>
                        <li>The vertex is at x = -b/(2a)</li>
                        <li>The axis of symmetry is x = -b/(2a)</li>
                    </ul>
                    <h3>Standard Forms:</h3>
                    <p>1. <strong>Standard form:</strong> f(x) = ax² + bx + c</p>
                    <p>2. <strong>Vertex form:</strong> f(x) = a(x - h)² + k</p>
                    <p>3. <strong>Factored form:</strong> f(x) = a(x - r₁)(x - r₂)</p>
                    <h3>Finding Roots:</h3>
                    <p>Use the quadratic formula: x = (-b ± √(b² - 4ac))/(2a)</p>
                `
            },
            '1.3': {
                title: 'Exponential Functions',
                content: `
                    <h3>Exponential Functions</h3>
                    <p>An exponential function has the form:</p>
                    <p><strong>f(x) = a·bˣ</strong></p>
                    <p>Where a > 0, b > 0, and b ≠ 1</p>
                    <h3>Properties:</h3>
                    <ul>
                        <li>Domain: all real numbers</li>
                        <li>Range: (0, ∞) if a > 0</li>
                        <li>Horizontal asymptote at y = 0</li>
                        <li>If b > 1, the function is increasing (exponential growth)</li>
                        <li>If 0 < b < 1, the function is decreasing (exponential decay)</li>
                    </ul>
                    <h3>Common Forms:</h3>
                    <p>1. <strong>Natural exponential:</strong> f(x) = aeˣ</p>
                    <p>2. <strong>Compound interest:</strong> A = P(1 + r/n)^(nt)</p>
                    <p>3. <strong>Population growth:</strong> P(t) = P₀e^(rt)</p>
                    <h3>Applications:</h3>
                    <ul>
                        <li>Population growth and decay</li>
                        <li>Radioactive decay</li>
                        <li>Compound interest</li>
                        <li>Bacterial growth</li>
                    </ul>
                `
            },
            '1.4': {
                title: 'Logarithmic Functions',
                content: `
                    <h3>Logarithmic Functions</h3>
                    <p>A logarithmic function is the inverse of an exponential function:</p>
                    <p><strong>f(x) = log_b(x)</strong></p>
                    <p>Where b > 0, b ≠ 1, and x > 0</p>
                    <h3>Properties:</h3>
                    <ul>
                        <li>Domain: (0, ∞)</li>
                        <li>Range: all real numbers</li>
                        <li>Vertical asymptote at x = 0</li>
                        <li>Passes through (1, 0) and (b, 1)</li>
                    </ul>
                    <h3>Logarithm Laws:</h3>
                    <ul>
                        <li>log_b(xy) = log_b(x) + log_b(y)</li>
                        <li>log_b(x/y) = log_b(x) - log_b(y)</li>
                        <li>log_b(x^n) = n·log_b(x)</li>
                        <li>log_b(1) = 0</li>
                        <li>log_b(b) = 1</li>
                    </ul>
                    <h3>Common Logarithms:</h3>
                    <p>1. <strong>Common log:</strong> log(x) = log₁₀(x)</p>
                    <p>2. <strong>Natural log:</strong> ln(x) = log_e(x)</p>
                    <h3>Change of Base Formula:</h3>
                    <p>log_b(x) = ln(x)/ln(b) = log(x)/log(b)</p>
                `
            }
        },
        'physics': {
            '1.1': {
                title: 'Motion in One Dimension',
                content: `
                    <h3>Motion in One Dimension</h3>
                    <p>Motion in one dimension involves movement along a straight line.</p>
                    <h3>Key Concepts:</h3>
                    <ul>
                        <li><strong>Position (x):</strong> Location of an object</li>
                        <li><strong>Displacement (Δx):</strong> Change in position</li>
                        <li><strong>Distance:</strong> Total path traveled</li>
                        <li><strong>Speed:</strong> Rate of change of distance</li>
                        <li><strong>Velocity (v):</strong> Rate of change of position</li>
                        <li><strong>Acceleration (a):</strong> Rate of change of velocity</li>
                    </ul>
                    <h3>Kinematic Equations:</h3>
                    <p>For constant acceleration:</p>
                    <ul>
                        <li>v = v₀ + at</li>
                        <li>x = x₀ + v₀t + ½at²</li>
                        <li>v² = v₀² + 2a(x - x₀)</li>
                        <li>x = x₀ + ½(v₀ + v)t</li>
                    </ul>
                    <h3>Types of Motion:</h3>
                    <ul>
                        <li><strong>Uniform motion:</strong> Constant velocity (a = 0)</li>
                        <li><strong>Uniformly accelerated motion:</strong> Constant acceleration</li>
                        <li><strong>Free fall:</strong> Motion under gravity (a = g = 9.8 m/s²)</li>
                    </ul>
                `
            },
            '1.2': {
                title: 'Motion in Two Dimensions',
                content: `
                    <h3>Motion in Two Dimensions</h3>
                    <p>Motion in two dimensions involves movement in a plane, described by x and y coordinates.</p>
                    <h3>Vector Components:</h3>
                    <ul>
                        <li>Position: r⃗ = x î + y ĵ</li>
                        <li>Velocity: v⃗ = vₓ î + vᵧ ĵ</li>
                        <li>Acceleration: a⃗ = aₓ î + aᵧ ĵ</li>
                    </ul>
                    <h3>Projectile Motion:</h3>
                    <p>Motion under constant acceleration (gravity) with initial velocity at an angle.</p>
                    <ul>
                        <li>Horizontal motion: x = v₀ₓt</li>
                        <li>Vertical motion: y = v₀ᵧt - ½gt²</li>
                        <li>Range: R = (v₀²sin(2θ))/g</li>
                        <li>Maximum height: H = (v₀²sin²(θ))/(2g)</li>
                        <li>Time of flight: T = (2v₀sin(θ))/g</li>
                    </ul>
                    <h3>Circular Motion:</h3>
                    <ul>
                        <li>Centripetal acceleration: aᶜ = v²/r</li>
                        <li>Angular velocity: ω = v/r</li>
                        <li>Period: T = 2πr/v = 2π/ω</li>
                    </ul>
                `
            }
        },
        'chemistry': {
            '1.1': {
                title: 'Ionic Bonding',
                content: `
                    <h3>Ionic Bonding</h3>
                    <p>Ionic bonding occurs between metals and non-metals through electron transfer.</p>
                    <h3>Formation Process:</h3>
                    <ul>
                        <li>Metal atoms lose electrons to form positive cations</li>
                        <li>Non-metal atoms gain electrons to form negative anions</li>
                        <li>Opposite charges attract, forming ionic bonds</li>
                    </ul>
                    <h3>Properties of Ionic Compounds:</h3>
                    <ul>
                        <li>High melting and boiling points</li>
                        <li>Conduct electricity when molten or dissolved</li>
                        <li>Brittle and crystalline structure</li>
                        <li>Many are soluble in polar solvents like water</li>
                        <li>Form crystal lattices</li>
                    </ul>
                    <h3>Examples:</h3>
                    <ul>
                        <li>NaCl (sodium chloride) - table salt</li>
                        <li>MgO (magnesium oxide)</li>
                        <li>CaF₂ (calcium fluoride)</li>
                        <li>Al₂O₃ (aluminum oxide)</li>
                    </ul>
                    <h3>Lattice Energy:</h3>
                    <p>The energy required to completely separate one mole of ionic solid into gaseous ions.</p>
                    <p>Higher lattice energy means stronger ionic bonds.</p>
                `
            },
            '1.2': {
                title: 'Covalent Bonding',
                content: `
                    <h3>Covalent Bonding</h3>
                    <p>Covalent bonding occurs between non-metals through electron sharing.</p>
                    <h3>Types of Covalent Bonds:</h3>
                    <ul>
                        <li><strong>Single bond:</strong> Sharing one pair of electrons (C-C)</li>
                        <li><strong>Double bond:</strong> Sharing two pairs of electrons (C=C)</li>
                        <li><strong>Triple bond:</strong> Sharing three pairs of electrons (C≡C)</li>
                    </ul>
                    <h3>Bond Polarity:</h3>
                    <ul>
                        <li><strong>Nonpolar covalent:</strong> Equal sharing (same atoms)</li>
                        <li><strong>Polar covalent:</strong> Unequal sharing (different atoms)</li>
                        <li>Electronegativity difference determines polarity</li>
                    </ul>
                    <h3>Properties of Covalent Compounds:</h3>
                    <ul>
                        <li>Lower melting and boiling points than ionic</li>
                        <li>Poor electrical conductors</li>
                        <li>Can be gases, liquids, or solids at room temperature</li>
                        <li>Many are insoluble in water but soluble in organic solvents</li>
                    </ul>
                    <h3>Lewis Structures:</h3>
                    <p>Diagrams showing valence electrons and bonding in molecules.</p>
                    <ul>
                        <li>Dots represent electrons</li>
                        <li>Lines represent bonds</li>
                        <li>Octets are usually completed</li>
                    </ul>
                `
            }
        }
    };

    return lessons[subject] && lessons[subject][lessonId] 
        ? lessons[subject][lessonId] 
        : { title: 'Lesson Not Found', content: '<p>Content coming soon...</p>' };
}

function markComplete() {
    alert('Lesson marked as complete! Progress saved.');
    // Here you would update the lesson status in a real app
}

function takeQuiz() {
    alert('Quiz feature coming soon! This will test your knowledge of the current lesson.');
    // Here you would open a quiz modal or navigate to quiz page
}

function checkAuthState() {
    // Check if payment was completed successfully
    const paymentCompleted = localStorage.getItem('paymentCompleted');
    const subscriptionActive = localStorage.getItem('subscriptionActive');
    
    if (paymentCompleted === 'true' && subscriptionActive === 'true') {
        // Restore user session after successful payment
        const savedUser = localStorage.getItem('currentUser');
        const savedPlan = localStorage.getItem('selectedPlan');
        
        if (savedUser && savedPlan) {
            isAuthenticated = true;
            currentUser = JSON.parse(savedUser);
            selectedPlan = JSON.parse(savedPlan);
            
            // Clear the payment completed flag
            localStorage.removeItem('paymentCompleted');
            
            updateAuthUI();
            
            // Show success message and redirect to dashboard
            setTimeout(() => {
                alert('Welcome back! Your subscription is now active.');
                showDashboard();
            }, 1000);
            
            return;
        }
    }
    
    updateAuthUI();
}

// Utility functions
function switchToSignUp() {
    // This would switch the modal to sign-up mode
    alert('Sign-up form would be shown here');
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.selectPlan = selectPlan;
window.showAuthModal = showAuthModal;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.showPhoneAuth = showPhoneAuth;
window.showMainAuth = showMainAuth;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.switchToSignUp = switchToSignUp;
window.showDashboard = showDashboard;
window.logout = logout;
window.openSubject = openSubject;
window.backToDashboard = backToDashboard;
window.backToSubject = backToSubject;
window.openLesson = openLesson;
window.markComplete = markComplete;
window.takeQuiz = takeQuiz;
