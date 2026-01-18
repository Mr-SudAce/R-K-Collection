// let allProducts = [];

// Fetch products and organize by season
fetch("json/product.json")
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        organizeBySeasons(allProducts);
    })
    .catch(err => {
        console.log("JSON error:", err)
    })

// Organize products by season
function organizeBySeasons(products) {
    const seasons = {
        spring: [],
        summer: [],
        autumn: [],
        winter: []
    };

    // Categorize products by season
    products.forEach(product => {
        // If product has season field, use it
        if (product.season) {
            const season = product.season.toLowerCase();
            if (seasons[season]) {
                seasons[season].push(product);
            } else {
                // Fallback: assign to spring if invalid season
                seasons['spring'].push(product);
            }
        } else {
            // Fallback: categorize based on clothes_type or colors
            const season = categorizeByType(product);
            seasons[season].push(product);
        }
    });

    // Render each season
    renderSeason('spring', seasons.spring);
    renderSeason('summer', seasons.summer);
    renderSeason('autumn', seasons.autumn);
    renderSeason('winter', seasons.winter);
}

// Fallback function to categorize by clothing type
function categorizeByType(product) {
    const type = product.clothes_type ? product.clothes_type.toLowerCase() : '';

    // Spring: light fabrics
    if (type.includes('cotton') || type.includes('linen')) {
        return 'spring';
    }
    // Summer: very light fabrics
    if (type.includes('silk') || type.includes('cotton')) {
        return 'summer';
    }
    // Autumn: medium weight
    if (type.includes('wool') || type.includes('linen')) {
        return 'autumn';
    }
    // Winter: heavy fabrics
    if (type.includes('velvet') || type.includes('wool')) {
        return 'winter';
    }

    // Default distribution
    return 'spring';
}

// Render products for a specific season
function renderSeason(season, products) {
    const container = document.getElementById(`${season}Products`);
    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                <p>Coming soon...</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("collection-card");

        const discountBadge = product.discount ? `<div class="discount_badge">-${product.discount}%</div>` : "";
        const categoryNames = product.product_cat.map(cat => cat.category_name).join(", ");
        const discountedPrice = product.discount
            ? Math.round(product.product_price * (1 - product.discount / 100))
            : product.product_price;

        card.innerHTML = `
            <div class="card-inner">
                ${discountBadge}
                <img src="${product.product_image}" class="collection-product-image" alt="${product.product_name}">
                <div class="card-overlay">
                    <a href="#" class="btn btn-view">View Details</a>
                    <a href="#" class="btn btn-cart">Add to Cart</a>
                </div>
            </div>
            <div class="collection-product-info">
                <h3 class="collection-product-name">${product.product_name}</h3>
                <p class="collection-product-category">${categoryNames}</p>
                <div class="price-section">
                    ${product.discount ? `<span class="original-price">₹${product.product_price}</span>` : ''}
                    <span class="product-price">₹${discountedPrice}</span>
                </div>
                <p class="collection-product-type">${product.clothes_type}</p>
                <div class="color-swatches">
                    ${product.color_verient ? product.color_verient.slice(0, 3).map(color =>
            `<span class="color-swatch" style="background-color: ${getColorCode(color.color)};" title="${color.color}"></span>`
        ).join('') : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Helper function to get color codes
function getColorCode(colorName) {
    const colorMap = {
        'red': '#ff4444',
        'blue': '#4444ff',
        'green': '#44ff44',
        'black': '#000000',
        'white': '#ffffff',
        'yellow': '#ffff00',
        'pink': '#ff69b4',
        'purple': '#9933ff',
        'orange': '#ff8800',
        'brown': '#8b4513',
        'navy': '#001f3f',
        'gray': '#888888',
        'beige': '#f5f5dc',
        'maroon': '#800000',
        'gold': '#ffd700'
    };

    return colorMap[colorName.toLowerCase()] || '#cccccc';
}
