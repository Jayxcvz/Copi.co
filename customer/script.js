// Copi.co Customer Script

// ----------------------------------------------------
// STATE MANAGEMENT & MOCK DATA
// ----------------------------------------------------
const defaultProducts = [
  { id: 1, name: "Espresso", category: "hot", price: 120, desc: "Strong premium coffee shot.", img: "https://pngimg.com/d/coffee_PNG9298.png" },
  { id: 2, name: "Latte", category: "hot", price: 150, desc: "Creamy milk coffee blend.", img: "https://pngimg.com/d/coffee_PNG16874.png" },
  { id: 3, name: "Cappuccino", category: "hot", price: 160, desc: "Foamy classic coffee drink.", img: "https://pngimg.com/d/coffee_PNG16870.png" },
  { id: 4, name: "Mocha", category: "hot", price: 170, desc: "Chocolate flavored coffee.", img: "https://pngimg.com/d/coffee_PNG16876.png" },
  { id: 5, name: "Americano", category: "hot", price: 140, desc: "Smooth and bold coffee.", img: "https://pngimg.com/d/coffee_PNG16873.png" },
  { id: 6, name: "Caramel Macchiato", category: "iced", price: 190, desc: "Sweet caramel espresso drink.", img: "https://pngimg.com/d/coffee_PNG16875.png" },
  { id: 7, name: "Vanilla Latte", category: "iced", price: 180, desc: "Sweet vanilla creamy latte.", img: "https://pngimg.com/d/coffee_PNG9295.png" },
  { id: 8, name: "Hazelnut Coffee", category: "hot", price: 175, desc: "Nutty flavored coffee blend.", img: "https://pngimg.com/d/coffee_PNG9299.png" },
  { id: 9, name: "Iced Coffee", category: "iced", price: 160, desc: "Refreshing cold brew drink.", img: "https://pngimg.com/d/coffee_PNG16872.png" },
  { id: 10, name: "Cold Brew", category: "iced", price: 200, desc: "Slow brewed smooth coffee.", img: "https://pngimg.com/d/coffee_PNG16877.png" }
];

// Initialize localStorage DBs if empty
if (!localStorage.getItem("copico_products")) {
  localStorage.setItem("copico_products", JSON.stringify(defaultProducts));
}
let products = JSON.parse(localStorage.getItem("copico_products"));
let orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
let currentUser = JSON.parse(localStorage.getItem("copico_current_user")) || null;
let cart = JSON.parse(localStorage.getItem("copico_cart")) || [];

// ----------------------------------------------------
// AUTHENTICATION HELPER
// ----------------------------------------------------
function updateAuthNavbar() {
  const userBtn = document.getElementById("user-profile-btn");
  if (userBtn) {
    if (currentUser) {
      userBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
      userBtn.title = `Logout (${currentUser.username})`;
      userBtn.onclick = logoutUser;
    } else {
      userBtn.innerHTML = `<i class="fas fa-user"></i>`;
      userBtn.title = "Login / Register";
      userBtn.onclick = () => window.location.href = "login.html";
    }
  }
}

function logoutUser() {
  if (confirm("Do you want to log out?")) {
    localStorage.removeItem("copico_current_user");
    localStorage.removeItem("copico_cart");
    currentUser = null;
    cart = [];
    alert("Logged out successfully.");
    window.location.href = "index.html";
  }
}

// ----------------------------------------------------
// SHOPPING CART LOGIC
// ----------------------------------------------------
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

