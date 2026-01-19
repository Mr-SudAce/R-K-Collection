function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;

    const products = window.wishlist || [];
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #999;">
                <p style="font-size: 1.2rem;">Your wishlist is empty.</p>
                <a href="#productGrid" style="color: var(--primary-color); text-decoration: underline; margin-top: 10px; display: inline-block;">Browse Products</a>
            </div>
        `;
        return;
    }

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const discountBadge = item.discount ? `<div class="discount_badge">-${item.discount}%</div>` : "";
        
        card.innerHTML = `
        <div class="cardbox">
            ${discountBadge}
            <img src="${item.product_image}" class="product_image" alt="${item.product_name}">
            <div class="product-info">
                <p class="product_title">${item.product_name}</p>
                <p class="product_price">₹${item.product_price}</p>
                <div class="product-actions">
                    <button class="btn-add-cart remove-wishlist-btn">Remove</button>
                </div>
            </div>
        </div>
        `;

        // Remove button logic
        const removeBtn = card.querySelector('.remove-wishlist-btn');
        removeBtn.addEventListener('click', () => {
            window.toggleWishlist(item);
        });

        grid.appendChild(card);
    });
}

window.addEventListener('wishlistUpdated', renderWishlist);
renderWishlist();