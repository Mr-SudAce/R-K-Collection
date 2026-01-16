// title
document.title = "R & K Collections";

// favicon
const favicon = document.querySelector("link[rel='icon']");
favicon.href = "images/rklogo.jpeg";


// content
// common
// navbar
fetch('templates/common/navbar.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    });

// footer
fetch('templates/common/footer.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    });