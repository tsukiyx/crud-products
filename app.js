const API_BASE_URL = 'http://localhost:5040/db/products';
const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const submitBtn = document.getElementById('submitBtn');


async function fetchProducts() {
    try {
        const response = await fetch(API_BASE_URL);
        const products = await response.json();
        
        productList.innerHTML = ''; 
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <div class="product-details">
                    <strong>${product.name}</strong>
                    <p>Quantity: ${product.quantity} | Price: $${product.price.toFixed(2)}</p>
                    <small>${product.description || 'No description'}</small>
                </div>
                <div>
                    <button onclick="editProduct('${product._id}')">Edit</button>
                    <button class="delete" onclick="deleteProduct('${product._id}')">Delete</button>
                </div>
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products');
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    const productData = { name, quantity, price, description };

    try {
        let response;
        if (productId) {
            
            response = await fetch(`${API_BASE_URL}/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        } else {
            
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save product');
        }

        form.reset();
        document.getElementById('productId').value = '';
        submitBtn.textContent = 'Add Product';
        fetchProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product');
    }
});


async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        const products = await response.json();
        const product = products.find(p => p._id === id);

        if (product) {
            document.getElementById('productId').value = product._id;
            document.getElementById('name').value = product.name;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description || '';
            
            submitBtn.textContent = 'Update Product';
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to fetch product details');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

// Fetch products when page loads
fetchProducts();