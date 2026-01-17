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




