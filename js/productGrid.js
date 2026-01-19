let allProducts = [];
let filters = {
    category: 'all',
    clothesType: 'all',
    minPrice: 0,
    maxPrice: 10000,
    color: 'all',
    season: 'all'
};

// Fetch JSON
fetch("json/product.json")
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        generateCategoryButtons(allProducts);
        generateClothesTypeFilters(allProducts);
        generateColorFilters(allProducts);
        generateSeasonFilters(allProducts);
        renderProducts(allProducts);
        setupEventListeners();
    })
    .catch(err => {
        console.log("JSON error:", err)
    })

// Apply all filters
function applyFilters() {
    let filtered = allProducts;

    // Filter by category
    if (filters.category !== 'all') {
        filtered = filtered.filter(item =>
            item.product_cat.some(cat => cat.category_name.toLowerCase() === filters.category)
        );
    }

    // Filter by clothes type
    if (filters.clothesType !== 'all') {
        filtered = filtered.filter(item => item.clothes_type && item.clothes_type.toLowerCase() === filters.clothesType);
    }

    // Filter by price
    filtered = filtered.filter(item => item.product_price >= filters.minPrice && item.product_price <= filters.maxPrice);

    // Filter by color
    if (filters.color !== 'all') {
        filtered = filtered.filter(item =>
            item.color_verient && item.color_verient.some(color => color.color.toLowerCase() === filters.color)
        );
    }

    // Filter by season
    if (filters.season !== 'all') {
        filtered = filtered.filter(item => item.season && item.season.toLowerCase() === filters.season);
    }

    renderProducts(filtered);
}

