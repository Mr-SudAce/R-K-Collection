/* ================================
   SHOW PRODUCT DETAIL MODAL
================================ */
function showProductDetail(product) {
    // Remove existing modal if any
    const existingModal = document.getElementById('product-detail-modal');
    if (existingModal) existingModal.remove();


    const productImage = product.image || "no image";
    console.log("productImage", productImage);

    /* ===============================
       PRICE
    =============================== */
    const discountedPrice = product.discounted_price || product.price;

    /* ===============================
       VARIANTS (FROM allVariant)
    =============================== */
    // Use nested variants if available, otherwise fallback to global allVariant if it exists
    const productVariants = product.variants || (typeof allVariant !== 'undefined' ? allVariant.filter(v => v.product === product.id) : []);

    const materials = [...new Set(productVariants.map(v => v.material))].filter(Boolean);
    const seasons = [...new Set(productVariants.map(v => v.seasons))].filter(Boolean);
    const colors = [...new Set(productVariants.map(v => v.color))].filter(Boolean);

    /* ===============================
       IMAGES (MAX 4)
    =============================== */
    let images = [];
    if (product.image) {
        images.push(product.image);
    }

    if (product.images?.length > 0) {
        const imgObj = product.images[0];
        images = [...(product.image ? [product.image] : []), imgObj.image1, imgObj.image2, imgObj.image3, imgObj.image4].filter(Boolean);
    }
    images = images.slice(0, 5);
    const mainImageSrc = images[0] || '';

    /* ===============================
       MODAL HTML
    =============================== */
    const modalHTML = `
        <div id="product-detail-modal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image-gallery">
                        <div class="main-image-container">
                            <img src="${mainImageSrc}" alt="${product.name}" id="detail-main-image" style="
                                width: 22rem;
                                height: 22rem;
                                object-fit: contain;
                            ">
                        </div>
                        <div class="thumbnails-container" id="modal-thumbnails"></div>
                    </div>
                    <div class="modal-details">
                        <h2 class="modal-title">${product.name}</h2>
                        <div class="modal-price-area">
                            <span class="modal-price">Rs.${discountedPrice}</span>
                            ${product.discount_percent > 0 ? `<span class="modal-original-price">Rs.${product.price}</span>` : ''}
                            ${product.discount_percent > 0 ? `<span class="modal-discount" style="
                                font-size: 0.5em !important;
                                color: var(--primary-color) !important;
                                font-weight: 900 !important;
                            ">${product.discount_percent}% OFF</span>` : ''}
                        </div>
                        
                        <div class="modal-info-group">
                            <p><strong>Category:</strong> ${product.category?.name || "N/A"}</p>
                            <p><strong>Material:</strong> ${materials.join(", ") || "N/A"}</p>
                            <p><strong>Season:</strong> ${seasons.join(", ") || "All Season"}</p>
                        </div>

                        <div class="modal-colors">
                            <p><strong>Available Colors:</strong></p>
                            <div class="color-options">
                                ${colors.length
            ? colors.map(c =>
                `<span class="color-circle"
                      style="background-color:${c.toLowerCase()};"
                      title="${c}"></span>`
            ).join("")
            : "<span>N/A</span>"
        }
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-add-cart" onclick="window.location.href='#contact-section'">
                                Contact Us
                            </button>
                            <button class="btn btn-outline btn-wishlist" id="modal-wishlist-btn">
                                ${window.wishlist?.some(p => p.id === product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    /* ===============================
       APPEND MODAL
    =============================== */
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('product-detail-modal');
    const closeBtn = modal.querySelector('.modal-close');

    /* ===============================
       THUMBNAILS
    =============================== */
    const thumbContainer = document.getElementById('modal-thumbnails');
    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = "modal-thumb";
        if (index === 0) thumb.classList.add("active");

        thumb.onclick = () => {
            document.getElementById('detail-main-image').src = src;
            modal.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };

        thumbContainer.appendChild(thumb);
    });

    /* ===============================
       WISHLIST BUTTON
    =============================== */
    const wishBtn = document.getElementById('modal-wishlist-btn');
    wishBtn.onclick = () => {
        if (!window.wishlist) window.wishlist = [];

        const exists = window.wishlist.some(p => p.id === product.id);

        if (exists) {
            window.wishlist = window.wishlist.filter(p => p.id !== product.id);
        } else {
            window.wishlist.push(product);
        }

        // Update button text
        wishBtn.textContent = exists ? "Add to Wishlist" : "Remove from Wishlist";

        // Trigger wishlist update
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    /* ===============================
       CLOSE LOGIC
    =============================== */
    const closeModal = () => {
        modal.classList.remove("active");
        setTimeout(() => modal.remove(), 300);
    };
    closeBtn.onclick = closeModal;
    modal.onclick = e => { if (e.target === modal) closeModal(); };
    document.addEventListener("keydown", e => { if (e.key === "Escape" && modal) closeModal(); });

    requestAnimationFrame(() => modal.classList.add("active"));
}
