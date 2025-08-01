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
        stockQuantity: 10
    },
    {
        id: 2,
        name: "Casual Denim Jacket",
        price: 79.99,
        category: "outerwear",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        description: "Classic denim jacket that goes with everything",
        sizes: ["S", "M", "L", "XL"],
        stockQuantity: 15
    },
    {
        id: 3,
        name: "Silk Blouse",
        price: 65.99,
        category: "tops",
        image: "https://images.unsplash.com/photo-1564257577-0f3b8b6d5d4f?w=400",
        description: "Luxurious silk blouse for professional wear",
        sizes: ["XS", "S", "M", "L"],
        stockQuantity: 8
    },
    {
        id: 4,
        name: "High-Waisted Jeans",
        price: 95.99,
        category: "bottoms",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        description: "Comfortable high-waisted jeans with perfect fit",
        sizes: ["XS", "S", "M", "L", "XL"],
        stockQuantity: 12
    },
    {
        id: 5,
        name: "Designer Handbag",
        price: 149.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        description: "Elegant leather handbag for everyday use",
        sizes: ["One Size"],
        stockQuantity: 5
    },
    {
        id: 6,
        name: "Floral Maxi Dress",
        price: 110.99,
        category: "dresses",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        description: "Beautiful floral maxi dress for special occasions",
        sizes: ["S", "M", "L", "XL"],
        stockQuantity: 7
    },
    {
        id: 7,
        name: "Cozy Cardigan",
        price: 55.99,
        category: "tops",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
        description: "Soft and cozy cardigan perfect for layering",
        sizes: ["XS", "S", "M", "L", "XL"],
        stockQuantity: 20
    },
    {
        id: 8,
        name: "Leather Boots",
        price: 129.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        description: "Stylish leather boots for any season",
        sizes: ["6", "7", "8", "9", "10"],
        stockQuantity: 10
    }
];

// Global Supabase client (will be initialized from supabase-config.js)
let supabaseClient = null;

// Initialize Supabase when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    supabaseClient = window.initializeSupabase();
    if (!supabaseClient) {
        console.error('Failed to initialize Supabase client');
        return;
    }

    // Set up auth state listener
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            updateUIForAuthenticatedUser();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            updateUIForUnauthenticatedUser();
        }
    });

    // Check initial session
    checkUserSession();
    
    // Continue with other initialization
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
            if (event.target === modal && !modal.querySelector('.modal-content').contains(event.target)) {
                modal.style.display = 'none';
            }
        });
    });

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    document.getElementById('sizeFilter').addEventListener('change', filterProducts);

    // Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Admin panel buttons and actions
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', openAdminModal);
    }
    const adminProductsList = document.getElementById('adminProductsList');
    if (adminProductsList) {
        adminProductsList.addEventListener('click', handleAdminProductsListClick);
    }
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

async function checkUserSession() {
    if (!supabaseClient) return;
    
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) {
        console.error('Error getting session:', error.message);
        currentUser = null;
        return;
    }
    
    if (session) {
        currentUser = session.user;
        updateUIForAuthenticatedUser();
    } else {
        currentUser = null;
        updateUIForUnauthenticatedUser();
    }
}

function updateUIForAuthenticatedUser() {
    // Update user button icon to show logged in state
    const userBtn = document.getElementById('userBtn');
    userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
    userBtn.title = `Logged in as ${currentUser.email}`;
}

function updateUIForUnauthenticatedUser() {
    // Reset user button icon
    const userBtn = document.getElementById('userBtn');
    userBtn.innerHTML = '<i class="fas fa-user"></i>';
    userBtn.title = 'User Account';
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

async function handleLogin(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Authentication service not available', 'error');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            currentUser = data.user;
            closeUserModal();
            showNotification('Login successful!');
            // Clear form
            document.getElementById('loginForm').reset();
        }
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Authentication service not available', 'error');
        return;
    }

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validate password confirmation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Registration successful! Please check your email to confirm your account.');
            // Clear form
            document.getElementById('registerForm').reset();
            // Switch to login form
            showLogin();
        }
    } catch (error) {
        showNotification('Registration failed: ' + error.message, 'error');
    }
}

function showUserDashboard() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    document.getElementById('userModalTitle').textContent = `Welcome!`;
    document.getElementById('userName').textContent = currentUser.email;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';

    // Show admin button only for admin users
    const adminBtn = document.getElementById('adminBtn');
    if (currentUser && currentUser.email === 'admin@luxefashion.com') {
        adminBtn.style.display = 'inline-block';
    } else {
        adminBtn.style.display = 'none';
    }
}

async function logout() {
    if (!supabaseClient) {
        showNotification('Authentication service not available', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            showNotification('Error logging out: ' + error.message, 'error');
        } else {
            currentUser = null;
            closeUserModal();
            showNotification('Logged out successfully!');
        }
    } catch (error) {
        showNotification('Logout failed: ' + error.message, 'error');
    }
}

