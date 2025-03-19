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

// Handle quantity input manual changes
document.addEventListener("DOMContentLoaded", function () {
  const quantityForms = document.querySelectorAll(".quantity-form");
  quantityForms.forEach((form) => {
    const input = form.querySelector(".quantity-input");
    input.addEventListener("change", function () {
      // Submit form on change
      form.submit();
    });
  });
});
