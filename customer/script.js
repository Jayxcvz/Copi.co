// Copi.co Customer Script

// STATE MANAGEMENT & MOCK DATA
const defaultProducts = [
  {
    id: 1, name: "Arabica", category: "beans", price: 220, desc: "Smooth and sweet with bright acidity, fruity notes, and a hint of chocolate and caramel.", img: "../assets/arabica.png", variants: [
      { name: "100g", price: 220 }, { name: "250g", price: 550 }, { name: "500g", price: 1100 }, { name: "1kg", price: 2050 }, { name: "Pods 10pcs", price: 400 }
    ]
  },
  {
    id: 2, name: "Robusta", category: "beans", price: 240, desc: "Bold and full-bodied with a bitter, earthy flavor, nutty undertones, and a strong aftertaste.", img: "../assets/robusta.png", variants: [
      { name: "100g", price: 240 }, { name: "250g", price: 600 }, { name: "500g", price: 1250 }, { name: "1kg", price: 2475 }, { name: "Pods 10pcs", price: 550 }
    ]
  },
  {
    id: 3, name: "Liberica", category: "beans", price: 220, desc: "A rare variety with a distinct smoky, woody aroma and a unique jackfruit-like taste.", img: "../assets/liberica.png", variants: [
      { name: "100g", price: 220 }, { name: "250g", price: 550 }, { name: "500g", price: 1100 }, { name: "1kg", price: 2050 }, { name: "Pods 10pcs", price: 400 }
    ]
  },
  {
    id: 4, name: "Excelsa", category: "beans", price: 160, desc: "Fruity and tart with wine-like complexity and a slightly woody, lingering finish.", img: "../assets/excelsa.png", variants: [
      { name: "100g", price: 160 }, { name: "250g", price: 400 }, { name: "500g", price: 800 }, { name: "1kg", price: 1550 }, { name: "Pods 10pcs", price: 380 }
    ]
  },
  {
    id: 5, name: "Matcha (Ceremonial)", category: "matcha", price: 1250, desc: "Premium ceremonial-grade matcha with a naturally sweet, smooth taste and vibrant green color.", img: "../assets/matcha_ceremonial.png", variants: [
      { name: "50g", price: 1250 }
    ]
  },
  {
    id: 6, name: "Matcha (Premium)", category: "matcha", price: 1200, desc: "Uji/Kyoto origin matcha with rich umami flavor and a balanced, smooth finish for daily use.", img: "../assets/matcha_premium.png", variants: [
      { name: "50g", price: 1200 }
    ]
  },
  {
    id: 7, name: "Matcha (Culinary)", category: "matcha", price: 880, desc: "Best for milk-based drinks, baking, and desserts — robust flavor that holds up in any recipe.", img: "../assets/matcha_culinary2.jpg", variants: [
      { name: "50g", price: 880 }
    ]
  },
  {
    id: 8, name: "French Press", category: "equipment", price: 3000, desc: "Classic plunger brewer for a full-bodied, rich coffee with natural oils preserved.", img: "https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=600", variants: [
      { name: "Standard", price: 3000 }
    ]
  },
  {
    id: 9, name: "Moka Pot", category: "equipment", price: 3500, desc: "Italian stovetop brewer that produces a strong, espresso-like concentrate.", img: "../assets/moka_pot2.png", variants: [
      { name: "Standard", price: 3500 }
    ]
  },
  {
    id: 10, name: "V60 Dripper", category: "equipment", price: 2000, desc: "Precision pour-over dripper for a clean, flavorful cup with aromatic clarity.", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600", variants: [
      { name: "Standard", price: 2000 }
    ]
  },
  {
    id: 11, name: "Drip Coffee Maker", category: "equipment", price: 8500, desc: "Automatic brewer for consistently smooth coffee at the push of a button.", img: "../assets/drip_coffee_maker.png", variants: [
      { name: "Standard", price: 8500 }
    ]
  },
  {
    id: 12, name: "Pod Machine", category: "equipment", price: 9500, desc: "Single-serve convenience for quick, hassle-free coffee anytime.", img: "../assets/pod_machine.png", variants: [
      { name: "Standard", price: 9500 }
    ]
  },
  {
    id: 13, name: "Espresso Machine", category: "equipment", price: 15000, desc: "Semi-automatic machine for crafting barista-quality espresso shots at home.", img: "../assets/espresso_machine.png", variants: [
      { name: "Standard", price: 15000 }
    ]
  },
  {
    id: 14, name: "Burr Grinder", category: "equipment", price: 2400, desc: "Precision burr grinder for consistent, uniform grounds — essential for great coffee.", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600", variants: [
      { name: "Standard", price: 2400 }
    ]
  },
  {
    id: 15, name: "Automatic Milk Frother", category: "equipment", price: 3800, desc: "Create silky, café-quality foam for lattes and cappuccinos in seconds.", img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600", variants: [
      { name: "Standard", price: 3800 }
    ]
  },
  {
    id: 16, name: "Paper Filters", category: "equipment", price: 300, desc: "High-quality filters for a clean, sediment-free cup every time.", img: "../assets/paper_filters.png", variants: [
      { name: "100pcs", price: 300 }
    ]
  },
  {
    id: 17, name: "Full Matcha Starter Set", category: "matcha", price: 4000, desc: "Complete kit with bowl, whisk, scoop, sifter, and ceremonial matcha included.", img: "../assets/matcha_starter_set.jpg", variants: [
      { name: "Standard", price: 4000 }
    ]
  },
  {
    id: 18, name: "Premium Matcha Set", category: "matcha", price: 7500, desc: "Luxury set featuring an artisan bowl and 100-prong bamboo whisk for the perfect brew.", img: "../assets/matcha_premium_set.jpg", variants: [
      { name: "Standard", price: 7500 }
    ]
  }
];

