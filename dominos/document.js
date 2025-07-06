document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const cartIcon = document.querySelector(".cart-icon");
  const closeSidebar = document.querySelector(".sidebar-close");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-icon span");
  const cartTotal = document.querySelector(".cart-total");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const modal = document.getElementById("checkoutModal");
  const confirmBtn = document.getElementById("confirmCheckoutBtn");
  const cancelBtn = document.getElementById("cancelCheckoutBtn");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  const cartItems = [];
  let total = 0;
  let itemCount = 0;

  cartIcon.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  addToCartBtns.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const title = card.querySelector(".card--title").textContent;
      const price = parseFloat(card.querySelector(".card--price").textContent.replace("$", ""));
      const existingItem = cartItems.find(item => item.title === title);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push({ title, price, quantity: 1 });
      }

      total += price;
      itemCount++;
      cartCount.textContent = itemCount;
      cartTotal.textContent = `$${total.toFixed(2)}`;
      renderCart();
    });
  });

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    cartItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("individual-cart-item");
      div.innerHTML = `
        <span>${item.title}</span>
        <div>
          <div class="quantity-control">
            <button class="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="increase">+</button>
          </div>
        </div>
      `;

      const decrease = div.querySelector(".decrease");
      const increase = div.querySelector(".increase");

      decrease.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
          total -= item.price;
          itemCount--;
        } else {
          total -= item.price;
          itemCount--;
          cartItems.splice(index, 1);
        }
        cartCount.textContent = itemCount;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        renderCart();
      });

      increase.addEventListener("click", () => {
        item.quantity++;
        total += item.price;
        itemCount++;
        cartCount.textContent = itemCount;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        renderCart();
      });

      cartItemsContainer.appendChild(div);
    });
  }

  checkoutBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  confirmBtn.addEventListener("click", () => {
    alert("Thank you for your purchase!");
    cartItems.length = 0;
    total = 0;
    itemCount = 0;
    cartCount.textContent = itemCount;
    cartTotal.textContent = "$0.00";
    renderCart();
    sidebar.classList.remove("open");
    modal.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Category Filter
  document.querySelectorAll(".category-filter button").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      document.querySelectorAll(".card").forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Search Filter
  const searchInput = document.querySelector(".search--box input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".card").forEach(card => {
      const title = card.querySelector(".card--title").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "flex" : "none";
    });
  });
});
