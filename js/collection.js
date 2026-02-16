// No global variable needed; it's handled properly inside async flow
const loadProductData = async () => {
    try {
        const res = await fetch(Product_api_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch product data");
        }

        const data = await res.json();
        // Ensure we have an array
        const allProducts = Array.isArray(data) ? data : (data.results || []);

        // Organize and render AFTER data is ready
        organizeByVariantSeason(allProducts);

    } catch (err) {
        console.error("Error loading product data:", err);
    }
};

function organizeByVariantSeason(products) {

    const seasons = {
        spring: new Map(),
        summer: new Map(),
        autumn: new Map(),
        winter: new Map()
    };

    products.forEach(product => {

        if (!product.variants || product.variants.length === 0) return;

        product.variants.forEach(variant => {

            if (!variant.seasons) return;

            variant.seasons.split(",").forEach(s => {

                const seasonName = s.trim().toLowerCase();

                if (seasonName === "all season" || seasonName === "all seasons") {
                    ["spring", "summer", "autumn", "winter"].forEach(key => {
                        seasons[key].set(`${product.id}-${variant.id}`, {
                            product,
                            variant
                        });
                    });
                }
                else if (seasons[seasonName]) {
                    seasons[seasonName].set(`${product.id}-${variant.id}`, {
                        product,
                        variant
                    });
                }

            });

        });

    });

    // Render each season
    renderSeason("spring", Array.from(seasons.spring.values()));
    renderSeason("summer", Array.from(seasons.summer.values()));
    renderSeason("autumn", Array.from(seasons.autumn.values()));
    renderSeason("winter", Array.from(seasons.winter.values()));

    setupSliderControls();
}

function renderSeason(season, items) {

    const container = document.getElementById(`${season}Products`);
    if (!container) return;

    const seasonSection = container.closest(".seasonal-collection");

    container.innerHTML = "";

    if (items.length === 0) {
        if (seasonSection) {
            seasonSection.style.display = "none";
        }
        return;
    }

    if (seasonSection) {
        seasonSection.style.display = "block";
    }

    items.forEach(({ product, variant }) => {

        const price = parseFloat(product.price);
        const discountedPrice = product.discounted_price
            ? parseFloat(product.discounted_price)
            : price;

        const card = document.createElement("div");
        card.classList.add("cards");

        const discountBadge = product.discount_percent > 0
            ? `<div class="discount_badge">-${product.discount_percent}%</div>`
            : "";

        card.innerHTML = `
            <div class="cardbox">
                ${discountBadge}
                <img src="${product.image}" class="product_image" alt="${product.name}">
                <div class="product-info">
                    <p class="product_title">${product.name}</p>
                    <p class="product_brand">${product.brand?.name || ""}</p>
                    <button class="btn-add-cart btn view-btn" 
                        ${variant.stock === 0 ? "disabled" : ""}>
                        ${variant.stock === 0 ? "Out of Stock" : "View Details"}
                    </button>
                </div>
            </div>
        `;

        if (variant.stock > 0) {
            card.querySelector(".view-btn").addEventListener("click", () => {
                if (typeof showProductDetail === "function") {
                    showProductDetail(product, variant);
                }
            });
        }

        container.appendChild(card);
    });
}

function setupSliderControls() {

    document.querySelectorAll(".slide-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const season = btn.dataset.season;
            const slider = document.getElementById(`${season}Products`);

            if (!slider) return;

            const direction = btn.classList.contains("prev") ? -1 : 1;

            slider.scrollBy({
                left: 300 * direction,
                behavior: "smooth"
            });

        });

    });
}

// Call async loader
loadProductData();