// Initialize localStorage DBs if empty
const DB_VERSION = "2.4"; // Increment this number every time you change defaultProducts
const storedProducts = JSON.parse(localStorage.getItem("copico_products"));
const currentVersion = localStorage.getItem("copico_db_version");

// Force update if storage is empty or if the version has changed
if (!storedProducts || currentVersion !== DB_VERSION) {
  localStorage.setItem("copico_products", JSON.stringify(defaultProducts));
  localStorage.setItem("copico_db_version", DB_VERSION);
}
let products = JSON.parse(localStorage.getItem("copico_products"));
let orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
let currentUser = JSON.parse(localStorage.getItem("copico_current_user")) || null;
let cart = JSON.parse(localStorage.getItem("copico_cart")) || [];

// Helper to get variant price directly from variant object
function getVariantPrice(product, variantName) {
  if (!product.variants || product.variants.length === 0) return product.price;
  const variant = product.variants.find(v => v.name === variantName);
  return variant ? variant.price : product.price;
}

// Global state for the product currently in the modal
let currentProductForModal = null;
let selectedVariant = null;


// AUTHENTICATION HELPER
function updateAuthNavbar() {
}

function logout() {
  if (confirm("Do you want to log out?")) {
    localStorage.removeItem("copico_current_user");
    localStorage.removeItem("copico_cart");
    currentUser = null;
    cart = [];
    alert("Logged out successfully.");
    window.location.href = "index.html";
  }
}

function logoutUser() {
  logout();
}

// Global click delegation to handle login/logout navigation reliably
document.addEventListener("click", (e) => {
  const userBtn = e.target.closest("#user-profile-btn");
  if (userBtn) {
    e.preventDefault();
    if (currentUser) {
      logout();
    } else {
      window.location.href = "login.html";
    }
  }
});


// SHOPPING CART LOGIC
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

function addToCart(productId, variant = null, qty = 1, customPrice = null) {
  if (!currentUser) {
    alert("Please log in first to add items to your cart!");
    window.location.href = "login.html";
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const finalPrice = customPrice !== null ? customPrice : product.price;

  const existingItem = cart.find(item => item.id === productId && item.variant === variant);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: variant ? `${product.name} (${variant})` : product.name,
      variant: variant,
      price: finalPrice,
      img: product.img,
      qty: qty
    });
  }

  saveCart();
  renderCart();
  updateCartBadge();

  // Show visual toast feedback
  showToast(`${product.name} ${variant ? '(' + variant + ')' : ''} added to cart!`);
}

