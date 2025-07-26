// Global Variables
let products = [];
let cart = [];
let currentUser = null;
let users = [];
let orders = [];

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        price: 89.99,
        category: "dresses",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        description: "Beautiful flowy summer dress perfect for any occasion",
        sizes: ["XS", "S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 2,
        name: "Casual Denim Jacket",
        price: 79.99,
        category: "outerwear",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        description: "Classic denim jacket that goes with everything",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 3,
        name: "Silk Blouse",
        price: 65.99,
        category: "tops",
        image: "https://images.unsplash.com/photo-1564257577-0f3b8b6d5d4f?w=400",
        description: "Luxurious silk blouse for professional wear",
        sizes: ["XS", "S", "M", "L"],
        inStock: true
    },
    {
        id: 4,
        name: "High-Waisted Jeans",
        price: 95.99,
        category: "bottoms",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        description: "Comfortable high-waisted jeans with perfect fit",
        sizes: ["XS", "S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 5,
        name: "Designer Handbag",
        price: 149.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        description: "Elegant leather handbag for everyday use",
        sizes: ["One Size"],
        inStock: true
    },
    {
        id: 6,
        name: "Floral Maxi Dress",
        price: 110.99,
        category: "dresses",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        description: "Beautiful floral maxi dress for special occasions",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 7,
        name: "Cozy Cardigan",
        price: 55.99,
        category: "tops",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
        description: "Soft and cozy cardigan perfect for layering",
        sizes: ["XS", "S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 8,
        name: "Leather Boots",
        price: 129.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        description: "Stylish leather boots for any season",
        sizes: ["6", "7", "8", "9", "10"],
        inStock: true
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    loadFromLocalStorage();
});

function initializeApp() {
    products = [...sampleProducts];
    
    // Create default admin user
    if (users.length === 0) {
        users.push({
            id: 1,
            name: "Admin User",
            email: "admin@luxefashion.com",
            password: "admin123",
            isAdmin: true
        });
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('userBtn').addEventListener('click', openUserModal);
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
    
    // Modal close buttons
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('closeUser').addEventListener('click', closeUserModal);
    document.getElementById('closeAdmin').addEventListener('click', closeAdminModal);
    document.getElementById('closeAddProduct').addEventListener('click', closeAddProductModal);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    document.getElementById('sizeFilter').addEventListener('change', filterProducts);
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
}

// Product Functions
function loadProducts() {
    displayProducts(products);
}

function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">No products found matching your criteria.</p>';
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-sizes">
                    ${product.sizes.map(size => `<span class="size-option">${size}</span>`).join('')}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
    
    let filteredProducts = [...products];
    
    // Category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Price filter
    if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        if (max) {
            filteredProducts = filteredProducts.filter(product => product.price >= min && product.price <= max);
        } else {
            filteredProducts = filteredProducts.filter(product => product.price >= min);
        }
    }
    
    // Size filter
    if (sizeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.sizes.includes(sizeFilter));
    }
    
    displayProducts(filteredProducts);
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveToLocalStorage();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveToLocalStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveToLocalStorage();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function openCart() {
    document.getElementById('cartModal').style.display = 'block';
    updateCartUI();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        closeCart();
        openUserModal();
        showNotification('Please login to checkout', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: orders.length + 1,
        userId: currentUser.id,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(order);
    cart = [];
    updateCartUI();
    closeCart();
    saveToLocalStorage();
    showNotification('Order placed successfully!');
}

// User Functions
function openUserModal() {
    document.getElementById('userModal').style.display = 'block';
    
    if (currentUser) {
        showUserDashboard();
    } else {
        showLogin();
    }
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

function showLogin() {
    document.getElementById('userModalTitle').textContent = 'Login';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'none';
}

function showRegister() {
    document.getElementById('userModalTitle').textContent = 'Register';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('userDashboard').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple authentication logic (replace with Supabase auth later)
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        closeUserModal();
        showNotification('Login successful!');
        showUserDashboard();
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        isAdmin: false
    };

    users.push(newUser);
    currentUser = newUser;
    closeUserModal();
    showNotification('Registration successful!');
    showUserDashboard();
}

function showUserDashboard() {
    document.getElementById('userModalTitle').textContent = `Welcome, ${currentUser.name}`;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';

    // Display user orders
    const ordersList = document.getElementById('userOrders');
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p>You have no orders yet.</p>';
    } else {
        ordersList.innerHTML = userOrders.map(order => `
            <div class="order-item">
                <p>Order #${order.id} - ${new Date(order.date).toLocaleDateString()}</p>
                <p>Status: ${order.status}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
            </div>
        `).join('');
    }
}

function logout() {
    currentUser = null;
    showLogin();
    showNotification('Logged out successfully!');
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function loadFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    const storedUsers = localStorage.getItem('users');
    const storedOrders = localStorage.getItem('orders');
    const storedCurrentUser = localStorage.getItem('currentUser');

    if (storedCart) cart = JSON.parse(storedCart);
    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedOrders) orders = JSON.parse(storedOrders);
    if (storedCurrentUser) currentUser = JSON.parse(storedCurrentUser);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function toggleMobileMenu() {
    const nav = document.getElementById('navMenu');
    if (nav.style.display === 'block') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'block';
    }
}

function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function handleAddProduct(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;
    const sizes = document.getElementById('productSizes').value.split(',').map(s => s.trim());
    const inStock = document.getElementById('productInStock').checked;

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        category,
        image,
        description,
        sizes,
        inStock
    };

    products.push(newProduct);
    displayProducts(products);
    closeAddProductModal();
    showNotification('Product added successfully!');
}
