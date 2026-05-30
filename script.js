// SAVE ORDERS
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ADD ORDER
function addOrder(item){

  orders.push(item);

  localStorage.setItem("orders", JSON.stringify(orders));

  alert(item + " added to orders!");

}

// DISPLAY ORDERS
function displayOrders(){

  const orderList = document.getElementById("orderList");

  if(orderList){

    orderList.innerHTML = "";

    orders.forEach(order => {

      const li = document.createElement("li");

      li.textContent = order;

      orderList.appendChild(li);

    });

  }

}

displayOrders();

// CLEAR ORDERS
function clearOrders(){

  orders = [];

  localStorage.removeItem("orders");

  displayOrders();

}

// DARK MODE
function changeTheme(){

  document.body.classList.toggle("dark-mode");

}

// CHANGE BACKGROUND
function changeBackground(){

  const backgrounds = [

    "url('images/background.jpg')",
    "url('images/background2.jpg')",
    "url('images/background3.jpg')"

  ];

  const randomBg =
  backgrounds[Math.floor(Math.random() * backgrounds.length)];

  document.body.style.backgroundImage =
  "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), " + randomBg;

}

// ==========================
// BURGER MENU FUNCTION
// ==========================

const menuToggle = document.getElementById("menu-toggle");

const navbar = document.getElementById("navbar");

// CHECK IF ELEMENT EXISTS
if(menuToggle && navbar){

  menuToggle.addEventListener("click", function(){

    navbar.classList.toggle("active");

  });

}