function updateCartQty(productId, variant, newQty) {
  const item = cart.find(i => i.id === productId && i.variant === variant);
  if (!item) return;

  item.qty = parseInt(newQty);
  if (item.qty <= 0) {
    cart = cart.filter(i => !(i.id === productId && i.variant === variant));
  }

  saveCart();
  renderCart();
  updateCartBadge();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId); // This should probably also filter by variant if present
  saveCart();
  renderCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem("copico_cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-badge");
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items-container");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-basket"></i>
        <p>Your cart is empty.</p>
      </div>
    `;
    document.getElementById("cart-subtotal").textContent = "₱0.00";
    document.getElementById("cart-checkout-btn").disabled = true;
    return;
  }

  document.getElementById("cart-checkout-btn").disabled = false;
  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    const cost = item.price * item.qty;
    subtotal += cost;
    html += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₱${item.price}</div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  document.getElementById("cart-subtotal").textContent = `₱${subtotal.toLocaleString()}`;
}


// CHECKOUT & ORDERS FLOW

function openCheckoutModal() {
  if (cart.length === 0) return;
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.add("active");
    // Pre-populate customer name and details if logged in
    document.getElementById("customer-name").value = currentUser ? currentUser.fullname || currentUser.username : "";
    document.getElementById("customer-email").value = currentUser ? currentUser.email || "" : "";
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

let selectedPayment = "Cash";
function selectPaymentMethod(elem, method) {
  document.querySelectorAll(".payment-option").forEach(opt => opt.classList.remove("selected"));
  elem.classList.add("selected");
  selectedPayment = method;
}

function processCheckout(event) {
  event.preventDefault();
  if (cart.length === 0) return;

  const name = document.getElementById("customer-name").value;
  const email = document.getElementById("customer-email").value;
  const phone = document.getElementById("customer-phone").value;
  const address = document.getElementById("customer-address").value;

  if (!name || !phone || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  const orderId = "COP-" + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const newOrder = {
    id: orderId,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    customerAddress: address,
    username: currentUser ? currentUser.username : "guest",
    items: [...cart],
    total: totalAmount,
    paymentMethod: selectedPayment,
    status: "Pending",
    date: new Date().toISOString()
  };

  // Save order to global logs
  orders.push(newOrder);
  localStorage.setItem("copico_orders", JSON.stringify(orders));

  // Sync payments ledger automatically
  let payments = JSON.parse(localStorage.getItem("copico_payments")) || [];
  payments.push({
    id: "TRX-" + Math.floor(100000 + Math.random() * 900000),
    orderId: orderId,
    customerName: name,
    amount: totalAmount,
    method: selectedPayment,
    date: new Date().toISOString(),
    status: "Completed" // Paid status
  });
  localStorage.setItem("copico_payments", JSON.stringify(payments));

  // Clear cart
  cart = [];
  saveCart();
  updateCartBadge();
  closeCheckoutModal();
  toggleCart();

  alert(`Thank you! Order ${orderId} has been placed successfully.`);
  window.location.href = "orders.html";
}

// RENDERING VIEWS
function renderMenu() {
  const menuContainer = document.getElementById("customer-menu-grid");
  if (!menuContainer) return;

  if (products.length === 0) {
    menuContainer.innerHTML = "<p>No products available right now.</p>";
    return;
  }

  renderProductCards(products);
}

function renderProductCards(items) {
  const menuContainer = document.getElementById("customer-menu-grid");
  if (!menuContainer) return;

  let html = "";
  items.forEach(p => {
    html += `
      <div class="card" onclick="openProductDetail(${p.id})">
        <div class="card-img-wrapper">
          <img src="${p.img}" alt="${p.name}" onerror="this.src='https://pngimg.com/d/coffee_PNG9298.png'">
        </div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span>₱${p.price}</span>
          <button onclick="event.stopPropagation(); openProductDetail(${p.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  });
  menuContainer.innerHTML = html;
}