function addToCart(productId) {
  if (!currentUser) {
    alert("Please log in first to add items to your cart!");
    window.location.href = "login.html";
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  updateCartBadge();

  // Show visual toast feedback
  showToast(`${product.name} added to cart!`);
}

function updateCartQty(productId, newQty) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty = parseInt(newQty);
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  renderCart();
  updateCartBadge();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
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
      <div class="card">
        <div class="card-img-wrapper">
          <img src="${p.img}" alt="${p.name}" onerror="this.src='https://pngimg.com/d/coffee_PNG9298.png'">
        </div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span>₱${p.price}</span>
          <button onclick="addToCart(${p.id})">
            <i class="fas fa-shopping-cart"></i> Add Order
          </button>
        </div>
      </div>
    `;
  });
  menuContainer.innerHTML = html;
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

function renderOrdersHistory() {
  const orderList = document.getElementById("customer-orders-list");
  if (!orderList) return;

  if (!currentUser) {
    orderList.innerHTML = `
      <div class="notice">
        <p>Please <a href="login.html" style="color:var(--accent); font-weight:600;">log in</a> to see your order history.</p>
      </div>
    `;
    return;
  }

  // Get active user's orders
  const userOrders = orders.filter(o => o.username === currentUser.username);

  if (userOrders.length === 0) {
    orderList.innerHTML = `
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

  orderList.innerHTML = html;
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

function changeBackground() {
  const backgrounds = [
    "linear-gradient(rgba(30, 23, 21, 0.7), rgba(30, 23, 21, 0.85))",
    "linear-gradient(rgba(45, 30, 20, 0.8), rgba(45, 30, 20, 0.9))",
    "linear-gradient(rgba(15, 10, 8, 0.75), rgba(15, 10, 8, 0.88))"
  ];

  let bgIdx = parseInt(localStorage.getItem("copico_bg_idx") || "0");
  bgIdx = (bgIdx + 1) % backgrounds.length;
  localStorage.setItem("copico_bg_idx", bgIdx.toString());

  document.body.style.background = `${backgrounds[bgIdx]}, url('../assets/bg.png')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  showToast("Atmosphere changed!");
}

let isPlaying = false;
function toggleMusic() {
  const audio = document.getElementById("cafeMusic");
  if (!audio) return;

  const btn = document.getElementById("music-play-btn");

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    if (btn) btn.innerHTML = `<i class="fas fa-play"></i> Play Melody`;
    showToast("Ambient music paused");
  } else {
    audio.play().then(() => {
      isPlaying = true;
      if (btn) btn.innerHTML = `<i class="fas fa-pause"></i> Pause Melody`;
      showToast("Playing relaxing ambient music");
    }).catch(err => {
      alert("Please allow audio permissions in your browser.");
    });
  }
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Copi.co Coffee Shop", {
      body: "Order notifications enabled successfully!",
      icon: "../assets/logo.png"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showNotification();
      }
    });
  }
  showToast("Notifications enabled!");
}

let fontSizeScale = 1;
function changeFontSize() {
  const scales = [1.0, 1.15, 0.85];
  let fontIdx = parseInt(localStorage.getItem("copico_font_idx") || "0");
  fontIdx = (fontIdx + 1) % scales.length;
  localStorage.setItem("copico_font_idx", fontIdx.toString());

  const scale = scales[fontIdx];
  document.documentElement.style.fontSize = scale === 1.0 ? "100%" : `${scale * 100}%`;
  showToast(`Text size scaled to ${scale * 100}%`);
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


// WINDOW INITIALIZATION
function applySavedFontScale() {
  const scales = [1.0, 1.15, 0.85];
  const fontIdx = parseInt(localStorage.getItem("copico_font_idx") || "0");
  const scale = scales[fontIdx];
  document.documentElement.style.fontSize = scale === 1.0 ? "100%" : `${scale * 100}%`;
}

function applySavedBackground() {
  const backgrounds = [
    "linear-gradient(rgba(30, 23, 21, 0.7), rgba(30, 23, 21, 0.85))",
    "linear-gradient(rgba(45, 30, 20, 0.8), rgba(45, 30, 20, 0.9))",
    "linear-gradient(rgba(15, 10, 8, 0.75), rgba(15, 10, 8, 0.88))"
  ];
  const bgIdx = parseInt(localStorage.getItem("copico_bg_idx") || "0");
  document.body.style.background = `${backgrounds[bgIdx]}, url('../assets/bg.png')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  applySavedFontScale();
  applySavedBackground();
  updateAuthNavbar();
  updateCartBadge();

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
    renderCart();
  }
  if (document.getElementById("customer-orders-list")) {
    renderOrdersHistory();
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
