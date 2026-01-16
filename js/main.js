// title
document.title = "R & K Collections";

// favicon
const favicon = document.querySelector("link[rel='icon']");
favicon.href = "images/rklogo.jpeg";


// content
const file = [
    // common
    { files: "common/navbar.html", id: "navbar" },
    { files: "common/footer.html", id: "footer" },
    // template
    { files: "ImageSlider.html", id: "imageSlider" },
    { files: "productGrid.html", id: "productGrid" },
]

// mapped the file so render the file
file.forEach(items => {
    fetch('templates/' + items.files)
        .then(r => r.text())
        .then(html => {
            document.getElementById(items.id).innerHTML = html;
        })
        .catch(err => console.error("Error Loading", items.files, err));
});