function updateProductModalDisplay() {
  if (!currentProductForModal) return;

  let price = currentProductForModal.price;

  // Use direct variant price if a variant is selected
  if (selectedVariant) {
    price = getVariantPrice(currentProductForModal, selectedVariant);
  }

  document.getElementById("detail-price").textContent = `₱${price.toLocaleString()}`;
  return price;
}

function openProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductForModal = product;
  // Initialize selectedVariant to the first available variant name, or null if none
  selectedVariant = product.variants && product.variants.length > 0 ? product.variants[0].name : null;

  // Ensure the variant group is visible if there are variants, otherwise hide it
  const variantGroup = document.getElementById("variant-group");
  if (product.variants && product.variants.length > 0) {
    variantGroup.style.display = "block";
  } else {
    variantGroup.style.display = "none";
  }

  document.getElementById("detail-img").src = product.img;
  document.getElementById("detail-name").textContent = product.name;
  document.getElementById("detail-desc").textContent = product.desc;
  document.getElementById("detail-qty").value = 1;

  updateProductModalDisplay(); // Set the initial price

  const variantContainer = document.getElementById("detail-variants");

  if (product.variants && product.variants.length > 0) {
    variantContainer.innerHTML = product.variants.map(v =>
      `<div class="variant-chip ${v.name === selectedVariant ? 'selected' : ''}" onclick="selectVariant('${v.name}', this)">${v.name}</div>`
    ).join('');
  }

  document.getElementById("product-detail-modal").classList.add("active");

  const addBtn = document.getElementById("add-to-cart-detail-btn");
  addBtn.onclick = () => {
    const qty = parseInt(document.getElementById("detail-qty").value);
    const calculatedPrice = updateProductModalDisplay(); // Get the currently displayed price
    let finalVariantName = selectedVariant || ""; // Use selectedVariant directly

    addToCart(productId, finalVariantName, qty, calculatedPrice);
    closeProductDetailModal();
  };
}

function selectVariant(variant, el) {
  selectedVariant = variant;
  document.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  // Update price when variant changes
  updateProductModalDisplay();
}

function updateDetailQty(change) {
  const input = document.getElementById("detail-qty");
  let val = parseInt(input.value) + change;
  if (val < 1) val = 1;
  input.value = val;
}

function closeProductDetailModal() {
  document.getElementById("product-detail-modal").classList.remove("active");
}


function filterMenu(category, btn) {
  document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if (category === "all") {
    renderProductCards(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProductCards(filtered);
  }
}

function searchMenu(query) {
  const q = query.toLowerCase().trim();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  renderProductCards(filtered);
}

function renderUserOrders(statusFilter, containerId) {
  const orderListContainer = document.getElementById(containerId);
  if (!orderListContainer) return;

  if (!currentUser) {
    orderListContainer.innerHTML = `
      <div class="notice">
        <p>Please <a href="login.html" style="color:var(--accent); font-weight:600;">log in</a> to see your order history.</p>
      </div>
    `;
    return;
  }

  // Get active user's orders
  let userOrders = orders.filter(o => o.username === currentUser.username);

  if (statusFilter !== 'all') {
    userOrders = userOrders.filter(o => o.status.toLowerCase() === statusFilter);
  }

  if (userOrders.length === 0) {
    orderListContainer.innerHTML = `
      <div class="notice">
        <p>You have not placed any orders yet. <a href="menu.html" style="color:var(--accent); font-weight:600;">Order Now</a></p>
      </div>
    `;
    return;
  }

  // Sort by date descending
  userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

  let html = "";
  userOrders.forEach(o => {
    const formattedDate = new Date(o.date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });

    let itemsHtml = "";
    o.items.forEach(item => {
      itemsHtml += `
        <li>
          <span>${item.name} (x${item.qty})</span>
          <span>₱${(item.price * item.qty).toLocaleString()}</span>
        </li>
      `;
    });

    const statusClass = o.status.toLowerCase();

    html += `
      <div class="order-card">
        <div class="order-header-row">
          <div>
            <div class="order-id">${o.id}</div>
            <div class="order-date">${formattedDate}</div>
          </div>
          <span class="badge-status ${statusClass}">${o.status}</span>
        </div>
        <ul class="order-items-list">
          ${itemsHtml}
        </ul>
        <div class="order-total-row">
          <span>Total Payment (${o.paymentMethod})</span>
          <span>₱${o.total.toLocaleString()}</span>
        </div>
      </div>
    `;
  });

  orderListContainer.innerHTML = html;
}

