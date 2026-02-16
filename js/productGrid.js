/* ================================
   GLOBAL STATE
================================ */
let allProducts = [];
let allVariant = [];
let currentFilteredProducts = [];

let currentPage = 1;
const productsPerPage = 10;

let filters = {
    category: "all",
    brand: "all",
    color: "all",
    season: "all",
    material: "all",
    minPrice: 0,
    maxPrice: 1000000
};

/* ================================
   HELPERS
================================ */
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ================================
   FETCH DATA
================================ */
async function fetchProducts() {
    try {
        const [product_res, variant_res] = await Promise.all([
            fetch(Product_api_URL),
            fetch(Variant_api_URL)
        ]);

        allProducts = await product_res.json();
        allVariant = await variant_res.json();

        currentFilteredProducts = allProducts;

        generateCategoryButtons(allProducts);
        generateBrandFilters(allProducts);
        generateColorFilters(allVariant);
        generateSeasonFilters(allVariant);
        generateMaterialFilters(allVariant);

        renderProducts(currentFilteredProducts);
        setupPriceFilter();
        setupResetButton();

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

fetchProducts();

/* ================================
   CATEGORY FILTER
================================ */
function generateCategoryButtons(products) {
    const container = document.getElementById("categoryFilter");
    container.innerHTML = "";

    const categoriesMap = new Map();
    products.forEach(p => {
        if (!p.category) return;
        const id = p.category.id || p.category || p.category_id;
        const name = p.category.name || p.category_name || (typeof p.category === 'string' ? p.category : `Category ${id}`);
        if (id !== undefined && id !== null) {
            categoriesMap.set(id, { id, name });
        }
    });
    const categories = [...categoriesMap.values()];

    // Dropdown for categories
    const select = document.createElement("select");
    select.className = "filter-dropdown";

    select.innerHTML = `
        <option value="all">All Categories</option>
        ${categories
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join("")}
    `;

    select.addEventListener("change", e => {
        filters.category = e.target.value;
        applyFilters();
    });

    container.appendChild(select);
}

function setActiveButton(activeBtn) {
    document
        .querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
}

function updateActiveCategoryButton(categoryId) {
    const btn = document.querySelector(
        categoryId === "all"
            ? `.filter-btn`
            : `.filter-btn[data-id="${categoryId}"]`
    );
    if (btn) setActiveButton(btn);
}

/* ================================
   BRAND FILTER
================================ */
function generateBrandFilters(products) {
    const container = document.getElementById("brandFilter");
    container.innerHTML = "";

    const brands = [...new Set(
        products
            .filter(p => p.brand)
            .map(p => p.brand.name.toLowerCase())
    )];

    const select = document.createElement("select");
    select.className = "filter-dropdown";
    select.innerHTML = `<option value="all">All Brands</option>`;

    brands.forEach(brand => {
        select.innerHTML += `<option value="${brand}">${capitalize(brand)}</option>`;
    });

    select.addEventListener("change", e => {
        filters.brand = e.target.value;
        applyFilters();
    });

    container.appendChild(select);
}

/* ================================
   COLOR FILTER (FROM VARIANTS)
================================ */
function generateColorFilters(variants) {
    const container = document.getElementById("colorFilter");
    container.innerHTML = "";

    const colors = [...new Set(
        variants.map(v => v.color.toLowerCase())
    )];

    const select = document.createElement("select");
    select.className = "filter-dropdown";
    select.innerHTML = `<option value="all">All Colors</option>`;

    colors.forEach(color => {
        select.innerHTML += `<option value="${color}">${capitalize(color)}</option>`;
    });

    select.addEventListener("change", e => {
        filters.color = e.target.value;
        applyFilters();
    });

    container.appendChild(select);
}

/* ================================
   SEASON FILTER (FROM VARIANTS)
================================ */
function generateSeasonFilters(variants) {
    const container = document.getElementById("seasonFilter");
    container.innerHTML = "";

    const seasons = [...new Set(
        variants.map(v => v.seasons.toLowerCase())
    )];

    const select = document.createElement("select");
    select.className = "filter-dropdown";
    select.innerHTML = `<option value="all">All Seasons</option>`;

    seasons.forEach(season => {
        select.innerHTML += `<option value="${season}">${capitalize(season)}</option>`;
    });

    select.addEventListener("change", e => {
        filters.season = e.target.value;
        applyFilters();
    });

    container.appendChild(select);
}

/* ================================
   MATERIAL FILTER (FROM VARIANTS)
================================ */
function generateMaterialFilters(variants) {
    const container = document.getElementById("materialFilter");
    container.innerHTML = "";

    const materials = [...new Set(
        variants
            .filter(v => v.material)
            .map(v => v.material.toLowerCase())
    )];

    const select = document.createElement("select");
    select.className = "filter-dropdown";
    select.innerHTML = `<option value="all">All Materials</option>`;

    materials.forEach(mat => {
        select.innerHTML += `<option value="${mat}">${capitalize(mat)}</option>`;
    });

    select.addEventListener("change", e => {
        filters.material = e.target.value;
        applyFilters();
    });

    container.appendChild(select);
}

/* ================================
   PRICE FILTER (Dual Slider + Input)
================================ */
function setupPriceFilter() {
    const minInput = document.getElementById("minPrice");
    const maxInput = document.getElementById("maxPrice");

    // Sync inputs with current filter state
    if (minInput) minInput.value = filters.minPrice;
    if (maxInput) maxInput.value = filters.maxPrice;

    // Create warning element
    let warning = document.createElement("p");
    warning.id = "price-warning";
    warning.style.color = "red";
    warning.style.fontSize = "0.85rem";
    warning.style.marginTop = "2px";
    minInput.parentElement.parentElement.appendChild(warning);

    function checkAndApply() {
        const minVal = Number(minInput.value) || 0;
        const maxVal = Number(maxInput.value) || 0;

        if (maxVal < minVal) {
            warning.innerHTML = '<p style="margin:0; font-size:0.6rem; position:absolute;">⚠︎ Max price must be greater than Min price!</p>';
        } else {
            warning.innerHTML = "";
        }

        filters.minPrice = minVal;
        filters.maxPrice = maxVal;
        applyFilters();
    }

    minInput.addEventListener("input", checkAndApply);
    maxInput.addEventListener("input", checkAndApply);
}

/* ================================
   RESET FILTER BUTTON
================================ */
function setupResetButton() {
    const resetBtn = document.getElementById('resetFilters');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Try to reset form if it exists
        const filterForm = document.getElementById('filterForm');
        if (filterForm) filterForm.reset();

        // Reset all dropdowns
        const selects = document.querySelectorAll('select.filter-dropdown');
        selects.forEach(s => s.value = "all");

        // Reset checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        // Reset Price Inputs
        const minInput = document.getElementById("minPrice");
        const maxInput = document.getElementById("maxPrice");
        if (minInput) minInput.value = 0;
        if (maxInput) maxInput.value = 1000000;

        // Clear Price Warning
        const warning = document.getElementById("price-warning");
        if (warning) warning.innerHTML = "";

        // Reset Filter State
        filters = {
            category: "all",
            brand: "all",
            color: "all",
            season: "all",
            material: "all",
            minPrice: 0,
            maxPrice: 1000000
        };

        // Update active button UI
        updateActiveCategoryButton("all");

        currentFilteredProducts = allProducts;
        currentPage = 1;
        renderProducts(currentFilteredProducts);
    });
}



