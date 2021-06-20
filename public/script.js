const productsList = document.querySelector(".products-list");
const cartItems = document.querySelector(".cart-items");

if (productsList)
  productsList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-product")) {
      const button = e.target;
      const productId = button.dataset.productid;
      const csrfToken = button.dataset.csrf;
      await fetch("/seller/delete/" + productId, {
        method: "DELETE",
        headers: {
          "csrf-token": csrfToken,
        },
      });
      button.closest(".product-item").remove();
    }
  });

if (cartItems)
  cartItems.addEventListener("click", async (e) => {
    if (e.target.classList.contains("deleteFromCart")) {
      const button = e.target;
      const productId = button.dataset.productid;
      const csrfToken = button.dataset.csrf;
      await fetch("/shop/cart/" + productId, {
        method: "DELETE",
        headers: {
          "csrf-token": csrfToken,
        },
      });
      button.closest(".list-item").remove();
    }
  });