function switchOrdersTab(status, btn) {
  document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  document.getElementById("customer-current-orders-list").style.display = "none";
  document.getElementById("customer-completed-orders-list").style.display = "none";

  if (status === 'pending') {
    document.getElementById("customer-current-orders-list").style.display = "block";
    renderUserOrders('pending', 'customer-current-orders-list');
  } else if (status === 'completed') {
    document.getElementById("customer-completed-orders-list").style.display = "block";
    renderUserOrders('completed', 'customer-completed-orders-list');
  }
}

// SETTINGS HANDLERS
function applySavedTheme() {
  const savedTheme = localStorage.getItem("copico_theme") || "light";
  const themeCheckbox = document.getElementById("theme-toggle-checkbox");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeCheckbox) themeCheckbox.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    if (themeCheckbox) themeCheckbox.checked = false;
  }
}

function changeTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("copico_theme", isDark ? "dark" : "light");

  const themeCheckbox = document.getElementById("theme-toggle-checkbox");
  if (themeCheckbox) themeCheckbox.checked = isDark;

  showToast(`Switched to ${isDark ? "Dark" : "Light"} mode`);
}



function switchSettingsTab(tabId, btn) {
  // Deactivate all nav items
  document.querySelectorAll(".settings-nav-item").forEach(item => {
    item.classList.remove("active");
  });
  // Activate selected button
  btn.classList.add("active");

  // Hide all settings tabs
  document.querySelectorAll(".settings-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  // Show target settings tab
  const targetPane = document.getElementById(`settings-tab-${tabId}`);
  if (targetPane) {
    targetPane.classList.add("active");
  }
}

// Profile Management
function loadProfile() {
  if (!currentUser) return;
  const users = JSON.parse(localStorage.getItem("copico_users")) || [];
  const user = users.find(u => u.username === currentUser.username);
  if (!user) return;

  const firstname = document.getElementById("profile-firstname");
  const lastname = document.getElementById("profile-lastname");
  const birthdate = document.getElementById("profile-birthdate");
  const email = document.getElementById("profile-email");
  const mobile = document.getElementById("profile-mobile");

  if (firstname) firstname.value = user.firstname || (user.fullname ? user.fullname.split(' ')[0] : '') || '';
  if (lastname) lastname.value = user.lastname || (user.fullname && user.fullname.split(' ').length > 1 ? user.fullname.split(' ').slice(1).join(' ') : '') || '';
  if (birthdate) birthdate.value = user.birthdate || '';
  if (email) email.value = user.email || '';
  if (mobile) mobile.value = user.mobile || '';
}

function saveProfile(event) {
  event.preventDefault();
  if (!currentUser) {
    alert("Please log in first to update your profile.");
    window.location.href = "login.html";
    return;
  }

  const firstname = document.getElementById("profile-firstname").value.trim();
  const lastname = document.getElementById("profile-lastname").value.trim();
  const birthdate = document.getElementById("profile-birthdate").value;
  const email = document.getElementById("profile-email").value.trim();
  const mobile = document.getElementById("profile-mobile").value.trim();

  const users = JSON.parse(localStorage.getItem("copico_users")) || [];
  const userIdx = users.findIndex(u => u.username === currentUser.username);
  if (userIdx === -1) return;

  users[userIdx].firstname = firstname;
  users[userIdx].lastname = lastname;
  users[userIdx].fullname = `${firstname} ${lastname}`.trim();
  users[userIdx].birthdate = birthdate;
  users[userIdx].email = email;
  users[userIdx].mobile = mobile;

  localStorage.setItem("copico_users", JSON.stringify(users));
  // Update current user session
  currentUser = { ...currentUser, ...users[userIdx] };
  localStorage.setItem("copico_current_user", JSON.stringify(currentUser));

  showToast("Profile updated successfully!");
}

function changePassword(event) {
  event.preventDefault();
  if (!currentUser) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const currentPass = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  const users = JSON.parse(localStorage.getItem("copico_users")) || [];
  const user = users.find(u => u.username === currentUser.username);

  if (!user || user.password !== currentPass) {
    alert("Current password is incorrect.");
    return;
  }

  if (newPass.length < 4) {
    alert("New password must be at least 4 characters.");
    return;
  }

  if (newPass !== confirmPass) {
    alert("New password and confirmation do not match.");
    return;
  }

  user.password = newPass;
  localStorage.setItem("copico_users", JSON.stringify(users));

  document.getElementById("current-password").value = '';
  document.getElementById("new-password").value = '';
  document.getElementById("confirm-password").value = '';

  showToast("Password changed successfully!");
}

function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const type = field.getAttribute("type") === "password" ? "text" : "password";
  field.setAttribute("type", type);
}

