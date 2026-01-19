// Function to create and show product detail modal
function showProductDetail(product) {
    // Remove existing modal if any
    const existingModal = document.getElementById('product-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Calculate discounted price
    const discountedPrice = product.discount
        ? Math.round(product.product_price * (1 - product.discount / 100))
        : product.product_price;

    const isInWishlist = window.wishlist && window.wishlist.some(p => p.product_name === product.product_name);
    const wishlistText = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';

    // Create modal HTML
    const modalHTML = `
        <div id="product-detail-modal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.product_image}" alt="${product.product_name}">
                    </div>
                    <div class="modal-details">
                        <h2 class="modal-title">${product.product_name}</h2>
                        <div class="modal-price-area">
                            <span class="modal-price">Rs.${discountedPrice}</span>
                            ${product.discount ? `<span class="modal-original-price">₹${product.product_price}</span>` : ''}
                            ${product.discount ? `<span class="modal-discount">-${product.discount}% OFF</span>` : ''}
                        </div>
                        
                        <div class="modal-info-group">
                            <p><strong>Category:</strong> ${product.product_cat.map(c => c.category_name).join(', ')}</p>
                            <p><strong>Material:</strong> ${product.clothes_type}</p>
                            <p><strong>Season:</strong> ${product.season || 'All Season'}</p>
                        </div>

                        <div class="modal-colors">
                            <p><strong>Available Colors:</strong></p>
                            <div class="color-options">
                                ${product.color_verient ? product.color_verient.map(c => 
                                    `<span class="color-circle" style="background-color: ${getColorCode(c.color)};" title="${c.color}"></span>`
                                ).join('') : '<span>N/A</span>'}
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-add-cart" onclick="window.location.href = '#contact-section'">Contact Us</button>
                            <button class="btn btn-outline btn-wishlist" id="modal-wishlist-btn">${wishlistText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    const modal = document.getElementById('product-detail-modal');
    const closeBtn = modal.querySelector('.modal-close');

    // Wishlist Logic
    const wishBtn = document.getElementById('modal-wishlist-btn');
    wishBtn.onclick = () => {
        window.toggleWishlist(product);
        const inList = window.wishlist.some(p => p.product_name === product.product_name);
        wishBtn.textContent = inList ? 'Remove from Wishlist' : 'Add to Wishlist';
    };

    // Show modal (small delay to allow CSS transition if added)
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    // Close functions
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('product-detail-modal')) {
            closeModal();
        }
    });
}