// Render Products Function
function renderProducts(products) {
    const grid = document.getElementById("gridProduct");
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #999;">
                <p style="font-size: 1.1rem;">No products found matching your filters</p>
            </div>
        `;
        return;
    }

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const discountBadge = item.discount ? `<div class="discount_badge">-${item.discount}%</div>` : "";
        const categoryNames = item.product_cat.map(cat => cat.category_name).join(", ");
        const isInWishlist = window.wishlist && window.wishlist.some(p => p.product_name === item.product_name);
        const heartIcon = isInWishlist ? '❤️' : '♡';

        card.innerHTML = `
        <div class="cardbox">
        ${discountBadge}
        <img src="${item.product_image}" class="product_image" alt="${item.product_name}">
        <div class="product-info">
            <p class="product_title">${item.product_name}</p>
            <p class="product_category">${categoryNames}</p>
            <p class="product_price">Rs.${item.product_price}</p>
            <p class="product_detail">${item.clothes_type}</p>
            <div class="product-actions">
                <button class="btn-add-cart view-details-btn">View Details</button>
                <button class="btn-wishlist">${heartIcon}</button>
            </div>
        </div>
        </div>
        `;
        
        // Add click event for details
        const viewBtn = card.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', () => showProductDetail(item));

        // Add click event for wishlist
        const wishBtn = card.querySelector('.btn-wishlist');
        wishBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.toggleWishlist(item);
            const inList = window.wishlist.some(p => p.product_name === item.product_name);
            wishBtn.textContent = inList ? '❤️' : '♡';
        });
        
        grid.appendChild(card);
    });
}

// Generate Category Dropdown
function generateCategoryButtons(products) {
    const categoryContainer = document.getElementById("categoryFilter");
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";

    // Get unique categories
    const categoriesSet = new Set();
    products.forEach(item => {
        item.product_cat.forEach(cat => categoriesSet.add(cat.category_name.toLowerCase()));
    });
    const categories = Array.from(categoriesSet).sort();

    // Create Select
    const select = document.createElement("select");
    select.className = "filter-dropdown";
    
    // All Option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    select.appendChild(allOption);

    // Category Options
    categories.forEach(catName => {
        const count = products.filter(item =>
            item.product_cat.some(cat => cat.category_name.toLowerCase() === catName)
        ).length;
        const option = document.createElement("option");
        option.value = catName;
        option.textContent = `${capitalize(catName)} (${count})`;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        filters.category = e.target.value;
        applyFilters();
    });

    categoryContainer.appendChild(select);
}

// Generate Clothes Type Dropdown
function generateClothesTypeFilters(products) {
    const typeContainer = document.getElementById("clothesTypeFilter");
    if (!typeContainer) return;
    typeContainer.innerHTML = "";

    // Get unique types
    const typesSet = new Set();
    products.forEach(item => {
        if (item.clothes_type) {
            typesSet.add(item.clothes_type.toLowerCase());
        }
    });
    const types = Array.from(typesSet).sort();

    // Create Select
    const select = document.createElement("select");
    select.className = "filter-dropdown";
    
    // All Option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Types";
    select.appendChild(allOption);

    // Type Options
    types.forEach(typeName => {
        const option = document.createElement("option");
        option.value = typeName;
        option.textContent = capitalize(typeName);
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        filters.clothesType = e.target.value;
        applyFilters();
    });

    typeContainer.appendChild(select);
}

// Generate Season Dropdown
function generateSeasonFilters(products) {
    const seasonContainer = document.getElementById("seasonFilter");
    seasonContainer.innerHTML = "";

    // Get unique seasons
    const seasonsSet = new Set();
    products.forEach(item => {
        if (item.season) {
            seasonsSet.add(item.season.toLowerCase());
        }
    });
    const seasons = Array.from(seasonsSet).sort();

    // Create Select
    const select = document.createElement("select");
    select.className = "filter-dropdown";

    // All Option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Seasons";
    select.appendChild(allOption);

    // Season Options
    seasons.forEach(seasonName => {
        const option = document.createElement("option");
        option.value = seasonName;
        option.textContent = capitalize(seasonName);
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        filters.season = e.target.value;
        applyFilters();
    });

    seasonContainer.appendChild(select);
}

// Generate Color Dropdown
function generateColorFilters(products) {
    const colorContainer = document.getElementById("colorFilter");
    colorContainer.innerHTML = "";

    // Get unique colors
    const colorsSet = new Set();
    products.forEach(item => {
        if (item.color_verient) {
            item.color_verient.forEach(color => {
                colorsSet.add(color.color.toLowerCase());
            });
        }
    });
    const colors = Array.from(colorsSet).sort();

    // Create Select
    const select = document.createElement("select");
    select.className = "filter-dropdown";

    // All Option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Colors";
    select.appendChild(allOption);

    // Color Options
    colors.forEach(colorName => {
        const option = document.createElement("option");
        option.value = colorName;
        option.textContent = capitalize(colorName);
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        filters.color = e.target.value;
        applyFilters();
    });

    colorContainer.appendChild(select);
}

// Setup Event Listeners
function setupEventListeners() {
    // Price range slider
    const priceSlider = document.getElementById("priceRange");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");

    function updatePrices() {
        filters.minPrice = Number(minPriceInput.value) || 0;
        filters.maxPrice = Number(maxPriceInput.value) || 10000;
        applyFilters();
    }

    if (minPriceInput) minPriceInput.addEventListener("input", updatePrices);

    if (maxPriceInput) {
        maxPriceInput.addEventListener("input", () => {
            if (priceSlider) priceSlider.value = maxPriceInput.value;
            updatePrices();
        });
    }

    if (priceSlider && maxPriceInput) {
        priceSlider.addEventListener("input", (e) => {
            maxPriceInput.value = e.target.value;
            updatePrices();
        });
    }

    // Reset filters button
    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            filters = {
                category: 'all',
                clothesType: 'all',
                minPrice: 0,
                maxPrice: 10000,
                color: 'all',
                season: 'all'
            };
            
            if (minPriceInput) minPriceInput.value = 0;
            if (maxPriceInput) maxPriceInput.value = 10000;
            if (priceSlider) priceSlider.value = 10000;

            // Reset category select
            const categorySelect = document.querySelector("#categoryFilter select");
            if(categorySelect) categorySelect.value = 'all';

            // Reset clothes type select
            const typeSelect = document.querySelector("#clothesTypeFilter select");
            if(typeSelect) typeSelect.value = 'all';

            // Reset color select
            const colorSelect = document.querySelector("#colorFilter select");
            if(colorSelect) colorSelect.value = 'all';

            // Reset season select
            const seasonSelect = document.querySelector("#seasonFilter select");
            if(seasonSelect) seasonSelect.value = 'all';

            renderProducts(allProducts);
        });
    }
}

// Helper function to capitalize
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
