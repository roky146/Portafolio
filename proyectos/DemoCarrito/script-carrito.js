const products = [
  { id: 1, name: "Zapatos Nike", price: 50, emoji: "👟", description: "Zapatillas deportivas cómodas" },
  { id: 2, name: "Camiseta JS", price: 30, emoji: "👕", description: "Camiseta con logo de JavaScript" },
  { id: 3, name: "Gorra React", price: 25, emoji: "🧢", description: "Gorra con diseño React" },
  { id: 4, name: "Sudadera HTML", price: 40, emoji: "🧥", description: "Sudadera temática HTML" },
  { id: 5, name: "Reloj Smart", price: 80, emoji: "⌚", description: "Reloj inteligente multifunción" },
  { id: 6, name: "Auriculares", price: 60, emoji: "🎧", description: "Auriculares con cancelación de ruido" },
  { id: 7, name: "Mochila", price: 45, emoji: "🎒", description: "Mochila resistente para portátil" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const storeContainer = document.getElementById('store');
const cartContainer = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const discountNotice = document.getElementById('discount-notice');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutSummary = document.getElementById('checkout-summary');
const paymentForm = document.getElementById('payment-form');
const cancelPayment = document.getElementById('cancel-payment');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessage = document.getElementById('confirmation-message');
const closeConfirmation = document.getElementById('close-confirmation');
const overlay = document.getElementById('overlay');

function renderProducts() {
  storeContainer.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <div class="quantity-selector">
          <button class="quantity-btn minus" data-id="${product.id}">-</button>
          <span class="quantity-display" data-id="${product.id}">1</span>
          <button class="quantity-btn plus" data-id="${product.id}">+</button>
        </div>
        <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
      </div>
    `;
    
    storeContainer.appendChild(productCard);
  });
  
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const quantityDisplay = document.querySelector(`.quantity-display[data-id="${productId}"]`);
      let quantity = parseInt(quantityDisplay.textContent);
      
      if (e.target.classList.contains('minus') && quantity > 1) {
        quantity--;
      } else if (e.target.classList.contains('plus') && quantity < 5) {
        quantity++;
      }
      
      quantityDisplay.textContent = quantity;
    });
  });
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const quantity = parseInt(document.querySelector(`.quantity-display[data-id="${productId}"]`).textContent);
      addToCart(productId, quantity);
    });
  });
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    if (existingItem.quantity + quantity > 5) {
      existingItem.quantity = 5;
      alert('Límite de 5 unidades por producto alcanzado');
    } else {
      existingItem.quantity += quantity;
    }
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      description: product.description,
      quantity: Math.min(quantity, 5)
    });
  }
  
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity > 5) {
      item.quantity = 5;
      alert('Límite de 5 unidades por producto');
    } else {
      item.quantity = newQuantity;
    }
    updateCart();
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
    return;
  }
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <div class="cart-item-image">${item.emoji}</div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">$${item.price} c/u</p>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">Eliminar</button>
        </div>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  document.querySelectorAll('.cart-item .quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const item = cart.find(item => item.id === productId);
      
      if (e.target.classList.contains('minus')) {
        updateQuantity(productId, item.quantity - 1);
      } else if (e.target.classList.contains('plus')) {
        updateQuantity(productId, item.quantity + 1);
      }
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      removeFromCart(productId);
    });
  });
}

function updateCart() {
  renderCart();
  
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  discountNotice.style.display = discount > 0 ? 'block' : 'none';
  
  updateCheckoutSummary(subtotal, discount, total);
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCheckoutSummary(subtotal, discount, total) {
  checkoutSummary.innerHTML = `
    <h3>Resumen de Compra</h3>
    <ul>
      ${cart.map(item => `
        <li>${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>
      `).join('')}
    </ul>
    <div class="total">
      <span>Subtotal:</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    ${discount > 0 ? `
      <div class="total">
        <span>Descuento (10%):</span>
        <span>-$${discount.toFixed(2)}</span>
      </div>
      <div class="total">
        <span>Total:</span>
        <span><s>$${subtotal.toFixed(2)}</s> $${total.toFixed(2)}</span>
      </div>
    ` : `
      <div class="total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    `}
  `;
}

function showCart() {
  cartContainer.classList.add('open');
  overlay.classList.add('show');
}

function hideCart() {
  cartContainer.classList.remove('open');
  overlay.classList.remove('show');
}

function showCheckoutModal() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  checkoutModal.classList.add('show');
  overlay.classList.add('show');
  hideCart();
}

function hideCheckoutModal() {
  checkoutModal.classList.remove('show');
  overlay.classList.remove('show');
}

function showConfirmation(total) {
  confirmationMessage.textContent = `¡Gracias por tu compra de $${total.toFixed(2)}! Te hemos enviado un correo con los detalles.`;
  confirmationModal.classList.add('show');
  overlay.classList.add('show');
}

function hideConfirmation() {
  confirmationModal.classList.remove('show');
  overlay.classList.remove('show');
  cart = [];
  updateCart();
}

cartToggle.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
overlay.addEventListener('click', hideCart); // Only hide cart, don't clear it
checkoutBtn.addEventListener('click', showCheckoutModal);
cancelPayment.addEventListener('click', hideCheckoutModal);
closeConfirmation.addEventListener('click', hideConfirmation);

paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Por favor completa todos los campos con un correo electrónico válido');
    return;
  }
  
  setTimeout(() => {
    hideCheckoutModal();
    
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = subtotal > 100 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    showConfirmation(total);
  }, 1500);
});

renderProducts();
updateCart();