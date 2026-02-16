Domain_api_URL = "http://127.0.0.1:8000/api/";
Product_api_URL = Domain_api_URL + "products/";
Brand_api_URL = Domain_api_URL + "brands/";
Category_api_URL = Domain_api_URL + "categories/";
Variant_api_URL = Domain_api_URL + "variants/";
Other_detail_api_URL = Domain_api_URL + "otherdetails/";
kidcollection_api_URL = Domain_api_URL + "kids-collections/";
Blog_api_URL = Domain_api_URL + "blogs/";






// favicon

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
    { files: "common/navbar.html", id: "navbar", css: "navbar.css", js: "js/navbar.js" },
    { files: "common/footer.html", id: "footer" },
    { files: "common/header.html", id: "header" },
    // template
    { files: "productGrid.html", id: "productGrid", js: "js/productGrid.js" },
    { files: "collection.html", id: "collection-page", css: "collection.css", js: "js/collection.js" },
    { files: "blog.html", id: "blog-section", css: "blog.css", js: "js/blog.js" },
    { files: "contact.html", id: "contact-section", css: "contact.css", js: "js/contact.js" },
    { files: "aboutus.html", id: "about-section", css: "aboutus.css", js: "js/about.js" },
    { files: "children.html", id: "children-section", css: "children.css", js: "js/children.js" },
    { files: "wishlist.html", id: "wishlist-box", css: "wishlist.css", js: "js/wishlist.js" },
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
        .catch(err => { console.log("Error Loading", err) });
});

