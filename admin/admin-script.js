// Copi.co Admin Script — Unified State Controller

// SHARED SIDEBAR & TOPBAR LOGIC
function initSidebar() {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("admin-sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
    });
  }
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  }

  // Highlight active nav link
  const filename = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === filename) {
      link.classList.add("active");
    }
  });

  // Update pending orders badge
  const pendingBadge = document.getElementById("pending-orders-badge");
  if (pendingBadge) {
    const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
    const pending = orders.filter(o => o.status === "Pending").length;
    pendingBadge.textContent = pending;
    pendingBadge.style.display = pending > 0 ? "flex" : "none";
  }
}

function adminLogout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("copico_admin_user");
    window.location.href = "login.html";
  }
}

function checkAdminAuth() {
  const admin = JSON.parse(localStorage.getItem("copico_admin_user"));
  if (!admin) {
    window.location.href = "login.html";
  }
  return admin;
}

// =============================================
// DASHBOARD METRICS
// =============================================
function renderDashboardMetrics() {
  const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
  const customers = JSON.parse(localStorage.getItem("copico_customers")) || [];
  const payments = JSON.parse(localStorage.getItem("copico_payments")) || [];

  const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  setMetric("metric-sales", `₱${totalSales.toLocaleString()}`);
  setMetric("metric-orders", totalOrders);
  setMetric("metric-customers", totalCustomers);
  setMetric("metric-avg", `₱${avgOrder.toLocaleString()}`);
}

function setMetric(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// =============================================
// SALES CHART (Chart.js)
// =============================================
function renderSalesChart() {
  const canvas = document.getElementById("sales-chart");
  if (!canvas) return;

  const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];

  // Aggregate last 7 days of sales
  const labels = [];
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    labels.push(dateStr);

    const daySales = orders
      .filter(o => {
        const od = new Date(o.date);
        return od.toDateString() === d.toDateString();
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    data.push(daySales);
  }

  // If all data = 0, add sample data for visual appeal
  const hasData = data.some(v => v > 0);
  const chartData = hasData ? data : [1200, 1800, 1400, 2200, 1900, 2500, 2100];

  new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Sales (₱)",
        data: chartData,
        borderColor: "#ffd27d",
        backgroundColor: "rgba(255, 210, 125, 0.1)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ffd27d",
        pointBorderColor: "#0f0a08",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(26, 18, 16, 0.95)",
          titleColor: "#ffd27d",
          bodyColor: "#f5f0eb",
          borderColor: "rgba(255, 210, 125, 0.2)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.03)" },
          ticks: { color: "#6b5f56", font: { size: 11 } }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.03)" },
          ticks: {
            color: "#6b5f56",
            font: { size: 11 },
            callback: v => "₱" + v.toLocaleString()
          }
        }
      }
    }
  });
}

