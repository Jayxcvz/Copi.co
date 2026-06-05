// Copi.co Customer Script

// STATE MANAGEMENT & MOCK DATA
const defaultProducts = [
  { id: 1, name: "Arabica", category: "beans", price: 450, desc: "100% Arabica beans, known for their sweet, complex flavor profile.", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600", variants: ["250g starter", "500g", "1kg"] },
  { id: 2, name: "Robusta", category: "beans", price: 350, desc: "High-caffeine Robusta beans with a strong, earthy flavor and rich crema.", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=600", variants: ["250g starter", "500g", "1kg"] },
  { id: 3, name: "Liberica", category: "beans", price: 550, desc: "Rare Liberica beans with a distinct smoky, floral aroma and fruity taste.", img: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=600", variants: ["250g starter", "500g", "1kg"] },
  { id: 4, name: "Excelsa", category: "beans", price: 480, desc: "Fruity and tart Excelsa beans that add complexity to any coffee blend.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600", variants: ["250g starter", "500g", "1kg"] },
  { id: 5, name: "Matcha (Ceremonial)", category: "matcha", price: 1200, desc: "The highest grade of matcha, intended for traditional whisking with water.", img: "https://images.unsplash.com/photo-1582782622744-8071a2bc9a0b?q=80&w=600", variants: ["50g", "250g", "500g", "1kg"] },
  { id: 6, name: "Matcha (Premium)", category: "matcha", price: 850, desc: "High-quality matcha suitable for daily drinking and premium lattes.", img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600", variants: ["50g", "250g", "500g", "1kg"] },
  { id: 7, name: "Matcha (Culinary)", category: "matcha", price: 500, desc: "Perfect for cooking, baking, and smoothies, offering a robust matcha flavor.", img: "https://images.unsplash.com/photo-1528667853120-7f415309605b?q=80&w=600", variants: ["50g", "250g", "500g", "1kg"] },
  { id: 8, name: "French Press", category: "equipment", price: 1500, desc: "Classic glass and stainless steel plunger for full-bodied coffee.", img: "https://images.unsplash.com/photo-1544650558-d129650742d1?q=80&w=600", variants: ["3-cup", "8-cup"] },
  { id: 9, name: "Moka Pot", category: "equipment", price: 1200, desc: "Iconic Italian stovetop espresso maker for a strong and intense brew.", img: "https://images.unsplash.com/photo-1594052119749-99458a95f0cf?q=80&w=600", variants: ["3-cup", "6-cup"] },
  { id: 10, name: "V60 Dripper", category: "equipment", price: 800, desc: "Hario V60 ceramic dripper for a clean and flavorful pour-over experience.", img: "https://images.unsplash.com/photo-1544650558-d129650742d1?q=80&w=600", variants: ["Size 01", "Size 02"] },
  { id: 11, name: "Drip Coffee Maker", category: "equipment", price: 2500, desc: "Reliable automatic machine for brewing a perfect pot of coffee.", img: "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=600", variants: ["Standard"] },
  { id: 12, name: "Pod Machine", category: "equipment", price: 4500, desc: "Speed and convenience in every cup with this single-serve brewer.", img: "https://images.unsplash.com/photo-1565452344518-47fca9946476?q=80&w=600", variants: ["Standard"] },
  { id: 13, name: "Espresso Machine", category: "equipment", price: 12500, desc: "Semi-automatic machine for crafting barista-quality espresso at home.", img: "https://images.unsplash.com/photo-1559496413-f0cf0594877d?q=80&w=600", variants: ["Black", "Silver"] },
  { id: 14, name: "Burr Grinder", category: "equipment", price: 3500, desc: "Precision burrs for a consistent grind size, essential for great coffee.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600", variants: ["Manual", "Electric"] },
  { id: 15, name: "Automatic Milk Frother", category: "equipment", price: 1800, desc: "Create café-quality foam for your lattes and cappuccinos instantly.", img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600", variants: ["Standard"] },
  { id: 16, name: "Paper Filters", category: "equipment", price: 250, desc: "High-quality paper filters for a clean and sediment-free cup.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600", variants: ["100pcs"] },
  { id: 17, name: "Full Matcha Starter Set", category: "matcha", price: 2500, desc: "Everything needed: bowl, whisk, scoop, sifter, and ceremonial matcha.", img: "https://images.unsplash.com/photo-1627435601361-ec25f6b8b08f?q=80&w=600", variants: ["Standard"] },
  { id: 18, name: "Premium Matcha Set", category: "matcha", price: 3500, desc: "Luxury collection featuring an artisan bowl and 100-prong bamboo whisk.", img: "https://images.unsplash.com/photo-1627435601361-ec25f6b8b08f?q=80&w=600", variants: ["Standard"] }
];

// Initialize localStorage DBs if empty
const storedProducts = JSON.parse(localStorage.getItem("copico_products"));
// Force update if empty, if we need to reach the 18 items count, or if names haven't been updated to the new list
if (!storedProducts || storedProducts.length < 18 || (storedProducts[0] && storedProducts[0].category !== "beans")) {
  localStorage.setItem("copico_products", JSON.stringify(defaultProducts));
}
let products = JSON.parse(localStorage.getItem("copico_products"));
let orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
let currentUser = JSON.parse(localStorage.getItem("copico_current_user")) || null;
let cart = JSON.parse(localStorage.getItem("copico_cart")) || [];

// Helper for variant price multipliers
function getVariantPriceMultiplier(category, variant) {
  if (category === 'beans') {
    if (variant === '250g starter') return 1.0;
    if (variant === '500g') return 1.8;
    if (variant === '1kg') return 3.2;
  } else if (category === 'matcha') {
    // Base price for matcha is for 50g
    if (variant === '50g') return 1.0; 
    if (variant === '250g') return 4.0; // 5x quantity, 4x price for discount
    if (variant === '500g') return 7.5; // 10x quantity, 7.5x price for discount
    if (variant === '1kg') return 14.0; // 20x quantity, 14x price for discount
  }
  return 1.0; // Default multiplier for other categories or unknown variants
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
  
  // Apply variant multiplier if a variant is selected and it's a consumable
  if (selectedVariant && (currentProductForModal.category === 'beans' || currentProductForModal.category === 'matcha')) {
    const multiplier = getVariantPriceMultiplier(currentProductForModal.category, selectedVariant);
    price = Math.round(currentProductForModal.price * multiplier); // Base price * multiplier
  }
  
  document.getElementById("detail-price").textContent = `₱${price.toLocaleString()}`;
  return price;
}

function openProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductForModal = product;
  // Initialize selectedVariant to the first available variant, or null if none
  selectedVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  
  // Hide grams-group (it's removed from HTML, but this ensures no JS errors if it was there)
  // This line is now redundant as the grams-group is removed from HTML
  // const gramsGroup = document.getElementById("grams-group");
  // if (gramsGroup) gramsGroup.style.display = "none";

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
  
  updateProductModalDisplay(); // Call the new display update function to set the initial price

  const variantContainer = document.getElementById("detail-variants");
  
  if (product.variants && product.variants.length > 0) {
    variantContainer.innerHTML = product.variants.map(v => 
      `<div class="variant-chip ${v === selectedVariant ? 'selected' : ''}" onclick="selectVariant('${v}', this)">${v}</div>`
    ).join('');
  } else {
    // This is already handled above, but good to keep for clarity if structure changes
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
