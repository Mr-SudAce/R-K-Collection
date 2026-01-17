let allPicture = [];

fetch("json/product.json")
    .then(r => r.json())
    .then(picture => {
        allPicture = picture;
        console.log("JSON loaded:", allPicture);
        pictureRender(allPicture);
    })
    .catch(err => {
        console.log("JSON error:", err);
    });

function pictureRender(allPicture) {
    const parent = document.getElementById("design-parent");

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
