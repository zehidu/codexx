const products = [
    { id: 1, name: 'Predator Elite FG', price: 240, category: 'boots', emoji: '👟', description: 'Firm-ground boot for powerful strikes.' },
    { id: 2, name: 'Phantom GX Pro', price: 220, category: 'boots', emoji: '⚡', description: 'GripKnit upper for agile playmaking.' },
    { id: 3, name: 'Tiempo Legend 10', price: 210, category: 'boots', emoji: '🛡️', description: 'Premium touch and stability for defenders.' },
    { id: 4, name: 'Adidas Match Ball Pro', price: 160, category: 'equipment', emoji: '⚽', description: 'Thermo-bonded FIFA Quality Pro ball.' },
    { id: 5, name: 'Nike Strike Training Ball', price: 48, category: 'equipment', emoji: '🎯', description: 'Textured casing for consistent flight.' },
    { id: 6, name: 'Goalie Elite Gloves', price: 120, category: 'equipment', emoji: '🧤', description: 'German latex palm with finger protection.' },
    { id: 7, name: 'Club Jersey 24/25', price: 125, category: 'apparel', emoji: '🎽', description: 'Authentic Dri-FIT ADV match jersey.' },
    { id: 8, name: 'Travel Tracksuit', price: 98, category: 'apparel', emoji: '🥋', description: 'Lightweight woven set for warmups.' },
    { id: 9, name: 'Supporter Scarf', price: 32, category: 'fan', emoji: '🧣', description: 'Knit scarf in home colors.' },
    { id: 10, name: 'Club Cap Classic', price: 28, category: 'fan', emoji: '🧢', description: 'Adjustable curved brim cap with crest.' },
    { id: 11, name: 'Compression Shorts', price: 42, category: 'apparel', emoji: '🩳', description: 'Breathable base layer for training.' },
    { id: 12, name: 'Shin Guards Pro', price: 36, category: 'equipment', emoji: '🛡️', description: 'Carbon insert with sleeve lock-in.' }
];

const state = { cart: [] };

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const backdrop = document.getElementById('backdrop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const bundleSavingRow = document.getElementById('bundle-saving');
const checkoutBtn = document.getElementById('checkout-btn');

function renderProducts() {
    productGrid.innerHTML = '';
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const filtered = products.filter(p => {
        const matchesCategory = category === 'all' || p.category === category;
        const matchesQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="thumb">${product.emoji}</div>
            <div class="product-meta">
                <h3>${product.name}</h3>
                <span class="tag">${product.category}</span>
            </div>
            <p class="subtext">${product.description}</p>
            <div class="product-meta">
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="btn ghost" data-id="${product.id}">Add to cart</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function renderCart() {
    cartItems.innerHTML = '';
    let subtotal = 0;

    if (!state.cart.length) {
        cartItems.innerHTML = '<p class="subtext">Your cart is empty. Add gear to get match-ready.</p>';
    }

    state.cart.forEach(item => {
        subtotal += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="thumb">${item.emoji}</div>
            <div>
                <div class="title">${item.name}</div>
                <div class="subtext">$${item.price.toFixed(2)} • ${item.category}</div>
            </div>
            <div class="cart-controls" data-id="${item.id}">
                <button aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button aria-label="Increase quantity">+</button>
            </div>
        `;
        cartItems.appendChild(row);
    });

    const qualifiesForBundle = state.cart.length >= 3;
    bundleSavingRow.hidden = !qualifiesForBundle;
    const total = qualifiesForBundle ? subtotal * 0.8 : subtotal;

    cartSubtotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(productId) {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ ...product, qty: 1 });
    }
    renderCart();
    openCart();
}

function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === Number(productId));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        state.cart = state.cart.filter(i => i.id !== item.id);
    }
    renderCart();
}

function openCart() {
    cartPanel.classList.add('open');
    backdrop.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
}

function closeCartPanel() {
    cartPanel.classList.remove('open');
    backdrop.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
}

productGrid.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-id]');
    if (button) {
        addToCart(button.dataset.id);
    }
});

cartItems.addEventListener('click', (e) => {
    const controls = e.target.closest('.cart-controls');
    if (!controls) return;
    const id = controls.dataset.id;
    if (e.target.textContent === '+') updateQuantity(id, 1);
    if (e.target.textContent === '−') updateQuantity(id, -1);
});

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);

cartToggle.addEventListener('click', () => {
    if (cartPanel.classList.contains('open')) {
        closeCartPanel();
    } else {
        openCart();
    }
});
closeCart.addEventListener('click', closeCartPanel);
backdrop.addEventListener('click', closeCartPanel);

checkoutBtn.addEventListener('click', () => {
    if (!state.cart.length) {
        alert('Add items before checking out.');
        return;
    }
    alert('Checkout ready! This demo keeps everything client-side.');
});

// Category shortcuts
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const filter = card.dataset.filter;
        categoryFilter.value = filter;
        renderProducts();
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
});

// Contact form toast
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Thank you! A specialist will reply within 24 hours.';
    contactForm.reset();
});

renderProducts();
renderCart();
