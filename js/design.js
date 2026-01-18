let allPicture = [];

fetch("json/product.json")
    .then(r => r.json())
    .then(picture => {
        pictureRender(picture);
    })
    .catch(err => {
        console.log("JSON error:", err);
    });

function pictureRender(allPicture) {
    const parent = document.getElementById("design-parent");

    if (!parent) {
        console.error("Element 'design-parent' not found");
        return;
    }

    parent.innerHTML = "";

    allPicture.slice(-3).forEach(images => {
        const imageCard = document.createElement("div");
        imageCard.classList.add("imgCard");

        imageCard.innerHTML = `
        <p class="design_title">${images.product_name}</p>
        <img src="${images.product_image}" alt="img">
        <p>${images.product_desc}</p>
        `;

        parent.appendChild(imageCard);
    });
}
