// ================================
// R&K Collection – Dashboard App
// ================================

// DOM refs
const productsTableBody = document.getElementById('productsTableBody');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.close');
const saveToDirectoryBtn = document.getElementById('saveToDirectoryBtn');

let products = [];
let editingProductId = null;
let fileHandle = null; // stores the JSON file handle

// ================================
// File Picker (ask ONCE)
// ================================
async function requestFileHandle() {
    if (fileHandle) return;

    try {
        fileHandle = await window.showSaveFilePicker({
            suggestedName: 'product.json',
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }]
        });
    } catch {
        alert('File access cancelled. JSON saving disabled.');
    }
}

// ================================
// Init
// ================================
function init() {
    const stored = localStorage.getItem('products');
    products = stored ? JSON.parse(stored) : [];
    displayProducts();
}

// ================================
// Render Table
// ================================
function displayProducts() {
    productsTableBody.innerHTML = '';
    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.product_name}</td>
            <td>${p.product_price}</td>
            <td>${p.brand}</td>
            <td>${p.discount}%</td>
            <td><img src="${p.product_image}" width="50"></td>
            <td>${p.clothes_type}</td>
            <td>${p.season}</td>
            <td>${p.product_cat.map(c => c.category_name).join(', ')}</td>
            <td>${p.color_verient.map(c => c.color).join(', ')}</td>
            <td>${p.related_productImage.length}</td>
            <td>
                <button onclick="editProduct(${p.id})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// ================================
// Modal Controls
// ================================
addProductBtn.onclick = () => {
    editingProductId = null;
    modalTitle.textContent = 'Add Product';
    productForm.reset();
    productModal.style.display = 'block';
};

closeModal.onclick = () => productModal.style.display = 'none';
window.onclick = e => {
    if (e.target === productModal) productModal.style.display = 'none';
};

// ================================
// Form Submit
// ================================
productForm.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
        product_name: productName.value,
        product_price: +productPrice.value,
        brand: brand.value,
        discount: +discount.value,
        product_image: productImage.value,
        clothes_type: clothesType.value,
        season: season.value,
        product_cat: categories.value.split(',').map(c => ({ category_name: c.trim() })),
        color_verient: colors.value.split(',').map(c => ({ color: c.trim() })),
        related_productImage: relatedImages.value.split('\n').filter(Boolean)
    };

    editingProductId
        ? await updateProduct(data)
        : await addProduct(data);

    productModal.style.display = 'none';
    displayProducts();
};

// ================================
// CRUD Logic
// ================================
async function addProduct(product) {
    const id = Math.max(0, ...products.map(p => p.id)) + 1;
    products.push({ id, ...product });
    persist();
    await saveToJson(); // auto-save to JSON
}

async function updateProduct(product) {
    const i = products.findIndex(p => p.id === editingProductId);
    if (i !== -1) {
        products[i] = { id: editingProductId, ...product };
        persist();
        await saveToJson(); // auto-save to JSON
    }
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    editingProductId = id;
    modalTitle.textContent = 'Edit Product';

    productName.value = p.product_name;
    productPrice.value = p.product_price;
    brand.value = p.brand;
    discount.value = p.discount;
    productImage.value = p.product_image;
    clothesType.value = p.clothes_type;
    season.value = p.season;
    categories.value = p.product_cat.map(c => c.category_name).join(', ');
    colors.value = p.color_verient.map(c => c.color).join(', ');
    relatedImages.value = p.related_productImage.join('\n');

    productModal.style.display = 'block';
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;

    products = products.filter(p => p.id !== id);
    persist();
    displayProducts();
    await saveToJson();
}

// ================================
// Persistence
// ================================
function persist() {
    localStorage.setItem('products', JSON.stringify(products));
}

// ================================
// Save JSON (click or auto)
// ================================
async function saveToJson() {
    await requestFileHandle();
    if (!fileHandle) return;

    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(products, null, 2));
    await writable.close();
}

// ================================
// Save Button
// ================================
if (saveToDirectoryBtn) {
    saveToDirectoryBtn.addEventListener('click', async () => {
        await saveToJson();
        alert('product.json has been created/updated!');
    });
}

// ================================
document.addEventListener('DOMContentLoaded', init);
