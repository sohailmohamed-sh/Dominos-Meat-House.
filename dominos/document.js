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
  const searchInput = document.querySelector(".search--box input");

  const cartItems = [];
  let total = 0;
  let itemCount = 0;

  // Open sidebar
  cartIcon.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  // Close sidebar
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Add item to cart
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

  // Render cart items
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
          itemCount -= item.quantity;
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

  // On Checkout click
  checkoutBtn.addEventListener("click", () => {
    sidebar.classList.remove("open"); // ✅ Close sidebar
    modal.classList.remove("hidden"); // ✅ Show modal
  });

  // Confirm Checkout
  confirmBtn.addEventListener("click", () => {
    alert("Thank you for your purchase!");
    cartItems.length = 0;
    total = 0;
    itemCount = 0;
    cartCount.textContent = itemCount;
    cartTotal.textContent = "$0.00";
    renderCart();
    modal.classList.add("hidden");
  });

  // Cancel Checkout
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
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".card").forEach(card => {
      const title = card.querySelector(".card--title").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "flex" : "none";
    });
  });
});
