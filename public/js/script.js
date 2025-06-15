//Alert --------------------------------------------------------------------------------------------------------------------
function showToast(type, message) {
  // Create toast container if not exists
  let container = document.querySelector(".pd-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "pd-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pd-toast ${type}`;

  // Icon mapping
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
  };

  toast.innerHTML = `
    <div class="pd-toast-icon">
      <i class="fas ${icons[type]}"></i>
    </div>
    <div class="pd-toast-message">${message}</div>
    <button class="pd-toast-close">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  // Add close button functionality
  const closeBtn = toast.querySelector(".pd-toast-close");
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });

  // Animation timing
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Handle server-side flash messages
document.addEventListener("DOMContentLoaded", function () {
  const flashItems = document.querySelectorAll("#flash-data .flash-item");
  flashItems.forEach((item) => {
    const type = item.dataset.type;
    const message = item.dataset.message;
    if (type && message) {
      showToast(type, message);
    }
  });

  const flashDataContainer = document.querySelector("#flash-data");
  if (flashDataContainer) {
    flashDataContainer.remove();
  }
});
