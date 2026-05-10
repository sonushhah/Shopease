const products = {
  "Blue Denim Jacket": { price: 59.99, image: "images/product1.jpg" },
  "Smart Watch": { price: 89.99, image: "images/product2.jpg" },
  "Wireless Headphones": { price: 74.99, image: "images/product3.jpg" },
  "Casual Sneakers": { price: 69.99, image: "images/product4.jpg" },
  "Leather Backpack": { price: 79.99, image: "images/product5.jpg" },
  "Premium Sunglasses": { price: 29.99, image: "images/product6.jpg" }
};

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productName) {
  let cart = getCart();
  let existingProduct = cart.find(item => item.name === productName);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: productName,
      quantity: 1
    });
  }

  saveCart(cart);
  showSuccessMessage("✔ " + productName + " added successfully!");
}

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  let cart = getCart();
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Start shopping to add products.</p>
        <a href="shop.html" class="btn">Go to Products</a>
      </div>
    `;

    if (cartTotal) cartTotal.innerHTML = "Total: $0.00";
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(function(item, index) {
    let product = products[item.name];
    let price = product ? product.price : 0;
    let image = product ? product.image : "";
    let itemTotal = price * item.quantity;

    total += itemTotal;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <img src="${image}" class="cart-img" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <p>$${price.toFixed(2)} each</p>
          </div>
        </div>

        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
        </div>

        <div class="item-total">
          $${itemTotal.toFixed(2)}
        </div>

        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  if (cartTotal) {
    cartTotal.innerHTML = "Total: $" + total.toFixed(2);
  }
}

function increaseQuantity(index) {
  let cart = getCart();
  cart[index].quantity += 1;
  saveCart(cart);
  displayCart();
}

function decreaseQuantity(index) {
  let cart = getCart();

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  displayCart();
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
}

function clearCart() {
  let cart = getCart();

  if (cart.length === 0) {
    showSuccessMessage("Your cart is already empty.");
    return;
  }

  localStorage.removeItem("cart");
  updateCartCount();
  displayCart();
  showSuccessMessage("Cart cleared successfully.");
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  let cart = getCart();
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.innerHTML = totalItems;
}

function showSuccessMessage(message) {
  const oldMessage = document.querySelector(".success-message");
  if (oldMessage) oldMessage.remove();

  const successBox = document.createElement("div");
  successBox.className = "success-message";
  successBox.innerHTML = message;

  document.body.appendChild(successBox);

  setTimeout(function() {
    successBox.remove();
  }, 2200);
}

/* Contact Form Validation */

function validateContactForm() {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  let nameError = document.getElementById("nameError");
  let emailError = document.getElementById("emailError");
  let messageError = document.getElementById("messageError");
  let formSuccess = document.getElementById("formSuccess");

  nameError.innerHTML = "";
  emailError.innerHTML = "";
  messageError.innerHTML = "";
  formSuccess.innerHTML = "";

  let isValid = true;

  if (name === "") {
    nameError.innerHTML = "Please enter your name.";
    isValid = false;
  }

  if (email === "") {
    emailError.innerHTML = "Please enter your email.";
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    emailError.innerHTML = "Please enter a valid email address.";
    isValid = false;
  }

  if (message === "") {
    messageError.innerHTML = "Please enter your message.";
    isValid = false;
  }

  if (isValid) {
    formSuccess.innerHTML = "Sending...";

    setTimeout(function() {
      formSuccess.innerHTML = "✔ Your message has been submitted successfully!";
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
    }, 800);
  }

  return false;
}

/* Product Search, Category Filter, and Sort */

function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const productGrid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");

  if (!productGrid) return;

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  const categoryValue = categoryFilter ? categoryFilter.value : "all";
  const sortValue = sortFilter ? sortFilter.value : "default";

  let cards = Array.from(productGrid.querySelectorAll(".product-card"));
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    const category = card.getAttribute("data-category");

    const matchesSearch = name.includes(searchValue);
    const matchesCategory = categoryValue === "all" || category === categoryValue;

    if (matchesSearch && matchesCategory) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  if (sortValue !== "default") {
    cards.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute("data-price"));
      const priceB = parseFloat(b.getAttribute("data-price"));

      if (sortValue === "low-high") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    cards.forEach(card => productGrid.appendChild(card));
  }

  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

function searchProducts() {
  filterProducts();
}

/* Wishlist */

function toggleWishlist(button) {
  button.classList.toggle("active");

  if (button.classList.contains("active")) {
    button.innerHTML = "♥";
    showSuccessMessage("Added to wishlist.");
  } else {
    button.innerHTML = "♡";
    showSuccessMessage("Removed from wishlist.");
  }
}

/* Back to Top */

window.onscroll = function() {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

displayCart();
updateCartCount();