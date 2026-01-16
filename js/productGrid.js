fetch('json/product.json')
    .then(r => r.json())
    .then(products => {
        renderProducts(products);
    })
    .catch(error => {
        console.log("Error loading JSON file:", error);
    });


function renderProducts(products){
    const gridProduct = document.getElementById("gridProduct");

    
    products.forEach(item => { 
        const card = document.createElement("div");
        card.classList.add("cards");
        card.innerHTML = `
        <div id="cardbox">
            <img src="${item.product_image}"
                 class="product_image"
                 alt="${item.product_name}">

            <p class="product_title">${item.product_name}</p>
            <p class="product_price">Rs. ${item.product_price}</p>
            <p class="product_detail">${item.clothes_type}</p>
        </div>`;

        gridProduct.appendChild(card);
        console.log("this is the product data:",item.id )
    });
}