// toggle menu for mobile view 
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }, 100);

    // Handle hash-based navigation with smooth scroll
    handleHashNavigation();
});

// Handle navigation based on hash
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
                closeNavMenu();
            }, 100);
        }
    }
}

// Close navigation menu
function closeNavMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

// Handle hash change
window.addEventListener('hashchange', handleHashNavigation);

// Smooth scroll for all anchor links in navbar
document.addEventListener('click', (e) => {
    if (e.target.matches('nav a[href^="#"]')) {
        const href = e.target.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeNavMenu();
                window.history.pushState(null, null, href);
            }
        }
    }
});

// Render Wishlist Dropdown Function
function renderWishlistDropdown() {
    let container = document.getElementById('wishlist-box');
    if (!container) container = document.getElementById('nav-wishlist-container');
    if (!container) return;

    const wishlist = window.wishlist || [];
    const count = wishlist.length;
    
    // Main Link
    const linkHTML = `<a href="#wishlist-section" class="wishlist-link" id="nav-wishlist-link">❤️ Wishlist ${count > 0 ? `(${count})` : ''}</a>`;
    
    // Dropdown Content
    let dropdownContent = '';
    if (count === 0) {
        dropdownContent = '<div class="wishlist-empty-msg">Your wishlist is empty</div>';
    } else {
        const itemsHTML = wishlist.map((item, index) => `
            <div class="wishlist-dropdown-item">
                <img src="${item.product_image}" class="wishlist-dropdown-img" alt="${item.product_name}">
                <div class="wishlist-dropdown-info">
                    <h4 class="wishlist-dropdown-title">${item.product_name}</h4>
                    <p class="wishlist-dropdown-price">₹${item.product_price}</p>
                </div>
                <button class="wishlist-dropdown-remove" data-index="${index}">&times;</button>
            </div>
        `).join('');
        dropdownContent = itemsHTML + `<a href="#wishlist-section" class="wishlist-view-btn">View Full Wishlist</a>`;
    }

    container.innerHTML = `
        ${linkHTML}
        <div class="wishlist-dropdown">
            ${dropdownContent}
        </div>
    `;

    // Add event listeners for remove buttons
    const removeBtns = container.querySelectorAll('.wishlist-dropdown-remove');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const item = wishlist[index];
            if(item) {
                window.toggleWishlist(item);
            }
        });
    });
}

// Initialize Wishlist Dropdown and listen for updates
window.addEventListener('wishlistUpdated', renderWishlistDropdown);

const initWishlist = setInterval(() => {
    if (document.getElementById('wishlist-box')) {
        renderWishlistDropdown();
        clearInterval(initWishlist);
    }
}, 100);