// Additional user functions
function showOrders() {
    if (!currentUser) return;
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    let ordersHTML = '<h4>My Orders</h4>';
    if (userOrders.length === 0) {
        ordersHTML += '<p>You have no orders yet.</p>';
    } else {
        ordersHTML += userOrders.map(order => `
            <div class="order-item">
                <p><strong>Order #${order.id}</strong> - ${new Date(order.date).toLocaleDateString()}</p>
                <p>Status: <span class="order-status ${order.status}">${order.status}</span></p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // Update dashboard content
    const dashboardOptions = document.querySelector('.dashboard-options');
    dashboardOptions.innerHTML = ordersHTML + '<button onclick="showUserDashboard()">Back to Dashboard</button>';
}

function showProfile() {
    if (!currentUser) return;
    
    let profileHTML = `
        <h4>Profile Information</h4>
        <div class="profile-info">
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Account Created:</strong> ${new Date(currentUser.created_at).toLocaleDateString()}</p>
            <p><strong>Email Confirmed:</strong> ${currentUser.email_confirmed_at ? 'Yes' : 'No'}</p>
        </div>
    `;
    
    // Update dashboard content
    const dashboardOptions = document.querySelector('.dashboard-options');
    dashboardOptions.innerHTML = profileHTML + '<button onclick="showUserDashboard()">Back to Dashboard</button>';
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
    renderAdminProductsList();
}

function renderAdminProductsList() {
    const adminProductsList = document.getElementById('adminProductsList');
    if (!adminProductsList) return;

    if (products.length === 0) {
        adminProductsList.innerHTML = '<p>No products available.</p>';
        return;
    }

    adminProductsList.innerHTML = products.map(product => `
        <div class="admin-product-item" data-id="${product.id}">
            <input type="text" class="admin-product-name" value="${product.name}" />
            <input type="number" class="admin-product-price" value="${product.price.toFixed(2)}" step="0.01" />
            <select class="admin-product-category">
                <option value="dresses" ${product.category === 'dresses' ? 'selected' : ''}>Dresses</option>
                <option value="tops" ${product.category === 'tops' ? 'selected' : ''}>Tops</option>
                <option value="bottoms" ${product.category === 'bottoms' ? 'selected' : ''}>Bottoms</option>
                <option value="outerwear" ${product.category === 'outerwear' ? 'selected' : ''}>Outerwear</option>
                <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
            </select>
            <input type="number" class="admin-product-stock" value="${product.stockQuantity}" min="0" />
            <button class="admin-save-btn">Save</button>
            <button class="admin-delete-btn">Delete</button>
        </div>
    `).join('');
}

function handleAdminProductsListClick(event) {
    const target = event.target;
    const productItem = target.closest('.admin-product-item');
    if (!productItem) return;

    const productId = parseInt(productItem.getAttribute('data-id'), 10);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    if (target.classList.contains('admin-save-btn')) {
        // Save changes
        const nameInput = productItem.querySelector('.admin-product-name');
        const priceInput = productItem.querySelector('.admin-product-price');
        const categorySelect = productItem.querySelector('.admin-product-category');
        const stockInput = productItem.querySelector('.admin-product-stock');

        const updatedName = nameInput.value.trim();
        const updatedPrice = parseFloat(priceInput.value);
        const updatedCategory = categorySelect.value;
        const updatedStock = parseInt(stockInput.value, 10);

        if (!updatedName || isNaN(updatedPrice) || !updatedCategory || isNaN(updatedStock) || updatedStock < 0) {
            showNotification('Please enter valid product details.', 'error');
            return;
        }

        products[productIndex].name = updatedName;
        products[productIndex].price = updatedPrice;
        products[productIndex].category = updatedCategory;
        products[productIndex].stockQuantity = updatedStock;

        showNotification('Product updated successfully.');
        renderAdminProductsList();
        displayProducts(products);
    } else if (target.classList.contains('admin-delete-btn')) {
        // Delete product
        if (confirm('Are you sure you want to delete this product?')) {
            products.splice(productIndex, 1);
            showNotification('Product deleted successfully.');
            renderAdminProductsList();
            displayProducts(products);
        }
    }
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

function scrollToShop() {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load content based on tab
    if (tabName === 'products') {
        renderAdminProductsList();
    } else if (tabName === 'orders') {
        renderAdminOrdersList();
    } else if (tabName === 'users') {
        renderAdminUsersList();
    }
}

function renderAdminOrdersList() {
    const adminOrdersList = document.getElementById('adminOrdersList');
    if (!adminOrdersList) return;

    if (orders.length === 0) {
        adminOrdersList.innerHTML = '<p>No orders available.</p>';
        return;
    }

    adminOrdersList.innerHTML = orders.map(order => `
        <div class="admin-order-item">
            <h4>Order #${order.id}</h4>
            <p>User ID: ${order.userId}</p>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Status: ${order.status}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderAdminUsersList() {
    const adminUsersList = document.getElementById('adminUsersList');
    if (!adminUsersList) return;

    if (users.length === 0) {
        adminUsersList.innerHTML = '<p>No users available.</p>';
        return;
    }

    adminUsersList.innerHTML = users.map(user => `
        <div class="admin-user-item">
            <h4>${user.name}</h4>
            <p>Email: ${user.email}</p>
            <p>Admin: ${user.isAdmin ? 'Yes' : 'No'}</p>
        </div>
    `).join('');
}

function showAddProduct() {
    openAddProductModal();
}
