function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;

    const products = window.wishlist || [];
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:50px; color:#999;">
                <p style="font-size:1.2rem;">Your wishlist is empty.</p>
                <a href="#productGrid" style="color:var(--primary-color); text-decoration:underline; margin-top:10px; display:inline-block;">Browse Products</a>
            </div>
        `;
        return;
    }

    const sortedProducts = [...products].reverse();

    sortedProducts.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const discountBadge = item.discount_percent ? `<div class="discount_badge">-${item.discount_percent}%</div>` : "";
        
        card.innerHTML = `
        <div class="cardbox">
            ${discountBadge}
            <img src="${item.images || (item.images?.[0]?.image1) || "images/rklogo.jpeg"}" class="product_image" alt="${item.name}">
            <div class="product-info">
                <p class="product_title">${item.name}</p>
                <p class="product_price">Rs.${item.discounted_price || item.price}</p>
                <div class="product-actions">
                    <button class="btn-add-cart remove-wishlist-btn">Remove</button>
                </div>
            </div>
        </div>
        `;

        const removeBtn = card.querySelector('.remove-wishlist-btn');
        removeBtn.addEventListener('click', () => {
            window.wishlist = window.wishlist.filter(p => p.id !== item.id);
            window.dispatchEvent(new Event('wishlistUpdated'));
        });

        grid.appendChild(card);
    });
}

/* ================================
   LISTENER
================================ */
window.addEventListener('wishlistUpdated', renderWishlist);
renderWishlist();
