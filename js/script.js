const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", this.window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navmenu = document.querySelector(".navmenu");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navmenu.classList.toggle("open");
};

const addToCartButtons = document.querySelectorAll(".add-to-cart");
let basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
const basketItemsContainer = document.querySelector(".basket-items");
const totalPriceContainer = document.querySelector(".total-price");

addToCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener("click", () => {
    const name =
      addToCartButton.parentElement.querySelector("#items").textContent;
    const price = parseInt(
      addToCartButton.parentElement
        .querySelector(".price p")
        .textContent.replace(/₸/g, "")
    );
    const color = addToCartButton.parentElement.querySelector("#color").value;
    const size = addToCartButton.parentElement.querySelector("#size").value;

    if (color === "" || size === "") {
      alert("Пожалуйста, выберите цвет и размер");
      return;
    }

    const item = { name, price, color, size };
    let basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
    basketItems.push(item);
    localStorage.setItem("basketItems", JSON.stringify(basketItems));
    alert("Товар успешно добавлен в корзину!");

    renderBasket();
  });
});

function renderBasket() {
  let basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
  let basketHTML = "";
  let totalPrice = 0;

  basketItems.forEach((item, index) => {
    basketHTML += `<div id="item-${index}">${item.name} - Цвет: ${item.color} - Размер: ${item.size} - Цена: ₸ ${item.price} <button class="delete-item">Удалить</button></div>`;
    totalPrice += item.price;
  });

  basketHTML += `<div >Общая стоимость: ₸ ${totalPrice}</div>`;

  const basketContainer = document.getElementById("basketItemsContainer");
  if (basketContainer) {
    basketContainer.innerHTML = basketHTML;
  }

  updateBasket();
}

if (basketItems.length === 0) {
  basketItemsContainer.innerHTML = "<p>Корзина пуста</p>";
} else {
  let total = 0;
  for (let i = 0; i < basketItems.length; i++) {
    const item = basketItems[i];
    total += item.price;
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("basket-item");
    itemContainer.innerHTML = `
        <div class="basket-item__name">${item.name} (${item.color}, ${item.size})</div>
        <div class="basket-item__price"> ₸ ${item.price} </div>
        <button class="delete-item" data-index="${i}">Удалить</button>
      `;
    basketItemsContainer.appendChild(itemContainer);
  }
  totalPriceContainer.innerHTML = `<p class="basket-item__total">Общая стоимость: ₸${total}</p>`;

  const deleteButtons2 = document.querySelectorAll(".delete-item");
  deleteButtons2.forEach((button, index) => {
    button.addEventListener("click", () => {
      basketItems.splice(index, 1);
      updateBasket();
    });
  });
}

function updateBasket() {
  basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
  // Remove all items from basket
  basketItemsContainer.innerHTML = "";

  // Rebuild basket
  let totalPrice = 0;
  for (let i = 0; i < basketItems.length; i++) {
    const item = basketItems[i];
    totalPrice += item.price;
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("basket-item");
    itemContainer.innerHTML = `
      <div class="basket-item__name">${item.name} (${item.color}, ${item.size})</div>
      <div  class="basket-item__price">₸ ${item.price}</div>
      <button class="delete-item" data-index="${i}">Удалить</button>
    `;
    basketItemsContainer.appendChild(itemContainer);
  }
  totalPriceContainer.innerHTML = `<p class="basket-item__total">Общая стоимость: ₸${totalPrice}</p>`;

  // Add event listener to delete button
  const deleteButtons = document.querySelectorAll(".delete-item");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      basketItems.splice(index, 1);
      localStorage.setItem("basketItems", JSON.stringify(basketItems));
      renderBasket();
    });
  });
}
renderBasket();

// const form = document.querySelector("#my-form");
// form.addEventListener("submit", (event) => {
//   event.preventDefault();

//   const formData = new FormData(form);
//   fetch(form.action, {
//     method: "POST",
//     body: formData,
//     headers: {
//       Accept: "application/json",
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         alert("Спасибо за заказ, мы свяжемся с вами в ближайшее время");
//         form.reset();
//       } else {
//         alert("Произошла ошибка, попробуйте позднее.");
//       }
//     })
//     .catch((error) => {
//       alert("Произошла ошибка, попробуйте позднее.");
//     });

//   // Получить информацию о корзине
//   var cart2 = getCartInformation();
//   console.log("Корзина:", cart2);

//   // Установить значение поля "cart" в информацию о корзине
//   document.getElementById("cart").value = JSON.stringify(cart2);
//   console.log((document.getElementById("cart").value = JSON.stringify(cart2)));
// });

// // Функция для получения информации о корзине
// function getCartInformation() {
//   var cartItems = document.querySelectorAll(".basket-items .basket-item");
//   var cart1 = [];

//   for (var i = 0; i < cartItems.length; i++) {
//     var item = cartItems[i];
//     var name = item.querySelector(".basket-item__name").textContent;
//     var price = item.querySelector(".basket-item__price").textContent;

//     cart1.push({
//       name: name,
//       price: price,
//     });
//   }

//   console.log("Содержимое корзины:", cart1);
//   return cart1;
// }
const form = document.querySelector("#my-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Получить информацию о корзине
  const cartItems = document.querySelectorAll(".basket-items .basket-item");
  const cart = [];

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const name = item.querySelector(".basket-item__name").textContent;
    const price = item.querySelector(".basket-item__price").textContent;

    cart.push({
      name: name,
      price: price,
    });
  }

  console.log("Корзина:", cart);

  try {
    const formData = new FormData(form);
    formData.append("cart", JSON.stringify(cart));
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      alert("Спасибо за заказ, мы свяжемся с вами в ближайшее время");
      form.reset();
    } else {
      throw new Error("Произошла ошибка при отправке данных на сервер.");
    }
  } catch (error) {
    alert("Произошла ошибка: " + error.message);
  }
});
