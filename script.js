// Global variables for data storage
let users = JSON.parse(localStorage.getItem('mbuUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let offers = [
    {
        id: 1,
        title: "First 10 Days Free",
        category: "restaurants",
        description: "Get free meals for the first 10 days at participating restaurants",
        discount: "100% OFF",
        validity: "Valid till Dec 31, 2024",
        code: "MBUFIRST10",
        details: "This offer is valid for new MBU students only. Present your college ID at the restaurant to avail this offer. One offer per student."
    },
    {
        id: 2,
        title: "Weekend Special",
        category: "restaurants",
        description: "50% discount on all weekend meals",
        discount: "50% OFF",
        validity: "Valid on weekends only",
        code: "MBUWEEKEND",
        details: "Enjoy 50% off on all meals during weekends. Valid from Friday 6 PM to Sunday 11 PM."
    },
    {
        id: 3,
        title: "Grocery Cashback",
        category: "grocery",
        description: "Get 20% cashback on grocery shopping",
        discount: "20% CASHBACK",
        validity: "Valid till Jan 31, 2025",
        code: "MBUGROC20",
        details: "Shop for groceries and get 20% cashback credited to your account within 24 hours. Minimum purchase of ₹500 required."
    },
    {
        id: 4,
        title: "Monthly Essentials",
        category: "grocery",
        description: "Special discounts on monthly grocery packages",
        discount: "30% OFF",
        validity: "Valid every month",
        code: "MBUMONTH30",
        details: "Save 30% on pre-packaged monthly grocery essentials. Packages include rice, dal, oil, and other basic necessities."
    },
    {
        id: 5,
        title: "Morning Tea Special",
        category: "tea",
        description: "Buy 1 get 1 free on morning tea",
        discount: "BOGO",
        validity: "Valid 6 AM - 11 AM",
        code: "MBUMORNING",
        details: "Start your day right! Buy one tea and get another absolutely free. Valid only during morning hours."
    },
    {
        id: 6,
        title: "Study Break Tea",
        category: "tea",
        description: "Special combo for study sessions",
        discount: "₹50 OFF",
        validity: "Valid 2 PM - 6 PM",
        code: "MBUSTUDY",
        details: "Perfect for study breaks! Get tea + snacks combo for just ₹50 off. Present your student ID to avail."
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (currentUser) {
        showDashboard();
    } else {
        showHomepage();
    }
    
    // Render offers if on dashboard
    if (document.getElementById('offers-grid')) {
        renderOffers();
    }
});

// Page navigation functions
function showHomepage() {
    hideAllPages();
    document.getElementById('homepage').classList.add('active');
}

function showAuthPage() {
    hideAllPages();
    document.getElementById('auth-page').classList.add('active');
}

function showDashboard() {
    hideAllPages();
    document.getElementById('dashboard').classList.add('active');
    
    // Update user name in dashboard
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
    }
    
    // Render offers
    renderOffers();
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// Authentication form functions
function switchToSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    clearErrors();
}

function switchToLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

// Form validation functions
function validateMBUID(id) {
    // MBU ID format: MBU followed by 7 digits (e.g., MBU2024001)
    const pattern = /^MBU\d{7}$/;
    return pattern.test(id);
}

function validateMobile(mobile) {
    // Indian mobile number format: 10 digits starting with 6,7,8, or 9
    const pattern = /^[6-9]\d{9}$/;
    return pattern.test(mobile);
}

function validatePassword(password) {
    // Password should be at least 6 characters
    return password.length >= 6;
}

// Login handler
function handleLogin(event) {
    event.preventDefault();
    clearErrors();
    
    const id = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    
    let isValid = true;
    
    // Validate MBU ID
    if (!id) {
        document.getElementById('login-id-error').textContent = 'MBU College ID is required';
        isValid = false;
    } else if (!validateMBUID(id)) {
        document.getElementById('login-id-error').textContent = 'Invalid MBU ID format (e.g., MBU2024001)';
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        document.getElementById('login-password-error').textContent = 'Password is required';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check if user exists
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
        // Store current user
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show dashboard
        showDashboard();
    } else {
        document.getElementById('login-password-error').textContent = 'Invalid ID or password';
    }
}

// Signup handler
function handleSignup(event) {
    event.preventDefault();
    clearErrors();
    
    const id = document.getElementById('signup-id').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const mobile = document.getElementById('signup-mobile').value.trim();
    const password = document.getElementById('signup-password').value;
    
    let isValid = true;
    
    // Validate MBU ID
    if (!id) {
        document.getElementById('signup-id-error').textContent = 'MBU College ID is required';
        isValid = false;
    } else if (!validateMBUID(id)) {
        document.getElementById('signup-id-error').textContent = 'Invalid MBU ID format (e.g., MBU2024001)';
        isValid = false;
    } else if (users.find(u => u.id === id)) {
        document.getElementById('signup-id-error').textContent = 'MBU ID already registered';
        isValid = false;
    }
    
    // Validate name
    if (!name) {
        document.getElementById('signup-name-error').textContent = 'Full name is required';
        isValid = false;
    }
    
    // Validate mobile
    if (!mobile) {
        document.getElementById('signup-mobile-error').textContent = 'Mobile number is required';
        isValid = false;
    } else if (!validateMobile(mobile)) {
        document.getElementById('signup-mobile-error').textContent = 'Invalid mobile number';
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        document.getElementById('signup-password-error').textContent = 'Password is required';
        isValid = false;
    } else if (!validatePassword(password)) {
        document.getElementById('signup-password-error').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Create new user
    const newUser = {
        id: id,
        name: name,
        mobile: mobile,
        password: password
    };
    
    // Store user
    users.push(newUser);
    localStorage.setItem('mbuUsers', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show dashboard
    showDashboard();
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showHomepage();
}

// Render offers on dashboard
function renderOffers(category = 'all') {
    const offersGrid = document.getElementById('offers-grid');
    offersGrid.innerHTML = '';
    
    const filteredOffers = category === 'all' 
        ? offers 
        : offers.filter(offer => offer.category === category);
    
    filteredOffers.forEach(offer => {
        const offerCard = createOfferCard(offer);
        offersGrid.appendChild(offerCard);
    });
}

// Create offer card element
function createOfferCard(offer) {
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.onclick = () => showCouponModal(offer);
    
    card.innerHTML = `
        <div class="offer-header">
            <h4 class="offer-title">${offer.title}</h4>
            <span class="offer-category">${getCategoryName(offer.category)}</span>
        </div>
        <p class="offer-description">${offer.description}</p>
        <div class="offer-footer">
            <span class="offer-discount">${offer.discount}</span>
            <span class="offer-validity">${offer.validity}</span>
        </div>
    `;
    
    return card;
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'restaurants': '🍴 Restaurants',
        'grocery': '🛒 Grocery',
        'tea': '☕ Tea'
    };
    return names[category] || category;
}

// Filter offers by category
function filterOffers(category) {
    renderOffers(category);
}

// Show coupon modal
function showCouponModal(offer) {
    const modal = document.getElementById('coupon-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${offer.title}</h2>
        <p style="color: #666; margin-bottom: 20px;">${offer.description}</p>
        <div class="coupon-code">${offer.code}</div>
        <p style="color: #666; margin-bottom: 20px;">${offer.details}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 1.2rem; color: #f5576c; font-weight: bold;">${offer.discount}</span>
            <span style="color: #666; font-size: 0.9rem;">${offer.validity}</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('coupon-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('coupon-modal');
    if (event.target === modal) {
        closeModal();
    }
}