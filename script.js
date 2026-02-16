// products data
const products = [
  { id: 1, name: "Illuminating Gift Set - Vanilla yum", price: 5500 },
  { id: 2, name: "Illuminating Gift Set - Citrus crazy", price: 5500 },

  { id: 3, name: "Walking Bakery Body Butter", price: 2500 },
  { id: 4, name: "Lucky Lemon Body Butter", price: 2500 },

  { id: 5, name: "Walking Bakery Body Oil", price: 2500 },
  { id: 6, name: "Lucky Lemon Body Oil", price: 2500 },

  { id: 7, name: "Vanilla Yum Candle", price: 1500 },
  { id: 8, name: "Citrus Crazy Candle", price: 1500 }
];

// cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

function displayProducts() {
  const shopSection = document.querySelector('.shop-section');  
  products.forEach(product => {
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