// Notification Preferences
function togglePushNotifications() {
  const checkbox = document.getElementById("push-notif-toggle");
  if (!checkbox) return;
  const enabled = checkbox.checked;
  localStorage.setItem("copico_push_notif", enabled ? "true" : "false");

  if (enabled) {
    if (Notification.permission === "granted") {
      new Notification("Copi.co Coffee Shop", {
        body: "Push notifications enabled!",
        icon: "../assets/logo.png"
      });
      showToast("Push notifications enabled!");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showToast("Push notifications enabled!");
        } else {
          checkbox.checked = false;
          localStorage.setItem("copico_push_notif", "false");
          showToast("Permission denied for notifications.");
        }
      });
    } else {
      checkbox.checked = false;
      localStorage.setItem("copico_push_notif", "false");
      showToast("Notifications are blocked by your browser.");
    }
  } else {
    showToast("Push notifications disabled.");
  }
}

function toggleEmailNotifications() {
  const checkbox = document.getElementById("email-notif-toggle");
  if (!checkbox) return;
  const enabled = checkbox.checked;
  localStorage.setItem("copico_email_notif", enabled ? "true" : "false");
  showToast(enabled ? "Email notifications enabled!" : "Email notifications disabled.");
}

function loadNotificationPreferences() {
  const pushToggle = document.getElementById("push-notif-toggle");
  const emailToggle = document.getElementById("email-notif-toggle");
  if (pushToggle) pushToggle.checked = localStorage.getItem("copico_push_notif") === "true";
  if (emailToggle) emailToggle.checked = localStorage.getItem("copico_email_notif") === "true";
}

function resetWebsite() {
  if (confirm("This will clear user login, orders, cart and reset all settings. Proceed?")) {
    localStorage.clear();
    alert("Website data reset completely.");
    window.location.href = "index.html";
  }
}

// Helper toast notification
function showToast(message) {
  let toast = document.getElementById("toast-feedback");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-feedback";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(78, 52, 46, 0.95)";
    toast.style.border = "1px solid var(--accent)";
    toast.style.color = "white";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "25px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "500";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    toast.style.transition = "opacity 0.3s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}

window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  updateAuthNavbar();
  updateCartBadge();
  renderCart();

  // Set active link in nav
  const filename = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav ul li a").forEach(link => {
    if (link.getAttribute("href") === filename || (filename === "" && link.getAttribute("href") === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Render view-specific pages
  if (document.getElementById("customer-menu-grid")) {
    renderMenu();
  }
  if (document.getElementById("customer-orders-list")) {
    // Initialize orders page with current orders tab active
    const currentOrdersTab = document.querySelector(".filter-tabs .filter-tab.active");
    if (currentOrdersTab) {
      const status = currentOrdersTab.getAttribute('onclick').match(/'([^']+)'/)[1];
      switchOrdersTab(status, currentOrdersTab);
    }
  }

  // Settings page initialization
  if (document.getElementById("profile-form")) {
    loadProfile();
    loadNotificationPreferences();
  }

  // Burger Menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }
});
