function updateQuantity(button, change) {
  const input = button.parentNode.querySelector(".quantity-input");
  let value = parseInt(input.value) + change;

  // Enforce min/max constraints
  const min = parseInt(input.min) || 1;
  const max = parseInt(input.max) || 100;

  if (value < min) value = min;
  if (value > max) value = max;

  // Only update if value changed
  if (value !== parseInt(input.value)) {
    input.value = value;
    input.form.submit();
  }
}

// Chức năng lựa chọn sản phẩm để thanh toán
function calculateSelectedTotals() {
  const selectedItems = document.querySelectorAll(".product-selector:checked");
  let totalCount = 0;
  let subtotal = 0;
  let discount = 0;

  selectedItems.forEach((item) => {
    const quantity = parseInt(item.dataset.quantity);
    const price = parseFloat(item.dataset.price);
    const itemDiscount = parseFloat(item.dataset.discount) || 0;

    totalCount += quantity;
    subtotal += price * quantity;
    discount += itemDiscount;
  });

  // Cập nhật giá trị vào giao diện
  document.getElementById("selected-count").textContent = totalCount;
  document.getElementById("selected-subtotal").textContent =
    "$" + subtotal.toFixed(2);

  const discountElement = document.getElementById("selected-discount");
  if (discountElement) {
    discountElement.textContent = "-$" + discount.toFixed(2);
  }

  // Tính tổng thanh toán (giả sử phí vận chuyển không thay đổi)
  const shippingElement = document.getElementById("selected-shipping");
  const shipping = shippingElement
    ? parseFloat(shippingElement.textContent.replace("$", ""))
    : 0;

  const total = subtotal - discount + shipping;
  document.getElementById("selected-total").textContent =
    "$" + total.toFixed(2);

  // Cập nhật button checkout
  const checkoutBtn = document.getElementById("checkout-selected-btn");
  if (selectedItems.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Select items to checkout";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Proceed to Checkout";
  }
}

// Xử lý sự kiện checkout cho các sản phẩm được chọn
function handleCheckoutSelected() {
  const selectedItems = document.querySelectorAll(".product-selector:checked");
  const selectedProducts = Array.from(selectedItems).map((item) => {
    return {
      productId: item.dataset.productId,
      variantId: item.dataset.variantId || null,
      quantity: parseInt(item.dataset.quantity),
    };
  });

  console.log(selectedProducts);

  if (selectedProducts.length === 0) {
    // Hiển thị thông báo nếu không có sản phẩm nào được chọn
    alert("Please select at least one product to order");
    return;
  }

  // Gửi sản phẩm đã chọn đến server
  fetch("/cart/pre-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedProducts),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Chuyển hướng đến trang thanh toán
        window.location.href = "/order";
      } else {
        alert(data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      console.error("Error preparing checkout:", error);
      alert("Failed to process checkout. Please try again.");
    });
}

// Khởi tạo trang khi DOM đã load
document.addEventListener("DOMContentLoaded", function () {
  // Xử lý các sự kiện form số lượng
  const quantityForms = document.querySelectorAll(".quantity-form");
  quantityForms.forEach((form) => {
    const input = form.querySelector(".quantity-input");
    input.addEventListener("change", function () {
      form.submit();
    });
  });

  // Xử lý checkbox chọn sản phẩm
  const productSelectors = document.querySelectorAll(".product-selector");
  productSelectors.forEach((checkbox) => {
    checkbox.addEventListener("change", calculateSelectedTotals);
  });

  // Xử lý nút checkout
  const checkoutBtn = document.getElementById("checkout-selected-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckoutSelected);
  }

  // Tính toán tổng ban đầu
  calculateSelectedTotals();

  // Thêm checkbox "Select All"
  const cartHeader = document.querySelector(
    ".cart-items-card .card-header .d-flex"
  );
  if (cartHeader) {
    const selectAllContainer = document.createElement("div");
    selectAllContainer.className = "form-check me-3";
    selectAllContainer.innerHTML = `
      <input class="form-check-input" type="checkbox" id="select-all-products" checked>
      <label class="form-check-label" for="select-all-products">Select All</label>
    `;
    cartHeader.prepend(selectAllContainer);

    // Xử lý sự kiện Select All
    const selectAllCheckbox = document.getElementById("select-all-products");
    selectAllCheckbox.addEventListener("change", function () {
      const isChecked = this.checked;
      productSelectors.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
      calculateSelectedTotals();
    });
  }
});
