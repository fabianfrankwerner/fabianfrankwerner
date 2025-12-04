import { menuArray } from "./data.js";

const items = document.getElementById("items");
const checkout = document.getElementById("checkout");
const checkoutItemsContainer = document.createElement("div");
checkoutItemsContainer.id = "checkout-items-container";

const checkoutArray = [];

function render() {
  const menu = menuArray
    .map(function (element) {
      return `<div class="item">
                <div class="item-layout">
                    <div class="item-layout-nested">
                        <img src="${
                          element.emojiURL
                        }" alt="${element.emoji}" class="item-graphic" />
                        <div class="item-layout-text">
                            <h2 class="item-title">${element.name}</h2>
                            <p class="item-description">Includes ${element.ingredients.join(
                              ", "
                            )}</p>
                            <p class="item-price">$${element.price}</p>
                        </div>
                    </div>
                    <button class="add-button" id="${
                      element.id
                    }" data-name="${element.name}" data-price="${element.price}">+</button>
                </div>
                <div class="item-divider"></div>
            </div>`;
    })
    .join("");
  return (items.innerHTML = menu);
}

function renderOrder() {
  const orderItems = checkoutArray
    .map(function (element, index) {
      return `
            <div class="checkout-item-layout">
                <div class="checkout-item-layout-nested">
                    <p class="checkout-item-text">${element.name}</p>
                    <button class="checkout-remove-button" data-index="${index}">remove</button>
                </div>
                <p class="checkout-item-price">$${element.price}</p>
            </div>`;
    })
    .join("");

  const checkoutItemsContainerElement = document.getElementById(
    "checkout-items-container"
  );
  if (checkoutItemsContainerElement) {
    checkoutItemsContainerElement.innerHTML = orderItems;
    addRemoveButtonListeners();
  }

  updateTotal();
}

function updateTotal() {
  const totalPrice = checkoutArray.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0
  );

  const totalPriceElement = checkout.querySelector(".checkout-total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (checkoutArray.length === 0) {
    checkout.style.display = "none";
  }
}

function removeItem(index) {
  checkoutArray.splice(index, 1);
  renderOrder();
}

function addRemoveButtonListeners() {
  const removeButtons = document.querySelectorAll(".checkout-remove-button");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const index = parseInt(e.target.dataset.index);
      removeItem(index);
    });
  });
}

function initializeCheckout() {
  checkout.innerHTML = `
        <h2 class="checkout-title">Your order</h2>
        <div id="checkout-items-container"></div>
        <div class="checkout-divider"></div>
        <div class="checkout-total-layout">
            <p class="checkout-total-text">Total price:</p>
            <p class="checkout-total-price"></p>
        </div>
        <button id="checkout-order-button" class="checkout-order-button">Complete order</button>`;

  renderOrder();
}

items.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-button")) {
    const name = event.target.dataset.name;
    const price = event.target.dataset.price;

    checkoutArray.push({ name: name, price: price });

    if (checkout.style.display !== "block") {
      checkout.style.display = "block";
      initializeCheckout();
    } else {
      renderOrder();
    }

    const checkoutOrderButton = document.getElementById(
      "checkout-order-button"
    );
    const newCheckoutOrderButton = checkoutOrderButton.cloneNode(true);
    checkoutOrderButton.parentNode.replaceChild(
      newCheckoutOrderButton,
      checkoutOrderButton
    );
    newCheckoutOrderButton.addEventListener("click", checkoutOrder);
  }
});

function checkoutOrder() {
  const paymentModal = document.getElementById("payment-modal");
  paymentModal.style.display = "block";

  const paymentForm = document.querySelector(".payment-modal-form");
  const newForm = paymentForm.cloneNode(true);
  paymentForm.parentNode.replaceChild(newForm, paymentForm);
  newForm.addEventListener("submit", handlePaymentSubmit);
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const customerName = nameInput.value.trim();

  if (customerName) {
    document.getElementById("payment-modal").style.display = "none";

    const thankYouMessage = document.querySelector(".checkout-complete-text");
    thankYouMessage.textContent = `Thanks, ${customerName}! Your order is on its way!`;

    document.getElementById("checkout-complete-state").style.display = "block";
    checkout.style.display = "none";

    checkoutArray.length = 0;
    event.target.reset();
  }
}

document
  .getElementById("payment-modal-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const form = document.querySelector(".payment-modal-form");
    form.dispatchEvent(new Event("submit"));
  });

render();
