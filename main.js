// title
document.title = "R & K Collections";

// favicon
const favicon = document.querySelector("link[rel='icon']");
favicon.href = "images/rklogo.jpeg";


// content
// common
// navbar
fetch('content/common/navbar.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    });

// footer
fetch('content/common/footer.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    });