/* ================================
   APPLY FILTERS
================================ */
function applyFilters() {
    let filtered = [...allProducts];

    // Category
    if (filters.category !== 'all') {
        filtered = filtered.filter(p => {
            const catId = p.category?.id || p.category || p.category_id;
            return catId == filters.category;
        });
    }

    // Brand
    if (filters.brand !== 'all') {
        filtered = filtered.filter(p => {
            const brandName = p.brand?.name || p.brand || p.brand_name;
            return brandName && String(brandName).toLowerCase() === filters.brand;
        });
    }

    // Price filter using discounted price if available
    filtered = filtered.filter(item => {
        let rawPrice = item.discounted_price && item.discounted_price > 0
            ? item.discounted_price
            : (item.product_price || item.price);

        // Strip non-numeric characters (keep digits and dot)
        const cleanPrice = String(rawPrice).replace(/[^0-9.]/g, '');
        const finalPrice = Number(cleanPrice) || 0;

        return finalPrice >= Number(filters.minPrice) &&
            finalPrice <= Number(filters.maxPrice);
    });

    // Helper to match variant to product (handles objects and IDs)
    const variantMatchesProduct = (v, productId) => {
        if (!productId) return false;
        const vPid = v.product?.id || v.product || v.product_id;
        return vPid == productId;
    };

    // Material (variant-based)
    if (filters.material !== 'all') {
        filtered = filtered.filter(product =>
            allVariant.some(v => variantMatchesProduct(v, product.id || product.product_id) && v.material && v.material.toLowerCase() === filters.material));
    }

    // Color (variant-based)
    if (filters.color !== 'all') {
        filtered = filtered.filter(product => allVariant.some(v => variantMatchesProduct(v, product.id || product.product_id) && v.color && v.color.toLowerCase() === filters.color));
    }

    // Season (variant-based)
    if (filters.season !== 'all') {
        filtered = filtered.filter(product => allVariant.some(v => variantMatchesProduct(v, product.id || product.product_id) && v.seasons && v.seasons.toLowerCase() === filters.season));
    }

    currentFilteredProducts = filtered;
    currentPage = 1;
    renderProducts(currentFilteredProducts);
}



/* ================================
   RENDER PRODUCTS
================================ */
function renderProducts(products) {
    const grid = document.getElementById("gridProduct");
    grid.innerHTML = "";

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    if (products.length === 0) {
        grid.innerHTML = `<p style="text-align:center;">No products found</p>`;
        return;
    }

    paginatedProducts.forEach(item => {
        const card = document.createElement("div");
        card.className = "cards";

        const image = item.image;




        // Pricing display: shows discounted price and original price
        card.innerHTML = `
            <div class="cardbox">
            ${item.discount_percent > 0
                ? `<div class="discount_badge">${item.discount_percent}%</div>`
                : ""
            }
            <img src="${image}" class="product_image">
            
                <div class="product-info">
                    <p class="product_title">${item.name}</p>
                    <p class="product_brand">${item.brand?.name || ""}</p>

                    <p class="product_price">Rs. ${item.discounted_price}</p>
                    <button class="btn-add-cart btn">View Details</button>
                </div>
            </div>
            `;

        // using a promps
        card.onclick = () => {
            showProductDetail(item);
        };

        grid.appendChild(card);
    });
}

/* ================================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});
