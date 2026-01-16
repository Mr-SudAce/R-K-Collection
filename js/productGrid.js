let allProducts = [];

// Fetch JSON
fetch("json/product.json")
  .then(res => res.json())
  .then(products => {
      allProducts = products;
      
      // 1. Generate category buttons dynamically
      generateCategoryButtons(allProducts);

      // 2. Render all products by default
      renderProducts(allProducts);
  })
  .catch(err => console.error("Error loading JSON:", err));

// Render Products Function
function renderProducts(products) {
    const grid = document.getElementById("gridProduct");
    grid.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const discountBadge = item.discount ? `<div class="discount_badge">-${item.discount}%</div>` : "";
        const categoryNames = item.product_cat.map(cat => cat.category_name).join(", ");

        card.innerHTML = `
        <div class="cardbox">
        ${discountBadge}
        <img src="${item.product_image}" class="product_image" alt="${item.product_name}">
        <p class="product_title">${item.product_name}</p>
        <p class="product_category">Category: ${categoryNames}</p>
        <p class="product_price">Rs. ${item.product_price}</p>
        <p class="product_detail">${item.clothes_type}</p>
        <button>Add to Cart</button>
        </div>
        `;
        grid.appendChild(card);
    });
}

// Generate Category Buttons Dynamically
function generateCategoryButtons(products) {
    const categoryContainer = document.getElementById("categoryFilter");
    categoryContainer.innerHTML = "";

    // Get unique categories from all products
    const categoriesSet = new Set();
    products.forEach(item => {
        item.product_cat.forEach(cat => categoriesSet.add(cat.category_name.toLowerCase()));
    });

    const categories = Array.from(categoriesSet).sort();

    // Add 'All' button first
    const allBtn = document.createElement("button");
    allBtn.dataset.category = "all";
    allBtn.textContent = `All (${products.length})`;
    allBtn.classList.add("active");
    categoryContainer.appendChild(allBtn);

    // Add buttons for each category
    categories.forEach(catName => {
        const count = products.filter(item =>
            item.product_cat.some(cat => cat.category_name.toLowerCase() === catName)
        ).length;

        const btn = document.createElement("button");
        btn.dataset.category = catName;
        btn.textContent = `${capitalize(catName)}`;
        categoryContainer.appendChild(btn);
    });

    // Add click event listener to all buttons
    const categoryButtons = categoryContainer.querySelectorAll("button");
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Highlight active button
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedCategory = btn.dataset.category;

            if (selectedCategory === "all") {
                renderProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(item =>
                    item.product_cat.some(cat => cat.category_name.toLowerCase() === selectedCategory)
                );
                renderProducts(filteredProducts);
            }
        });
    });
}

// Helper function to capitalize category names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
