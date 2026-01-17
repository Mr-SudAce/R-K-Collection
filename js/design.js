let allPicture = [];

fetch("json/design.json")
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

    allPicture.forEach(images => {
        const imageCard = document.createElement("div");
        imageCard.classList.add("imgCard");

        imageCard.innerHTML = `
        <img src="${images.pictureUrl}" alt="img">
        <p>${images.description}</p>
        `;

        parent.appendChild(imageCard);
    });
}
