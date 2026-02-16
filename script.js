// products data
const products = [
  { id: 1, name: "Illuminating Gift Set - Vanilla yum", price: 5500, category: "Gift Sets" },
  { id: 2, name: "Illuminating Gift Set - Citrus crazy", price: 5500, category: "Gift Sets" },

  { id: 3, name: "Walking Bakery Body Butter", price: 2500, category: "Scented Body Butters" },
  { id: 4, name: "Lucky Lemon Body Butter", price: 2500, category: "Scented Body Butters" },

  { id: 5, name: "Walking Bakery Body Oil", price: 2500, category: "Scented Body Oils" },
  { id: 6, name: "Lucky Lemon Body Oil", price: 2500, category: "Scented Body Oils" },

  { id: 7, name: "Vanilla Yum Candle", price: 1500, category: "Scented Candles" },
  { id: 8, name: "Citrus Crazy Candle", price: 1500, category: "Scented Candles" }
];

// cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedCategory = null;

const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}
const formatPrice = (price) => {
  return price.toLocaleString('en-US', { style: 'currency', currency: 'KES' });
}
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    displayCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateCartItemQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
  }
}

function displayProducts(productsToDisplay = products) {
  const shopSection = document.querySelector('.shop-section');
  shopSection.innerHTML = '';
  
  if (productsToDisplay.length === 0) {
    shopSection.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No products found.</p>';
    return;
  }
  
  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <p>${formatPrice(product.price)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    shopSection.appendChild(productCard);
  });
}

function displayCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-cart-message');
  const cartTotal = document.getElementById('cart-total');
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    emptyMessage.style.display = 'block';
    if (cartTotal) cartTotal.textContent = '0 KES';
    return;
  }
  
  emptyMessage.style.display = 'none';
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="cart-item-controls">
          <input type="number" min="1" value="${item.quantity}" onchange="updateCartItemQuantity(${item.id}, this.value); displayCart();">
          <button onclick="removeFromCart(${item.id}); displayCart();">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  const total = calculateTotal();
  if (cartTotal) cartTotal.textContent = formatPrice(total);
}

// Initialize cart and products on page load
if (document.querySelector('.shop-section')) {
  displayProducts();
  displayCart();
  
  // Category functionality
  const categoryItems = document.querySelectorAll('.sidebar ul li');
  if (categoryItems.length > 0) {
    categoryItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        // Remove active class from all items
        categoryItems.forEach(li => li.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Set selected category
        selectedCategory = item.textContent.trim();
        
        // Filter and display
        filterAndDisplayProducts();
      });
    });
    
    // Add "Show All" option
    const showAllItem = document.createElement('li');
    showAllItem.textContent = 'Show All';
    showAllItem.style.cursor = 'pointer';
    showAllItem.style.fontWeight = 'bold';
    showAllItem.style.marginTop = '10px';
    showAllItem.classList.add('active');
    showAllItem.addEventListener('click', () => {
      categoryItems.forEach(li => li.classList.remove('active'));
      showAllItem.classList.add('active');
      selectedCategory = null;
      filterAndDisplayProducts();
    });
    document.querySelector('.sidebar ul').appendChild(showAllItem);
  }
  
  // Search functionality
  const searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', filterAndDisplayProducts);
  }
  
  // Sort functionality
  const sortFilter = document.getElementById('sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', filterAndDisplayProducts);
  }
}

function filterAndDisplayProducts() {
  const searchBar = document.getElementById('search-bar');
  const sortFilter = document.getElementById('sort-filter');
  
  let filtered = products;
  
  // Apply category filter
  if (selectedCategory) {
    filtered = filtered.filter(product => product.category === selectedCategory);
  }
  
  // Apply search filter
  if (searchBar && searchBar.value.trim() !== '') {
    const searchTerm = searchBar.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply sort
  if (sortFilter && sortFilter.value !== 'default') {
    filtered = [...filtered]; // Create a copy to avoid mutating original
    if (sortFilter.value === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortFilter.value === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }
  }
  
  displayProducts(filtered);
}

// Checkout functionality
const checkoutButton = document.getElementById('checkout-button');
if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    const paymentMethod = document.getElementById('payment-method').value;
    const checkoutMessage = document.getElementById('checkout-message');
    
    if (cart.length === 0) {
      checkoutMessage.textContent = 'Your cart is empty. Add items before checking out.';
      checkoutMessage.style.color = 'red';
      return;
    }
    
    if (paymentMethod === 'default') {
      checkoutMessage.textContent = 'Please select a payment method.';
      checkoutMessage.style.color = 'red';
      return;
    }
    
    const total = calculateTotal();
    checkoutMessage.textContent = `Order confirmed! Total: ${formatPrice(total)}. Payment method: ${paymentMethod}`;
    checkoutMessage.style.color = 'green';
    
    // Clear cart after successful checkout
    setTimeout(() => {
      cart = [];
      saveCart();
      displayCart();
      document.getElementById('payment-method').value = 'default';
      checkoutMessage.textContent = '';
    }, 2000);
  });
}

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
} 