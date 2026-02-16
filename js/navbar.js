
try {
    const savedWishlist = localStorage.getItem('wishlist');
    window.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
} catch (e) {
    console.error("Error loading wishlist:", e);
    window.wishlist = [];
}

// Save to LocalStorage on update
window.addEventListener('wishlistUpdated', () => {
    localStorage.setItem('wishlist', JSON.stringify(window.wishlist));
});

// Global Toggle Function
window.toggleWishlist = function(product) {
    if (!window.wishlist) window.wishlist = [];
    const index = window.wishlist.findIndex(p => p.id === product.id);
    if (index > -1) {
        window.wishlist.splice(index, 1);
    } else {
        window.wishlist.push(product);
    }
    window.dispatchEvent(new Event('wishlistUpdated'));
};

// Trigger initial update to sync UI
setTimeout(() => window.dispatchEvent(new Event('wishlistUpdated')), 50);

// Toggle menu for mobile view 
document.addEventListener('click', (e) => {
    const menuToggle = e.target.closest('#menuToggle');
    if (menuToggle) {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    }
});

// Handle hash-based navigation with smooth scroll
handleHashNavigation();

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

function closeNavMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

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
    
    const linkHTML = `<a href="#wishlist-container" class="wishlist-link" id="nav-wishlist-link"> ❤️ Wishlist ${count > 0 ? `[${count}]` : ''}</a>`;
    
    // Dropdown Content
    let dropdownContent = '';
    if (count === 0) {
        dropdownContent = '<div class="wishlist-empty-msg">Your wishlist is empty</div>';
    } else {
        const itemsHTML = wishlist.map((item, index) => `
            <div class="wishlist-dropdown-item">
                <img src="${item.product_image || (item.images?.[0]?.image1) || 'images/rklogo.jpeg'}" class="wishlist-dropdown-img" alt="${item.name}">
                <div class="wishlist-dropdown-info">
                    <h4 class="wishlist-dropdown-title">${item.name}</h4>
                    <p class="wishlist-dropdown-price">Rs.${item.discounted_price || item.price}</p>
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

    // Remove button logic
    const removeBtns = container.querySelectorAll('.wishlist-dropdown-remove');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const item = wishlist[index];
            if(item) {
                window.toggleWishlist(item);            }
        });
    });
}
window.addEventListener('wishlistUpdated', renderWishlistDropdown);

const initWishlist = setInterval(() => {
    if (document.getElementById('wishlist-box') || document.getElementById('nav-wishlist-container')) {
        renderWishlistDropdown();
        clearInterval(initWishlist);
    }
}, 100);



// Open full wishlist panel
document.addEventListener('click', (e) => {
    if (e.target.matches('.wishlist-view-btn')) {
        e.preventDefault();
        openWishlistPanel();
    }
});

// Function to create panel HTML if it doesn't exist
function createWishlistPanel() {
    if (document.getElementById('wishlist-panel')) return;

    const panelHTML = `
        <div id="wishlist-overlay"></div>
        <div id="wishlist-panel">
            <div class="wishlist-panel-header">
                <h3>Your Wishlist</h3>
                <button id="wishlist-panel-close">&times;</button>
            </div>
            <div id="wishlist-panel-content">
                <!-- Items will be injected here -->
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Attach event listeners for closing
    document.getElementById('wishlist-panel-close').addEventListener('click', closeWishlistPanel);
    document.getElementById('wishlist-overlay').addEventListener('click', closeWishlistPanel);
}

function openWishlistPanel() {
    createWishlistPanel(); // Ensure elements exist
    
    const panel = document.getElementById('wishlist-panel');
    const overlay = document.getElementById('wishlist-overlay');
    
    renderWishlistPanelItems();

    // Use timeout to allow DOM update before transition
    setTimeout(() => {
        panel.classList.add('active');
        overlay.classList.add('active');
    }, 10);
}

function closeWishlistPanel() {
    const panel = document.getElementById('wishlist-panel');
    const overlay = document.getElementById('wishlist-overlay');
    if (panel) panel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function renderWishlistPanelItems() {
    const content = document.getElementById('wishlist-panel-content');
    if (!content) return;

    const wishlist = window.wishlist || [];
    
    if (wishlist.length === 0) {
        content.innerHTML = '<p class="wishlist-empty-msg">Your wishlist is empty.</p>';
    } else {
        content.innerHTML = wishlist.map((item, index) => `
            <div class="wishlist-panel-item" style="display:flex; align-items:center; gap:15px; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #f5f5f5;">
                <img src="${item.product_image || (item.images?.[0]?.image1) || 'images/rklogo.jpeg'}" alt="${item.name}" style="width:70px; height:85px; object-fit:contain; border-radius:4px;">
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px 0; font-size:0.95rem; color:#333;">${item.name}</h4>
                    <p style="margin:0; color:#666; font-weight:500;">Rs.${item.discounted_price || item.price}</p>
                </div>
                <button class="wishlist-panel-remove" data-index="${index}" style="background:none; border:none; color:#999; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        content.querySelectorAll('.wishlist-panel-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                const item = wishlist[index];
                if (item) {
                    window.toggleWishlist(item);
                }
            });
        });
    }
}

// Listen for updates to refresh panel if open
window.addEventListener('wishlistUpdated', () => {
    const panel = document.getElementById('wishlist-panel');
    if (panel && panel.classList.contains('active')) {
        renderWishlistPanelItems();
    }
});
