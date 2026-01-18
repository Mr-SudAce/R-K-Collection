let allProducts = [];
let filters = {
    category: 'all',
    price: 10000,
    color: 'all',
    season: 'all'
};

// Fetch JSON
fetch("json/product.json")
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        generateCategoryButtons(allProducts);
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

    // Filter by price
    filtered = filtered.filter(item => item.product_price <= filters.price);

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

        card.innerHTML = `
        <div class="cardbox">
        ${discountBadge}
        <img src="${item.product_image}" class="product_image" alt="${item.product_name}">
        <div class="product-info">
            <p class="product_title">${item.product_name}</p>
            <p class="product_category">${categoryNames}</p>
            <p class="product_price">₹${item.product_price}</p>
            <p class="product_detail">${item.clothes_type}</p>
            <div class="product-actions">
                <button class="btn-add-cart view-details-btn">View Details</button>
                <button class="btn-wishlist">♡</button>
            </div>
        </div>
        </div>
        `;
        
        // Add click event for details
        const viewBtn = card.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', () => showProductDetail(item));
        
        grid.appendChild(card);
    });
}

// Generate Category Buttons Dynamically
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

    // Add 'All' button first
    const allBtn = document.createElement("button");
    allBtn.dataset.category = "all";
    allBtn.textContent = `All`;
    allBtn.classList.add("active");
    categoryContainer.appendChild(allBtn);

    // Add buttons for each category
    categories.forEach(catName => {
        const count = products.filter(item =>
            item.product_cat.some(cat => cat.category_name.toLowerCase() === catName)
        ).length;

        const btn = document.createElement("button");
        btn.dataset.category = catName;
        btn.textContent = `${capitalize(catName)} (${count})`;
        categoryContainer.appendChild(btn);
    });

    // Add click event listener
    const categoryButtons = categoryContainer.querySelectorAll("button");
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filters.category = btn.dataset.category;
            applyFilters();
        });
    });
}

// Generate Season Filters
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

    // Add 'All' option first
    const allLabel = document.createElement("label");
    const allRadio = document.createElement("input");
    allRadio.type = "radio";
    allRadio.name = "season";
    allRadio.value = "all";
    allRadio.checked = true;
    allLabel.appendChild(allRadio);
    allLabel.appendChild(document.createTextNode("All"));
    seasonContainer.appendChild(allLabel);

    // Add season options
    seasons.forEach(seasonName => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "season";
        radio.value = seasonName;
        radio.addEventListener("change", (e) => {
            filters.season = e.target.value;
            applyFilters();
        });
        label.appendChild(radio);
        label.appendChild(document.createTextNode(capitalize(seasonName)));
        seasonContainer.appendChild(label);
    });
}

// Generate Color Filters
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

    // Add 'All' option first
    const allLabel = document.createElement("label");
    const allCheckbox = document.createElement("input");
    allCheckbox.type = "radio";
    allCheckbox.name = "color";
    allCheckbox.value = "all";
    allCheckbox.checked = true;
    allLabel.appendChild(allCheckbox);
    allLabel.appendChild(document.createTextNode("All"));
    colorContainer.appendChild(allLabel);

    // Add color options
    colors.forEach(colorName => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.name = "color";
        checkbox.value = colorName;
        checkbox.addEventListener("change", (e) => {
            filters.color = e.target.value;
            applyFilters();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(capitalize(colorName)));
        colorContainer.appendChild(label);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Price range slider
    const priceSlider = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");

    if (priceSlider) {
        priceSlider.addEventListener("input", (e) => {
            filters.price = e.target.value;
            priceValue.textContent = e.target.value;
            applyFilters();
        });
    }

    // Reset filters button
    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            filters = {
                category: 'all',
                price: 10000,
                color: 'all',
                season: 'all'
            };
            if (priceSlider) priceSlider.value = 10000;
            if (priceValue) priceValue.textContent = 10000;

            // Reset category buttons
            const categoryButtons = document.querySelectorAll("#categoryFilter button");
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            categoryButtons[0].classList.add("active");

            // Reset color radios
            const colorRadios = document.querySelectorAll("input[name='color']");
            colorRadios.forEach(radio => radio.checked = radio.value === 'all');

            // Reset season radios
            const seasonRadios = document.querySelectorAll("input[name='season']");
            seasonRadios.forEach(radio => radio.checked = radio.value === 'all');

            renderProducts(allProducts);
        });
    }
}

// Helper function to capitalize
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