// TRENDING PRODUCTS
function renderTrendingProducts() {
  const container = document.getElementById("trending-list");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
  const productCounts = {};

  orders.forEach(o => {
    (o.items || []).forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + item.qty;
    });
  });

  let sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // If no data, show sample
  if (sorted.length === 0) {
    sorted = [["Espresso", 24], ["Latte", 18], ["Cappuccino", 15], ["Mocha", 12], ["Cold Brew", 9]];
  }

  const maxCount = sorted[0][1];

  let html = "";
  sorted.forEach(([name, count], i) => {
    const pct = Math.round((count / maxCount) * 100);
    html += `
      <div class="trending-item">
        <div class="trending-rank">${i + 1}</div>
        <div class="trending-info">
          <h4>${name}</h4>
          <p>${count} orders</p>
        </div>
        <div class="trending-bar">
          <div class="trending-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}


// ADMIN MENU MANAGEMENT (CRUD)
let editingProductId = null;

function renderAdminMenu() {
  const tbody = document.getElementById("admin-menu-tbody");
  if (!tbody) return;

  const products = JSON.parse(localStorage.getItem("copico_products")) || [];

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-coffee"></i><p>No products yet. Add your first coffee item!</p></div></td></tr>`;
    return;
  }

  let html = "";
  products.forEach(p => {
    html += `
      <tr>
        <td><img src="${p.img}" alt="${p.name}" style="width:40px;height:40px;object-fit:contain;border-radius:8px;"></td>
        <td style="font-weight:500;color:var(--text-primary)">${p.name}</td>
        <td>${p.category || "—"}</td>
        <td style="color:var(--accent);font-weight:600">₱${p.price}</td>
        <td>${p.desc}</td>
        <td>
          <div style="display:flex;gap:8px;">
            <button class="btn-info" onclick="openEditProduct(${p.id})"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function openAddProduct() {
  editingProductId = null;
  document.getElementById("product-modal-title").textContent = "Add New Product";
  document.getElementById("prod-name").value = "";
  document.getElementById("prod-category").value = "hot";
  document.getElementById("prod-price").value = "";
  document.getElementById("prod-desc").value = "";
  document.getElementById("prod-img").value = "";
  document.getElementById("product-modal").classList.add("active");
}

function openEditProduct(id) {
  const products = JSON.parse(localStorage.getItem("copico_products")) || [];
  const p = products.find(x => x.id === id);
  if (!p) return;

  editingProductId = id;
  document.getElementById("product-modal-title").textContent = "Edit Product";
  document.getElementById("prod-name").value = p.name;
  document.getElementById("prod-category").value = p.category || "hot";
  document.getElementById("prod-price").value = p.price;
  document.getElementById("prod-desc").value = p.desc;
  document.getElementById("prod-img").value = p.img;
  document.getElementById("product-modal").classList.add("active");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("active");
}

function saveProduct(event) {
  event.preventDefault();
  const products = JSON.parse(localStorage.getItem("copico_products")) || [];

  const name = document.getElementById("prod-name").value.trim();
  const category = document.getElementById("prod-category").value;
  const price = parseInt(document.getElementById("prod-price").value);
  const desc = document.getElementById("prod-desc").value.trim();
  const img = document.getElementById("prod-img").value.trim() || "https://pngimg.com/d/coffee_PNG9298.png";

  if (!name || !price) { alert("Name and Price are required."); return; }

  if (editingProductId !== null) {
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, desc, img };
    }
  } else {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, category, price, desc, img });
  }

  localStorage.setItem("copico_products", JSON.stringify(products));
  closeProductModal();
  renderAdminMenu();
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  let products = JSON.parse(localStorage.getItem("copico_products")) || [];
  products = products.filter(p => p.id !== id);
  localStorage.setItem("copico_products", JSON.stringify(products));
  renderAdminMenu();
}

function searchAdminMenu(query) {
  const tbody = document.getElementById("admin-menu-tbody");
  if (!tbody) return;
  const products = JSON.parse(localStorage.getItem("copico_products")) || [];
  const q = query.toLowerCase().trim();
  const filtered = q ? products.filter(p => p.name.toLowerCase().includes(q)) : products;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No matching products.</p></div></td></tr>`;
    return;
  }

  let html = "";
  filtered.forEach(p => {
    html += `
      <tr>
        <td><img src="${p.img}" alt="${p.name}" style="width:40px;height:40px;object-fit:contain;border-radius:8px;"></td>
        <td style="font-weight:500;color:var(--text-primary)">${p.name}</td>
        <td>${p.category || "—"}</td>
        <td style="color:var(--accent);font-weight:600">₱${p.price}</td>
        <td>${p.desc}</td>
        <td>
          <div style="display:flex;gap:8px;">
            <button class="btn-info" onclick="openEditProduct(${p.id})"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// ADMIN ORDERS MANAGEMENT
function renderAdminOrders() {
  const tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No orders yet.</p></div></td></tr>`;
    return;
  }

  const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

  let html = "";
  sorted.forEach(o => {
    const d = new Date(o.date);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const timeStr = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const itemNames = (o.items || []).map(i => `${i.name} x${i.qty}`).join(", ");
    const statusClass = o.status === "Completed" ? "completed" : "pending";

    html += `
      <tr>
        <td style="font-weight:600;color:var(--accent)">${o.id}</td>
        <td style="color:var(--text-primary)">${o.customerName}</td>
        <td title="${itemNames}">${itemNames.length > 40 ? itemNames.substring(0, 40) + "…" : itemNames}</td>
        <td style="font-weight:600">₱${(o.total || 0).toLocaleString()}</td>
        <td>${dateStr}<br><span style="font-size:11px;color:var(--text-muted)">${timeStr}</span></td>
        <td><span class="status-badge ${statusClass}">${o.status}</span></td>
        <td>
          ${o.status === "Pending"
        ? `<button class="btn-success" onclick="completeOrder('${o.id}')"><i class="fas fa-check"></i> Complete</button>`
        : `<span style="color:var(--text-muted);font-size:12px">Done</span>`
      }
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function completeOrder(orderId) {
  let orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return;

  orders[idx].status = "Completed";
  localStorage.setItem("copico_orders", JSON.stringify(orders));

  // Update customer stats
  const order = orders[idx];
  let customers = JSON.parse(localStorage.getItem("copico_customers")) || [];
  const custIdx = customers.findIndex(c => c.username === order.username);
  if (custIdx !== -1) {
    customers[custIdx].ordersCount = (customers[custIdx].ordersCount || 0) + 1;
    customers[custIdx].totalSpent = (customers[custIdx].totalSpent || 0) + (order.total || 0);
    localStorage.setItem("copico_customers", JSON.stringify(customers));
  }

  renderAdminOrders();
}

function searchAdminOrders(query) {
  const tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;
  const orders = JSON.parse(localStorage.getItem("copico_orders")) || [];
  const q = query.toLowerCase().trim();
  const filtered = q ? orders.filter(o =>
    o.id.toLowerCase().includes(q) ||
    o.customerName.toLowerCase().includes(q)
  ) : orders;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><p>No matching orders.</p></div></td></tr>`;
    return;
  }

  // Re-render just filtered results
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  let html = "";
  sorted.forEach(o => {
    const d = new Date(o.date);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const timeStr = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const itemNames = (o.items || []).map(i => `${i.name} x${i.qty}`).join(", ");
    const statusClass = o.status === "Completed" ? "completed" : "pending";

    html += `
      <tr>
        <td style="font-weight:600;color:var(--accent)">${o.id}</td>
        <td style="color:var(--text-primary)">${o.customerName}</td>
        <td>${itemNames.length > 40 ? itemNames.substring(0, 40) + "…" : itemNames}</td>
        <td style="font-weight:600">₱${(o.total || 0).toLocaleString()}</td>
        <td>${dateStr}<br><span style="font-size:11px;color:var(--text-muted)">${timeStr}</span></td>
        <td><span class="status-badge ${statusClass}">${o.status}</span></td>
        <td>
          ${o.status === "Pending"
        ? `<button class="btn-success" onclick="completeOrder('${o.id}')"><i class="fas fa-check"></i> Complete</button>`
        : `<span style="color:var(--text-muted);font-size:12px">Done</span>`
      }
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// ADMIN PAYMENTS
function renderAdminPayments() {
  const tbody = document.getElementById("admin-payments-tbody");
  if (!tbody) return;

  const payments = JSON.parse(localStorage.getItem("copico_payments")) || [];

  if (payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-receipt"></i><p>No payment records yet.</p></div></td></tr>`;
    return;
  }

  const sorted = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));
  let html = "";
  sorted.forEach(p => {
    const d = new Date(p.date);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const timeStr = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

    html += `
      <tr>
        <td style="font-weight:500;color:var(--text-primary)">${p.id}</td>
        <td>${p.orderId}</td>
        <td>${p.customerName}</td>
        <td style="font-weight:600;color:var(--accent)">₱${(p.amount || 0).toLocaleString()}</td>
        <td>${p.method}</td>
        <td>${dateStr} ${timeStr}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;

  // Summary
  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const sumEl = document.getElementById("payments-total");
  if (sumEl) sumEl.textContent = `₱${totalPaid.toLocaleString()}`;
}

// ADMIN CUSTOMERS
function renderAdminCustomers() {
  const tbody = document.getElementById("admin-customers-tbody");
  if (!tbody) return;

  const customers = JSON.parse(localStorage.getItem("copico_customers")) || [];

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><p>No customers registered yet.</p></div></td></tr>`;
    return;
  }

  let html = "";
  customers.forEach(c => {
    const joined = c.dateAdded ? new Date(c.dateAdded).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

    html += `
      <tr>
        <td style="font-weight:500;color:var(--text-primary)">${c.fullname || c.username}</td>
        <td>${c.username}</td>
        <td>${c.email || "—"}</td>
        <td>${c.ordersCount || 0}</td>
        <td style="color:var(--accent);font-weight:600">₱${(c.totalSpent || 0).toLocaleString()}</td>
        <td>${joined}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// INIT ON PAGE LOAD
window.addEventListener("DOMContentLoaded", () => {
  initSidebar();

  // Page-specific rendering
  if (document.getElementById("metric-sales")) {
    renderDashboardMetrics();
    renderSalesChart();
    renderTrendingProducts();
  }
  if (document.getElementById("admin-menu-tbody")) renderAdminMenu();
  if (document.getElementById("admin-orders-tbody")) renderAdminOrders();
  if (document.getElementById("admin-payments-tbody")) renderAdminPayments();
  if (document.getElementById("admin-customers-tbody")) renderAdminCustomers();
});
