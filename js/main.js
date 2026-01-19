// Wishlist Global Logic
window.wishlist = JSON.parse(localStorage.getItem('rk_wishlist')) || [];

window.toggleWishlist = function(product) {
    const index = window.wishlist.findIndex(p => p.product_name === product.product_name);
    
    if (index === -1) {
        window.wishlist.push(product);
        alert("Added to wishlist!");
    } else {
        window.wishlist.splice(index, 1);
        alert("Removed from wishlist!");
    }
    localStorage.setItem('rk_wishlist', JSON.stringify(window.wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
};

// title
document.title = "R & K Collections";

// favicon
const favicon = document.querySelector("link[rel='icon']");
favicon.href = "images/rklogo.jpeg";

// Function to load CSS dynamically
function loadCSS(filename) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/" + filename;
    document.head.appendChild(link);
}

// content
const file = [
    // common
    { files: "common/navbar.html", id: "navbar", css: "navbar.css" },
    { files: "common/footer.html", id: "footer" },
    { files: "common/header.html", id: "header" },
    // template
    { files: "productGrid.html", id: "productGrid", js: "js/productGrid.js" },
    { files: "design.html", id: "design", js: "js/design.js" },
    { files: "collection.html", id: "collection-page", css: "collection.css", js: "js/collection.js" },
    { files: "blog.html", id: "blog-section", css: "blog.css", js: "js/blog.js" },
    { files: "contact.html", id: "contact-section", css: "contact.css", js: "js/contact.js" },
    { files: "aboutus.html", id: "about-section", css: "aboutus.css", js: "js/about.js" },
    { files: "lookbooks.html", id: "lookbooks-section", css: "lookbooks.css", js: "js/lookbooks.js" },
    { files: "children.html", id: "children-section", css: "children.css", js: "js/children.js" },
    { files: "wishlist.html", id: "wishlist-section", css: "wishlist.css", js: "js/wishlist.js" },
]

// mapped the file so render the file
file.forEach(items => {
    // Load CSS if specified
    if (items.css) {
        loadCSS(items.css);
    }
    
    fetch('templates/' + items.files)
        .then(r => r.text())
        .then(html => {
            const element = document.getElementById(items.id);
            if (element) {
                element.innerHTML = html;
                
                // Load JS if specified
                if (items.js) {
                    const script = document.createElement("script");
                    script.src = items.js;
                    document.body.appendChild(script);
                }
            } else {
                console.warn(`Element with id '${items.id}' not found`);
            }
        })
        .catch(err => {console.log("Error Loading", err)});
});
