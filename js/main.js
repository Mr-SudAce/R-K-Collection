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
    { files: "common/navbar.html", id: "navbar" },
    { files: "common/footer.html", id: "footer" },
    { files: "common/header.html", id: "header" },
    // template
    { files: "ImageSlider.html", id: "imageSlider" },
    { files: "productGrid.html", id: "productGrid" },
    { files: "design.html", id: "design" },
    { files: "collection.html", id: "collection-page", css: "collection.css" },
    { files: "blog.html", id: "blog-section", css: "blog.css" },
    { files: "contact.html", id: "contact-section", css: "contact.css" },
    { files: "aboutus.html", id: "about-section", css: "aboutus.css" },
    { files: "lookbooks.html", id: "lookbooks-section", css: "lookbooks.css" },
    { files: "children.html", id: "children-section", css: "children.css" },
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
            document.getElementById(items.id).innerHTML = html;
        })
        .catch(err => console.error("Error Loading", items.files, err));
});

